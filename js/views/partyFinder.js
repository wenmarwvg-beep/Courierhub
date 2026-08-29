/**
 * Ancient Nexus - Party Finder (Looking for Party) View
 * Interactive queue system for players seeking stacks and teammates.
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { Toast } from '../components/toast.js';
import { AppRouter } from '../router.js';

export function renderPartyFinderView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = Store.state.currentUser;
  const partyList = Store.state.partyFinder;

  container.innerHTML = `
    <div class="animate-fade-in content-container">
      <!-- Header Banner -->
      <div class="hud-panel hud-highlight" style="margin-bottom: 24px; padding: 24px 32px; background: linear-gradient(135deg, rgba(24, 34, 52, 0.95) 0%, rgba(10, 15, 26, 0.98) 100%);">
        <div class="hud-corner-accent hud-corner-tl"></div>
        <div class="hud-corner-accent hud-corner-tr"></div>
        <div class="hud-corner-accent hud-corner-bl"></div>
        <div class="hud-corner-accent hud-corner-br"></div>

        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 6px;">
              <span>🎯</span> <span>Real-Time Party Matchmaker</span>
            </div>
            <h1 style="font-size: 1.8rem; font-weight: 900; color: #fff; margin: 4px 0;">
              LOOKING FOR PARTY (LFP)
            </h1>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">
              Find players matching your role, rank tier, and server region for ranked parties and battle cups.
            </p>
          </div>

          <div style="display: flex; align-items: center; gap: 16px; background: rgba(0,0,0,0.3); padding: 14px 20px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">My LFP Status</div>
              <div style="font-size: 0.75rem; color: ${user.isLookingForParty ? 'var(--radiant-green)' : 'var(--text-muted)'}; font-weight: 600;">
                ${user.isLookingForParty ? '🟢 In Active LFP Queue' : '⚪ Offline from Queue'}
              </div>
            </div>

            <button class="btn ${user.isLookingForParty ? 'btn-danger' : 'btn-success'}" id="lfp-toggle-status-btn">
              ${user.isLookingForParty ? 'Leave Queue' : 'Find a Party ⚔️'}
            </button>
          </div>
        </div>
      </div>

      <!-- Party Queue Roster Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
        ${renderPartyCards(partyList, user)}
      </div>
    </div>
  `;

  initPartyFinderEvents();
}

function renderPartyCards(partyList, currentUser) {
  if (!partyList || !partyList.length) {
    return `
      <div class="hud-panel" style="grid-column: 1/-1; padding: 48px; text-align: center;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🎯</div>
        <h3 style="font-family: var(--font-header); font-size: 1.2rem; color: #fff;">Party Queue is Empty</h3>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 6px;">
          Enable "Find a Party" above to put yourself on the roster!
        </p>
      </div>
    `;
  }

  return partyList.map(p => {
    const isMe = currentUser && p.userId === currentUser.id;

    return `
      <div class="hud-panel ${isMe ? 'hud-highlight' : ''}" style="padding: 18px; display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="player-avatar-frame avatar-frame-immortal" style="width: 44px; height: 44px; font-size: 1.4rem;">
              <div class="avatar-placeholder">${p.avatar || '⚔️'}</div>
              <div class="status-dot status-online"></div>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #fff; display: flex; align-items: center; gap: 6px;">
                <span>${p.name}</span>
                ${isMe ? `<span class="badge badge-gold" style="font-size: 0.62rem;">YOU</span>` : ''}
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${p.rank}</div>
            </div>
          </div>

          <span class="badge badge-radiant">READY</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm); font-size: 0.78rem;">
          <div>
            <div style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Looking For</div>
            <div style="font-weight: 700; color: #fff;">${p.mode || 'Ranked'}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Role</div>
            <div style="font-weight: 700; color: var(--accent-gold);">${p.role || 'Any'}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 0.68rem; text-transform: uppercase;">Region</div>
            <div style="font-weight: 700; color: var(--mana-blue);">${p.region || 'SEA'}</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; margin-top: auto;">
          ${!isMe ? `
            <button class="btn btn-primary btn-sm party-invite-btn" data-id="${p.userId}" data-name="${p.name}" style="flex: 1;">
              ${Icons.plus} <span>Invite to Lobby</span>
            </button>
            <button class="btn btn-secondary btn-sm party-pm-btn" data-id="${p.userId}">
              ${Icons.conversations}
            </button>
          ` : `
            <button class="btn btn-secondary btn-sm" style="flex: 1;" disabled>
              <span>Currently in Queue ✓</span>
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

function initPartyFinderEvents() {
  const toggleBtn = document.getElementById('lfp-toggle-status-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = Store.state.currentUser.isLookingForParty;
      Store.togglePartyFinder(!current);
      Toast.success('Queue Updated', !current ? 'You have joined the LFP party queue!' : 'You have left the party queue.');
      renderPartyFinderView();
    });
  }

  // Invite button
  document.querySelectorAll('.party-invite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pName = btn.dataset.name;
      Toast.success('Invitation Sent', `Invited ${pName} to your party lobby!`);
      btn.innerText = 'Invited ✓';
      btn.disabled = true;
      Sound.playNotification();
    });
  });

  // PM button
  document.querySelectorAll('.party-pm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AppRouter.navigate(`conversations/${btn.dataset.id}`);
    });
  });
}
