/**
 * Ancient Nexus - Customizable Dota 2-Style HUD View
 * Theme presets, ambient canvas particle styles, widget toggles, and avatar frames.
 */

import { Store } from '../store.js';
import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';
import { Toast } from '../components/toast.js';

export function renderHudSettingsView() {
  const container = document.getElementById('view-container');
  if (!container) return;

  const user = Store.state.currentUser;
  const hud = user.hudSettings || {
    theme: 'classic',
    bgMode: 'embers',
    avatarFrame: 'avatar-frame-immortal',
    audioVolume: 0.5,
    audioMuted: false
  };

  container.innerHTML = `
    <div class="animate-fade-in content-container">
      <div style="margin-bottom: 24px;">
        <h1 style="font-size: 1.6rem; color: #fff; display: flex; align-items: center; gap: 10px;">
          <span>⚙️</span> <span>PERSONAL HUD CUSTOMIZER</span>
        </h1>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
          Tailor your Dota esports command center aesthetics, ambient effects, and widget layout.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
        <!-- Theme Presets & Palette -->
        <div class="hud-panel">
          <div class="hud-panel-header">
            <div class="hud-panel-title">
              <span class="icon-badge">🎨</span>
              <span>Visual Theme Presets</span>
            </div>
          </div>

          <div class="hud-panel-body" style="display: flex; flex-direction: column; gap: 12px;">
            ${renderThemeOption('classic', 'Classic Aegis (Default)', 'Gold & Obsidian armor trims', '#f59e0b', '#0f172a', hud.theme === 'classic')}
            ${renderThemeOption('crimson', 'Competitive Crimson', 'Dire Red & Bloodseeker Ember', '#f43f5e', '#1c1016', hud.theme === 'crimson')}
            ${renderThemeOption('diretide', 'Emerald Diretide', 'Toxic Emerald & Abyssal Green', '#10b981', '#0e1e18', hud.theme === 'diretide')}
            ${renderThemeOption('abyssal', 'Abyssal Void', 'Celestial Mana Blue & Midnight Slate', '#0284c7', '#0d1a2e', hud.theme === 'abyssal')}
            ${renderThemeOption('immortal', 'Immortal Radiance', 'Imperial Purple & Radiant Gold', '#eab308', '#1e132e', hud.theme === 'immortal')}
          </div>
        </div>

        <!-- Ambient Canvas Background Mode -->
        <div class="hud-panel">
          <div class="hud-panel-header">
            <div class="hud-panel-title">
              <span class="icon-badge">✨</span>
              <span>Ambient Background Particles</span>
            </div>
          </div>

          <div class="hud-panel-body" style="display: flex; flex-direction: column; gap: 12px;">
            ${renderBgModeOption('embers', 'Rising Ancient Embers', 'Glowing floating sparks and energy orbs', hud.bgMode === 'embers')}
            ${renderBgModeOption('runes', 'Floating Mystic Runes', 'Ancient high-tier glyphs drifting through space', hud.bgMode === 'runes')}
            ${renderBgModeOption('minimal', 'Minimalist Dark Void', 'Ultra-clean solid backdrop without particle motion', hud.bgMode === 'minimal')}
          </div>
        </div>

        <!-- Avatar Frame Selector -->
        <div class="hud-panel">
          <div class="hud-panel-header">
            <div class="hud-panel-title">
              <span class="icon-badge">🛡️</span>
              <span>Player Avatar Frame</span>
            </div>
          </div>

          <div class="hud-panel-body" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
            <div class="hud-frame-select-card ${hud.avatarFrame === 'avatar-frame-immortal' ? 'selected' : ''}" data-frame="avatar-frame-immortal" style="padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div class="player-avatar-frame avatar-frame-immortal" style="width: 44px; height: 44px; font-size: 1.4rem;">
                <div class="avatar-placeholder">⚔️</div>
              </div>
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">Immortal Gold</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">Gleaming gold border</div>
              </div>
            </div>

            <div class="hud-frame-select-card ${hud.avatarFrame === 'avatar-frame-radiant' ? 'selected' : ''}" data-frame="avatar-frame-radiant" style="padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div class="player-avatar-frame avatar-frame-radiant" style="width: 44px; height: 44px; font-size: 1.4rem;">
                <div class="avatar-placeholder">🌿</div>
              </div>
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">Radiant Emerald</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">Forest spirit aura</div>
              </div>
            </div>

            <div class="hud-frame-select-card ${hud.avatarFrame === 'avatar-frame-dire' ? 'selected' : ''}" data-frame="avatar-frame-dire" style="padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div class="player-avatar-frame avatar-frame-dire" style="width: 44px; height: 44px; font-size: 1.4rem;">
                <div class="avatar-placeholder">🔥</div>
              </div>
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">Dire Crimson</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">Infernal volcanic trim</div>
              </div>
            </div>

            <div class="hud-frame-select-card ${hud.avatarFrame === 'avatar-frame-aegis' ? 'selected' : ''}" data-frame="avatar-frame-aegis" style="padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; gap: 12px; cursor: pointer;">
              <div class="player-avatar-frame avatar-frame-aegis" style="width: 44px; height: 44px; font-size: 1.4rem;">
                <div class="avatar-placeholder">⚡</div>
              </div>
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 0.88rem;">Aegis Mana</div>
                <div style="font-size: 0.7rem; color: var(--text-muted);">Celestial storm glow</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Audio & Sound FX Settings -->
        <div class="hud-panel">
          <div class="hud-panel-header">
            <div class="hud-panel-title">
              <span class="icon-badge">🔊</span>
              <span>Audio Synthesis & Sound Effects</span>
            </div>
          </div>

          <div class="hud-panel-body" style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>
                <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">Sound Effects (UI & Lobby Chimes)</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">Interactive button feedback and queue alerts</div>
              </div>
              <label class="checkbox-wrap">
                <input type="checkbox" id="hud-sound-toggle" ${!hud.audioMuted ? 'checked' : ''} style="display: none;">
                <div class="checkbox-custom">✓</div>
                <span>Enabled</span>
              </label>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px;">
                <span style="color: var(--text-muted);">Master Volume</span>
                <span id="volume-val-display" style="font-family: var(--font-stats); color: var(--accent-gold); font-weight: 700;">50%</span>
              </div>
              <input type="range" id="hud-volume-slider" min="0" max="100" value="${(hud.audioVolume || 0.5) * 100}" style="width: 100%; accent-color: var(--accent-primary);">
            </div>

            <button class="btn btn-secondary btn-sm" id="hud-test-sound-btn" style="margin-top: 8px;">
              <span>Test Audio Synthesizer (Fanfare)</span> <span>🎺</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  initHudSettingsEvents();
}

function renderThemeOption(id, name, desc, primaryColor, bgColor, isSelected) {
  return `
    <div class="theme-preset-card ${isSelected ? 'selected' : ''}" data-theme="${id}" style="padding: 12px 16px; background: rgba(0,0,0,0.35); border: 1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all var(--transition-fast);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: ${primaryColor}; box-shadow: 0 0 10px ${primaryColor};"></div>
        <div>
          <div style="font-weight: 700; color: #fff; font-size: 0.92rem;">${name}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${desc}</div>
        </div>
      </div>

      <span class="badge ${isSelected ? 'badge-gold' : 'badge-mana'}">${isSelected ? 'ACTIVE' : 'APPLY'}</span>
    </div>
  `;
}

function renderBgModeOption(id, name, desc, isSelected) {
  return `
    <div class="bg-mode-card ${isSelected ? 'selected' : ''}" data-mode="${id}" style="padding: 12px 16px; background: rgba(0,0,0,0.35); border: 1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all var(--transition-fast);">
      <div>
        <div style="font-weight: 700; color: #fff; font-size: 0.92rem;">${name}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">${desc}</div>
      </div>
      <span class="badge ${isSelected ? 'badge-gold' : 'badge-mana'}">${isSelected ? 'ACTIVE' : 'SELECT'}</span>
    </div>
  `;
}

function initHudSettingsEvents() {
  // Theme cards
  document.querySelectorAll('.theme-preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const theme = card.dataset.theme;
      document.body.setAttribute('data-theme', theme);
      Store.updateHudSettings({ theme });
      Toast.success('Theme Applied', `Theme switched to ${theme.toUpperCase()}`);
      Sound.playClick();
      renderHudSettingsView();
    });
  });

  // Background particles
  document.querySelectorAll('.bg-mode-card').forEach(card => {
    card.addEventListener('click', () => {
      const bgMode = card.dataset.mode;
      Store.updateHudSettings({ bgMode });
      if (window.nexusBgInstance) {
        window.nexusBgInstance.setMode(bgMode);
      }
      Toast.success('Background Updated', `Particle effect changed to ${bgMode}`);
      Sound.playClick();
      renderHudSettingsView();
    });
  });

  // Avatar frames
  document.querySelectorAll('.hud-frame-select-card').forEach(card => {
    card.addEventListener('click', () => {
      const frame = card.dataset.frame;
      Store.updateProfile({ avatarFrame: frame });
      Store.updateHudSettings({ avatarFrame: frame });
      Toast.success('Frame Equipped', 'New avatar frame equipped!');
      Sound.playClick();
      renderHudSettingsView();
    });
  });

  // Sound toggle
  const soundToggle = document.getElementById('hud-sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('change', (e) => {
      const isMuted = !e.target.checked;
      Sound.setMuted(isMuted);
      Store.updateHudSettings({ audioMuted: isMuted });
    });
  }

  // Volume slider
  const volSlider = document.getElementById('hud-volume-slider');
  const volDisplay = document.getElementById('volume-val-display');
  if (volSlider && volDisplay) {
    volSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      volDisplay.innerText = `${val}%`;
      Sound.setVolume(val / 100);
      Store.updateHudSettings({ audioVolume: val / 100 });
    });
  }

  // Test sound fanfare
  const testBtn = document.getElementById('hud-test-sound-btn');
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      Sound.playLobbyJoin();
    });
  }
}
