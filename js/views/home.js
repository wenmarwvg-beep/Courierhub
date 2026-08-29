/**
 * Ancient Nexus - Home / Dashboard HUD Command Center
 * 6 Animated Stat Cards, Live Esports Activity Ticker, Today's Matches table,
 * Quick Party Finder widget, and Quick Create Lobby launcher.
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { AppRouter } from '../router.js';
import { openCreateLobbyModal } from './lobbies.js';

export function renderHomeView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = Store.state.currentUser;
  const stats = Store.state.statsOverview;
  const lobbies = Store.state.lobbies;
  const activityFeed = Store.state.activityFeed;
  const partyFinderList = Store.state.partyFinder;

  container.innerHTML = `
    <div class="animate-fade-in content-container">
      <!-- Welcome Hero Command Header -->
      <div class="hud-panel hud-highlight" style="margin-bottom: 24px; padding: 24px 32px; background: linear-gradient(135deg, rgba(20, 28, 44, 0.95) 0%, rgba(9, 14, 24, 0.98) 100%);">
        <div class="hud-corner-accent hud-corner-tl"></div>
        <div class="hud-corner-accent hud-corner-tr"></div>
        <div class="hud-corner-accent hud-corner-bl"></div>
        <div class="hud-corner-accent hud-corner-br"></div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 18px;">
            <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 58px; height: 58px; font-size: 2rem;">
              <div class="avatar-placeholder">${user.avatar || '🔥'}</div>
              <div class="status-dot status-${user.onlineStatus || 'online'}"></div>
            </div>
            <div>
              <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 6px;">
                <span>⚔️</span> <span>Nexus Command Center</span>
              </div>
              <h1 style="font-size: 1.8rem; font-weight: 900; margin: 2px 0 4px; color: #fff;">
                Welcome back, <span style="background: linear-gradient(135deg, #fff, #fbbf24); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${user.displayName || user.username}</span>
              </h1>
              <div style="display: flex; align-items: center; gap: 12px; font-size: 0.8rem; color: var(--text-secondary);">
                <span>Rank: <strong style="color: #fff;">${user.rank}</strong></span>
                <span>•</span>
                <span>Region: <strong style="color: #fff;">${user.region}</strong></span>
                <span>•</span>
                <span>Dota ID: <strong style="color: var(--accent-gold); font-family: var(--font-stats);">${user.dotaId}</strong></span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="btn btn-secondary" id="home-view-lfp-btn">
              ${Icons.party} <span>Party Finder (${partyFinderList.length})</span>
            </button>
            <button class="btn btn-primary" id="home-create-lobby-cta">
              ${Icons.plus} <span>Create Lobby</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 6 Statistics Cards with animated numbers & gaming accents -->
      <div class="stats-hud-grid">
        <div class="stat-hud-card" style="--card-accent: var(--accent-gold);">
          <div class="stat-info">
            <div class="stat-label">Total Members</div>
            <div class="stat-value" data-target="${stats.totalMembers}">${stats.totalMembers.toLocaleString()}</div>
            <div class="stat-sub">Active platform players</div>
          </div>
          <div class="stat-icon-wrap">👥</div>
        </div>

        <div class="stat-hud-card" style="--card-accent: var(--radiant-green);">
          <div class="stat-info">
            <div class="stat-label">Online Now</div>
            <div class="stat-value text-radiant" data-target="${stats.onlineNow}">${stats.onlineNow.toLocaleString()}</div>
            <div class="stat-sub">247 Players Ready</div>
          </div>
          <div class="stat-icon-wrap" style="color: var(--radiant-green);">🟢</div>
        </div>

        <div class="stat-hud-card" style="--card-accent: var(--mana-blue);">
          <div class="stat-info">
            <div class="stat-label">Matches Today</div>
            <div class="stat-value text-mana" data-target="${stats.matchesToday}">${stats.matchesToday}</div>
            <div class="stat-sub">High MMR & Turbo stacks</div>
          </div>
          <div class="stat-icon-wrap" style="color: var(--mana-blue);">⚔️</div>
        </div>

        <div class="stat-hud-card" style="--card-accent: var(--accent-gold);">
          <div class="stat-info">
            <div class="stat-label">Active Lobbies</div>
            <div class="stat-value text-gold" data-target="${lobbies.length}">${lobbies.length}</div>
            <div class="stat-sub">Open for team recruitment</div>
          </div>
          <div class="stat-icon-wrap">🎮</div>
        </div>

        <div class="stat-hud-card" style="--card-accent: var(--ancient-purple);">
          <div class="stat-info">
            <div class="stat-label">Matches Completed</div>
            <div class="stat-value text-purple" data-target="${stats.matchesCompleted}">${stats.matchesCompleted}</div>
            <div class="stat-sub">62 Completed Today</div>
          </div>
          <div class="stat-icon-wrap" style="color: var(--ancient-purple);">🏆</div>
        </div>

        <div class="stat-hud-card" style="--card-accent: var(--dire-red);">
          <div class="stat-info">
            <div class="stat-label">Looking for Party</div>
            <div class="stat-value text-dire" data-target="${stats.playersLookingForParty}">${stats.playersLookingForParty}</div>
            <div class="stat-sub">Players seeking stacks</div>
          </div>
          <div class="stat-icon-wrap" style="color: var(--dire-red);">🎯</div>
        </div>
      </div>

      <!-- Main Dashboard 2-Column Layout -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <!-- Left Column: Today's Matches & Lobbies Overview -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          
          <!-- Today's Match Activity Table -->
          <div class="hud-panel">
            <div class="hud-panel-header">
              <div class="hud-panel-title">
                <span class="icon-badge">⚔️</span>
                <span>Today's Match Activity</span>
              </div>
              <a href="#lobbies" class="btn btn-secondary btn-sm">View All Lobbies (${lobbies.length})</a>
            </div>

            <div class="hud-panel-body" style="padding: 0; overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
                <thead>
                  <tr style="background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;">
                    <th style="padding: 12px 18px;">Lobby Name</th>
                    <th style="padding: 12px 14px;">Host</th>
                    <th style="padding: 12px 14px;">Players</th>
                    <th style="padding: 12px 14px;">Region</th>
                    <th style="padding: 12px 14px;">Type</th>
                    <th style="padding: 12px 14px;">Status</th>
                    <th style="padding: 12px 18px; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderMatchesTableRows(lobbies)}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Looking for Party (LFP) Live Strip -->
          <div class="hud-panel">
            <div class="hud-panel-header">
              <div class="hud-panel-title">
                <span class="icon-badge">🎯</span>
                <span>Players Looking for Teammates</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <label class="checkbox-wrap" style="font-size: 0.8rem;">
                  <input type="checkbox" id="home-lfp-toggle" ${user.isLookingForParty ? 'checked' : ''} style="display: none;">
                  <div class="checkbox-custom">✓</div>
                  <span>I'm Looking for a Party</span>
                </label>
              </div>
            </div>

            <div class="hud-panel-body" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px;">
              ${renderLfpCards(partyFinderList)}
            </div>
          </div>
        </div>

        <!-- Right Column: Real-Time Activity Feed & Quick Actions -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Real-Time Activity Feed -->
          <div class="hud-panel">
            <div class="hud-panel-header">
              <div class="hud-panel-title">
                <span class="icon-badge">⚡</span>
                <span>Live Esports Activity</span>
              </div>
              <span class="badge badge-radiant pulse-glow">LIVE</span>
            </div>

            <div class="hud-panel-body" style="display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto;">
              ${renderActivityFeed(activityFeed)}
            </div>
          </div>

          <!-- Community Quick Chat Banner -->
          <div class="hud-panel" style="background: linear-gradient(135deg, rgba(24, 34, 54, 0.9) 0%, rgba(13, 18, 28, 0.95) 100%); border-color: var(--border-bright);">
            <div class="hud-panel-body" style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px;">
              <div style="font-size: 2.2rem;">💬</div>
              <h3 style="font-family: var(--font-header); font-size: 1.15rem; color: #fff;">Join Global Community Chat</h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
                Share lobby invite links, discuss hero drafts, chat with online players, and coordinate scrims in real time.
              </p>
              <a href="#community" class="btn btn-primary btn-block">
                <span>Enter Community Hall</span> <span>⚔️</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initHomeEvents();
}

function renderMatchesTableRows(lobbies) {
  if (!lobbies || !lobbies.length) {
    return `<tr><td colspan="7" style="padding: 24px; text-align: center; color: var(--text-muted);">No active matches. Create one to get started!</td></tr>`;
  }

  return lobbies.slice(0, 6).map(l => {
    const isFull = l.players.length >= l.maxPlayers;
    const inMatch = l.status === 'In Match';
    const statusClass = inMatch ? 'badge-purple' : (isFull ? 'badge-dire' : 'badge-radiant');

    return `
      <tr style="border-bottom: 1px solid var(--border-subtle); transition: background var(--transition-fast);" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
        <td style="padding: 14px 18px;">
          <div style="font-weight: 700; color: #fff;">${l.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-stats);">${l.id}</div>
        </td>
        <td style="padding: 14px 14px; font-weight: 600; color: var(--text-secondary);">${l.hostName}</td>
        <td style="padding: 14px 14px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-family: var(--font-stats); font-weight: 700; color: var(--accent-gold);">${l.players.length}/${l.maxPlayers}</span>
            <div class="slots-dots-list" style="gap: 3px;">
              ${Array.from({ length: l.maxPlayers }).map((_, i) => `
                <div class="slot-dot ${i < l.players.length ? 'filled' : 'empty'}" style="width: 6px; height: 6px;"></div>
              `).join('')}
            </div>
          </div>
        </td>
        <td style="padding: 14px 14px;"><span class="badge badge-mana">${l.region}</span></td>
        <td style="padding: 14px 14px;"><span class="badge badge-gold">${l.matchType}</span></td>
        <td style="padding: 14px 14px;"><span class="badge ${statusClass}">${l.status}</span></td>
        <td style="padding: 14px 18px; text-align: right;">
          <button class="btn btn-secondary btn-sm home-join-lobby-btn" data-id="${l.id}">
            ${inMatch ? 'Spectate' : (isFull ? 'View' : 'Join')}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderLfpCards(partyList) {
  if (!partyList || !partyList.length) {
    return `<div style="grid-column: 1/-1; padding: 18px; text-align: center; color: var(--text-muted);">No players currently in party queue. Check back soon!</div>`;
  }

  return partyList.slice(0, 4).map(p => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.4rem;">${p.avatar || '⚔️'}</span>
        <div>
          <div style="font-weight: 700; font-size: 0.88rem; color: #fff;">${p.name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${p.rank} • ${p.role} • ${p.region}</div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm home-invite-lfp-btn" data-id="${p.userId}" data-name="${p.name}">
        Invite
      </button>
    </div>
  `).join('');
}

function renderActivityFeed(feed) {
  if (!feed || !feed.length) {
    return `<div style="padding: 12px; color: var(--text-muted); font-size: 0.8rem; text-align: center;">No recent activity</div>`;
  }

  return feed.map(item => `
    <div style="display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; background: rgba(255,255,255,0.02); border-radius: var(--radius-sm); border-left: 2px solid var(--accent-gold);">
      <span style="font-size: 1.1rem; line-height: 1;">${item.icon || '⚡'}</span>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.82rem; color: #fff; line-height: 1.4;">${item.text}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${item.time}</div>
      </div>
    </div>
  `).join('');
}

function initHomeEvents() {
  // Create lobby cta
  const createCta = document.getElementById('home-create-lobby-cta');
  if (createCta) {
    createCta.addEventListener('click', () => {
      openCreateLobbyModal();
    });
  }

  // View LFP CTA
  const viewLfpBtn = document.getElementById('home-view-lfp-btn');
  if (viewLfpBtn) {
    viewLfpBtn.addEventListener('click', () => {
      AppRouter.navigate('party-finder');
    });
  }

  // LFP Toggle
  const lfpToggle = document.getElementById('home-lfp-toggle');
  if (lfpToggle) {
    lfpToggle.addEventListener('change', (e) => {
      Store.togglePartyFinder(e.target.checked);
    });
  }

  // Join/View Lobby buttons in table
  document.querySelectorAll('.home-join-lobby-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lobbyId = btn.dataset.id;
      AppRouter.navigate(`lobby/${lobbyId}`);
      Sound.playClick();
    });
  });

  // Invite LFP player
  document.querySelectorAll('.home-invite-lfp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pName = btn.dataset.name;
      import('../components/toast.js').then(({ Toast }) => {
        Toast.success('Invitation Sent', `Invited ${pName} to your party lobby!`);
      });
      btn.innerText = 'Invited ✓';
      btn.disabled = true;
      Sound.playNotification();
    });
  });
}
