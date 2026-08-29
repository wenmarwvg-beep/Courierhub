/**
 * Ancient Nexus - Player Profile & Edit Profile View
 * Large gaming profile banner, stats HUD, favorite heroes masteries, role radar,
 * and comprehensive Edit Profile modal.
 */

import { Store } from '../store.js';
import { Icons, RolesList } from '../../assets/icons.js';
import { HeroesCatalog, AvatarIcons } from '../../assets/heroes.js';
import { Sound } from '../audio.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';
import { AppRouter } from '../router.js';

export function renderProfileView(targetUserId = null) {
  const container = document.getElementById('view-container');
  if (!container) return;

  const currentLoggedInUser = Store.state.currentUser;
  const isMe = !targetUserId || targetUserId === currentLoggedInUser?.id;

  const profileUser = isMe
    ? currentLoggedInUser
    : (Store.state.users.find(u => u.id === targetUserId) || currentLoggedInUser);

  if (!profileUser) return;

  const stats = profileUser.stats || {
    matches: profileUser.gamesPlayed || 1284,
    wins: Math.round((profileUser.gamesPlayed || 1284) * 0.54),
    losses: Math.round((profileUser.gamesPlayed || 1284) * 0.46),
    winRate: profileUser.winRate || 54.1,
    hoursPlayed: 3420,
    mvpCount: 142
  };

  const favoriteHeroes = (profileUser.favoriteHeroes || ['shadow_fiend', 'juggernaut', 'phantom_assassin'])
    .map(hId => HeroesCatalog.find(h => h.id === hId))
    .filter(Boolean);

  container.innerHTML = `
    <div class="animate-fade-in content-container">
      <!-- Profile Header Gaming Banner -->
      <div class="hud-panel hud-highlight" style="margin-bottom: 24px; padding: 0; overflow: hidden; background: linear-gradient(180deg, rgba(16, 24, 38, 0.95) 0%, rgba(8, 12, 20, 0.98) 100%);">
        <div class="hud-corner-accent hud-corner-tl"></div>
        <div class="hud-corner-accent hud-corner-tr"></div>
        <div class="hud-corner-accent hud-corner-bl"></div>
        <div class="hud-corner-accent hud-corner-br"></div>

        <!-- Ambient Backdrop Graphic -->
        <div style="height: 160px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%); position: relative; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: flex-end; padding: 24px 32px;">
          <div style="position: absolute; right: 32px; top: 24px; opacity: 0.15; font-size: 8rem; font-family: var(--font-header); pointer-events: none;">AEGIS</div>
        </div>

        <div style="padding: 0 32px 28px; margin-top: -50px; display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div style="display: flex; align-items: flex-end; gap: 24px;">
            <div class="player-avatar-frame ${profileUser.avatarFrame || 'avatar-frame-immortal'}" style="width: 104px; height: 104px; font-size: 3.4rem; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
              <div class="avatar-placeholder">${profileUser.avatar || '🔥'}</div>
              <div class="status-dot status-${profileUser.onlineStatus || profileUser.status || 'online'}" style="width: 20px; height: 20px; border-width: 3px;"></div>
            </div>

            <div style="margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
                <h1 style="font-size: 1.8rem; font-weight: 900; color: #fff; line-height: 1;">
                  ${profileUser.displayName || profileUser.username}
                </h1>
                <div class="rank-badge" style="font-size: 0.9rem;">
                  <span>${profileUser.rank}</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 14px; font-size: 0.82rem; color: var(--text-secondary); flex-wrap: wrap;">
                <span>Dota ID: <strong style="color: var(--accent-gold); font-family: var(--font-stats);">${profileUser.dotaId}</strong></span>
                <span>•</span>
                <span>Region: <strong style="color: #fff;">${profileUser.region}</strong></span>
                <span>•</span>
                <span>Member Since: <strong>Jan 2025</strong></span>
              </div>
            </div>
          </div>

          <!-- Profile Actions -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
            ${isMe ? `
              <button class="btn btn-primary" id="profile-edit-btn">
                ${Icons.edit} <span>Edit Player Profile</span>
              </button>
            ` : `
              <button class="btn btn-secondary" id="profile-send-pm-btn">
                ${Icons.conversations} <span>Message</span>
              </button>
              <button class="btn btn-primary" id="profile-invite-lobby-btn">
                ${Icons.plus} <span>Invite to Lobby</span>
              </button>
            `}
          </div>
        </div>

        <div style="padding: 0 32px 24px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
          <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 800px; line-height: 1.6;">
            ${profileUser.bio || 'Competitive Dota 2 player looking for party stacks and community scrims.'}
          </p>
        </div>
      </div>

      <!-- Stats HUD & Performance Breakdown -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <!-- Left: Stats Grid & Role Distribution -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Primary Performance Grid -->
          <div class="hud-panel">
            <div class="hud-panel-header">
              <div class="hud-panel-title">
                <span class="icon-badge">📊</span>
                <span>Performance Overview</span>
              </div>
            </div>

            <div class="hud-panel-body" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px;">
              <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-sm); text-align: center;">
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Total Matches</div>
                <div style="font-family: var(--font-stats); font-size: 1.8rem; font-weight: 700; color: #fff;">${stats.matches}</div>
              </div>

              <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-sm); text-align: center;">
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Wins</div>
                <div style="font-family: var(--font-stats); font-size: 1.8rem; font-weight: 700; color: var(--radiant-green);">${stats.wins}</div>
              </div>

              <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-sm); text-align: center;">
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Losses</div>
                <div style="font-family: var(--font-stats); font-size: 1.8rem; font-weight: 700; color: var(--dire-red);">${stats.losses}</div>
              </div>

              <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-sm); text-align: center;">
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Win Rate</div>
                <div style="font-family: var(--font-stats); font-size: 1.8rem; font-weight: 700; color: var(--accent-gold);">${stats.winRate}%</div>
              </div>

              <div style="background: rgba(0,0,0,0.3); padding: 14px; border-radius: var(--radius-sm); text-align: center;">
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Hours Played</div>
                <div style="font-family: var(--font-stats); font-size: 1.8rem; font-weight: 700; color: var(--mana-blue);">${stats.hoursPlayed || 3200}h</div>
              </div>
            </div>
          </div>

          <!-- Preferred Roles Matrix -->
          <div class="hud-panel">
            <div class="hud-panel-header">
              <div class="hud-panel-title">
                <span class="icon-badge">🎯</span>
                <span>Preferred Roles & Mastery</span>
              </div>
            </div>

            <div class="hud-panel-body" style="display: flex; flex-direction: column; gap: 16px;">
              ${RolesList.map(role => {
                const isPreferred = (profileUser.preferredRoles || ['carry', 'mid']).includes(role.id);
                const mockWinrate = isPreferred ? 57 : 49;
                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 10px; width: 180px;">
                      <span style="color: ${role.color};">${role.icon}</span>
                      <span style="font-weight: 600; color: ${isPreferred ? '#fff' : 'var(--text-secondary)'}; font-size: 0.88rem;">${role.name}</span>
                    </div>

                    <div style="flex: 1;">
                      <div class="winrate-bar-wrap">
                        <div class="winrate-meta">
                          <span style="color: var(--text-muted);">${isPreferred ? 'Primary Role' : 'Secondary'}</span>
                          <span style="color: ${mockWinrate > 50 ? 'var(--radiant-green)' : 'var(--text-secondary)'}; font-family: var(--font-stats);">${mockWinrate}% WR</span>
                        </div>
                        <div class="winrate-track">
                          <div class="winrate-fill" style="width: ${mockWinrate}%;"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Favorite Heroes Masteries -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <div class="hud-panel">
            <div class="hud-panel-header">
              <div class="hud-panel-title">
                <span class="icon-badge">👑</span>
                <span>Top Hero Masteries</span>
              </div>
            </div>

            <div class="hud-panel-body" style="display: flex; flex-direction: column; gap: 14px;">
              ${favoriteHeroes.map((hero, idx) => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 44px; height: 44px; border-radius: 8px; background: ${hero.gradient}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid rgba(255,255,255,0.2);">
                      ${hero.icon}
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 0.95rem; color: #fff;">${hero.name}</div>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">${hero.role} • ${hero.title}</div>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <div style="font-family: var(--font-stats); font-weight: 700; font-size: 1rem; color: var(--accent-gold);">
                      Mastery Lvl ${25 - idx * 4}
                    </div>
                    <div style="font-size: 0.72rem; color: var(--radiant-green);">${340 - idx * 80} Matches (58% WR)</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Steam & Dota ID Link Card -->
          <div class="hud-panel" style="padding: 20px; text-align: center;">
            <div style="font-size: 1.8rem; margin-bottom: 8px;">🛡️</div>
            <h4 style="font-family: var(--font-header); font-size: 1rem; color: #fff;">Verified Steam / Dota ID</h4>
            <div style="font-family: var(--font-stats); font-size: 1.2rem; color: var(--accent-gold); margin: 6px 0;">
              ${profileUser.dotaId}
            </div>
            <button class="btn btn-secondary btn-sm" id="profile-copy-id-btn" style="margin-top: 8px;">
              ${Icons.copy} <span>Copy Friend ID</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  initProfileEvents(profileUser, isMe);
}

function initProfileEvents(profileUser, isMe) {
  // Edit Profile button
  const editBtn = document.getElementById('profile-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', openEditProfileModal);
  }

  // Copy friend ID
  const copyBtn = document.getElementById('profile-copy-id-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard?.writeText(profileUser.dotaId);
      Toast.success('Copied', `Dota 2 ID ${profileUser.dotaId} copied to clipboard!`);
      Sound.playNotification();
    });
  }

  // Send PM button
  const pmBtn = document.getElementById('profile-send-pm-btn');
  if (pmBtn) {
    pmBtn.addEventListener('click', () => {
      AppRouter.navigate(`conversations/${profileUser.id}`);
    });
  }

  // Invite to lobby
  const inviteBtn = document.getElementById('profile-invite-lobby-btn');
  if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
      Toast.success('Invitation Sent', `Invited ${profileUser.displayName} to your active lobby!`);
      Sound.playNotification();
    });
  }
}

/**
 * ==========================================================================
 * EDIT PROFILE MODAL
 * ==========================================================================
 */
export function openEditProfileModal() {
  const user = Store.state.currentUser;
  if (!user) return;

  let selectedAvatar = user.avatar || '🔥';

  Modal.open({
    title: 'Edit Player Profile',
    icon: 'profile',
    maxWidth: '580px',
    contentHtml: `
      <form id="edit-profile-form">
        <!-- Choose Avatar -->
        <div class="form-group">
          <label class="form-label">Player Avatar Icon</label>
          <div id="ep-avatar-picker" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
            ${AvatarIcons.map(icon => `
              <button type="button" class="ep-avatar-btn ${icon === selectedAvatar ? 'selected' : ''}" data-icon="${icon}" style="width: 38px; height: 38px; font-size: 1.3rem; border: 1px solid ${icon === selectedAvatar ? 'var(--accent-primary)' : 'var(--border-subtle)'}; background: var(--bg-tertiary); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transform: ${icon === selectedAvatar ? 'scale(1.15)' : 'scale(1)'};">
                ${icon}
              </button>
            `).join('')}
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Display Name</label>
            <input type="text" id="ep-name" class="input-control" value="${user.displayName || user.username}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Dota 2 Player ID</label>
            <input type="text" id="ep-dotaid" class="input-control" value="${user.dotaId || ''}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Player Bio</label>
          <textarea id="ep-bio" class="textarea-control" placeholder="Share your playstyle, goals, or schedule...">${user.bio || ''}</textarea>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label class="form-label">Region</label>
            <select id="ep-region" class="select-control">
              <option value="SEA" ${user.region === 'SEA' ? 'selected' : ''}>Southeast Asia (SEA)</option>
              <option value="NA" ${user.region === 'NA' ? 'selected' : ''}>North America (NA)</option>
              <option value="EU" ${user.region === 'EU' ? 'selected' : ''}>Europe (EU)</option>
              <option value="SA" ${user.region === 'SA' ? 'selected' : ''}>South America (SA)</option>
              <option value="China" ${user.region === 'China' ? 'selected' : ''}>China</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Rank Tier</label>
            <select id="ep-rank" class="select-control">
              <option value="Herald V" ${user.rank === 'Herald V' ? 'selected' : ''}>Herald V</option>
              <option value="Guardian V" ${user.rank === 'Guardian V' ? 'selected' : ''}>Guardian V</option>
              <option value="Crusader V" ${user.rank === 'Crusader V' ? 'selected' : ''}>Crusader V</option>
              <option value="Archon V" ${user.rank === 'Archon V' ? 'selected' : ''}>Archon V</option>
              <option value="Legend V" ${user.rank === 'Legend V' ? 'selected' : ''}>Legend V</option>
              <option value="Ancient V" ${user.rank === 'Ancient V' ? 'selected' : ''}>Ancient V</option>
              <option value="Divine V" ${user.rank === 'Divine V' ? 'selected' : ''}>Divine V</option>
              <option value="Immortal" ${user.rank === 'Immortal' ? 'selected' : ''}>Immortal</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Preferred Roles (Select Multiple)</label>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            ${RolesList.map(r => {
              const isChecked = (user.preferredRoles || []).includes(r.id);
              return `
                <label class="checkbox-wrap">
                  <input type="checkbox" class="ep-role-check" value="${r.id}" ${isChecked ? 'checked' : ''} style="display: none;">
                  <div class="checkbox-custom">✓</div>
                  <span>${r.name.split(' ')[0]}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 14px;">
          <span>Save Changes</span> <span>✓</span>
        </button>
      </form>
    `,
    onOpen: (modalEl) => {
      // Avatar click
      modalEl.querySelectorAll('.ep-avatar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          modalEl.querySelectorAll('.ep-avatar-btn').forEach(b => {
            b.style.borderColor = 'var(--border-subtle)';
            b.style.transform = 'scale(1)';
          });
          btn.style.borderColor = 'var(--accent-primary)';
          btn.style.transform = 'scale(1.15)';
          selectedAvatar = btn.dataset.icon;
          Sound.playHover();
        });
      });

      // Submit
      const form = modalEl.querySelector('#edit-profile-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const displayName = modalEl.querySelector('#ep-name').value.trim();
          const dotaId = modalEl.querySelector('#ep-dotaid').value.trim();
          const bio = modalEl.querySelector('#ep-bio').value.trim();
          const region = modalEl.querySelector('#ep-region').value;
          const rank = modalEl.querySelector('#ep-rank').value;

          const checkedRoles = Array.from(modalEl.querySelectorAll('.ep-role-check:checked')).map(c => c.value);

          Store.updateProfile({
            displayName,
            dotaId,
            bio,
            region,
            rank,
            avatar: selectedAvatar,
            preferredRoles: checkedRoles.length ? checkedRoles : ['carry']
          });

          Modal.close();
          Toast.success('Profile Updated', 'Your Dota profile changes have been saved!');
          renderProfileView();
        });
      }
    }
  });
}
