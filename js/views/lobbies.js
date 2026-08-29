/**
 * Ancient Nexus - Lobbies Finder & 5-Slot Interactive Lobby Room View
 * Multi-filter search, rich lobby cards, Create Lobby modal, and 5-slot Party Room.
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';
import { AppRouter } from '../router.js';

let activeFilters = {
  search: '',
  region: 'ALL',
  type: 'ALL',
  status: 'ALL'
};

export function renderLobbiesView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = Store.state.currentUser;
  const filteredLobbies = getFilteredLobbies();

  container.innerHTML = `
    <div class="animate-fade-in content-container">
      <!-- Lobbies Top Controls Bar -->
      <div class="lobbies-header-bar">
        <div class="lobbies-controls-row">
          <div>
            <h1 style="font-size: 1.6rem; color: #fff; display: flex; align-items: center; gap: 10px;">
              <span>🎮</span> <span>DOTA 2 MATCH LOBBIES</span>
            </h1>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
              Find active parties, join high-MMR scrims, or create your own custom stack.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn btn-primary" id="lobbies-create-btn">
              ${Icons.plus} <span>+ Create Match Lobby</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="lobby-filters-bar">
          <div class="lobby-search-box">
            <span class="search-icon">${Icons.search}</span>
            <input type="text" class="input-control" id="lobby-search-input" placeholder="Search by name, ID (e.g. SEA-48291), or host..." value="${activeFilters.search}">
          </div>

          <!-- Region Filter Chips -->
          <div class="filter-group">
            <span class="filter-label">Region:</span>
            ${['ALL', 'SEA', 'NA', 'EU', 'SA', 'China'].map(r => `
              <button class="filter-chip filter-region-btn ${activeFilters.region === r ? 'active' : ''}" data-val="${r}">${r}</button>
            `).join('')}
          </div>

          <!-- Match Type Chips -->
          <div class="filter-group">
            <span class="filter-label">Type:</span>
            ${['ALL', 'Ranked', 'Turbo', 'Captains Mode'].map(t => `
              <button class="filter-chip filter-type-btn ${activeFilters.type === t ? 'active' : ''}" data-val="${t}">${t}</button>
            `).join('')}
          </div>

          <!-- Status Chips -->
          <div class="filter-group">
            <span class="filter-label">Status:</span>
            ${['ALL', 'Waiting', 'Almost Full', 'In Match'].map(s => `
              <button class="filter-chip filter-status-btn ${activeFilters.status === s ? 'active' : ''}" data-val="${s}">${s}</button>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Lobbies Grid -->
      <div class="lobbies-grid" id="lobbies-cards-grid">
        ${renderLobbyCardsList(filteredLobbies)}
      </div>
    </div>
  `;

  initLobbiesEvents();
}

function getFilteredLobbies() {
  return Store.state.lobbies.filter(l => {
    // Search match
    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase();
      const matchName = l.name.toLowerCase().includes(q);
      const matchId = l.id.toLowerCase().includes(q);
      const matchHost = l.hostName.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchHost) return false;
    }
    // Region match
    if (activeFilters.region !== 'ALL' && l.region !== activeFilters.region) return false;
    // Type match
    if (activeFilters.type !== 'ALL' && l.matchType !== activeFilters.type) return false;
    // Status match
    if (activeFilters.status !== 'ALL' && l.status !== activeFilters.status) return false;

    return true;
  });
}

function renderLobbyCardsList(lobbies) {
  if (!lobbies.length) {
    return `
      <div class="hud-panel" style="grid-column: 1/-1; padding: 48px; text-align: center;">
        <div style="font-size: 2.4rem; margin-bottom: 12px;">🛡️</div>
        <h3 style="font-family: var(--font-header); font-size: 1.2rem; color: #fff;">No Lobbies Found</h3>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 6px; max-width: 420px; margin-left: auto; margin-right: auto;">
          Try adjusting your filter criteria or create a brand new lobby to host other community members!
        </p>
        <button class="btn btn-primary" id="empty-state-create-lobby-btn" style="margin-top: 18px;">
          ${Icons.plus} <span>Create Lobby Now</span>
        </button>
      </div>
    `;
  }

  const currentUserId = Store.state.currentUser?.id;

  return lobbies.map(l => {
    const isUserInLobby = l.players.some(p => p.userId === currentUserId);
    const isFull = l.players.length >= l.maxPlayers;
    const isHost = l.hostId === currentUserId;

    return `
      <div class="lobby-card ${isUserInLobby ? 'hud-highlight' : ''}">
        <div class="lobby-card-top">
          <div class="lobby-card-title">
            <span>⚔️</span>
            <span>${l.name}</span>
          </div>
          <div class="lobby-card-id">${l.id}</div>
        </div>

        <div class="lobby-card-body">
          <div class="lobby-card-meta-grid">
            <div class="lobby-meta-item">
              <span class="meta-lbl">Host</span>
              <span class="meta-val">${l.hostName} ${isHost ? '<span class="badge badge-gold" style="font-size: 0.6rem;">YOU</span>' : ''}</span>
            </div>
            <div class="lobby-meta-item">
              <span class="meta-lbl">Region / Server</span>
              <span class="meta-val"><span class="badge badge-mana">${l.region}</span></span>
            </div>
            <div class="lobby-meta-item">
              <span class="meta-lbl">Match Type</span>
              <span class="meta-val"><span class="badge badge-gold">${l.matchType}</span></span>
            </div>
            <div class="lobby-meta-item">
              <span class="meta-lbl">Rank Req</span>
              <span class="meta-val">${l.requiredRank || 'Any'}</span>
            </div>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; min-height: 36px;">
            ${l.description || 'No description provided.'}
          </p>

          <!-- Slots Dot Indicator ● ● ● ● ○ -->
          <div class="lobby-slots-indicator">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="slots-dots-list">
                ${Array.from({ length: l.maxPlayers }).map((_, i) => `
                  <div class="slot-dot ${i < l.players.length ? 'filled' : 'empty'}"></div>
                `).join('')}
              </div>
              <span style="font-family: var(--font-stats); font-weight: 700; color: #fff;">
                ${l.players.length} / ${l.maxPlayers} Players
              </span>
            </div>

            <span class="badge ${l.status === 'In Match' ? 'badge-purple' : (isFull ? 'badge-dire' : 'badge-radiant')}">
              ${l.status === 'In Match' ? 'In Match' : (isFull ? 'Full' : `${l.maxPlayers - l.players.length} Slots Left`)}
            </span>
          </div>
        </div>

        <div class="lobby-card-actions">
          <button class="btn ${isUserInLobby ? 'btn-success' : 'btn-primary'} btn-sm lobby-join-btn" data-id="${l.id}" style="flex: 1;">
            ${isUserInLobby ? 'Enter Lobby 🎮' : (isFull ? 'Lobby Full' : 'Join Lobby ⚔️')}
          </button>
          <button class="btn btn-secondary btn-sm lobby-view-btn" data-id="${l.id}">
            View Details
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function initLobbiesEvents() {
  // Create Lobby Button
  const createBtn = document.getElementById('lobbies-create-btn');
  if (createBtn) createBtn.addEventListener('click', openCreateLobbyModal);

  const emptyCreateBtn = document.getElementById('empty-state-create-lobby-btn');
  if (emptyCreateBtn) emptyCreateBtn.addEventListener('click', openCreateLobbyModal);

  // Search input
  const searchInput = document.getElementById('lobby-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeFilters.search = e.target.value;
      updateLobbiesList();
    });
  }

  // Region chips
  document.querySelectorAll('.filter-region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-region-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.region = btn.dataset.val;
      updateLobbiesList();
      Sound.playHover();
    });
  });

  // Type chips
  document.querySelectorAll('.filter-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.type = btn.dataset.val;
      updateLobbiesList();
      Sound.playHover();
    });
  });

  // Status chips
  document.querySelectorAll('.filter-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-status-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.status = btn.dataset.val;
      updateLobbiesList();
      Sound.playHover();
    });
  });

  // Join & View buttons
  attachLobbyCardActions();
}

function attachLobbyCardActions() {
  document.querySelectorAll('.lobby-join-btn, .lobby-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lobbyId = btn.dataset.id;
      AppRouter.navigate(`lobby/${lobbyId}`);
      Sound.playClick();
    });
  });
}

function updateLobbiesList() {
  const grid = document.getElementById('lobbies-cards-grid');
  if (grid) {
    grid.innerHTML = renderLobbyCardsList(getFilteredLobbies());
    attachLobbyCardActions();
  }
}

/**
 * ==========================================================================
 * CREATE LOBBY MODAL
 * ==========================================================================
 */
