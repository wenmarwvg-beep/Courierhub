/**
 * Ancient Nexus - Private Messaging (Conversations) View
 * One-to-one messaging, typing indicators, thread search, report & block user.
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { Toast } from '../components/toast.js';
import { AppRouter } from '../router.js';

let activeParticipantId = null;
let searchQuery = '';

export function renderConversationsView(participantId = null) {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = Store.state.currentUser;
  const conversations = Store.state.conversations;

  if (participantId) {
    activeParticipantId = participantId;
  } else if (!activeParticipantId && conversations.length > 0) {
    activeParticipantId = conversations[0].participantId;
  }

  const activeUser = Store.state.users.find(u => u.id === activeParticipantId) || Store.state.users[1];
  const activeConv = conversations.find(c => c.participantId === activeParticipantId);

  container.innerHTML = `
    <div class="animate-fade-in content-container" style="padding-bottom: 20px;">
      <div class="conversations-view-container ${activeParticipantId ? 'chat-active' : ''}">
        <!-- Left Side: Conversation Threads List -->
        <div class="conv-sidebar">
          <div class="conv-search-wrap">
            <div style="position: relative;">
              <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">${Icons.search}</span>
              <input type="text" class="input-control" id="conv-search-input" placeholder="Search conversations..." value="${searchQuery}" style="padding-left: 34px;">
            </div>
          </div>

          <div class="conv-list" id="conv-threads-list">
            ${renderConversationThreads(conversations, activeParticipantId, searchQuery)}
          </div>
        </div>

        <!-- Right Side: Active Chat Window -->
        <div class="chat-main-area">
          ${activeUser ? `
            <div class="chat-header">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div class="player-avatar-frame ${activeUser.avatarFrame || 'avatar-frame-immortal'}" style="width: 42px; height: 42px; font-size: 1.3rem;">
                  <div class="avatar-placeholder">${activeUser.avatar || '⚔️'}</div>
                  <div class="status-dot status-${activeUser.status || 'online'}"></div>
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 1rem; color: #fff; display: flex; align-items: center; gap: 8px;">
                    <span>${activeUser.displayName}</span>
                    <span class="badge badge-gold" style="font-size: 0.65rem;">${activeUser.rank}</span>
                  </div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">
                    <span>Dota ID: ${activeUser.dotaId}</span> • <span>${activeUser.region}</span> • <span style="color: var(--radiant-green);">${activeUser.status === 'online' ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn btn-secondary btn-sm" id="pm-invite-to-lobby-btn" title="Invite to active lobby">
                  ${Icons.plus} <span>Invite to Lobby</span>
                </button>
                <button class="btn btn-icon btn-sm" id="pm-block-user-btn" title="Block User">
                  ${Icons.lock}
                </button>
              </div>
            </div>

            <!-- Messages Thread Scroll -->
            <div class="chat-messages-scroll" id="conv-messages-scroll">
              ${renderPrivateMessages(activeConv ? activeConv.messages : [], user, activeUser)}
            </div>

            <!-- Typing Indicator -->
            <div id="conv-typing-indicator" class="typing-indicator" style="display: none;">
              <span>${activeUser.displayName} is typing...</span>
            </div>

            <!-- Input Bar -->
            <div class="chat-input-area">
              <input type="text" class="chat-input-box" id="pm-input-box" placeholder="Send private message to ${activeUser.displayName}...">
              <button class="btn btn-primary btn-icon" id="pm-send-btn">
                ${Icons.send}
              </button>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); gap: 12px;">
              <div style="font-size: 2.5rem;">💬</div>
              <div style="font-family: var(--font-header); font-size: 1.1rem; color: #fff;">Select a Conversation</div>
              <p style="font-size: 0.82rem;">Choose a teammate on the left to start direct messaging.</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  initConversationsEvents(activeUser);
  scrollPrivateChatToBottom();
}

function renderConversationThreads(conversations, activeId, query) {
  const users = Store.state.users.filter(u => u.id !== Store.state.currentUser?.id);

  return users.map(u => {
    if (query && !u.displayName.toLowerCase().includes(query.toLowerCase())) {
      return '';
    }

    const conv = conversations.find(c => c.participantId === u.id);
    const lastMsg = conv && conv.messages.length ? conv.messages[conv.messages.length - 1] : null;
    const isActive = u.id === activeId;

    return `
      <div class="conv-item ${isActive ? 'active' : ''}" data-user-id="${u.id}">
        <div class="player-avatar-frame ${u.avatarFrame || 'avatar-frame-immortal'}" style="width: 40px; height: 40px; font-size: 1.2rem;">
          <div class="avatar-placeholder">${u.avatar || '⚔️'}</div>
          <div class="status-dot status-${u.status || 'online'}"></div>
        </div>

        <div class="conv-item-body">
          <div class="conv-item-top">
            <span class="conv-name">${u.displayName}</span>
            <span class="conv-time">${lastMsg ? formatTime(lastMsg.time) : ''}</span>
          </div>
          <div class="conv-preview">${lastMsg ? lastMsg.text : 'Click to send a message'}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderPrivateMessages(messages, currentUser, activeUser) {
  if (!messages || !messages.length) {
    return `<div style="padding: 32px; text-align: center; color: var(--text-muted);">No messages yet with ${activeUser.displayName}. Say hi!</div>`;
  }

  return messages.map(m => {
    const isMe = m.senderId === currentUser.id;
    return `
      <div class="chat-message-item ${isMe ? 'is-own-message' : ''}">
        <div class="chat-msg-avatar">
          ${isMe ? (currentUser.avatar || '🔥') : (activeUser.avatar || '⚔️')}
        </div>
        <div class="chat-msg-body">
          <div class="chat-msg-header">
            <span class="chat-msg-author">${isMe ? 'You' : activeUser.displayName}</span>
            <span class="chat-msg-time">${formatTime(m.time)}</span>
          </div>
          <div class="chat-msg-content">${m.text}</div>
        </div>
      </div>
    `;
  }).join('');
}

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollPrivateChatToBottom() {
  const scrollEl = document.getElementById('conv-messages-scroll');
  if (scrollEl) {
    scrollEl.scrollTop = scrollEl.scrollHeight;
  }
}

function initConversationsEvents(activeUser) {
  // Search input
  const searchInput = document.getElementById('conv-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      const listEl = document.getElementById('conv-threads-list');
      if (listEl) {
        listEl.innerHTML = renderConversationThreads(Store.state.conversations, activeParticipantId, searchQuery);
        attachThreadClicks();
      }
    });
  }

  // Thread clicks
  attachThreadClicks();

  // Send message
  const input = document.getElementById('pm-input-box');
  const sendBtn = document.getElementById('pm-send-btn');

  const sendPM = () => {
    if (!input || !activeUser) return;
    const text = input.value.trim();
    if (!text) return;

    Store.sendPrivateMessage(activeUser.id, text);
    input.value = '';
    renderConversationsView(activeUser.id);

    // Simulated reply after 3s
    const indicator = document.getElementById('conv-typing-indicator');
    setTimeout(() => {
      if (indicator) indicator.style.display = 'block';
    }, 1200);

    setTimeout(() => {
      if (indicator) indicator.style.display = 'none';
      const replies = [
        "Sounds great! Let's party up.",
        "Nice! I am ready whenever you are.",
        "Got it, joining your match lobby now.",
        "Roger that, let's win this match."
      ];
      const rText = replies[Math.floor(Math.random() * replies.length)];
      let conv = Store.state.conversations.find(c => c.participantId === activeUser.id);
      if (conv) {
        conv.messages.push({
          id: 'pm_' + Date.now(),
          senderId: activeUser.id,
          text: rText,
          time: new Date().toISOString(),
          read: true
        });
        Store.saveState();
        Store.notifySubscribers();
        renderConversationsView(activeUser.id);
      }
    }, 3200);
  };

  if (sendBtn) sendBtn.addEventListener('click', sendPM);
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendPM();
      }
    });
  }

  // Invite to lobby action
  const inviteBtn = document.getElementById('pm-invite-to-lobby-btn');
  if (inviteBtn && activeUser) {
    inviteBtn.addEventListener('click', () => {
      Toast.success('Invitation Sent', `Invited ${activeUser.displayName} to your party lobby!`);
      Sound.playNotification();
    });
  }

  // Block user action
  const blockBtn = document.getElementById('pm-block-user-btn');
  if (blockBtn && activeUser) {
    blockBtn.addEventListener('click', () => {
      if (confirm(`Block ${activeUser.displayName}? You will no longer receive direct messages from them.`)) {
        Toast.warning('User Blocked', `${activeUser.displayName} has been blocked.`);
      }
    });
  }
}

function attachThreadClicks() {
  document.querySelectorAll('.conv-item').forEach(item => {
    item.addEventListener('click', () => {
      const uId = item.dataset.userId;
      activeParticipantId = uId;
      AppRouter.navigate(`conversations/${uId}`);
      Sound.playClick();
    });
  });
}
