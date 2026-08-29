/**
 * Ancient Nexus - Global Community Chat View
 * Real-time public communication, message reactions, @mentions, emoji picker,
 * and interactive embedded lobby cards with direct 1-click Join.
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { Toast } from '../components/toast.js';
import { AppRouter } from '../router.js';

let replyingToMessage = null;
let emojiPickerOpen = false;

export function renderCommunityView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const messages = Store.state.communityMessages;
  const onlineUsers = Store.state.users.filter(u => u.status === 'online');
  const user = Store.state.currentUser;

  container.innerHTML = `
    <div class="animate-fade-in content-container" style="padding-bottom: 20px;">
      <div class="chat-view-container">
        <!-- Main Chat Area -->
        <div class="chat-main-area">
          <div class="chat-header">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.3rem;">💬</span>
              <div>
                <div style="font-family: var(--font-header); font-size: 1rem; font-weight: 700; color: #fff;">
                  GLOBAL COMMUNITY HALL
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">
                  Public communication for all Aegis Nexus members
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              ${user?.currentLobbyId ? `
                <button class="btn btn-primary btn-sm" id="chat-share-my-lobby-btn">
                  ${Icons.share} <span>Share My Lobby (${user.currentLobbyId})</span>
                </button>
              ` : ''}
              <span class="badge badge-radiant">🟢 ${onlineUsers.length} Online</span>
            </div>
          </div>

          <!-- Messages Scroll View -->
          <div class="chat-messages-scroll" id="community-messages-scroll">
            ${renderMessagesList(messages, user)}
          </div>

          <!-- Reply Preview Box -->
          <div id="chat-reply-bar" class="chat-reply-preview" style="display: none;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: var(--accent-gold); font-size: 0.9rem;">↩</span>
              <span>Replying to <strong id="reply-author-name" style="color: #fff;"></strong>: <span id="reply-text-snippet" style="font-style: italic;"></span></span>
            </div>
            <button class="btn btn-icon btn-sm" id="cancel-reply-btn" style="padding: 2px 6px;">✕</button>
          </div>

          <!-- Message Composer Area -->
          <div class="chat-input-area">
            <button class="btn btn-icon" id="chat-emoji-trigger-btn" title="Emoji Picker">
              ${Icons.emoji}
            </button>

            <!-- Emoji Picker Popup -->
            <div id="chat-emoji-picker-dropdown" class="emoji-picker-dropdown" style="display: none;">
              ${['⚔️', '🔥', '🛡️', '⚡', '🏆', '💎', '👏', '🎯', '👑', '👹', '🏹', '❄️', '🪓', '🪝', '💀', '🌊', '⏳', '✨'].map(em => `
                <button class="emoji-btn" data-emoji="${em}">${em}</button>
              `).join('')}
            </div>

            <input type="text" class="chat-input-box" id="community-chat-input" placeholder="Message the community... (type @ to mention a player)">

            <button class="btn btn-primary btn-icon" id="community-send-btn" title="Send Message">
              ${Icons.send}
            </button>
          </div>
        </div>

        <!-- Right Side Online Roster -->
        <div class="chat-roster-sidebar">
          <div class="roster-header">
            <span>ONLINE ROSTER (${onlineUsers.length})</span>
            <span style="font-size: 0.72rem; color: var(--radiant-green);">🟢 ACTIVE</span>
          </div>

          <div class="roster-list">
            ${onlineUsers.map(u => `
              <div class="roster-user-item" data-id="${u.id}" data-name="${u.displayName}">
                <div class="player-avatar-frame ${u.avatarFrame || 'avatar-frame-immortal'}" style="width: 34px; height: 34px; font-size: 1.1rem;">
                  <div class="avatar-placeholder">${u.avatar || '⚔️'}</div>
                  <div class="status-dot status-${u.status}"></div>
                </div>
                <div class="roster-user-info">
                  <div class="roster-user-name">${u.displayName}</div>
                  <div class="roster-user-meta">
                    <span>${u.rank}</span>
                    <span>•</span>
                    <span>${u.region}</span>
                  </div>
                </div>
                <button class="btn btn-icon btn-sm roster-pm-btn" data-id="${u.id}" title="Send PM" style="padding: 4px;">
                  ${Icons.conversations}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  initCommunityEvents();
  scrollChatToBottom();
}

function renderMessagesList(messages, currentUser) {
  if (!messages || !messages.length) {
    return `<div style="padding: 32px; text-align: center; color: var(--text-muted);">No messages yet. Be the first hero to speak!</div>`;
  }

  return messages.map(msg => {
    const isOwn = currentUser && msg.userId === currentUser.id;
    const replyTarget = msg.replyTo ? Store.state.communityMessages.find(m => m.id === msg.replyTo) : null;

    // Parse @mentions
    const formattedContent = msg.content.replace(/@([a-zA-Z0-9_]+)/g, '<span class="user-mention">@$1</span>');

    return `
      <div class="chat-message-item ${isOwn ? 'is-own-message' : ''}" data-msg-id="${msg.id}">
        <div class="chat-msg-avatar">
          ${msg.userAvatar || '⚔️'}
        </div>

        <div class="chat-msg-body">
          <div class="chat-msg-header">
            <span class="chat-msg-author">${msg.userName}</span>
            <span class="badge badge-gold" style="font-size: 0.68rem;">${msg.userRank || 'Legend'}</span>
            <span class="chat-msg-time">${formatTime(msg.createdAt)}</span>
          </div>

          ${replyTarget ? `
            <div style="font-size: 0.75rem; color: var(--text-muted); padding: 2px 8px; border-left: 2px solid var(--border-medium); margin-bottom: 4px; background: rgba(0,0,0,0.15); border-radius: 0 4px 4px 0;">
              ↳ Replying to <strong style="color: var(--accent-gold);">${replyTarget.userName}</strong>: ${replyTarget.content.slice(0, 60)}...
            </div>
          ` : ''}

          <div class="chat-msg-content">${formattedContent}</div>

          <!-- Embedded Interactive Lobby Card -->
          ${msg.lobbyEmbed ? `
            <div class="chat-lobby-embed" data-lobby-id="${msg.lobbyEmbed.lobbyId}">
              <div class="lobby-embed-info">
                <div class="lobby-embed-title">
                  <span>🎮</span>
                  <span>${msg.lobbyEmbed.name}</span>
                </div>
                <div class="lobby-embed-meta">
                  <span>Lobby ID: <strong style="color: var(--accent-gold); font-family: var(--font-stats);">${msg.lobbyEmbed.lobbyId}</strong></span>
                  <span>•</span>
                  <span>Host: ${msg.lobbyEmbed.host}</span>
                  <span>•</span>
                  <span>${msg.lobbyEmbed.type} • ${msg.lobbyEmbed.region}</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="lobby-embed-slots">
                  <span>● ● ● ● ○</span>
                  <span>${msg.lobbyEmbed.currentPlayers} / ${msg.lobbyEmbed.maxPlayers}</span>
                </div>
                <button class="btn btn-primary btn-sm chat-embed-join-btn" data-lobby-id="${msg.lobbyEmbed.lobbyId}">
                  Join Lobby ⚔️
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Reactions Pills -->
          <div class="chat-reactions-wrap">
            ${renderReactionPills(msg, currentUser)}
          </div>
        </div>

        <!-- Hover Action Menu -->
        <div class="chat-msg-actions">
          <button class="chat-action-btn msg-react-trigger" data-emoji="🔥" title="React Fire">🔥</button>
          <button class="chat-action-btn msg-react-trigger" data-emoji="⚔️" title="React Swords">⚔️</button>
          <button class="chat-action-btn msg-reply-trigger" data-msg-id="${msg.id}" data-author="${msg.userName}" data-text="${msg.content}" title="Reply">
            ${Icons.reply}
          </button>
          ${isOwn ? `
            <button class="chat-action-btn msg-delete-trigger" data-msg-id="${msg.id}" title="Delete Message" style="color: var(--dire-red);">
              ${Icons.trash}
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderReactionPills(msg, currentUser) {
  if (!msg.reactions) return '';
  const currentUserId = currentUser?.id;

  return Object.entries(msg.reactions).map(([emoji, userIds]) => {
    if (!userIds || !userIds.length) return '';
    const hasReacted = currentUserId && userIds.includes(currentUserId);
    return `
      <div class="reaction-pill ${hasReacted ? 'has-reacted' : ''}" data-msg-id="${msg.id}" data-emoji="${emoji}">
        <span>${emoji}</span>
        <span>${userIds.length}</span>
      </div>
    `;
  }).join('');
}

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollChatToBottom() {
  const scrollEl = document.getElementById('community-messages-scroll');
  if (scrollEl) {
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }
}

function initCommunityEvents() {
  const input = document.getElementById('community-chat-input');
  const sendBtn = document.getElementById('community-send-btn');
  const emojiTrigger = document.getElementById('chat-emoji-trigger-btn');
  const emojiPicker = document.getElementById('chat-emoji-picker-dropdown');
  const replyBar = document.getElementById('chat-reply-bar');
  const cancelReplyBtn = document.getElementById('cancel-reply-btn');
  const shareMyLobbyBtn = document.getElementById('chat-share-my-lobby-btn');

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    Store.sendCommunityMessage(text, replyingToMessage?.id || null);
    input.value = '';
    replyingToMessage = null;
    if (replyBar) replyBar.style.display = 'none';

    renderCommunityView();
  };

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // Emoji picker toggle
  if (emojiTrigger && emojiPicker) {
    emojiTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      emojiPickerOpen = !emojiPickerOpen;
      emojiPicker.style.display = emojiPickerOpen ? 'grid' : 'none';
      Sound.playClick();
    });

    document.addEventListener('click', (e) => {
      if (!emojiPicker.contains(e.target) && e.target !== emojiTrigger) {
        emojiPicker.style.display = 'none';
        emojiPickerOpen = false;
      }
    });

    emojiPicker.querySelectorAll('.emoji-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        input.value += btn.dataset.emoji;
        input.focus();
        emojiPicker.style.display = 'none';
        emojiPickerOpen = false;
      });
    });
  }

  // Share My Lobby CTA
  if (shareMyLobbyBtn) {
    shareMyLobbyBtn.addEventListener('click', () => {
      const activeLobby = Store.state.lobbies.find(l => l.id === Store.state.currentUser?.currentLobbyId);
      if (activeLobby) {
        Store.sendCommunityMessage(
          `🎮 Party ready in "${activeLobby.name}"! Looking for teammates:`,
          null,
          {
            lobbyId: activeLobby.id,
            name: activeLobby.name,
            host: activeLobby.hostName,
            region: activeLobby.region,
            type: activeLobby.matchType,
            currentPlayers: activeLobby.players.length,
            maxPlayers: activeLobby.maxPlayers
          }
        );
        Toast.success('Lobby Shared', 'Lobby card posted to community!');
        renderCommunityView();
      }
    });
  }

  // Reply preview & cancel
  if (cancelReplyBtn) {
    cancelReplyBtn.addEventListener('click', () => {
      replyingToMessage = null;
      if (replyBar) replyBar.style.display = 'none';
    });
  }

  // Message Actions Delegation
  document.querySelectorAll('.msg-react-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const msgItem = btn.closest('.chat-message-item');
      const msgId = msgItem?.dataset.msgId;
      const emoji = btn.dataset.emoji;
      if (msgId && emoji) {
        Store.reactToMessage(msgId, emoji);
        renderCommunityView();
      }
    });
  });

  document.querySelectorAll('.reaction-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const msgId = pill.dataset.msgId;
      const emoji = pill.dataset.emoji;
      if (msgId && emoji) {
        Store.reactToMessage(msgId, emoji);
        renderCommunityView();
      }
    });
  });

  document.querySelectorAll('.msg-reply-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      replyingToMessage = { id: btn.dataset.msgId, author: btn.dataset.author, text: btn.dataset.text };
      if (replyBar) {
        document.getElementById('reply-author-name').innerText = replyingToMessage.author;
        document.getElementById('reply-text-snippet').innerText = replyingToMessage.text.slice(0, 50);
        replyBar.style.display = 'flex';
      }
      input.focus();
    });
  });

  document.querySelectorAll('.msg-delete-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this message?')) {
        Store.deleteCommunityMessage(btn.dataset.msgId);
        renderCommunityView();
      }
    });
  });

  // Embedded Lobby Card direct clicks & Join button
  document.querySelectorAll('.chat-lobby-embed, .chat-embed-join-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const lobbyId = el.dataset.lobbyId;
      if (lobbyId) {
        AppRouter.navigate(`lobby/${lobbyId}`);
      }
    });
  });

  // PM button in Online Roster
  document.querySelectorAll('.roster-pm-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const uId = btn.dataset.id;
      AppRouter.navigate(`conversations/${uId}`);
    });
  });

  // Roster item view profile
  document.querySelectorAll('.roster-user-item').forEach(item => {
    item.addEventListener('click', () => {
      const uId = item.dataset.id;
      AppRouter.navigate(`profile/${uId}`);
    });
  });
}