export function openCreateLobbyModal() {
  Modal.open({
    title: 'Create Match Lobby',
    icon: 'swords',
    maxWidth: '560px',
    contentHtml: `
      <form id="create-lobby-form">
        <div class="form-group">
          <label class="form-label">Lobby Name</label>
          <input type="text" id="cl-name" class="input-control" placeholder="e.g. Friday Night Ranked Grind" value="Friday Night Ranked SEA" required>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Region / Server</label>
            <select id="cl-region" class="select-control">
              <option value="SEA" selected>Southeast Asia (SEA)</option>
              <option value="NA">North America (NA)</option>
              <option value="EU">Europe (EU West/East)</option>
              <option value="SA">South America (SA)</option>
              <option value="China">China (Perfect World)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Match Type</label>
            <select id="cl-type" class="select-control">
              <option value="Ranked" selected>Ranked Matchmaking</option>
              <option value="Unranked">Unranked All Pick</option>
              <option value="Turbo">Turbo Fast Mode</option>
              <option value="Captains Mode">Captains Mode (5v5)</option>
              <option value="Custom">Custom Game / Inhouse</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Maximum Players</label>
            <select id="cl-max-players" class="select-control">
              <option value="5" selected>5 Players (Party Stack)</option>
              <option value="10">10 Players (5 vs 5 Inhouse)</option>
              <option value="3">3 Players (Trio Queue)</option>
              <option value="2">2 Players (Duo Queue)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Required Rank</label>
            <select id="cl-rank" class="select-control">
              <option value="Any" selected>Any Rank Welcome</option>
              <option value="Crusader+">Crusader+</option>
              <option value="Archon+">Archon+</option>
              <option value="Legend+">Legend+</option>
              <option value="Ancient+">Ancient+</option>
              <option value="Divine+">Divine / Immortal Only</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description / Instructions</label>
          <textarea id="cl-desc" class="textarea-control" placeholder="Looking for 2 more players. Legend+ preferred. Have mic!"></textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
          <label class="checkbox-wrap">
            <input type="checkbox" id="cl-voice" checked style="display: none;">
            <div class="checkbox-custom">✓</div>
            <span>Voice Chat Available</span>
          </label>

          <label class="checkbox-wrap">
            <input type="checkbox" id="cl-public" checked style="display: none;">
            <div class="checkbox-custom">✓</div>
            <span>Allow Public Join</span>
          </label>
        </div>

        <div class="form-group" style="margin-top: 12px;">
          <label class="form-label">Lobby Password (Optional)</label>
          <input type="password" id="cl-password" class="input-control" placeholder="Leave empty for public join">
        </div>

        <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 16px;">
          <span>Launch Match Lobby</span> <span>🚀</span>
        </button>
      </form>
    `,
    onOpen: (modalEl) => {
      const form = modalEl.querySelector('#create-lobby-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = modalEl.querySelector('#cl-name').value.trim();
          const region = modalEl.querySelector('#cl-region').value;
          const matchType = modalEl.querySelector('#cl-type').value;
          const maxPlayers = modalEl.querySelector('#cl-max-players').value;
          const requiredRank = modalEl.querySelector('#cl-rank').value;
          const description = modalEl.querySelector('#cl-desc').value.trim();
          const voiceChat = modalEl.querySelector('#cl-voice').checked;
          const isPublic = modalEl.querySelector('#cl-public').checked;
          const password = modalEl.querySelector('#cl-password').value;

          const newLobby = Store.createLobby({
            name,
            region,
            matchType,
            maxPlayers,
            requiredRank,
            description,
            voiceChat,
            isPublic,
            password
          });

          Modal.close();
          Toast.success('Lobby Created', `Lobby ${newLobby.id} is now open!`);
          AppRouter.navigate(`lobby/${newLobby.id}`);
        });
      }
    }
  });
}

