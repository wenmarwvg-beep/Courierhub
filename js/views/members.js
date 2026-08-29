/**
 * Ancient Nexus - Member Directory View
 * Search and filter players by rank, role, region, win rate with direct invite and message actions.
 */

import { Store } from '../store.js';
import { Icons, RanksList, RolesList } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { Toast } from '../components/toast.js';
import { AppRouter } from '../router.js';

let memberFilters = {
  search: '',
  region: 'ALL',
  rank: 'ALL'
};

export function renderMembersView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const users = Store.state.users;
  const filteredUsers = getFilteredMembers(users);

  container.innerHTML = `
    <div class="animate-fade-in content-container">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <h1 style="font-size: 1.6rem; color: #fff; display: flex; align-items: center; gap: 10px;">
            <span>👥</span> <span>COMMUNITY MEMBER DIRECTORY</span>
          </h1>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
            Browse calibrated Dota 2 players, inspect stats, and recruit teammates.
          </p>
        </div>

        <!-- Search Bar -->
        <div style="position: relative; width: 320px;">
          <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted);">${Icons.search}</span>
          <input type="text" class="input-control" id="member-search-input" placeholder="Search by name or Dota ID..." value="${memberFilters.search}" style="padding-left: 38px;">
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="lobby-filters-bar" style="margin-bottom: 24px;">
        <div class="filter-group">
          <span class="filter-label">Region:</span>
          ${['ALL', 'SEA', 'NA', 'EU', 'China'].map(r => `
            <button class="filter-chip filter-member-region-btn ${memberFilters.region === r ? 'active' : ''}" data-val="${r}">${r}</button>
          `).join('')}
        </div>

        <div class="filter-group">
          <span class="filter-label">Rank:</span>
          ${['ALL', 'Immortal', 'Divine', 'Ancient', 'Legend', 'Archon', 'Crusader'].map(rk => `
            <button class="filter-chip filter-member-rank-btn ${memberFilters.rank === rk ? 'active' : ''}" data-val="${rk}">${rk}</button>
          `).join('')}
        </div>
      </div>

      <!-- Member Cards Grid -->
      <div class="lobbies-grid" id="members-cards-grid">
        ${renderMemberCards(filteredUsers)}
      </div>
    </div>
  `;

  initMembersEvents();
}

function getFilteredMembers(users) {
  return users.filter(u => {
    if (memberFilters.search) {
      const q = memberFilters.search.toLowerCase();
      if (!u.displayName.toLowerCase().includes(q) && !u.dotaId.includes(q)) return false;
    }
    if (memberFilters.region !== 'ALL' && u.region !== memberFilters.region) return false;
    if (memberFilters.rank !== 'ALL' && !u.rank.includes(memberFilters.rank)) return false;
    return true;
  });
}

function renderMemberCards(users) {
  if (!users.length) {
    return `<div class="hud-panel" style="grid-column: 1/-1; padding: 36px; text-align: center; color: var(--text-muted);">No community members matched your search.</div>`;
  }

  const currentUser = Store.state.currentUser;

  return users.map(u => {
    const isMe = currentUser && u.id === currentUser.id;
    return `
      <div class="hud-panel" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="player-avatar-frame ${u.avatarFrame || 'avatar-frame-immortal'}" style="width: 48px; height: 48px; font-size: 1.6rem;">
              <div class="avatar-placeholder">${u.avatar || '⚔️'}</div>
              <div class="status-dot status-${u.status || 'online'}"></div>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 1.05rem; color: #fff; display: flex; align-items: center; gap: 6px;">
                <span>${u.displayName}</span>
                ${isMe ? `<span class="badge badge-gold" style="font-size: 0.62rem;">YOU</span>` : ''}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
                <span>Dota ID: <strong style="color: var(--accent-gold); font-family: var(--font-stats);">${u.dotaId}</strong></span>
                <button class="btn btn-icon btn-sm member-copy-dotaid" data-dotaid="${u.dotaId}" title="Copy Dota ID" style="padding: 1px 4px; font-size: 0.65rem;">${Icons.copy}</button>
              </div>
            </div>
          </div>

          <div class="rank-badge">
            <span>${u.rank}</span>
          </div>
        </div>

        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; min-height: 34px;">
          ${u.bio || 'Competitive Dota 2 player.'}
        </p>

        <!-- Stats row -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm); text-align: center;">
          <div>
            <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Region</div>
            <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">${u.region}</div>
          </div>
          <div>
            <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Games</div>
            <div style="font-weight: 700; color: #fff; font-size: 0.88rem; font-family: var(--font-stats);">${u.gamesPlayed || u.stats?.matches || 1200}</div>
          </div>
          <div>
            <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">Win Rate</div>
            <div style="font-weight: 700; color: var(--radiant-green); font-size: 0.88rem; font-family: var(--font-stats);">${u.winRate || 54}%</div>
          </div>
        </div>

        <!-- Action buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: auto;">
          <button class="btn btn-secondary btn-sm member-msg-btn" data-id="${u.id}">
            ${Icons.conversations} <span>Message</span>
          </button>
          <button class="btn btn-primary btn-sm member-view-profile-btn" data-id="${u.id}">
            <span>View Profile →</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function initMembersEvents() {
  // Search
  const searchInput = document.getElementById('member-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      memberFilters.search = e.target.value;
      updateMembersGrid();
    });
  }

  // Region chips
  document.querySelectorAll('.filter-member-region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-member-region-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      memberFilters.region = btn.dataset.val;
      updateMembersGrid();
      Sound.playHover();
    });
  });

  // Rank chips
  document.querySelectorAll('.filter-member-rank-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-member-rank-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      memberFilters.rank = btn.dataset.val;
      updateMembersGrid();
      Sound.playHover();
    });
  });

  attachMemberCardActions();
}

function attachMemberCardActions() {
  // Copy Dota ID
  document.querySelectorAll('.member-copy-dotaid').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard?.writeText(btn.dataset.dotaid);
      Toast.success('Dota ID Copied', `Copied ID: ${btn.dataset.dotaid}`);
      Sound.playNotification();
    });
  });

  // Message button
  document.querySelectorAll('.member-msg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppRouter.navigate(`conversations/${btn.dataset.id}`);
      Sound.playClick();
    });
  });

  // View profile button
  document.querySelectorAll('.member-view-profile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppRouter.navigate(`profile/${btn.dataset.id}`);
      Sound.playClick();
    });
  });
}

function updateMembersGrid() {
  const grid = document.getElementById('members-cards-grid');
  if (grid) {
    grid.innerHTML = renderMemberCards(getFilteredMembers(Store.state.users));
    attachMemberCardActions();
  }
}
