/**
 * Ancient Nexus - Sidebar & Bottom Navigation Component
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { AppRouter } from '../router.js';

export function renderSidebar() {
  const user = Store.state.currentUser;
  if (!user) return '';

  const activeLobbiesCount = Store.state.lobbies.length;
  const unreadMessages = Store.state.conversations.reduce((acc, c) => acc + (c.unread || 0), 0);

  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <a href="#home" class="brand-logo" id="sidebar-logo-link">
          <img src="assets/logo.png" alt="CourierHub" style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.35));">
          <span class="brand-text" style="font-family: var(--font-sans); font-weight: 800; letter-spacing: 0.02em;">CourierHub</span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <a href="#home" class="nav-link active" data-route="home">
          ${Icons.home}
          <span>Home HUD</span>
        </a>

        <a href="#community" class="nav-link" data-route="community">
          ${Icons.community}
          <span>Community</span>
        </a>

        <a href="#conversations" class="nav-link" data-route="conversations">
          ${Icons.conversations}
          <span>Conversations</span>
          ${unreadMessages > 0 ? `<span class="nav-badge">${unreadMessages}</span>` : ''}
        </a>

        <a href="#lobbies" class="nav-link" data-route="lobbies">
          ${Icons.lobbies}
          <span>Lobbies</span>
          <span class="nav-badge" style="background: rgba(245,158,11,0.2); color: var(--accent-gold);">${activeLobbiesCount}</span>
        </a>

        <a href="#party-finder" class="nav-link" data-route="party-finder">
          ${Icons.party}
          <span>Party Finder</span>
        </a>

        <a href="#members" class="nav-link" data-route="members">
          ${Icons.members}
          <span>Members</span>
        </a>

        <a href="#profile" class="nav-link" data-route="profile">
          ${Icons.profile}
          <span>My Profile</span>
        </a>

        <a href="#hud-settings" class="nav-link" data-route="hud-settings">
          ${Icons.hud}
          <span>HUD Customizer</span>
        </a>
      </nav>

      <!-- Sidebar User Footer -->
      <div class="sidebar-user-footer">
        <div class="user-snippet" id="sidebar-user-snippet">
          <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 38px; height: 38px;">
            <div class="avatar-placeholder">${user.avatar || '🔥'}</div>
            <div class="status-dot status-${user.onlineStatus || 'online'}"></div>
          </div>
          <div class="user-snippet-info">
            <div class="user-snippet-name">${user.displayName || user.username}</div>
            <select class="user-status-select" id="sidebar-status-select">
              <option value="online" ${user.onlineStatus === 'online' ? 'selected' : ''}>🟢 Available</option>
              <option value="busy" ${user.onlineStatus === 'busy' ? 'selected' : ''}>🟡 Busy</option>
              <option value="dnd" ${user.onlineStatus === 'dnd' ? 'selected' : ''}>🔴 Do Not Disturb</option>
            </select>
          </div>
        </div>

        <button class="btn btn-icon" id="sidebar-logout-btn" title="Logout">
          ${Icons.logout}
        </button>
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav">
      <a href="#home" class="bottom-nav-item active" data-route="home">
        ${Icons.home}
        <span>Home</span>
      </a>
      <a href="#community" class="bottom-nav-item" data-route="community">
        ${Icons.community}
        <span>Chat</span>
      </a>
      <a href="#lobbies" class="bottom-nav-item" data-route="lobbies">
        ${Icons.lobbies}
        <span>Lobbies</span>
        <span class="bottom-nav-badge">${activeLobbiesCount}</span>
      </a>
      <a href="#conversations" class="bottom-nav-item" data-route="conversations">
        ${Icons.conversations}
        <span>Messages</span>
      </a>
      <a href="#profile" class="bottom-nav-item" data-route="profile">
        ${Icons.profile}
        <span>Profile</span>
      </a>
    </nav>
  `;
}

export function initSidebarEvents() {
  // Navigation sound & clicks
  document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(link => {
    link.addEventListener('click', () => {
      Sound.playClick();
    });
    link.addEventListener('mouseenter', () => {
      Sound.playHover();
    });
  });

  // User snippet click to profile
  const userSnippet = document.getElementById('sidebar-user-snippet');
  if (userSnippet) {
    userSnippet.addEventListener('click', (e) => {
      if (e.target.tagName !== 'SELECT') {
        AppRouter.navigate('profile');
      }
    });
  }

  // Status changer
  const statusSelect = document.getElementById('sidebar-status-select');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      Store.updateProfile({ onlineStatus: newStatus });
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to log out of Aegis Nexus?')) {
        Store.logout();
        AppRouter.navigate('login');
      }
    });
  }
}