/**
 * ==========================================================================
 * LOBBY ROOM DETAILS SCREEN (5-Slot Party Room / 5v5 Room View)
 * Route: #lobby/:lobbyId
 * ==========================================================================
 */
export function renderLobbyDetailsView(lobbyId) {
  const container = document.getElementById('view-container');
  if (!container) return;

  const lobby = Store.state.lobbies.find(l => l.id === lobbyId);
  const user = Store.state.currentUser;

  if (!lobby) {
    container.innerHTML = `
      <div class="content-container">
        <div class="hud-panel" style="padding: 48px; text-align: center;">
          <div style="font-size: 2.4rem;">🛑</div>
          <h2 style="font-family: var(--font-header); color: #fff; margin: 12px 0;">Lobby Not Found</h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">The lobby you are looking for does not exist or has already concluded.</p>
          <a href="#lobbies" class="btn btn-primary">Browse Active Lobbies</a>
        </div>
      </div>
    `;
    return;
  }

  const isHost = lobby.hostId === user?.id;
  const isMember = lobby.players.some(p => p.userId === user?.id);
  const isFull = lobby.players.length >= lobby.maxPlayers;
  const inviteLink = `${window.location.origin}${window.location.pathname}#lobby/${lobby.id}`;

  container.innerHTML = `
    <div class="animate-fade-in content-container">
      <div class="lobby-room-container">
        <!-- Lobby Room Header -->
        <div class="lobby-room-header">
          <div class="lobby-room-title-area">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted);">
              <a href="#lobbies" style="color: var(--accent-gold); text-decoration: none; display: flex; align-items: center; gap: 4px;">
                ← Back to Lobbies
              </a>
              <span>/</span>
              <span>Lobby ${lobby.id}</span>
            </div>

            <div class="lobby-room-title">
              <span>⚔️</span>
              <span>${lobby.name}</span>
              <span class="badge ${lobby.status === 'In Match' ? 'badge-purple' : (isFull ? 'badge-dire' : 'badge-radiant')}" style="font-size: 0.8rem;">
                ${lobby.status === 'In Match' ? 'In Match' : (isFull ? 'Lobby Full' : 'Waiting for Players')}
              </span>
            </div>

            <div class="lobby-room-meta-tags">
              <span class="badge badge-mana">Region: ${lobby.region}</span>
              <span class="badge badge-gold">Mode: ${lobby.matchType}</span>
              <span class="badge badge-radiant">Rank Req: ${lobby.requiredRank}</span>
              ${lobby.voiceChat ? `<span class="badge badge-gold">🎤 Voice Chat</span>` : ''}
              <span style="font-size: 0.8rem; color: var(--text-secondary);">${lobby.description || ''}</span>
            </div>
          </div>

          <!-- Invite Link Generator Box -->
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
            <div class="lobby-room-invite-strip">
              <span>🔗 Link: /lobby/${lobby.id}</span>
              <button class="btn btn-secondary btn-sm" id="room-copy-link-btn" title="Copy Invite Link">
                ${Icons.copy} <span>Copy</span>
              </button>
            </div>

            <button class="btn btn-primary btn-sm" id="room-share-community-btn">
              ${Icons.share} <span>Share to Community Chat</span>
            </button>
          </div>
        </div>

        <!-- 5 Player Slots Roster Grid -->
        <div style="margin: 8px 0;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <span>Party Roster (${lobby.players.length} / ${lobby.maxPlayers} Slots Filled)</span>
            <span>Host: <strong style="color: var(--accent-gold);">${lobby.hostName}</strong></span>
          </div>

          <div class="lobby-slots-roster">
            ${renderLobbySlots(lobby, user)}
          </div>
        </div>

        <!-- Host & Member Action Command Bar -->
        <div class="lobby-command-bar">
          <div class="command-bar-group">
            ${isHost ? `
              <button class="btn btn-success btn-lg" id="host-start-match-btn" ${!isFull ? '' : ''}>
                <span>⚔️ Start Match / Launch Queue</span>
              </button>
              <button class="btn btn-secondary" id="host-invite-player-btn">
                ${Icons.plus} <span>Invite Player</span>
              </button>
              <button class="btn btn-secondary" id="host-close-lobby-btn" style="color: var(--dire-red);">
                <span>Close Lobby</span>
              </button>
            ` : `
              ${isMember ? `
                <button class="btn btn-danger" id="member-leave-lobby-btn">
                  <span>Leave Lobby</span>
                </button>
                <button class="btn btn-success" id="member-ready-toggle-btn">
                  <span>Ready Up (Toggle) ✓</span>
                </button>
              ` : `
                <button class="btn btn-primary btn-lg" id="guest-join-lobby-btn" ${isFull ? 'disabled' : ''}>
                  <span>${isFull ? 'Lobby is Full' : 'Join Match Lobby ⚔️'}</span>
                </button>
              `}
            `}
          </div>

          <div class="command-bar-group">
            <button class="btn btn-secondary" id="room-open-chat-btn">
              ${Icons.community} <span>Open Community Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  initLobbyDetailsEvents(lobby);
}

function renderLobbySlots(lobby, currentUser) {
  const max = lobby.maxPlayers;
  let html = '';

  for (let i = 0; i < max; i++) {
    const player = lobby.players[i];
    if (player) {
      const isCurrent = currentUser?.id === player.userId;
      html += `
        <div class="lobby-slot-card is-filled ${player.isHost ? 'is-host' : ''}">
          <div class="slot-index-badge">#${i + 1}</div>
          <div class="slot-avatar">
            ${player.avatar || '⚔️'}
          </div>
          <div class="slot-player-info">
            <div class="slot-player-name">
              <span>${player.name}</span>
              ${player.isHost ? `<span class="badge badge-gold" style="font-size: 0.65rem;">HOST</span>` : ''}
              ${isCurrent ? `<span class="badge badge-radiant" style="font-size: 0.65rem;">YOU</span>` : ''}
            </div>
            <div class="slot-player-meta">
              <span>Rank: <strong>${player.rank || 'Uncalibrated'}</strong></span>
              <span>•</span>
              <span>Role: <strong>${player.role || 'Flexible'}</strong></span>
            </div>
          </div>
          <div class="slot-ready-indicator ${player.ready ? 'ready' : 'not-ready'}">
            ${player.ready ? 'READY' : 'WAITING'}
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="lobby-slot-card is-empty open-slot-join-trigger" data-slot="${i}">
          <div class="slot-index-badge">#${i + 1}</div>
          <div class="slot-avatar" style="border: 1px dashed var(--border-medium); opacity: 0.5;">
            +
          </div>
          <div class="slot-player-info">
            <div class="slot-player-name" style="color: var(--text-muted);">Open Slot</div>
            <div class="slot-player-meta" style="color: var(--text-muted);">Looking for player...</div>
          </div>
          <button class="btn btn-secondary btn-sm" style="font-size: 0.72rem;">Claim Slot</button>
        </div>
      `;
    }
  }

  return html;
}

function initLobbyDetailsEvents(lobby) {
  // Copy Link
  const copyBtn = document.getElementById('room-copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const link = `${window.location.origin}${window.location.pathname}#lobby/${lobby.id}`;
      navigator.clipboard?.writeText(link);
      Toast.success('Link Copied', `Invite link copied to clipboard! (/lobby/${lobby.id})`);
      Sound.playNotification();
    });
  }

  // Share to Community Chat
  const shareBtn = document.getElementById('room-share-community-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      Store.sendCommunityMessage(
        `🎮 Joined "${lobby.name}"! We have ${lobby.maxPlayers - lobby.players.length} slots open. Join up:`,
        null,
        {
          lobbyId: lobby.id,
          name: lobby.name,
          host: lobby.hostName,
          region: lobby.region,
          type: lobby.matchType,
          currentPlayers: lobby.players.length,
          maxPlayers: lobby.maxPlayers
        }
      );
      Toast.success('Shared to Community', 'Interactive lobby card posted in Community Chat!');
      AppRouter.navigate('community');
    });
  }

  // Guest join button
  const guestJoinBtn = document.getElementById('guest-join-lobby-btn');
  if (guestJoinBtn) {
    guestJoinBtn.addEventListener('click', () => {
      const res = Store.joinLobby(lobby.id);
      if (res.success) {
        Toast.success('Joined Lobby', `Welcome to ${lobby.name}!`);
        renderLobbyDetailsView(lobby.id);
      } else {
        Toast.error('Join Error', res.reason);
      }
    });
  }

  // Empty slot clicks
  document.querySelectorAll('.open-slot-join-trigger').forEach(slot => {
    slot.addEventListener('click', () => {
      const res = Store.joinLobby(lobby.id);
      if (res.success) {
        Toast.success('Slot Claimed', `You claimed a slot in ${lobby.name}!`);
        renderLobbyDetailsView(lobby.id);
      } else {
        Toast.error('Slot Error', res.reason);
      }
    });
  });

  // Member leave button
  const leaveBtn = document.getElementById('member-leave-lobby-btn');
  if (leaveBtn) {
    leaveBtn.addEventListener('click', () => {
      Store.leaveLobby(lobby.id);
      Toast.info('Lobby Left', 'You have left the match lobby.');
      AppRouter.navigate('lobbies');
    });
  }

  // Host close lobby
  const closeBtn = document.getElementById('host-close-lobby-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to disband this lobby?')) {
        Store.leaveLobby(lobby.id);
        Toast.info('Lobby Closed', 'Match lobby disbanded.');
        AppRouter.navigate('lobbies');
      }
    });
  }

  // Host start match
  const startBtn = document.getElementById('host-start-match-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      lobby.status = 'In Match';
      Store.saveState();
      Store.notifySubscribers();
      Toast.success('Match Started', `Queue popped! Match #${Math.floor(10000 + Math.random() * 90000)} is launching.`);
      Sound.playLobbyJoin();
      renderLobbyDetailsView(lobby.id);
    });
  }

  // Host Invite Player Modal
  const inviteBtn = document.getElementById('host-invite-player-btn');
  if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
      const candidateUsers = Store.state.users.filter(u => !lobby.players.some(p => p.userId === u.id));
      Modal.open({
        title: 'Invite Player to Lobby',
        icon: 'plus',
        contentHtml: `
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 360px; overflow-y: auto;">
            ${candidateUsers.map(u => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 1.3rem;">${u.avatar}</span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.85rem; color: #fff;">${u.displayName}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${u.rank} • ${u.region}</div>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm modal-send-invite-btn" data-id="${u.id}" data-name="${u.displayName}">
                  Invite
                </button>
              </div>
            `).join('')}
          </div>
        `,
        onOpen: (modalEl) => {
          modalEl.querySelectorAll('.modal-send-invite-btn').forEach(b => {
            b.addEventListener('click', () => {
              const pName = b.dataset.name;
              Toast.success('Invitation Sent', `Sent lobby invite to ${pName}!`);
              b.innerText = 'Sent ✓';
              b.disabled = true;
              Sound.playNotification();
            });
          });
        }
      });
    });
  }

  // Open Community Chat button
  const openChatBtn = document.getElementById('room-open-chat-btn');
  if (openChatBtn) {
    openChatBtn.addEventListener('click', () => {
      AppRouter.navigate('community');
    });
  }
}
