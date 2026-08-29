/**
 * Ancient Nexus - Live Esports Community Simulation Engine
 * Generates realistic ambient community activity (chat messages, reactions, party queue, match ticks)
 * to ensure the application feels fully alive and interactive.
 */

import { Store } from './store.js';

class LiveSimulation {
  constructor() {
    this.intervalId = null;
    this.simulatedChatPhrases = [
      'Who is playing Ranked tonight? Need +1 Pos 5.',
      'Just got a rampage with Shadow Fiend! 16-0-12 scoreline.',
      'Anyone trying out the new patch changes on Invoker?',
      'GGs to Team Dire, awesome 60 min game.',
      'Looking for 3 more players for Battle Cup Tier 7 SEA.',
      'Need an offlaner who buys pipe/crimson guard!',
      'Turbo stack ready, joining lobby in 2 mins.'
    ];
  }

  start() {
    if (this.intervalId) return;

    // Run ambient event every 20-35 seconds
    this.intervalId = setInterval(() => {
      this.tick();
    }, 25000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  tick() {
    const r = Math.random();
    const otherUsers = Store.state.users.filter(u => u.id !== Store.state.currentUser?.id);
    if (!otherUsers.length) return;

    const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];

    if (r < 0.4) {
      // Ambient Community message
      const randomPhrase = this.simulatedChatPhrases[Math.floor(Math.random() * this.simulatedChatPhrases.length)];
      const msg = {
        id: 'msg_sim_' + Date.now(),
        userId: randomUser.id,
        userName: randomUser.displayName,
        userAvatar: randomUser.avatar,
        userRank: randomUser.rank,
        content: randomPhrase,
        createdAt: new Date().toISOString(),
        reactions: {},
        replyTo: null,
        lobbyEmbed: null
      };
      Store.state.communityMessages.push(msg);
      // Keep chat bounded
      if (Store.state.communityMessages.length > 50) {
        Store.state.communityMessages.shift();
      }
      Store.saveState();
      Store.notifySubscribers();
    } else if (r < 0.7) {
      // Ambient reaction to recent chat message
      if (Store.state.communityMessages.length > 0) {
        const lastMsg = Store.state.communityMessages[Store.state.communityMessages.length - 1];
        const emojis = ['🔥', '⚔️', '🛡️', '🏆', '💎'];
        const em = emojis[Math.floor(Math.random() * emojis.length)];
        if (!lastMsg.reactions) lastMsg.reactions = {};
        if (!lastMsg.reactions[em]) lastMsg.reactions[em] = [];
        if (!lastMsg.reactions[em].includes(randomUser.id)) {
          lastMsg.reactions[em].push(randomUser.id);
          Store.saveState();
          Store.notifySubscribers();
        }
      }
    } else {
      // Ambient activity ticker update
      const activities = [
        `${randomUser.displayName} queued for Ranked SEA (+25 MMR target)`,
        `Team Radiant secured Roshan in Match #${Math.floor(10000 + Math.random() * 90000)}`,
        `${randomUser.displayName} achieved Mastery Level 18 on ${randomUser.favoriteHeroes ? randomUser.favoriteHeroes[0] : 'Hero'}`
      ];
      const act = activities[Math.floor(Math.random() * activities.length)];
      Store.state.activityFeed.unshift({
        id: 'act_sim_' + Date.now(),
        icon: '⚡',
        text: act,
        time: 'Just now'
      });
      if (Store.state.activityFeed.length > 20) {
        Store.state.activityFeed.pop();
      }
      Store.saveState();
      Store.notifySubscribers();
    }
  }
}

export const Simulation = new LiveSimulation();
