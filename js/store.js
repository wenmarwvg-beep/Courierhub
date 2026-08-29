/**
 * Ancient Nexus - Central Reactive State Store
 * Handles persistence, state mutations, subscribers, BroadcastChannel cross-tab sync,
 * and comprehensive initial seed data for an esports-grade platform.
 */

import { Sound } from './audio.js';

class StateStore {
  constructor() {
    this.channel = null;
    try {
      this.channel = new BroadcastChannel('ancient_nexus_sync');
      this.channel.onmessage = (e) => this.handleRemoteMessage(e.data);
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment');
    }

    this.subscribers = new Set();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    const saved = localStorage.getItem('nexus_state_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.users && parsed.users.some(u => u.id === 'u_raven' || u.id === 'u_shadow')) {
          localStorage.removeItem('nexus_state_v1');
          return this.getDefaultState();
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved state, resetting to defaults', e);
      }
    }
    return this.getDefaultState();
  }

  getDefaultState() {
    return {
      currentUser: null,
      users: [],
      lobbies: [],
      communityMessages: [],
      conversations: [],
      partyFinder: [],
      notifications: [],
      activityFeed: [],
      statsOverview: {
        totalMembers: 0,
        onlineNow: 0,
        matchesToday: 0,
        activeLobbies: 0,
        matchesCompleted: 0,
        playersLookingForParty: 0
      }
    };
  }

  saveState() {
    try {
      localStorage.setItem('nexus_state_v1', JSON.stringify(this.state));
      if (this.channel) {
        this.channel.postMessage({ type: 'STATE_UPDATED', state: this.state });
      }
    } catch (e) {
      console.error('Failed to persist state to localStorage', e);
    }
  }

  handleRemoteMessage(data) {
    if (data && data.type === 'STATE_UPDATED') {
      this.state = data.state;
      this.notifySubscribers();
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb(this.state);
      } catch (e) {
        console.error('Subscriber notification error', e);
      }
    });
  }

  // ==========================================
  // STATE MUTATION ACTIONS
  // ==========================================

  // Authentication
  loginUser(userData) {
    this.state.currentUser = { ...this.state.currentUser, ...userData, onlineStatus: 'online' };
    this.saveState();
    this.notifySubscribers();
    Sound.playNotification();
  }

  logout() {
    this.state.currentUser = null;
    this.saveState();
    this.notifySubscribers();
  }

  updateProfile(updates) {
    if (!this.state.currentUser) return;
    this.state.currentUser = { ...this.state.currentUser, ...updates };
    
    // Also update in users list
    const uIdx = this.state.users.findIndex(u => u.id === this.state.currentUser.id);
    if (uIdx !== -1) {
      this.state.users[uIdx] = { ...this.state.users[uIdx], ...updates };
    }
    
    this.saveState();
    this.notifySubscribers();
    Sound.playClick();
  }

  updateHudSettings(hudSettings) {
    if (!this.state.currentUser) return;
    this.state.currentUser.hudSettings = { ...this.state.currentUser.hudSettings, ...hudSettings };
    this.saveState();
    this.notifySubscribers();
  }

  // Community Chat
  sendCommunityMessage(content, replyToId = null, lobbyEmbed = null) {
    if (!this.state.currentUser) return;
    const newMsg = {
      id: 'msg_' + Date.now(),
      userId: this.state.currentUser.id,
      userName: this.state.currentUser.displayName || this.state.currentUser.username,
      userAvatar: this.state.currentUser.avatar || '⚔️',
      userRank: this.state.currentUser.rank || 'Ancient V',
      content,
      createdAt: new Date().toISOString(),
      reactions: {},
      replyTo: replyToId,
      lobbyEmbed: lobbyEmbed || null
    };

    this.state.communityMessages.push(newMsg);
    this.saveState();
    this.notifySubscribers();
    Sound.playMessage();
    return newMsg;
  }

  reactToMessage(messageId, emoji) {
    if (!this.state.currentUser) return;
    const msg = this.state.communityMessages.find(m => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

    const userId = this.state.currentUser.id;
    const idx = msg.reactions[emoji].indexOf(userId);
    if (idx > -1) {
      msg.reactions[emoji].splice(idx, 1);
      if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
    } else {
      msg.reactions[emoji].push(userId);
    }

    this.saveState();
    this.notifySubscribers();
    Sound.playHover();
  }

  deleteCommunityMessage(messageId) {
    if (!this.state.currentUser) return;
    const idx = this.state.communityMessages.findIndex(
      m => m.id === messageId && m.userId === this.state.currentUser.id
    );
    if (idx !== -1) {
      this.state.communityMessages.splice(idx, 1);
      this.saveState();
      this.notifySubscribers();
    }
  }

  // Private Messages
  sendPrivateMessage(recipientId, text) {
    if (!this.state.currentUser) return;
    let conv = this.state.conversations.find(c => c.participantId === recipientId);
    if (!conv) {
      conv = {
        id: 'conv_' + recipientId,
        participantId: recipientId,
        messages: [],
        unread: 0
      };
      this.state.conversations.push(conv);
    }

    const newMsg = {
      id: 'pm_' + Date.now(),
      senderId: this.state.currentUser.id,
      text,
      time: new Date().toISOString(),
      read: true
    };

    conv.messages.push(newMsg);
    this.saveState();
    this.notifySubscribers();
    Sound.playMessage();
    return newMsg;
  }

  // Lobbies
  createLobby(lobbyData) {
    if (!this.state.currentUser) return;
    const region = lobbyData.region || 'SEA';
    const lobbyId = `${region}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newLobby = {
      id: lobbyId,
      name: lobbyData.name || 'New Match Lobby',
      hostId: this.state.currentUser.id,
      hostName: this.state.currentUser.displayName || this.state.currentUser.username,
      region: region,
      matchType: lobbyData.matchType || 'Ranked',
      maxPlayers: parseInt(lobbyData.maxPlayers, 10) || 5,
      description: lobbyData.description || 'Join my match lobby!',
      requiredRank: lobbyData.requiredRank || 'Any',
      voiceChat: !!lobbyData.voiceChat,
      isPublic: lobbyData.isPublic !== false,
      password: lobbyData.password || '',
      status: 'Waiting',
      createdAt: new Date().toISOString(),
      players: [
        {
          userId: this.state.currentUser.id,
          name: this.state.currentUser.displayName || this.state.currentUser.username,
          avatar: this.state.currentUser.avatar || '🔥',
          rank: this.state.currentUser.rank || 'Ancient V',
          role: this.state.currentUser.preferredRoles ? this.state.currentUser.preferredRoles[0] : 'carry',
          ready: true,
          isHost: true
        }
      ]
    };

    this.state.lobbies.unshift(newLobby);
    this.state.currentUser.currentLobbyId = lobbyId;
    this.state.statsOverview.activeLobbies += 1;

    // Add activity feed
    this.state.activityFeed.unshift({
      id: 'act_' + Date.now(),
      icon: '🎮',
      text: `${newLobby.hostName} created "${newLobby.name}" (${newLobby.region})`,
      time: 'Just now'
    });

    this.saveState();
    this.notifySubscribers();
    Sound.playLobbyJoin();
    return newLobby;
  }

  joinLobby(lobbyId) {
    if (!this.state.currentUser) return { success: false, reason: 'Not logged in' };
    const lobby = this.state.lobbies.find(l => l.id === lobbyId);
    if (!lobby) return { success: false, reason: 'Lobby not found' };

    const isAlreadyIn = lobby.players.some(p => p.userId === this.state.currentUser.id);
    if (isAlreadyIn) {
      return { success: true, lobby, message: 'Already in lobby' };
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      return { success: false, reason: 'Lobby is full' };
    }

    const newPlayer = {
      userId: this.state.currentUser.id,
      name: this.state.currentUser.displayName || this.state.currentUser.username,
      avatar: this.state.currentUser.avatar || '⚔️',
      rank: this.state.currentUser.rank || 'Legend V',
      role: this.state.currentUser.preferredRoles ? this.state.currentUser.preferredRoles[0] : 'flexible',
      ready: true,
      isHost: false
    };

    lobby.players.push(newPlayer);
    if (lobby.players.length >= lobby.maxPlayers) {
      lobby.status = 'Full';
    } else if (lobby.players.length >= lobby.maxPlayers - 1) {
      lobby.status = 'Almost Full';
    }

    this.state.currentUser.currentLobbyId = lobbyId;

    this.state.activityFeed.unshift({
      id: 'act_' + Date.now(),
      icon: '⚔️',
      text: `${newPlayer.name} joined lobby "${lobby.name}"`,
      time: 'Just now'
    });

    this.saveState();
    this.notifySubscribers();
    Sound.playLobbyJoin();
    return { success: true, lobby };
  }

  leaveLobby(lobbyId) {
    if (!this.state.currentUser) return;
    const lobby = this.state.lobbies.find(l => l.id === lobbyId);
    if (!lobby) return;

    lobby.players = lobby.players.filter(p => p.userId !== this.state.currentUser.id);
    if (this.state.currentUser.currentLobbyId === lobbyId) {
      this.state.currentUser.currentLobbyId = null;
    }

    if (lobby.players.length === 0) {
      this.state.lobbies = this.state.lobbies.filter(l => l.id !== lobbyId);
    } else {
      if (lobby.hostId === this.state.currentUser.id && lobby.players.length > 0) {
        lobby.hostId = lobby.players[0].userId;
        lobby.hostName = lobby.players[0].name;
        lobby.players[0].isHost = true;
      }
      lobby.status = 'Waiting';
    }

    this.saveState();
    this.notifySubscribers();
    Sound.playClick();
  }

  togglePartyFinder(status) {
    if (!this.state.currentUser) return;
    this.state.currentUser.isLookingForParty = status;
    const uId = this.state.currentUser.id;

    if (status) {
      const exists = this.state.partyFinder.some(p => p.userId === uId);
      if (!exists) {
        this.state.partyFinder.unshift({
          userId: uId,
          name: this.state.currentUser.displayName || this.state.currentUser.username,
          avatar: this.state.currentUser.avatar || '🔥',
          rank: this.state.currentUser.rank || 'Ancient V',
          role: this.state.currentUser.preferredRoles ? this.state.currentUser.preferredRoles[0] : 'Carry',
          region: this.state.currentUser.region || 'SEA',
          mode: 'Ranked'
        });
      }
    } else {
      this.state.partyFinder = this.state.partyFinder.filter(p => p.userId !== uId);
    }

    this.saveState();
    this.notifySubscribers();
    Sound.playClick();
  }

  markNotificationsRead() {
    this.state.notifications.forEach(n => n.read = true);
    this.saveState();
    this.notifySubscribers();
  }
}

export const Store = new StateStore();
