/**
 * Ancient Nexus - Top Navigation Bar Component
 * Includes Omnisearch with instant dropdown results, Notification center,
 * Quick "Create Lobby" action, and User avatar status.
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { AppRouter } from '../router.js';

export function renderTopbar() {
  const user = Store.state.currentUser;
  if (!user) return '';

  const unreadNotifs = Store.state.notifications.filter(n => !n.read).length;

  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="btn btn-icon sidebar-toggle-btn" id="sidebar-toggle-btn" title="Toggle Sidebar">
          ${Icons.menu}
        </button>

        <div class="topbar-search-wrap">
          <span class="search-icon">${Icons.search}</span>
          <input type="text" class="input-control" id="global-omnisearch" placeholder="Search lobbies, players, matches...">
          <div id="omnisearch-results-dropdown" class="hud-panel" style="display: none; position: absolute; top: 110%; left: 0; width: 380px; z-index: 1000; padding: 12px;"></div>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Quick Create Lobby CTA -->
        <button class="btn btn-primary btn-sm" id="topbar-create-lobby-btn">
          ${Icons.plus} <span>Create Lobby</span>
        </button>

        <!-- Audio Mute Toggle -->
        <button class="btn btn-icon" id="topbar-audio-toggle" title="Toggle Sound Effects">
          ${Store.state.currentUser?.hudSettings?.audioMuted ? Icons.volumeMute : Icons.volume}
        </button>

        <!-- Notification Bell Dropdown -->
        <div style="position: relative;">
          <button class="btn btn-icon" id="notif-bell-btn" title="Notifications">
            ${Icons.bell}
            ${unreadNotifs > 0 ? `<span class="badge badge-dire" style="position: absolute; top: -4px; right: -4px; padding: 1px 5px; font-size: 0.65rem; border-radius: 8px;">${unreadNotifs}</span>` : ''}
          </button>
          
          <div id="notif-dropdown-menu" class="hud-panel" style="display: none; position: absolute; top: 120%; right: 0; width: 340px; z-index: 1000; box-shadow: 0 14px 36px rgba(0,0,0,0.8);">
            <div class="hud-panel-header">
              <div class="hud-panel-title" style="font-size: 0.88rem;">
                <span>Notifications</span>
              </div>
              <button class="btn btn-sm btn-secondary" id="mark-all-read-btn" style="font-size: 0.72rem; padding: 2px 6px;">Mark all read</button>
            </div>
            <div class="notif-items-list" style="max-height: 320px; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
              ${renderNotificationList()}
            </div>
          </div>
        </div>

        <!-- User Quick Profile Pill -->
        <div class="user-snippet" id="topbar-user-pill" style="cursor: pointer;">
          <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 38px; height: 38px;">
            <div class="avatar-placeholder">${user.avatar || '🔥'}</div>
            <div class="status-dot status-${user.onlineStatus || 'online'}"></div>
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderNotificationList() {
  const notifs = Store.state.notifications;
  if (!notifs.length) {
    return `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">No new notifications</div>`;
  }

  return notifs.map(n => `
    <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}" data-type="${n.type}" data-rel="${n.relatedId || ''}" style="padding: 10px; border-radius: 6px; background: ${n.read ? 'rgba(255,255,255,0.02)' : 'rgba(245,158,11,0.08)'}; border: 1px solid ${n.read ? 'transparent' : 'var(--border-bright)'}; cursor: pointer;">
      <div style="font-weight: 700; font-size: 0.82rem; color: #fff; display: flex; align-items: center; justify-content: space-between;">
        <span>${n.title}</span>
        <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: normal;">${formatTime(n.time)}</span>
      </div>
      <div style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
    </div>
  `).join('');
}

function formatTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function initTopbarEvents() {
  // Sidebar toggle
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
      Sound.playClick();
    });
  }

  // Audio Toggle
  const audioBtn = document.getElementById('topbar-audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const isMuted = Sound.toggleMute();
      audioBtn.innerHTML = isMuted ? Icons.volumeMute : Icons.volume;
      Store.updateHudSettings({ audioMuted: isMuted });
    });
  }

  // Create Lobby Button
  const createLobbyBtn = document.getElementById('topbar-create-lobby-btn');
  if (createLobbyBtn) {
    createLobbyBtn.addEventListener('click', () => {
      import('../views/lobbies.js').then(module => {
        module.openCreateLobbyModal();
      });
    });
  }

  // Notification dropdown
  const notifBtn = document.getElementById('notif-bell-btn');
  const notifMenu = document.getElementById('notif-dropdown-menu');
  if (notifBtn && notifMenu) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = notifMenu.style.display === 'block';
      notifMenu.style.display = isVisible ? 'none' : 'block';
      Sound.playClick();
    });

    document.addEventListener('click', (e) => {
      if (!notifMenu.contains(e.target) && e.target !== notifBtn) {
        notifMenu.style.display = 'none';
      }
    });

    const markAllReadBtn = document.getElementById('mark-all-read-btn');
    if (markAllReadBtn) {
      markAllReadBtn.addEventListener('click', () => {
        Store.markNotificationsRead();
      });
    }

    // Click notif item to navigate
    notifMenu.querySelectorAll('.notif-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        const rel = item.dataset.rel;
        if (type === 'lobby_invite' && rel) {
          AppRouter.navigate(`lobby/${rel}`);
        } else if (type === 'mention') {
          AppRouter.navigate('community');
        }
        notifMenu.style.display = 'none';
      });
    });
  }

  // User Profile Pill
  const userPill = document.getElementById('topbar-user-pill');
  if (userPill) {
    userPill.addEventListener('click', () => {
      AppRouter.navigate('profile');
    });
  }

  // Omnisearch
  const searchInput = document.getElementById('global-omnisearch');
  const resultsBox = document.getElementById('omnisearch-results-dropdown');
  if (searchInput && resultsBox) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        resultsBox.style.display = 'none';
        return;
      }

      const matchLobbies = Store.state.lobbies.filter(l => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.hostName.toLowerCase().includes(q));
      const matchUsers = Store.state.users.filter(u => u.displayName.toLowerCase().includes(q) || u.dotaId.includes(q) || u.rank.toLowerCase().includes(q));

      if (matchLobbies.length === 0 && matchUsers.length === 0) {
        resultsBox.innerHTML = `<div style="padding: 8px; color: var(--text-muted); font-size: 0.8rem; text-align: center;">No matching lobbies or players</div>`;
      } else {
        let html = '';
        if (matchLobbies.length > 0) {
          html += `<div style="font-size: 0.72rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 6px;">Lobbies (${matchLobbies.length})</div>`;
          html += matchLobbies.slice(0, 3).map(l => `
            <div class="search-result-item" data-type="lobby" data-id="${l.id}" style="padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; font-size: 0.85rem; color: #fff;">${l.name}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${l.region} • ${l.matchType} • Host: ${l.hostName}</div>
              </div>
              <span class="badge badge-gold">${l.players.length}/${l.maxPlayers}</span>
            </div>
          `).join('');
        }

        if (matchUsers.length > 0) {
          html += `<div style="font-size: 0.72rem; font-weight: 700; color: var(--mana-blue); text-transform: uppercase; margin-top: 8px; margin-bottom: 6px;">Players (${matchUsers.length})</div>`;
          html += matchUsers.slice(0, 3).map(u => `
            <div class="search-result-item" data-type="user" data-id="${u.id}" style="padding: 8px; border-radius: 4px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 1.2rem;">${u.avatar}</span>
                <div>
                  <div style="font-weight: 700; font-size: 0.85rem; color: #fff;">${u.displayName}</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${u.rank} • Dota ID: ${u.dotaId}</div>
                </div>
              </div>
              <span class="badge badge-radiant">View Profile</span>
            </div>
          `).join('');
        }

        resultsBox.innerHTML = html;
      }

      resultsBox.style.display = 'block';

      // Attach clicks to search result items
      resultsBox.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          const type = item.dataset.type;
          const id = item.dataset.id;
          if (type === 'lobby') {
            AppRouter.navigate(`lobby/${id}`);
          } else if (type === 'user') {
            AppRouter.navigate(`profile/${id}`);
          }
          resultsBox.style.display = 'none';
          searchInput.value = '';
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!resultsBox.contains(e.target) && e.target !== searchInput) {
        resultsBox.style.display = 'none';
      }
    });
  }
}
