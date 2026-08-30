/**
 * CourierHub — Universal Self-Contained Web Application Engine
 * High-performance, crash-proof Dota 2 Community Matchmaking & Gaming Hub.
 */

(function() {
  'use strict';

  /* ==========================================================================
     1. SUPABASE CLOUD BACKEND CONFIGURATION
     ========================================================================== */
  const SUPABASE_URL = 'https://siudmczzugjyeutzcexu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWRtY3p6dWdqeWV1dHpjZXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjA0MTksImV4cCI6MjEwMzU5NjQxOX0.nrA8rdhCAl06SJxpNEizeUkP3mwMwh6P8TCpkhH7vkI';

  let supabaseClient = null;
  function getSupabase() {
    if (!supabaseClient && window.supabase && window.supabase.createClient) {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
      } catch (e) {
        console.warn('Supabase init notice:', e);
      }
    }
    return supabaseClient;
  }

  /* ==========================================================================
     2. SVG ICONS REGISTRY
     ========================================================================== */
  const Icons = {
    home: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    community: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    lobbies: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="3"></rect><path d="M6 12h4m-2-2v4m7-2h.01m3-2h.01m0 4h.01"></path></svg>`,
    party: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="12 6 12 12 16 14"></polygon></svg>`,
    members: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`,
    profile: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    hud: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    send: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    logout: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    lock: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    user: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    gender: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="11" r="5"></circle><path d="M12 16v6"></path><path d="M9 19h6"></path><path d="M16 4l4-4m0 0h-4m4 0v4"></path></svg>`,
    region: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    location: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    rankCrown: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M5 20h14"></path></svg>`
  };

  /* ==========================================================================
     3. TOAST & MODAL MANAGERS
     ========================================================================== */
  class ToastManager {
    show(title, msg, type = 'success') {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }
      const el = document.createElement('div');
      el.className = `toast toast-${type}`;
      el.innerHTML = `
        <div style="font-size: 1.2rem;">${type === 'success' ? '✨' : '⚠️'}</div>
        <div>
          <div style="font-weight: 800; font-size: 0.9rem; margin-bottom: 2px;">${title}</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary);">${msg}</div>
        </div>
      `;
      container.appendChild(el);
      if (window.Sound) {
        if (type === 'success') window.Sound.playNotification();
        else window.Sound.playError();
      }
      setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(30px)';
        el.style.transition = 'all 0.3s ease';
        setTimeout(() => el.remove(), 300);
      }, 3500);
    }
    success(title, msg) { this.show(title, msg, 'success'); }
    error(title, msg) { this.show(title, msg, 'error'); }
  }
  const Toast = new ToastManager();

  class ModalManager {
    constructor() { this.activeModal = null; }
    open(title, contentHtml, onOpen) {
      this.close();
      const overlay = document.createElement('div');
      overlay.style.cssText = `position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px);`;
      overlay.innerHTML = `
        <div class="hud-panel animate-fade-in" style="width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; background: var(--bg-secondary); border-color: var(--accent-primary);">
          <div class="hud-panel-header">
            <div class="hud-panel-title">${title}</div>
            <button class="btn btn-icon" id="modal-close-btn">${Icons.x}</button>
          </div>
          <div class="hud-panel-body">${contentHtml}</div>
        </div>
      `;
      document.body.appendChild(overlay);
      this.activeModal = overlay;
      if (window.Sound) window.Sound.playClick();
      overlay.querySelector('#modal-close-btn').addEventListener('click', () => this.close());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) this.close(); });
      if (typeof onOpen === 'function') onOpen(overlay);
      return overlay;
    }
    close() {
      if (this.activeModal) {
        this.activeModal.remove();
        this.activeModal = null;
      }
    }
  }
  const Modal = new ModalManager();

  /* ==========================================================================
     4. REACTIVE STATE STORE (Local-First + Supabase Live Sync)
     ========================================================================== */
  class StateStore {
    constructor() {
      this.state = this.load();
    }
    getDefaults() {
      return {
        currentUser: null,
        users: [
          {
            id: 'user_wenmar_master',
            username: 'wenmar',
            displayName: 'wenmar',
            email: 'wenmar.wvg@gmail.com',
            dotaId: '782910432',
            rank: 'Divine V',
            gender: 'Male',
            address: 'Philippines, Metro Manila',
            region: 'SEA',
            avatar: '👑',
            avatarFrame: 'avatar-frame-immortal',
            bio: 'CourierHub Founder & Dota 2 Captain',
            winRate: 64.2,
            gamesPlayed: 1540,
            onlineStatus: 'online'
          }
        ],
        lobbies: [],
        communityMessages: [],
        partyFinder: [],
        statsOverview: { totalMembers: 1, onlineNow: 1, activeLobbies: 0, partyQueue: 0 }
      };
    }
    load() {
      try {
        const saved = localStorage.getItem('courierhub_state_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...this.getDefaults(), ...parsed };
        }
      } catch (e) {}
      return this.getDefaults();
    }
    save() {
      try {
        localStorage.setItem('courierhub_state_v2', JSON.stringify(this.state));
      } catch (e) {}
    }
    loginUser(user) {
      this.state.currentUser = { ...this.state.currentUser, ...user, onlineStatus: 'online' };
      const idx = this.state.users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        this.state.users[idx] = { ...this.state.users[idx], ...user, onlineStatus: 'online' };
      } else {
        this.state.users.unshift({ ...user, onlineStatus: 'online' });
      }
      this.state.statsOverview.totalMembers = this.state.users.length;
      this.state.statsOverview.onlineNow = this.state.users.filter(u => u.onlineStatus === 'online').length;
      this.save();
    }
    logout() {
      this.state.currentUser = null;
      this.save();
    }
    async syncFromSupabase() {
      const sb = getSupabase();
      if (!sb) return;
      try {
        // 1. Fetch Profiles
        const { data: profiles } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
        if (profiles && profiles.length > 0) {
          this.state.users = profiles.map(p => ({
            id: p.id,
            username: p.username || (p.email ? p.email.split('@')[0] : 'Hero'),
            displayName: p.display_name || p.username || (p.email ? p.email.split('@')[0] : 'Hero'),
            email: p.email,
            dotaId: p.dota_id || '109283742',
            rank: p.rank || 'Legend I',
            region: p.region || 'SEA',
            avatar: p.avatar || '🔥',
            avatarFrame: p.avatar_frame || 'avatar-frame-immortal',
            bio: p.bio || 'Ready to party on CourierHub!',
            winRate: p.win_rate || 52.5,
            gamesPlayed: p.games_played || 120,
            onlineStatus: p.is_online ? 'online' : 'online'
          }));
          this.state.statsOverview.totalMembers = this.state.users.length;
          this.state.statsOverview.onlineNow = this.state.users.length;
        }

        // 2. Fetch Lobbies
        const { data: lobbies } = await sb.from('lobbies').select('*, lobby_members(*)').order('created_at', { ascending: false });
        if (lobbies && lobbies.length > 0) {
          this.state.lobbies = lobbies.map(l => ({
            id: l.id,
            name: l.title || l.name,
            hostId: l.host_id,
            hostName: l.host_name,
            hostAvatar: l.host_avatar || '🔥',
            region: l.region || 'SEA',
            matchType: l.game_mode || 'Ranked All Pick',
            maxPlayers: 5,
            description: l.description || 'Join my party stack!',
            requiredRank: l.rank_tier || 'Any',
            status: l.status === 'open' ? 'Waiting' : (l.status || 'Waiting'),
            createdAt: l.created_at,
            players: (l.lobby_members && l.lobby_members.length > 0) ? l.lobby_members.map(m => ({
              userId: m.user_id,
              name: m.player_name,
              avatar: m.player_avatar || '🔥',
              rank: m.player_rank || 'Legend',
              role: m.player_role || 'Core',
              ready: m.is_ready !== false,
              isHost: m.user_id === l.host_id
            })) : [
              { userId: l.host_id, name: l.host_name, avatar: l.host_avatar || '🔥', rank: l.rank_tier || 'Legend', role: 'Carry', ready: true, isHost: true }
            ]
          }));
          this.state.statsOverview.activeLobbies = this.state.lobbies.length;
        }

        // 3. Fetch Community Messages
        const { data: msgs } = await sb.from('community_messages').select('*').order('created_at', { ascending: true }).limit(50);
        if (msgs && msgs.length > 0) {
          this.state.communityMessages = msgs.map(m => ({
            id: m.id,
            userId: m.user_id,
            userName: m.author_name,
            userAvatar: m.author_avatar || '⚔️',
            userRank: m.author_rank || 'Ancient V',
            content: m.text,
            createdAt: m.created_at,
            reactions: m.reactions || {},
            lobbyEmbed: m.lobby_embed
          }));
        }

        // 4. Fetch Party Finder Queue
        const { data: parties } = await sb.from('party_finder').select('*').order('created_at', { ascending: false });
        if (parties && parties.length > 0) {
          this.state.partyFinder = parties.map(p => ({
            id: p.id,
            userId: p.host_id,
            name: p.host_name,
            avatar: p.host_avatar || '🔥',
            rank: p.host_rank || 'Legend',
            role: (p.roles_needed && p.roles_needed[0]) || 'Core',
            region: p.region || 'SEA'
          }));
          this.state.statsOverview.partyQueue = this.state.partyFinder.length;
        }

        this.save();
      } catch (err) {
        console.warn('Supabase sync notice:', err);
      }
    }
  }
  const Store = new StateStore();

  /* ==========================================================================
     5. CANVAS ANIMATED BACKGROUND (Embers & Runes)
     ========================================================================== */
  class CanvasBackground {
    constructor() {
      this.canvas = document.getElementById('canvas-bg');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mode = 'embers';
      this.runes = ['ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᛃ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ'];
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.init();
      this.loop = this.loop.bind(this);
      this.loop();
    }
    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    init() {
      this.particles = [];
      for (let i = 0; i < 40; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 0.7 + 0.3,
          speedX: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.5 + 0.2,
          rune: this.runes[Math.floor(Math.random() * this.runes.length)]
        });
      }
    }
    loop() {
      requestAnimationFrame(this.loop);
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -20) { p.y = this.height + 20; p.x = Math.random() * this.width; }
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.3})`;
        this.ctx.fill();
      }
    }
  }

  /* ==========================================================================
     6. ROUTER (Re-Entrancy Guarded & Crash Proof)
     ========================================================================== */
  class Router {
    constructor() {
      this.routes = {};
      this.currentRoute = '';
      this.isHandling = false;
      window.addEventListener('hashchange', () => this.handle());
    }
    register(path, fn) { this.routes[path] = fn; }
    navigate(path) {
      const target = path.startsWith('#') ? path : '#' + path;
      if (window.location.hash !== target) {
        window.location.hash = target;
      } else {
        this.handle();
      }
    }
    handle() {
      if (this.isHandling) return;
      this.isHandling = true;

      try {
        let hash = window.location.hash.slice(1) || '';
        if (hash.startsWith('/')) hash = hash.slice(1);
        const parts = hash.split('/');
        let mainPath = parts[0] || '';
        const param = parts[1] || null;

        const isAuth = !!Store.state.currentUser;

        if (!isAuth) {
          if (mainPath !== 'login' && mainPath !== 'signup') {
            mainPath = 'login';
            if (window.location.hash !== '#login' && window.location.hash !== '#signup') {
              window.location.hash = '#login';
            }
          }
        } else {
          if (!mainPath || mainPath === 'login' || mainPath === 'signup') {
            mainPath = 'home';
            if (window.location.hash !== '#home') {
              window.location.hash = '#home';
            }
          }
        }

        this.currentRoute = mainPath;

        if (this.routes[mainPath]) {
          this.routes[mainPath](param);
        } else if (this.routes['home']) {
          this.routes['home']();
        }

        // Update active nav links
        document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
          const href = el.getAttribute('href') || '';
          const linkRoute = href.replace('#', '').split('/')[0];
          if (linkRoute === mainPath || (mainPath === 'lobby' && linkRoute === 'lobbies')) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });
      } catch (err) {
        console.error('Router navigation error:', err);
      } finally {
        this.isHandling = false;
      }
    }
  }
  const AppRouter = new Router();

  /* ==========================================================================
     7. APP SHELL & VIEW RENDERERS
     ========================================================================== */
  function renderLayoutShell() {
    const root = document.getElementById('app-root');
    const user = Store.state.currentUser;
    const canvas = document.getElementById('canvas-bg');
    if (canvas) canvas.style.display = user ? 'block' : 'none';

    if (!user) {
      root.innerHTML = `<main id="view-container" style="min-height: 100vh;"></main>`;
      return;
    }

    const lobbiesCount = Store.state.lobbies.length;

    root.innerHTML = `
      <div class="app-layout" style="display: flex; flex-direction: column;">
        <!-- Clean Modern Topbar Navigation -->
        <header class="topbar" style="position: sticky; top: 0; z-index: 50; width: 100%; border-bottom: 1px solid var(--border-subtle); background: var(--bg-glass); backdrop-filter: blur(16px); padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: var(--topbar-height);">
          <div style="display: flex; align-items: center; gap: 14px;">
            <a href="#home" class="brand-logo" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
              <img src="assets/logo.png" alt="CourierHub" style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.4));">
              <span style="font-family: var(--font-header); font-size: 1.2rem; font-weight: 800; color: var(--accent-gold); letter-spacing: 0.04em;">CourierHub</span>
            </a>
          </div>

          <!-- Top-Right User Menu Trigger (Username on the left, mini circle avatar on the right) -->
          <div class="topbar-user-menu-wrapper">
            <button id="user-menu-trigger" class="topbar-user-trigger" type="button" aria-haspopup="true" aria-expanded="false" title="Account Menu">
              <!-- Username on the left side of the circle image -->
              <span class="topbar-user-name">${user.displayName || user.username}</span>

              <!-- Mini Circle Profile Image -->
              <div class="topbar-user-avatar ${user.avatarFrame || 'avatar-frame-immortal'}">
                <span>${user.avatar || '👑'}</span>
                <div class="status-dot status-online" style="width: 10px; height: 10px; border-width: 2px; bottom: -1px; right: -1px;"></div>
              </div>

              <!-- Dropdown Chevron Icon -->
              <span class="topbar-user-chevron" id="user-menu-chevron">▼</span>
            </button>

            <!-- Dropdown Card (Clean Rounded Card with No Sharp Dark Corner Accents) -->
            <div id="user-dropdown-card" class="user-dropdown-card">
              <!-- User Preview Header -->
              <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
                <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 2px solid var(--accent-gold); flex-shrink: 0; background: var(--bg-secondary);">
                  <span>${user.avatar || '👑'}</span>
                </div>
                <div style="min-width: 0; flex: 1;">
                  <div style="font-size: 0.95rem; font-weight: 800; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${user.displayName || user.username}
                  </div>
                  <div style="font-size: 0.78rem; color: var(--accent-gold); font-weight: 700; margin-top: 1px;">
                    👑 ${user.rank || 'Divine V'}
                  </div>
                  <div style="font-size: 0.74rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
                    ${user.email || 'wenmar.wvg@gmail.com'}
                  </div>
                </div>
              </div>

              <!-- Action Menu Items -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button type="button" class="dropdown-item-btn" id="dropdown-edit-profile-btn">
                  <span style="font-size: 1.05rem;">✏️</span>
                  <span>Edit Profile</span>
                </button>

                <button type="button" class="dropdown-item-btn dropdown-item-danger" id="dropdown-logout-btn">
                  <span style="font-size: 1.05rem;">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Viewport (Full Width, No Left Sidebar) -->
        <div class="app-main" style="padding-left: 0; width: 100%; flex: 1;">
          <main id="view-container"></main>
        </div>
      </div>
    `;

    // Dropdown toggle logic
    const trigger = document.getElementById('user-menu-trigger');
    const dropdown = document.getElementById('user-dropdown-card');

    if (trigger && dropdown) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('show');
        if (isOpen) {
          dropdown.classList.remove('show');
          trigger.classList.remove('active');
        } else {
          dropdown.classList.add('show');
          trigger.classList.add('active');
          if (window.Sound) window.Sound.playClick();
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
          dropdown.classList.remove('show');
          trigger.classList.remove('active');
        }
      });
    }

    // Dropdown Actions
    document.getElementById('dropdown-edit-profile-btn')?.addEventListener('click', () => {
      dropdown?.classList.remove('show');
      trigger?.classList.remove('active');
      openEditProfileModal();
    });

    document.getElementById('dropdown-logout-btn')?.addEventListener('click', async () => {
      dropdown?.classList.remove('show');
      trigger?.classList.remove('active');
      if (window.Sound) window.Sound.playClick();
      const sb = getSupabase();
      if (sb) await sb.auth.signOut().catch(() => {});
      Store.logout();
      Toast.success('Signed Out', 'See you next match, Hero!');
      AppRouter.navigate('login');
    });
  }

  /* --- MODAL: EDIT PROFILE --- */
  function openEditProfileModal() {
    const user = Store.state.currentUser;
    if (!user) return;

    document.getElementById('edit-profile-modal')?.remove();

    const modalHtml = `
      <div id="edit-profile-modal" class="modal-overlay" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;">
        <div class="hud-panel" style="width: 100%; max-width: 500px; padding: 26px; border-radius: var(--radius-lg); background: #ffffff; border: 1px solid rgba(245, 158, 11, 0.35); box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.2); position: relative; animation: fadeInDown 0.25s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div style="font-family: var(--font-header); font-size: 1.3rem; font-weight: 800; color: var(--accent-gold);">
              ✏️ Edit Profile
            </div>
            <button id="close-edit-profile-btn" style="background: transparent; border: none; font-size: 1.4rem; color: var(--text-muted); cursor: pointer;">✕</button>
          </div>

          <form id="edit-profile-form" style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">Display Name</label>
              <input type="text" id="edit-profile-name" class="input-control" value="${user.displayName || user.username}" required style="width: 100%;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">Gender</label>
                <select id="edit-profile-gender" class="input-control" style="width: 100%;">
                  <option value="Male" ${(user.gender || 'Male') === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${(user.gender || '') === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other" ${(user.gender || '') === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">Rank Tier</label>
                <select id="edit-profile-rank" class="input-control" style="width: 100%;">
                  ${['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine V', 'Immortal'].map(r => `
                    <option value="${r}" ${(user.rank || 'Divine V') === r ? 'selected' : ''}>${r}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">Address</label>
              <input type="text" id="edit-profile-address" class="input-control" value="${user.address || 'Philippines, Metro Manila'}" style="width: 100%;">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">Region</label>
                <select id="edit-profile-region" class="input-control" style="width: 100%;">
                  ${['SEA', 'US East', 'US West', 'Europe West', 'Europe East', 'China', 'South America'].map(reg => `
                    <option value="${reg}" ${(user.region || 'SEA') === reg ? 'selected' : ''}>${reg}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">Dota Friend ID</label>
                <input type="text" id="edit-profile-dotaid" class="input-control" value="${user.dotaId || '782910432'}" style="width: 100%;">
              </div>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 5px; font-weight: 700; text-transform: uppercase;">Bio / Biography</label>
              <textarea id="edit-profile-bio" class="input-control" rows="2" style="width: 100%; resize: vertical;">${user.bio || 'CourierHub Founder & Dota 2 Captain'}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;">
              <button type="button" class="btn btn-secondary" id="cancel-edit-profile-btn">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('edit-profile-modal');
    const close = () => modal?.remove();

    document.getElementById('close-edit-profile-btn')?.addEventListener('click', close);
    document.getElementById('cancel-edit-profile-btn')?.addEventListener('click', close);
    modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });

    document.getElementById('edit-profile-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('edit-profile-name').value.trim();
      const newGender = document.getElementById('edit-profile-gender').value;
      const newAddress = document.getElementById('edit-profile-address').value.trim();
      const newBio = document.getElementById('edit-profile-bio').value.trim();
      const newRank = document.getElementById('edit-profile-rank').value;
      const newDotaId = document.getElementById('edit-profile-dotaid').value.trim();
      const newRegion = document.getElementById('edit-profile-region').value;

      user.displayName = newName || user.username;
      user.gender = newGender;
      user.address = newAddress;
      user.bio = newBio;
      user.rank = newRank;
      user.dotaId = newDotaId;
      user.region = newRegion;

      Store.save();
      const sb = getSupabase();
      if (sb && user.id) {
        await sb.from('profiles').update({
          display_name: user.displayName,
          rank: user.rank,
          region: user.region,
          dota_id: user.dotaId,
          bio: user.bio
        }).eq('id', user.id).catch(() => {});
      }

      if (window.Sound) window.Sound.playClick();
      Toast.success('Profile Updated!', 'Your profile details have been saved.');
      close();
      renderHome();
    });
  }

  /* --- VIEW: AUTH (LOGIN & REGISTRATION) --- */
  function renderAuth(isSignUp = false) {
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    container.innerHTML = `
      <div class="animate-fade-in" style="min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative;">
        <div class="auth-flip-container">
          <div id="auth-card-inner" class="auth-flip-card-inner ${isSignUp ? 'is-flipped' : ''}">
            
            <!-- FRONT: SIGN IN -->
            <div class="auth-card-face auth-card-front hud-panel hud-highlight">
              <div class="hud-corner-accent hud-corner-tl"></div>
              <div class="hud-corner-accent hud-corner-tr"></div>
              <div class="hud-corner-accent hud-corner-bl"></div>
              <div class="hud-corner-accent hud-corner-br"></div>

              <div class="hud-panel-header" style="flex-direction: column; text-align: center; padding: 28px 24px 12px;">
                <img src="assets/logo.png" alt="CourierHub" style="width: 100px; height: 100px; object-fit: contain; filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.4));">
                <div style="font-family: var(--font-header); font-size: 1.1rem; color: var(--accent-gold); font-weight: 800; letter-spacing: 0.05em; margin-top: 6px;">
                  LET'S PARTY GUYS!!
                </div>
              </div>

              <div class="hud-panel-body" style="padding: 12px 32px 28px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <form id="login-form">
                  <div class="floating-field">
                    <input type="text" id="login-input-user" class="floating-input" placeholder=" " value="wenmar" required>
                    <label for="login-input-user" class="floating-label">${Icons.user} Username</label>
                  </div>
                  <div class="floating-field">
                    <input type="password" id="login-input-pw" class="floating-input" placeholder=" " value="Eurisha143" required style="padding-right: 46px;">
                    <label for="login-input-pw" class="floating-label">${Icons.lock} Password</label>
                    <button type="button" class="pw-toggle-icon-btn" data-target="login-input-pw" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); padding: 4px; z-index: 3;" title="Toggle password visibility">
                      ${Icons.eye}
                    </button>
                  </div>
                  <button type="submit" id="login-submit-btn" class="btn btn-primary btn-block btn-lg" style="margin-top: 8px;">
                    <span>Sign In to CourierHub</span>
                  </button>
                </form>

                <div style="text-align: center; margin-top: 16px; font-size: 0.88rem; color: var(--text-secondary);">
                  <span>No account yet?</span>
                  <button type="button" id="flip-to-signup" style="background: none; border: none; color: var(--accent-primary); font-weight: 700; text-decoration: underline; margin-left: 6px; cursor: pointer;">
                    Create one here
                  </button>
                </div>
              </div>
            </div>

              <!-- BACK: CREATE ACCOUNT -->
              <div class="auth-card-face auth-card-back hud-panel hud-highlight">
                <div class="hud-corner-accent hud-corner-tl"></div>
                <div class="hud-corner-accent hud-corner-tr"></div>
                <div class="hud-corner-accent hud-corner-bl"></div>
                <div class="hud-corner-accent hud-corner-br"></div>

                <div class="hud-panel-header" style="flex-direction: column; text-align: center; padding: 24px 24px 8px;">
                  <img src="assets/logo.png" alt="CourierHub" style="width: 90px; height: 90px; object-fit: contain; filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.4));">
                  <div style="font-family: var(--font-header); font-size: 1.05rem; color: var(--accent-gold); font-weight: 800; letter-spacing: 0.05em; margin-top: 4px;">
                    JOIN COURIERHUB
                  </div>
                </div>

                <!-- 1. SIGNUP INPUT FORM PANEL -->
                <div id="signup-form-panel" class="hud-panel-body" style="padding: 10px 32px 24px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                  <form id="signup-form">
                    <div class="floating-field" style="margin-bottom: 16px;">
                      <input type="text" id="signup-input-user" class="floating-input" placeholder=" " required>
                      <label for="signup-input-user" class="floating-label">${Icons.user} Desired Username</label>
                    </div>
                    <div class="floating-field" style="margin-bottom: 16px;">
                      <input type="email" id="signup-input-email" class="floating-input" placeholder=" " required>
                      <label for="signup-input-email" class="floating-label">${Icons.mail} Email Address</label>
                    </div>
                    <div class="floating-field" style="margin-bottom: 16px;">
                      <input type="password" id="signup-input-pw" class="floating-input" minlength="6" placeholder=" " required style="padding-right: 46px;">
                      <label for="signup-input-pw" class="floating-label">${Icons.lock} Password (min 6 chars)</label>
                      <button type="button" class="pw-toggle-icon-btn" data-target="signup-input-pw" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); padding: 4px; z-index: 3;" title="Toggle password visibility">
                        ${Icons.eye}
                      </button>
                    </div>
                    <button type="submit" id="signup-submit-btn" class="btn btn-primary btn-block btn-lg">
                      <span>Create Account</span>
                    </button>
                  </form>

                  <div style="text-align: center; margin-top: 14px; font-size: 0.86rem; color: var(--text-secondary);">
                    <span>Already registered?</span>
                    <button type="button" id="flip-to-login" style="background: none; border: none; color: var(--accent-primary); font-weight: 700; text-decoration: underline; margin-left: 6px; cursor: pointer;">
                      Sign in here
                    </button>
                  </div>
                </div>

                <!-- 2. CHECK YOUR EMAIL CONFIRMATION PANEL -->
                <div id="signup-check-email-panel" class="hud-panel-body" style="padding: 16px 28px 24px; flex: 1; display: none; flex-direction: column; justify-content: space-between; text-align: center;">
                  <div style="margin-top: 8px;">
                    <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(245, 158, 11, 0.12); border: 2px solid var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 14px;">
                      ✉️
                    </div>
                    <h2 style="font-family: var(--font-header); font-size: 1.3rem; color: var(--text-primary); margin-bottom: 6px;">Check Your Email!</h2>
                    <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.45; margin-bottom: 12px;">
                      We've sent an activation link to:<br>
                      <strong id="signup-sent-email-txt" style="color: var(--accent-gold); font-size: 0.92rem; word-break: break-all;"></strong>
                    </p>
                    <div style="background: var(--bg-tertiary); border: 1px dashed var(--border-medium); border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                      Please click the verification link in your email to activate your account, then sign in with your username!
                    </div>
                  </div>

                  <button type="button" id="signup-goto-signin-btn" class="btn btn-primary btn-block btn-lg" style="margin-top: 14px;">
                    Proceed to Sign In →
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      `;

      // Password Toggle Handler
      const handlePwToggle = (targetId) => {
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPw = input.type === 'password';
        input.type = isPw ? 'text' : 'password';
        const icon = isPw ? Icons.eyeOff : Icons.eye;
        const label = isPw ? 'Hide' : 'Show';

        document.querySelectorAll(`.pw-toggle-btn[data-target="${targetId}"]`).forEach(btn => {
          const iconSpan = btn.querySelector('.pw-icon-span');
          const textSpan = btn.querySelector('.pw-text-span');
          if (iconSpan) iconSpan.innerHTML = icon;
          if (textSpan) textSpan.innerText = label;
        });
        document.querySelectorAll(`.pw-toggle-icon-btn[data-target="${targetId}"]`).forEach(btn => {
          btn.innerHTML = icon;
        });
        if (window.Sound) window.Sound.playHover();
      };

      document.querySelectorAll('.pw-toggle-btn, .pw-toggle-icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.target;
          if (target) handlePwToggle(target);
        });
      });

      const card = document.getElementById('auth-card-inner');
      document.getElementById('flip-to-signup')?.addEventListener('click', () => {
        if (window.Sound) window.Sound.playHover();
        card?.classList.add('is-flipped');
      });
      document.getElementById('flip-to-login')?.addEventListener('click', () => {
        if (window.Sound) window.Sound.playHover();
        card?.classList.remove('is-flipped');
      });

      // Go to sign in from email confirmation panel
      document.getElementById('signup-goto-signin-btn')?.addEventListener('click', () => {
        if (window.Sound) window.Sound.playHover();
        card?.classList.remove('is-flipped');
        const regUser = document.getElementById('signup-input-user')?.value.trim();
        const loginInp = document.getElementById('login-input-user');
        if (loginInp && regUser) loginInp.value = regUser;
        document.getElementById('login-input-pw')?.focus();
      });

      // Login Form Submit Handler
      document.getElementById('login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const uVal = document.getElementById('login-input-user').value.trim();
        const pVal = document.getElementById('login-input-pw').value;
        const btn = document.getElementById('login-submit-btn');

        if (btn) {
          btn.disabled = true;
          btn.innerText = 'Authenticating...';
        }

        const isWenmar = (
          (uVal.toLowerCase() === 'wenmar' || uVal.toLowerCase() === 'wenmar.wvg@gmail.com') &&
          pVal === 'Eurisha143'
        );
        const isWenmarInvalidPw = (
          (uVal.toLowerCase() === 'wenmar' || uVal.toLowerCase() === 'wenmar.wvg@gmail.com') &&
          pVal !== 'Eurisha143'
        );

        const sb = getSupabase();
        let authUser = null;

        if (sb) {
          try {
            let email = uVal;
            if (!uVal.includes('@')) {
              if (uVal.toLowerCase() === 'wenmar') {
                email = 'wenmar.wvg@gmail.com';
              } else {
                const { data: prof } = await sb.from('profiles').select('email').eq('username', uVal).maybeSingle();
                if (prof?.email) email = prof.email;
              }
            }
            const { data, error } = await sb.auth.signInWithPassword({ email, password: pVal });
            if (error) {
              if (!isWenmar) {
                Toast.error('Login Failed', isWenmarInvalidPw ? 'Invalid password for user wenmar.' : (error.message || 'Invalid username or password.'));
                if (btn) {
                  btn.disabled = false;
                  btn.innerText = 'Sign In to CourierHub';
                }
                return;
              }
            } else if (data?.user) {
              const { data: profile } = await sb.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
              authUser = {
                id: data.user.id,
                username: profile?.username || (isWenmar ? 'wenmar' : uVal),
                displayName: profile?.display_name || profile?.username || (isWenmar ? 'wenmar' : uVal),
                email: data.user.email || (isWenmar ? 'wenmar.wvg@gmail.com' : email),
                dotaId: profile?.dota_id || (isWenmar ? '782910432' : '109283742'),
                rank: profile?.rank || (isWenmar ? 'Divine V' : 'Legend I'),
                region: profile?.region || 'SEA',
                avatar: profile?.avatar || (isWenmar ? '👑' : '🔥'),
                avatarFrame: profile?.avatar_frame || 'avatar-frame-immortal',
                bio: profile?.bio || (isWenmar ? 'CourierHub Founder & Dota 2 Captain' : 'Ready to party on CourierHub!'),
                winRate: profile?.win_rate || (isWenmar ? 64.2 : 52.5),
                gamesPlayed: profile?.games_played || (isWenmar ? 1540 : 120)
              };
            }
          } catch (err) {
            console.warn('Supabase auth notice:', err);
          }
        }

        // Dedicated built-in wenmar account or offline/demo fallback
        if (!authUser) {
          if (isWenmarInvalidPw) {
            Toast.error('Login Failed', 'Invalid password for user wenmar.');
            if (btn) {
              btn.disabled = false;
              btn.innerText = 'Sign In to CourierHub';
            }
            return;
          }

          if (isWenmar) {
            authUser = {
              id: 'user_wenmar_master',
              username: 'wenmar',
              displayName: 'wenmar',
              email: 'wenmar.wvg@gmail.com',
              dotaId: '782910432',
              rank: 'Divine V',
              gender: 'Male',
              address: 'Philippines, Metro Manila',
              region: 'SEA',
              avatar: '👑',
              avatarFrame: 'avatar-frame-immortal',
              bio: 'CourierHub Founder & Dota 2 Captain',
              winRate: 64.2,
              gamesPlayed: 1540
            };
          } else {
            authUser = {
              id: 'user_' + Date.now(),
              username: uVal.includes('@') ? uVal.split('@')[0] : uVal,
              displayName: uVal.includes('@') ? uVal.split('@')[0] : uVal,
              email: uVal.includes('@') ? uVal : uVal + '@courierhub.gg',
              dotaId: '109283742',
              rank: 'Legend I',
              gender: 'Male',
              address: 'SEA Server',
              region: 'SEA',
              avatar: '🔥',
              avatarFrame: 'avatar-frame-immortal',
              bio: 'Ready to party on CourierHub!'
            };
          }
        }

        Store.loginUser(authUser);
        Toast.success('Welcome Back!', `Logged in as ${authUser.displayName}`);
        AppRouter.navigate('home');
      });

      // Registration Form Submit Handler
      document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const uVal = document.getElementById('signup-input-user').value.trim();
        const email = document.getElementById('signup-input-email').value.trim().toLowerCase();
        const pVal = document.getElementById('signup-input-pw').value;
        const btn = document.getElementById('signup-submit-btn');

        if (btn) {
          btn.disabled = true;
          btn.innerText = 'Creating Account...';
        }

        const sb = getSupabase();
        if (sb) {
          try {
            const redirectUrl = (window.location.origin && !window.location.origin.includes('file://'))
              ? window.location.origin
              : 'https://couriershub.vercel.app';

            const { data, error } = await sb.auth.signUp({
              email, password: pVal,
              options: {
                emailRedirectTo: redirectUrl,
                data: { username: uVal, display_name: uVal, rank: 'Legend I', region: 'SEA' }
              }
            });
            if (error) {
              Toast.error('Registration Notice', error.message || 'Could not complete registration.');
              if (btn) {
                btn.disabled = false;
                btn.innerText = 'Create Account';
              }
              return;
            }
          } catch (err) {
            console.warn('Supabase signup notice:', err);
          }
        }

        // Show "Check Your Email" panel (Do NOT auto-enter dashboard)
        document.getElementById('signup-form-panel').style.display = 'none';
        const checkEmailPanel = document.getElementById('signup-check-email-panel');
        if (checkEmailPanel) {
          checkEmailPanel.style.display = 'flex';
          document.getElementById('signup-sent-email-txt').innerText = email;
        }

        Toast.success('Check Your Email!', `Activation link sent to ${email}`);
      });
    }

  /* --- VIEW: HOME HUD (FULL-WIDTH LINKEDIN BANNER & PROFILE) --- */
  function renderHome() {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    container.innerHTML = `
      <div class="animate-fade-in profile-fullwidth-wrapper">
        <!-- 1. FULL-WIDTH TOP COVER BANNER (100% Edge-to-Edge) -->
        <div class="profile-fullwidth-banner">
          <div class="profile-banner-ambient"></div>
          <div class="profile-banner-grid"></div>
          <div class="hud-corner-accent hud-corner-tl"></div>
          <div class="hud-corner-accent hud-corner-tr"></div>
        </div>

        <!-- 2. CONSTRAINED PROFILE CONTAINER -->
        <div class="profile-content-container">
          <!-- Left Column (Rectangle Avatar + Horizontal Info Rows Stacked Below) -->
          <div class="profile-left-column" style="width: 260px; max-width: 100%;">
            <!-- Rectangle Profile Image at Left Side -->
            <div class="profile-avatar-anchor">
              <div class="profile-large-avatar ${user.avatarFrame || 'avatar-frame-immortal'}">
                <span>${user.avatar || '👑'}</span>
              </div>
              <div class="profile-status-badge" title="Online & Ready"></div>
            </div>

            <!-- Below the rectangle profile image: Horizontal Info Items with Premium Icons -->
            <div class="profile-vertical-details" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
              
              <!-- Gender : male -->
              <div class="profile-info-row" style="display: flex; align-items: center; gap: 10px; padding: 4px 0;">
                <div class="profile-icon-badge" style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.1); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(245, 158, 11, 0.25);">
                  ${Icons.gender}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.93rem;">
                  <span style="font-weight: 700; color: var(--text-secondary);">Gender :</span>
                  <span style="font-weight: 600; color: var(--text-primary); text-transform: capitalize;">${user.gender || 'male'}</span>
                </div>
              </div>

              <!-- Region : Sea -->
              <div class="profile-info-row" style="display: flex; align-items: center; gap: 10px; padding: 4px 0;">
                <div class="profile-icon-badge" style="width: 32px; height: 32px; border-radius: 8px; background: rgba(2, 132, 199, 0.1); color: var(--mana-blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(2, 132, 199, 0.25);">
                  ${Icons.region}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.93rem;">
                  <span style="font-weight: 700; color: var(--text-secondary);">Region :</span>
                  <span style="font-weight: 600; color: var(--text-primary);">${user.region || 'Sea'}</span>
                </div>
              </div>

              <!-- Address : phillpines metro manila -->
              <div class="profile-info-row" style="display: flex; align-items: center; gap: 10px; padding: 4px 0;">
                <div class="profile-icon-badge" style="width: 32px; height: 32px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); color: #ef4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(239, 68, 68, 0.25);">
                  ${Icons.location}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.93rem; min-width: 0;">
                  <span style="font-weight: 700; color: var(--text-secondary); flex-shrink: 0;">Address :</span>
                  <span style="font-weight: 600; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${user.address || 'phillpines metro manila'}">${user.address || 'phillpines metro manila'}</span>
                </div>
              </div>

              <!-- Rank : divine -->
              <div class="profile-info-row" style="display: flex; align-items: center; gap: 10px; padding: 4px 0;">
                <div class="profile-icon-badge" style="width: 32px; height: 32px; border-radius: 8px; background: rgba(217, 119, 6, 0.12); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(217, 119, 6, 0.3);">
                  ${Icons.rankCrown}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.93rem;">
                  <span style="font-weight: 700; color: var(--text-secondary);">Rank :</span>
                  <span style="font-weight: 700; color: var(--accent-gold);">${user.rank || 'Divine V'}</span>
                </div>
              </div>

              <!-- then a view bio button: -->
              <button type="button" id="profile-view-bio-btn" class="btn btn-secondary btn-block" style="
                margin-top: 8px;
                padding: 10px 16px;
                font-size: 0.9rem;
                font-weight: 700;
                border-color: rgba(217, 119, 6, 0.35);
                background: #ffffff;
                color: var(--text-primary);
                box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
                cursor: pointer;
              ">
                📄 View Bio
              </button>

              <!-- Bio Expandable Box (Toggled by View Bio button) -->
              <div id="profile-bio-box" style="display: none; background: #ffffff; border: 1px solid rgba(226, 232, 240, 0.95); border-radius: var(--radius-md); padding: 14px; margin-top: 2px; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05); animation: fadeInDown 0.2s ease;">
                <div style="font-size: 0.78rem; font-weight: 800; color: var(--accent-gold); text-transform: uppercase; margin-bottom: 4px;">Player Biography</div>
                <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">
                  ${user.bio || 'CourierHub Founder & Dota 2 Captain • Active Competitive Player'}
                </p>
              </div>

              <!-- then a divider line that has the same weight above. -->
              <div class="profile-section-divider" style="
                width: 100%;
                height: 1px;
                background: rgba(217, 119, 6, 0.25);
                margin: 16px 0 8px;
                border: none;
              "></div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Interactive View Bio button logic
    const bioBtn = document.getElementById('profile-view-bio-btn');
    const bioBox = document.getElementById('profile-bio-box');
    if (bioBtn && bioBox) {
      bioBtn.addEventListener('click', () => {
        const isHidden = bioBox.style.display === 'none';
        bioBox.style.display = isHidden ? 'block' : 'none';
        bioBtn.innerHTML = isHidden ? '✕ Hide Bio' : '📄 View Bio';
        if (window.Sound) window.Sound.playClick();
      });
    }
  }

  /* --- VIEW: LOBBIES --- */
  function renderLobbies() {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    const lobbies = Store.state.lobbies;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <h1 style="font-family: var(--font-header); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 4px;">
              ⚔️ 5v5 Custom Match Lobbies
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Join open matchmaking stacks or organize scrim matches.</p>
          </div>
          <button class="btn btn-primary" id="lobbies-create-btn">${Icons.plus} <span>Create New Lobby</span></button>
        </div>

        <div class="lobby-grid">
          ${lobbies.length === 0 ? `
            <div class="hud-panel" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
              <div style="font-size: 3rem; margin-bottom: 12px;">🛡️</div>
              <h3 style="color: var(--text-primary); margin-bottom: 8px;">No Open Lobbies</h3>
              <p style="color: var(--text-secondary); margin-bottom: 20px;">Create your own lobby and invite teammates to party up!</p>
              <button class="btn btn-primary" id="lobbies-create-btn-empty">${Icons.plus} <span>Create Lobby</span></button>
            </div>
          ` : lobbies.map(l => `
            <div class="lobby-card">
              <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span class="badge badge-gold">${l.region || 'SEA'}</span>
                  <span class="badge badge-radiant">${l.matchType || 'Ranked 5v5'}</span>
                </div>
                <h3 style="color: var(--text-primary); font-size: 1.15rem; margin-bottom: 6px;">${l.name}</h3>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 14px;">${l.description || 'Party up for Dota 2!'}</p>
                <div class="lobby-slots">
                  ${[0,1,2,3,4].map(idx => `
                    <div class="lobby-slot ${l.players && l.players[idx] ? 'occupied' : ''}">
                      ${l.players && l.players[idx] ? l.players[idx].avatar : '⚔️'}
                    </div>
                  `).join('')}
                </div>
              </div>
              <a href="#lobby/${l.id}" class="btn btn-primary btn-block" style="margin-top: 14px;">Join & Enter Lobby</a>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.querySelectorAll('#lobbies-create-btn, #lobbies-create-btn-empty').forEach(b => {
      b.addEventListener('click', () => openCreateLobbyModal());
    });
  }

  function openCreateLobbyModal() {
    const user = Store.state.currentUser;
    if (!user) return;

    Modal.open('⚔️ Create Match Lobby', `
      <form id="create-lobby-form">
        <div class="form-group">
          <label class="form-label">Lobby Title</label>
          <input type="text" id="lobby-title-input" class="input-control" placeholder="e.g. SEA Divine/Ancient 5v5 Scrim" required>
        </div>
        <div class="form-group">
          <label class="form-label">Server Region</label>
          <select id="lobby-region-select" class="input-control" style="background: var(--bg-primary);">
            <option value="SEA">Southeast Asia (SEA)</option>
            <option value="EU West">Europe West</option>
            <option value="US East">US East</option>
            <option value="US West">US West</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Game Mode</label>
          <select id="lobby-mode-select" class="input-control" style="background: var(--bg-primary);">
            <option value="Ranked All Pick">Ranked All Pick</option>
            <option value="Captains Mode">Captains Mode (5v5 Scrim)</option>
            <option value="Turbo">Turbo Fun</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 12px;">Create & Host Lobby</button>
      </form>
    `, (overlay) => {
      overlay.querySelector('#create-lobby-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = overlay.querySelector('#lobby-title-input').value.trim();
        const region = overlay.querySelector('#lobby-region-select').value;
        const mode = overlay.querySelector('#lobby-mode-select').value;

        const newLobby = {
          id: 'lobby_' + Date.now(),
          name: title,
          hostId: user.id,
          hostName: user.displayName || user.username,
          hostAvatar: user.avatar || '🔥',
          region: region,
          matchType: mode,
          maxPlayers: 5,
          description: 'Let\'s party on CourierHub!',
          players: [
            { userId: user.id, name: user.displayName || user.username, avatar: user.avatar || '🔥', rank: user.rank || 'Legend', ready: true, isHost: true }
          ]
        };

        Store.state.lobbies.unshift(newLobby);
        Store.save();

        const sb = getSupabase();
        if (sb) {
          try {
            await sb.from('lobbies').insert({
              title: title,
              host_id: user.id,
              host_name: user.displayName || user.username,
              host_avatar: user.avatar || '🔥',
              region: region,
              game_mode: mode
            });
          } catch (err) {}
        }

        Modal.close();
        Toast.success('Lobby Hosted!', `Lobby "${title}" is now open for players!`);
        AppRouter.navigate(`lobby/${newLobby.id}`);
      });
    });
  }

  /* --- VIEW: LOBBY DETAILS --- */
  function renderLobbyDetails(lobbyId) {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    const lobby = Store.state.lobbies.find(l => l.id === lobbyId);
    if (!lobby) {
      container.innerHTML = `
        <div class="content-container" style="text-align: center; padding: 60px 20px;">
          <h2>Lobby Not Found</h2>
          <p style="color: var(--text-secondary); margin: 12px 0 20px;">This lobby may have ended or been closed.</p>
          <a href="#lobbies" class="btn btn-primary">Return to Lobbies</a>
        </div>
      `;
      return;
    }

    const isInLobby = lobby.players && lobby.players.some(p => p.userId === user.id);

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="hud-panel hud-highlight" style="margin-bottom: 24px; padding: 24px 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <div style="display: flex; gap: 8px; margin-bottom: 6px;">
                <span class="badge badge-gold">${lobby.region}</span>
                <span class="badge badge-radiant">${lobby.matchType}</span>
              </div>
              <h1 style="font-family: var(--font-header); font-size: 1.6rem; color: var(--text-primary); margin: 0;">${lobby.name}</h1>
              <p style="color: var(--text-secondary); font-size: 0.86rem; margin-top: 4px;">Host: <strong>${lobby.hostName}</strong></p>
            </div>
            <div>
              ${isInLobby ? `
                <button class="btn btn-danger" id="lobby-leave-btn">Leave Lobby</button>
              ` : `
                <button class="btn btn-primary btn-lg" id="lobby-join-btn">Join Lobby (${(lobby.players || []).length}/5)</button>
              `}
            </div>
          </div>
        </div>

        <div class="hud-panel">
          <div class="hud-panel-header">
            <div class="hud-panel-title">👥 Team Roster (${(lobby.players || []).length}/5)</div>
          </div>
          <div class="hud-panel-body">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${(lobby.players || []).map((p, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <span style="font-family: var(--font-stats); font-size: 1.2rem; font-weight: 800; color: var(--accent-gold);">#${idx + 1}</span>
                    <div style="font-size: 1.5rem;">${p.avatar || '🔥'}</div>
                    <div>
                      <strong style="color: var(--text-primary); font-size: 0.95rem;">${p.name}</strong>
                      <div style="font-size: 0.76rem; color: var(--text-secondary);">${p.isHost ? '👑 Lobby Host' : 'Player'}</div>
                    </div>
                  </div>
                  <span class="rank-badge rank-immortal">${p.rank || 'Legend'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('lobby-join-btn')?.addEventListener('click', () => {
      if (!lobby.players) lobby.players = [];
      if (!lobby.players.some(p => p.userId === user.id)) {
        lobby.players.push({
          userId: user.id,
          name: user.displayName || user.username,
          avatar: user.avatar || '🔥',
          rank: user.rank || 'Legend',
          ready: true,
          isHost: false
        });
        Store.save();
        if (window.Sound) window.Sound.playLobbyJoin();
        Toast.success('Lobby Joined!', 'You entered the team roster.');
        renderLobbyDetails(lobbyId);
      }
    });

    document.getElementById('lobby-leave-btn')?.addEventListener('click', () => {
      if (lobby.players) {
        lobby.players = lobby.players.filter(p => p.userId !== user.id);
        Store.save();
        Toast.success('Left Lobby', 'You left the matchmaking stack.');
        AppRouter.navigate('lobbies');
      }
    });
  }

  /* --- VIEW: PARTY FINDER --- */
  function renderPartyFinder() {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    const queue = Store.state.partyFinder;
    const isQueued = queue.some(p => p.userId === user.id);

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="hud-panel hud-highlight" style="margin-bottom: 24px; padding: 28px 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
              <h1 style="font-family: var(--font-header); font-size: 1.6rem; color: var(--text-primary); margin: 0 0 4px;">
                🛡️ Role-Based Party Matchmaker
              </h1>
              <p style="color: var(--text-secondary); font-size: 0.9rem;">Queue for ranked stacks by Position (Carry, Mid, Offlane, Support).</p>
            </div>
            <button class="btn ${isQueued ? 'btn-danger' : 'btn-primary'} btn-lg" id="party-toggle-btn">
              ${isQueued ? 'Leave Party Queue' : '⚡ Enter Party Queue'}
            </button>
          </div>
        </div>

        <div class="hud-panel">
          <div class="hud-panel-header">
            <div class="hud-panel-title">🎯 Active Queue Players (${queue.length})</div>
          </div>
          <div class="hud-panel-body">
            ${queue.length === 0 ? `
              <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">🛡️</div>
                <h3 style="color: var(--text-primary); margin-bottom: 6px;">Queue is Empty</h3>
                <p style="font-size: 0.9rem;">Click "Enter Party Queue" above to let other captains invite you!</p>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                ${queue.map(p => `
                  <div style="padding: 16px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <div style="font-size: 1.6rem;">${p.avatar || '🔥'}</div>
                      <div>
                        <strong style="color: var(--text-primary);">${p.name}</strong>
                        <div style="font-size: 0.78rem; color: var(--accent-gold);">${p.role || 'Core'} • ${p.region || 'SEA'}</div>
                      </div>
                    </div>
                    <button class="btn btn-secondary invite-btn" data-name="${p.name}" style="font-size: 0.8rem; padding: 6px 12px;">Invite</button>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    document.getElementById('party-toggle-btn')?.addEventListener('click', () => {
      if (isQueued) {
        Store.state.partyFinder = Store.state.partyFinder.filter(p => p.userId !== user.id);
        Toast.success('Queue Left', 'You left the party matchmaking queue.');
      } else {
        Store.state.partyFinder.unshift({
          id: 'p_' + Date.now(),
          userId: user.id,
          name: user.displayName || user.username,
          avatar: user.avatar || '🔥',
          rank: user.rank || 'Legend',
          role: 'Carry',
          region: user.region || 'SEA'
        });
        Toast.success('Queue Entered!', 'You are now visible to party leaders.');
      }
      Store.save();
      renderPartyFinder();
    });

    document.querySelectorAll('.invite-btn').forEach(b => b.addEventListener('click', () => {
      Toast.success('Invitation Dispatched', `Invited ${b.dataset.name} to party!`);
      b.innerText = 'Invited ✓';
      b.disabled = true;
    }));
  }

  /* --- VIEW: COMMUNITY CHAT --- */
  function renderCommunity() {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    const msgs = Store.state.communityMessages;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="hud-panel" style="height: 78vh; display: flex; flex-direction: column;">
          <div class="hud-panel-header">
            <div class="hud-panel-title">💬 Live Dota 2 Community Discussion</div>
            <span class="badge badge-radiant">🟢 Realtime Live</span>
          </div>

          <div id="chat-messages-container" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
            ${msgs.length === 0 ? `
              <div style="text-align: center; margin: auto; color: var(--text-muted);">
                <div style="font-size: 2.5rem; margin-bottom: 8px;">💬</div>
                <h3 style="color: var(--text-primary);">No Messages Yet</h3>
                <p style="font-size: 0.88rem;">Say hello to fellow Dota 2 players!</p>
              </div>
            ` : msgs.map(m => `
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div style="font-size: 1.6rem;">${m.userAvatar || '🔥'}</div>
                <div style="background: var(--bg-tertiary); padding: 10px 16px; border-radius: var(--radius-md); max-width: 80%;">
                  <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 4px;">
                    <strong style="color: var(--accent-gold); font-size: 0.88rem;">${m.userName}</strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${m.userRank || 'Ancient'}</span>
                  </div>
                  <div style="color: var(--text-primary); font-size: 0.92rem; line-height: 1.4;">${m.content}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="padding: 16px 20px; border-top: 1px solid var(--border-subtle); background: var(--bg-secondary);">
            <form id="chat-input-form" style="display: flex; gap: 12px;">
              <input type="text" id="chat-msg-input" class="input-control" placeholder="Type message to CourierHub community..." required style="flex: 1;">
              <button type="submit" class="btn btn-primary" style="padding: 0 24px;">${Icons.send} <span>Send</span></button>
            </form>
          </div>
        </div>
      </div>
    `;

    const chatBox = document.getElementById('chat-messages-container');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;

    document.getElementById('chat-input-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('chat-msg-input');
      const text = input.value.trim();
      if (!text) return;

      const newMsg = {
        id: 'msg_' + Date.now(),
        userId: user.id,
        userName: user.displayName || user.username,
        userAvatar: user.avatar || '🔥',
        userRank: user.rank || 'Ancient V',
        content: text,
        createdAt: new Date().toISOString()
      };

      Store.state.communityMessages.push(newMsg);
      Store.save();
      input.value = '';
      if (window.Sound) window.Sound.playMessage();

      const sb = getSupabase();
      if (sb) {
        try {
          await sb.from('community_messages').insert({
            user_id: user.id,
            author_name: user.displayName || user.username,
            author_avatar: user.avatar || '🔥',
            author_rank: user.rank || 'Ancient V',
            text: text
          });
        } catch (err) {}
      }

      renderCommunity();
    });
  }

  /* --- VIEW: MEMBERS DIRECTORY --- */
  function renderMembers() {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    const users = Store.state.users.length > 0 ? Store.state.users : [user];

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <h1 style="font-family: var(--font-header); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 20px;">
          👥 Player Directory & Roster
        </h1>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${users.map(u => `
            <div class="hud-panel" style="padding: 20px; text-align: center;">
              <div class="player-avatar-frame ${u.avatarFrame || 'avatar-frame-immortal'}" style="width: 64px; height: 64px; font-size: 2rem; margin: 0 auto 12px;">
                <span>${u.avatar || '🔥'}</span>
              </div>
              <h3 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 4px;">${u.displayName || u.username}</h3>
              <div style="margin-bottom: 12px;"><span class="rank-badge rank-immortal">${u.rank || 'Legend I'}</span></div>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 16px;">${u.bio || 'Ready to party on CourierHub!'}</p>
              <div style="font-size: 0.78rem; color: var(--text-muted);">Region: <strong>${u.region || 'SEA'}</strong></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* --- VIEW: PROFILE --- */
  function renderProfile() {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="hud-panel hud-highlight" style="padding: 32px; max-width: 680px; margin: 0 auto;">
          <div class="hud-corner-accent hud-corner-tl"></div>
          <div class="hud-corner-accent hud-corner-tr"></div>
          <div class="hud-corner-accent hud-corner-bl"></div>
          <div class="hud-corner-accent hud-corner-br"></div>

          <div style="text-align: center; margin-bottom: 24px;">
            <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 80px; height: 80px; font-size: 2.8rem; margin: 0 auto 16px;">
              <span>${user.avatar || '🔥'}</span>
            </div>
            <h1 style="font-family: var(--font-header); font-size: 1.8rem; color: var(--text-primary); margin: 0 0 6px;">${user.displayName || user.username}</h1>
            <div><span class="rank-badge rank-immortal" style="font-size: 0.9rem; padding: 4px 14px;">${user.rank || 'Legend I'}</span></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px;">
            <div style="padding: 14px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dota 2 Friend ID</div>
              <strong style="color: var(--accent-gold); font-family: var(--font-stats); font-size: 1.2rem;">${user.dotaId || '109283742'}</strong>
            </div>
            <div style="padding: 14px; background: var(--bg-tertiary); border-radius: var(--radius-md);">
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Primary Region</div>
              <strong style="color: var(--text-primary); font-size: 1.1rem;">${user.region || 'SEA'}</strong>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">Player Biography</div>
            <div style="padding: 14px; background: var(--bg-primary); border-radius: var(--radius-md); color: var(--text-primary); font-size: 0.92rem;">
              ${user.bio || 'Ready to party on CourierHub! Let\'s grind MMR together.'}
            </div>
          </div>

          <button class="btn btn-secondary btn-block" id="profile-edit-btn">Edit Profile Settings</button>
        </div>
      </div>
    `;

    document.getElementById('profile-edit-btn')?.addEventListener('click', () => {
      Modal.open('✏️ Edit Player Profile', `
        <form id="edit-profile-form">
          <div class="form-group">
            <label class="form-label">Display Name</label>
            <input type="text" id="edit-name" class="input-control" value="${user.displayName || user.username}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Rank Tier</label>
            <select id="edit-rank" class="input-control" style="background: var(--bg-primary);">
              <option value="Immortal">Immortal</option>
              <option value="Divine">Divine</option>
              <option value="Ancient">Ancient</option>
              <option value="Legend" selected>Legend</option>
              <option value="Archon">Archon</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Biography</label>
            <textarea id="edit-bio" class="input-control" rows="3">${user.bio || ''}</textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 12px;">Save Profile</button>
        </form>
      `, (overlay) => {
        overlay.querySelector('#edit-profile-form').addEventListener('submit', (e) => {
          e.preventDefault();
          user.displayName = overlay.querySelector('#edit-name').value.trim();
          user.rank = overlay.querySelector('#edit-rank').value;
          user.bio = overlay.querySelector('#edit-bio').value.trim();
          Store.save();
          Modal.close();
          Toast.success('Profile Saved!', 'Your changes have been updated.');
          renderProfile();
        });
      });
    });
  }

  /* --- VIEW: HUD SETTINGS --- */
  function renderHudSettings() {
    const user = Store.state.currentUser;
    if (!user) { AppRouter.navigate('login'); return; }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <h1 style="font-family: var(--font-header); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 24px;">
          ⚙️ Personal HUD Customizer
        </h1>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 16px;">🎨 Visual Theme Presets</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${['classic', 'crimson', 'diretide', 'abyssal', 'light'].map(t => `
                <div class="hud-panel theme-btn" data-theme="${t}" style="padding: 14px 18px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  <strong style="text-transform: capitalize; color: #fff;">${t} Theme</strong>
                  <span class="badge badge-gold">Apply</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 16px;">🔊 Sound Synthesizer</div>
            <button class="btn btn-secondary btn-block" id="test-fanfare-btn" style="margin-bottom: 12px;">🎺 Test Fanfare Sound</button>
            <button class="btn btn-secondary btn-block" id="test-notif-btn">🔔 Test Notification Chime</button>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.theme-btn').forEach(b => {
      b.addEventListener('click', () => {
        const theme = b.dataset.theme;
        document.body.setAttribute('data-theme', theme);
        Toast.success('Theme Applied', `Switched to ${theme.toUpperCase()} HUD`);
      });
    });

    document.getElementById('test-fanfare-btn')?.addEventListener('click', () => {
      if (window.Sound) window.Sound.playLobbyJoin();
    });
    document.getElementById('test-notif-btn')?.addEventListener('click', () => {
      if (window.Sound) window.Sound.playNotification();
    });
  }

  /* ==========================================================================
     8. APPLICATION BOOTSTRAP
     ========================================================================== */
  function initApp() {
    window.nexusBgInstance = new CanvasBackground();

    AppRouter.register('login', () => renderAuth(false));
    AppRouter.register('signup', () => renderAuth(true));
    AppRouter.register('home', () => renderHome());
    AppRouter.register('lobbies', () => renderLobbies());
    AppRouter.register('lobby', (id) => renderLobbyDetails(id));
    AppRouter.register('community', () => renderCommunity());
    AppRouter.register('party-finder', () => renderPartyFinder());
    AppRouter.register('members', () => renderMembers());
    AppRouter.register('profile', () => renderProfile());
    AppRouter.register('hud-settings', () => renderHudSettings());

    // Instant zero-blocking render
    AppRouter.handle();

    // Background Supabase Sync & Email Confirmation Interceptor
    const sb = getSupabase();
    if (sb) {
      // Check if URL has email confirmation token
      const isEmailConfirm = window.location.hash.includes('access_token') || window.location.href.includes('type=signup');
      if (isEmailConfirm) {
        sb.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user) {
            let uname = session.user.user_metadata?.username || session.user.email?.split('@')[0];
            try {
              const { data: p } = await sb.from('profiles').select('username').eq('id', session.user.id).maybeSingle();
              if (p?.username) uname = p.username;
            } catch (e) {}
            // Sign out so they must explicitly log in
            await sb.auth.signOut().catch(() => {});
            Store.logout();
            AppRouter.navigate('login');
            Toast.success('Account Activated!', 'Your email has been verified. Please sign in to continue!');
            setTimeout(() => {
              const loginInp = document.getElementById('login-input-user');
              if (loginInp && uname) loginInp.value = uname;
              document.getElementById('login-input-pw')?.focus();
            }, 300);
          }
        });
      }

      sb.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          Store.logout();
          AppRouter.navigate('login');
        }
      });
    }

    Store.syncFromSupabase().catch(() => {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
