/**
 * Ancient Nexus - Universal Self-Contained Web Application Engine
 * Combines all icons, sound synthesis, state management, views, router, and animations
 * for instant 60+ FPS execution whether running via file:// or http://.
 */

(function() {
  'use strict';

  /* ==========================================================================
     0. SUPABASE CLOUD BACKEND & AUTHENTICATION INITIALIZATION
     ========================================================================== */
  const SUPABASE_URL = 'https://siudmczzugjyeutzcexu.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdWRtY3p6dWdqeWV1dHpjZXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMjA0MTksImV4cCI6MjEwMzU5NjQxOX0.nrA8rdhCAl06SJxpNEizeUkP3mwMwh6P8TCpkhH7vkI';

  let supabaseClient = null;

  function getSupabase() {
    if (!supabaseClient && window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return supabaseClient;
  }

  /* ==========================================================================
     1. ICONS & HERO REGISTRY
     ========================================================================== */
  const Icons = {
    home: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    community: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    conversations: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
    lobbies: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="3"></rect><path d="M6 12h4m-2-2v4m7-2h.01m3-2h.01m0 4h.01"></path></svg>`,
    profile: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    party: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="12 6 12 12 16 14"></polygon></svg>`,
    members: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`,
    hud: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    search: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    bell: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    swords: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"></path><path d="M13 19l6-6"></path><path d="M16 16l4 4"></path><path d="M19 21l2-2"></path><path d="M9.5 6.5L21 18v3h-3L6.5 9.5"></path></svg>`,
    shield: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    share: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    x: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    send: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    emoji: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    logout: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
    volume: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    volumeMute: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`,
    edit: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    reply: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>`,
    menu: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
    lock: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
    roleCarry: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M14.5 2.5L21.5 9.5L9.5 21.5L2.5 14.5L14.5 2.5ZM17.5 7.5L16.5 6.5L6.5 16.5L7.5 17.5L17.5 7.5Z"/><polygon points="21,3 15,3 21,9"/></svg>`,
    roleMid: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"/></svg>`,
    roleOfflane: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 4a4 4 0 0 1 4 4c0 2.21-1.79 4-4 4s-4-1.79-4-4a4 4 0 0 1 4-4z"/></svg>`,
    roleSoftSupport: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    roleHardSupport: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>`,
    roleFlex: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5V13h3.5a.5.5 0 0 1 0 1H14v2.5a.5.5 0 0 1-1 0zm-2-5V11H7.5a.5.5 0 0 1 0-1H10V7.5a.5.5 0 0 1 1 0z"/></svg>`
  };

  const RolesList = [
    { id: 'carry', name: 'Carry (Pos 1)', icon: Icons.roleCarry, color: '#ef4444' },
    { id: 'mid', name: 'Mid Lane (Pos 2)', icon: Icons.roleMid, color: '#f59e0b' },
    { id: 'offlane', name: 'Offlane (Pos 3)', icon: Icons.roleOfflane, color: '#3b82f6' },
    { id: 'soft_support', name: 'Soft Support (Pos 4)', icon: Icons.roleSoftSupport, color: '#10b981' },
    { id: 'hard_support', name: 'Hard Support (Pos 5)', icon: Icons.roleHardSupport, color: '#8b5cf6' },
    { id: 'flexible', name: 'Flexible', icon: Icons.roleFlex, color: '#ec4899' }
  ];

  const HeroesCatalog = [
    { id: 'shadow_fiend', name: 'Shadow Fiend', title: 'Nevermore', role: 'Mid', gradient: 'linear-gradient(135deg, #1a0505, #5c0f16, #ff3344)', icon: '🔥' },
    { id: 'invoker', name: 'Invoker', title: 'Arsenal Magus', role: 'Mid', gradient: 'linear-gradient(135deg, #2b1802, #78350f, #f59e0b)', icon: '⚡' },
    { id: 'juggernaut', name: 'Juggernaut', title: 'Yurnero', role: 'Carry', gradient: 'linear-gradient(135deg, #240a08, #851e19, #f87171)', icon: '⚔️' },
    { id: 'anti_mage', name: 'Anti-Mage', title: 'Magentur', role: 'Carry', gradient: 'linear-gradient(135deg, #1b0c2e, #581c87, #a855f7)', icon: '🛡️' },
    { id: 'phantom_assassin', name: 'Phantom Assassin', title: 'Mortred', role: 'Carry', gradient: 'linear-gradient(135deg, #052329, #155e75, #06b6d4)', icon: '🗡️' },
    { id: 'axe', name: 'Axe', title: 'Mogul Khan', role: 'Offlane', gradient: 'linear-gradient(135deg, #380d0d, #991b1b, #dc2626)', icon: '🪓' },
    { id: 'crystal_maiden', name: 'Crystal Maiden', title: 'Rylai', role: 'Hard Support', gradient: 'linear-gradient(135deg, #0c2838, #0369a1, #38bdf8)', icon: '❄️' },
    { id: 'rubick', name: 'Rubick', title: 'Grand Magus', role: 'Soft Support', gradient: 'linear-gradient(135deg, #062b1e, #047857, #10b981)', icon: '✨' },
    { id: 'storm_spirit', name: 'Storm Spirit', title: 'Raijin Thunderkeg', role: 'Mid', gradient: 'linear-gradient(135deg, #091e3a, #1d4ed8, #3b82f6)', icon: '🌩️' },
    { id: 'mirana', name: 'Mirana', title: 'Princess of the Moon', role: 'Soft Support', gradient: 'linear-gradient(135deg, #1e1b4b, #4338ca, #818cf8)', icon: '🏹' }
  ];

  const AvatarIcons = ['⚔️', '🔥', '⚡', '❄️', '🛡️', '🗡️', '🪓', '🪝', '✨', '🌩️', '⏳', '🌊', '🏹', '👑', '👹', '🚩', '💀', '🐉', '🦅', '🐺', '🪐', '🔮', '💎', '🎯'];

  /* ==========================================================================
     2. PROCEDURAL SOUND SYNTHESIZER
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = localStorage.getItem('nexus_audio_muted') === 'true';
      this.volume = 0.5;
    }
    ensureContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
    setMuted(m) {
      this.muted = m;
      localStorage.setItem('nexus_audio_muted', m);
    }
    toggleMute() {
      this.setMuted(!this.muted);
      return this.muted;
    }
    setVolume(v) { this.volume = Math.max(0, Math.min(1, v)); }
    playHover() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(this.volume * 0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }
    playClick() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(this.volume * 0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.07);
      } catch (e) {}
    }
    playLobbyJoin() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = now + idx * 0.07;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(this.volume * 0.15, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.3);
        });
      } catch (e) {}
    }
    playNotification() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(this.volume * 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } catch (e) {}
    }
    playMessage() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(784, now);
        osc.frequency.setValueAtTime(1046.5, now + 0.06);
        gain.gain.setValueAtTime(this.volume * 0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } catch (e) {}
    }
    playError() {
      if (this.muted) return;
      this.ensureContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(220, now + 0.08);
        gain.gain.setValueAtTime(this.volume * 0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}
    }
  }
  const Sound = new SoundEngine();

  /* ==========================================================================
     3. TOAST & MODAL MANAGERS
     ========================================================================== */
  class ToastManager {
    ensureContainer() {
      let c = document.getElementById('toast-container');
      if (!c) {
        c = document.createElement('div');
        c.id = 'toast-container';
        document.body.appendChild(c);
      }
      return c;
    }
    show(title, message, type = 'info', duration = 3500) {
      const container = this.ensureContainer();
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      const icons = { success: '⚔️', info: '⚡', warning: '⚠️', error: '🛑' };
      toast.innerHTML = `
        <div class="toast-icon">${icons[type] || '⚡'}</div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
      `;
      container.appendChild(toast);
      Sound.playNotification();
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(60px)';
        setTimeout(() => toast.remove(), 250);
      }, duration);
    }
    success(t, m) { this.show(t, m, 'success'); }
    info(t, m) { this.show(t, m, 'info'); }
    warning(t, m) { this.show(t, m, 'warning'); }
    error(t, m) { this.show(t, m, 'error'); }
  }
  const Toast = new ToastManager();

  class ModalManager {
    constructor() {
      this.activeModal = null;
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeModal) this.close();
      });
    }
    open({ title, icon = 'swords', contentHtml, maxWidth = '560px', onOpen = null }) {
      this.close();
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay active';
      overlay.id = 'active-modal-overlay';
      overlay.innerHTML = `
        <div class="modal-card" style="max-width: ${maxWidth}">
          <div class="modal-header">
            <div class="modal-title">
              <span>${Icons[icon] || Icons.swords}</span>
              <span>${title}</span>
            </div>
            <button class="btn btn-icon" id="modal-close-btn">${Icons.x}</button>
          </div>
          <div class="modal-body">
            ${contentHtml}
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      this.activeModal = overlay;
      Sound.playClick();
      overlay.querySelector('#modal-close-btn').addEventListener('click', () => this.close());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close();
      });
      if (typeof onOpen === 'function') onOpen(overlay);
      return overlay;
    }
    close() {
      if (this.activeModal) {
        this.activeModal.remove();
        this.activeModal = null;
        Sound.playHover();
      }
    }
  }
  const Modal = new ModalManager();

  /* ==========================================================================
     4. REACTIVE STATE STORE
     ========================================================================== */
  class StateStore {
    constructor() {
      this.subscribers = new Set();
      this.state = this.loadState();
    }
    loadState() {
      const saved = localStorage.getItem('nexus_state_v1');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.users && parsed.users.some(u => u.id === 'u_raven' || u.id === 'u_shadow')) {
            localStorage.removeItem('nexus_state_v1');
            return this.getDefaults();
          }
          return parsed;
        } catch (e) {}
      }
      return this.getDefaults();
    }
    getDefaults() {
      return {
        currentUser: null,
        users: [],
        lobbies: [],
        communityMessages: [],
        conversations: [],
        partyFinder: [],
        notifications: [],
        activityFeed: [],
        statsOverview: { totalMembers: 0, onlineNow: 0, matchesToday: 0, activeLobbies: 0, matchesCompleted: 0, playersLookingForParty: 0 }
      };
    }
    save() {
      try {
        localStorage.setItem('nexus_state_v1', JSON.stringify(this.state));
      } catch (e) {}
      this.notify();
    }
    subscribe(cb) {
      this.subscribers.add(cb);
      return () => this.subscribers.delete(cb);
    }
    notify() {
      this.subscribers.forEach(cb => {
        try { cb(this.state); } catch (e) {}
      });
    }
    async syncFromSupabase() {
      const sb = getSupabase();
      if (!sb) return;
      try {
        // 1. Fetch profiles
        const { data: profs } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
        if (profs && profs.length > 0) {
          this.state.users = profs.map(p => ({
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
            isOnline: p.is_online !== false,
            onlineStatus: p.online_status || 'online',
            stats: {
              matches: p.games_played || 120,
              wins: Math.round((p.games_played || 120) * ((p.win_rate || 52.5) / 100)),
              losses: (p.games_played || 120) - Math.round((p.games_played || 120) * ((p.win_rate || 52.5) / 100)),
              winRate: p.win_rate || 52.5,
              hoursPlayed: Math.round((p.games_played || 120) * 0.75)
            }
          }));
          this.state.statsOverview.totalMembers = this.state.users.length;
          this.state.statsOverview.onlineNow = this.state.users.filter(u => u.onlineStatus === 'online' || u.isOnline).length || (this.state.currentUser ? 1 : 0);
        }

        // 2. Fetch lobbies
        const { data: lobs } = await sb.from('lobbies').select('*, lobby_members(*)').order('created_at', { ascending: false });
        if (lobs && lobs.length > 0) {
          this.state.lobbies = lobs.map(l => ({
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

        // 3. Fetch community messages
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
            replyTo: m.reply_to_id,
            replyPreview: m.reply_preview,
            lobbyEmbed: m.lobby_embed
          }));
        }

        // 4. Fetch party finder queue
        const { data: parties } = await sb.from('party_finder').select('*').order('created_at', { ascending: false });
        if (parties && parties.length > 0) {
          this.state.partyFinder = parties.map(p => ({
            id: p.id,
            userId: p.host_id,
            name: p.host_name,
            avatar: p.host_avatar || '🔥',
            rank: p.host_rank || 'Legend',
            role: (p.roles_needed && p.roles_needed[0]) || 'Core',
            region: p.region || 'SEA',
            mode: 'Ranked'
          }));
          this.state.statsOverview.playersLookingForParty = this.state.partyFinder.length;
        }

        this.save();
      } catch (err) {
        console.warn('Supabase sync notice:', err);
      }
    }
    loginUser(user) {
      this.state.currentUser = { ...this.state.currentUser, ...user, onlineStatus: 'online' };
      // Also update or insert in users list
      const idx = this.state.users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        this.state.users[idx] = { ...this.state.users[idx], ...user, onlineStatus: 'online' };
      } else {
        this.state.users.unshift({ ...user, onlineStatus: 'online' });
      }
      this.state.statsOverview.totalMembers = this.state.users.length;
      this.state.statsOverview.onlineNow = this.state.users.filter(u => u.onlineStatus === 'online' || u.isOnline).length;
      this.save();
      Sound.playNotification();
    }
    logout() {
      this.state.currentUser = null;
      localStorage.removeItem('nexus_state_v1');
      this.save();
      const sb = getSupabase();
      if (sb) {
        sb.auth.signOut().catch(() => {});
      }
    }
    updateProfile(updates) {
      if (!this.state.currentUser) return;
      this.state.currentUser = { ...this.state.currentUser, ...updates };
      const idx = this.state.users.findIndex(u => u.id === this.state.currentUser.id);
      if (idx !== -1) this.state.users[idx] = { ...this.state.users[idx], ...updates };
      this.save();
      const sb = getSupabase();
      if (sb) {
        sb.from('profiles').update({
          display_name: updates.displayName || this.state.currentUser.displayName,
          dota_id: updates.dotaId || this.state.currentUser.dotaId,
          rank: updates.rank || this.state.currentUser.rank,
          region: updates.region || this.state.currentUser.region,
          avatar: updates.avatar || this.state.currentUser.avatar,
          avatar_frame: updates.avatarFrame || this.state.currentUser.avatarFrame,
          bio: updates.bio || this.state.currentUser.bio,
          online_status: updates.onlineStatus || this.state.currentUser.onlineStatus
        }).eq('id', this.state.currentUser.id).catch(() => {});
      }
    }
    updateHud(updates) {
      if (!this.state.currentUser) return;
      this.state.currentUser.hudSettings = { ...this.state.currentUser.hudSettings, ...updates };
      this.save();
    }
    sendCommunityMsg(content, replyTo = null, lobbyEmbed = null) {
      if (!this.state.currentUser) return;
      const msg = {
        id: 'msg_' + Date.now(),
        userId: this.state.currentUser.id,
        userName: this.state.currentUser.displayName || this.state.currentUser.username,
        userAvatar: this.state.currentUser.avatar || '⚔️',
        userRank: this.state.currentUser.rank || 'Ancient V',
        content,
        createdAt: new Date().toISOString(),
        reactions: {},
        replyTo,
        lobbyEmbed
      };
      this.state.communityMessages.push(msg);
      this.save();
      Sound.playMessage();
      const sb = getSupabase();
      if (sb) {
        sb.from('community_messages').insert({
          user_id: this.state.currentUser.id,
          author_name: msg.userName,
          author_avatar: msg.userAvatar,
          author_rank: msg.userRank,
          text: content,
          reply_to_id: replyTo,
          lobby_embed: lobbyEmbed
        }).catch(() => {});
      }
      return msg;
    }
    reactMsg(msgId, emoji) {
      const msg = this.state.communityMessages.find(m => m.id === msgId);
      if (!msg || !this.state.currentUser) return;
      if (!msg.reactions) msg.reactions = {};
      if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
      const uid = this.state.currentUser.id;
      const i = msg.reactions[emoji].indexOf(uid);
      if (i > -1) msg.reactions[emoji].splice(i, 1);
      else msg.reactions[emoji].push(uid);
      this.save();
      Sound.playHover();
    }
    deleteCommunityMsg(id) {
      this.state.communityMessages = this.state.communityMessages.filter(m => m.id !== id);
      this.save();
      const sb = getSupabase();
      if (sb) {
        sb.from('community_messages').delete().eq('id', id).catch(() => {});
      }
    }
    sendPM(recipientId, text) {
      if (!this.state.currentUser) return;
      let conv = this.state.conversations.find(c => c.participantId === recipientId);
      if (!conv) {
        conv = { id: 'conv_' + recipientId, participantId: recipientId, messages: [], unread: 0 };
        this.state.conversations.push(conv);
      }
      conv.messages.push({
        id: 'pm_' + Date.now(),
        senderId: this.state.currentUser.id,
        text,
        time: new Date().toISOString(),
        read: true
      });
      this.save();
      Sound.playMessage();
    }
    createLobby(data) {
      if (!this.state.currentUser) return;
      const region = data.region || 'SEA';
      const id = `${region}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newLobby = {
        id,
        name: data.name || 'New Match Lobby',
        hostId: this.state.currentUser.id,
        hostName: this.state.currentUser.displayName || this.state.currentUser.username,
        region,
        matchType: data.matchType || 'Ranked',
        maxPlayers: parseInt(data.maxPlayers, 10) || 5,
        description: data.description || 'Join my party stack!',
        requiredRank: data.requiredRank || 'Any',
        voiceChat: !!data.voiceChat,
        status: 'Waiting',
        players: [
          { userId: this.state.currentUser.id, name: this.state.currentUser.displayName, avatar: this.state.currentUser.avatar, rank: this.state.currentUser.rank, role: 'carry', ready: true, isHost: true }
        ]
      };
      this.state.lobbies.unshift(newLobby);
      this.state.currentUser.currentLobbyId = id;
      this.save();
      Sound.playLobbyJoin();
      const sb = getSupabase();
      if (sb) {
        sb.from('lobbies').insert({
          id,
          title: newLobby.name,
          region: newLobby.region,
          rank_tier: newLobby.requiredRank,
          game_mode: newLobby.matchType,
          host_id: this.state.currentUser.id,
          host_name: newLobby.hostName,
          host_avatar: this.state.currentUser.avatar || '🔥',
          status: 'open'
        }).catch(() => {});
      }
      return newLobby;
    }
    joinLobby(lobbyId) {
      const lobby = this.state.lobbies.find(l => l.id === lobbyId);
      if (!lobby || !this.state.currentUser) return { success: false, reason: 'Lobby not found' };
      if (lobby.players.some(p => p.userId === this.state.currentUser.id)) return { success: true, lobby };
      if (lobby.players.length >= lobby.maxPlayers) return { success: false, reason: 'Lobby is full' };

      lobby.players.push({
        userId: this.state.currentUser.id,
        name: this.state.currentUser.displayName,
        avatar: this.state.currentUser.avatar,
        rank: this.state.currentUser.rank,
        role: 'support',
        ready: true,
        isHost: false
      });
      if (lobby.players.length >= lobby.maxPlayers) lobby.status = 'Full';
      this.state.currentUser.currentLobbyId = lobbyId;
      this.save();
      Sound.playLobbyJoin();
      return { success: true, lobby };
    }
    leaveLobby(lobbyId) {
      const lobby = this.state.lobbies.find(l => l.id === lobbyId);
      if (!lobby || !this.state.currentUser) return;
      lobby.players = lobby.players.filter(p => p.userId !== this.state.currentUser.id);
      if (this.state.currentUser.currentLobbyId === lobbyId) this.state.currentUser.currentLobbyId = null;
      if (lobby.players.length === 0) {
        this.state.lobbies = this.state.lobbies.filter(l => l.id !== lobbyId);
      }
      this.save();
    }
    toggleParty(status) {
      if (!this.state.currentUser) return;
      this.state.currentUser.isLookingForParty = status;
      const uid = this.state.currentUser.id;
      if (status) {
        if (!this.state.partyFinder.some(p => p.userId === uid)) {
          this.state.partyFinder.unshift({
            userId: uid,
            name: this.state.currentUser.displayName,
            avatar: this.state.currentUser.avatar,
            rank: this.state.currentUser.rank,
            role: 'Carry',
            region: this.state.currentUser.region,
            mode: 'Ranked'
          });
        }
      } else {
        this.state.partyFinder = this.state.partyFinder.filter(p => p.userId !== uid);
      }
      this.save();
    }
  }
  const Store = new StateStore();

  /* ==========================================================================
     5. CANVAS ANIMATED BACKGROUND
     ========================================================================== */
  class CanvasBackground {
    constructor() {
      this.canvas = document.getElementById('canvas-bg');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mode = Store.state.currentUser?.hudSettings?.bgMode || 'embers';
      this.runes = ['ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᛃ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛞ', 'ᛟ'];
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.initParticles();
      this.loop = this.loop.bind(this);
      this.loop();
    }
    setMode(m) {
      this.mode = m;
      this.initParticles();
    }
    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    initParticles() {
      this.particles = [];
      if (this.mode === 'minimal') return;
      for (let i = 0; i < 45; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 3 + 1,
          speedY: Math.random() * 0.8 + 0.3,
          speedX: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.6 + 0.2,
          isRune: this.mode === 'runes' && Math.random() > 0.4,
          runeChar: this.runes[Math.floor(Math.random() * this.runes.length)]
        });
      }
    }
    loop() {
      requestAnimationFrame(this.loop);
      if (!this.ctx || this.mode === 'minimal') return;
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -20) { p.y = this.height + 20; p.x = Math.random() * this.width; }
        if (p.isRune) {
          this.ctx.font = `${Math.floor(p.size * 5 + 10)}px 'Cinzel', serif`;
          this.ctx.fillStyle = `rgba(217, 119, 6, ${p.alpha * 0.25})`;
          this.ctx.fillText(p.runeChar, p.x, p.y);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(217, 119, 6, ${p.alpha * 0.3})`;
          this.ctx.fill();
        }
      }
    }
  }

  /* ==========================================================================
     6. ROUTER
     ========================================================================== */
  class Router {
    constructor() {
      this.routes = {};
      this.currentRoute = 'home';
      this.currentParam = null;
      window.addEventListener('hashchange', () => this.handle());
    }
    register(path, fn) { this.routes[path] = fn; }
    navigate(path) {
      window.location.hash = path.startsWith('#') ? path : '#' + path;
    }
    handle() {
      let hash = window.location.hash.slice(1) || 'home';
      if (hash.startsWith('/')) hash = hash.slice(1);
      const parts = hash.split('/');
      const mainPath = parts[0] || 'home';
      const param = parts[1] || null;

      const isAuth = !!Store.state.currentUser;
      if (!isAuth && mainPath !== 'login' && mainPath !== 'signup') {
        this.currentRoute = 'login';
        if (window.location.hash !== '#login' && window.location.hash !== '#signup') {
          window.location.hash = '#login';
        }
        if (this.routes['login']) this.routes['login']();
        return;
      }
      if (isAuth && (mainPath === 'login' || mainPath === 'signup')) {
        this.navigate('home');
        return;
      }

      this.currentRoute = mainPath;
      this.currentParam = param;

      if (this.routes[mainPath]) {
        this.routes[mainPath](param);
      } else if (this.routes['home']) {
        this.routes['home']();
      }

      // Update active links
      document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
        const href = el.getAttribute('href') || '';
        const linkRoute = href.replace('#', '').split('/')[0];
        if (linkRoute === mainPath || (mainPath === 'lobby' && linkRoute === 'lobbies')) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    }
  }
  const AppRouter = new Router();

  /* ==========================================================================
     7. APP SHELL & VIEWS
     ========================================================================== */
  function renderLayoutShell() {
    const root = document.getElementById('app-root');
    const user = Store.state.currentUser;
    const bgCanvas = document.getElementById('canvas-bg');
    if (bgCanvas) bgCanvas.style.display = user ? 'block' : 'none';

    if (!user) {
      root.innerHTML = `<main id="view-container" style="min-height: 100vh;"></main>`;
      return;
    }

    const unreadCount = Store.state.notifications.filter(n => !n.read).length;
    const activeLobbiesCount = Store.state.lobbies.length;

    root.innerHTML = `
      <div class="app-layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <div class="sidebar-brand">
            <a href="#home" class="brand-logo">
              <img src="assets/logo.png" alt="CourierHub" style="width: 36px; height: 36px; object-fit: contain; filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.35));">
              <span class="brand-text" style="font-family: var(--font-sans); font-weight: 800; letter-spacing: 0.02em;">CourierHub</span>
            </a>
          </div>

          <nav class="sidebar-nav">
            <a href="#home" class="nav-link active" data-route="home">${Icons.home} <span>Home HUD</span></a>
            <a href="#community" class="nav-link" data-route="community">${Icons.community} <span>Community</span></a>
            <a href="#conversations" class="nav-link" data-route="conversations">${Icons.conversations} <span>Conversations</span></a>
            <a href="#lobbies" class="nav-link" data-route="lobbies">${Icons.lobbies} <span>Lobbies</span> <span class="nav-badge">${activeLobbiesCount}</span></a>
            <a href="#party-finder" class="nav-link" data-route="party-finder">${Icons.party} <span>Party Finder</span></a>
            <a href="#members" class="nav-link" data-route="members">${Icons.members} <span>Members</span></a>
            <a href="#profile" class="nav-link" data-route="profile">${Icons.profile} <span>My Profile</span></a>
            <a href="#hud-settings" class="nav-link" data-route="hud-settings">${Icons.hud} <span>HUD Customizer</span></a>
          </nav>

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
                  <option value="dnd" ${user.onlineStatus === 'dnd' ? 'selected' : ''}>🔴 DND</option>
                </select>
              </div>
            </div>
            <button class="btn btn-icon" id="sidebar-logout-btn" title="Logout">${Icons.logout}</button>
          </div>
        </aside>

        <!-- Main Body -->
        <div class="app-main">
          <!-- Topbar -->
          <header class="topbar">
            <div class="topbar-left">
              <button class="btn btn-icon sidebar-toggle-btn" id="sidebar-toggle-btn">${Icons.menu}</button>
              <div class="topbar-search-wrap">
                <span class="search-icon">${Icons.search}</span>
                <input type="text" class="input-control" id="global-omnisearch" placeholder="Search lobbies, players, matches...">
              </div>
            </div>

            <div class="topbar-right">
              <button class="btn btn-primary btn-sm" id="topbar-create-lobby-btn">
                ${Icons.plus} <span>Create Lobby</span>
              </button>
              <button class="btn btn-icon" id="topbar-audio-toggle">
                ${Store.state.currentUser?.hudSettings?.audioMuted ? Icons.volumeMute : Icons.volume}
              </button>
              <button class="btn btn-icon" id="topbar-notif-btn" style="position: relative;">
                ${Icons.bell}
                ${unreadCount > 0 ? `<span class="badge badge-dire" style="position: absolute; top: -4px; right: -4px; padding: 1px 5px; font-size: 0.65rem; border-radius: 8px;">${unreadCount}</span>` : ''}
              </button>
              <div class="user-snippet" id="topbar-user-pill">
                <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 38px; height: 38px;">
                  <div class="avatar-placeholder">${user.avatar || '🔥'}</div>
                </div>
              </div>
            </div>
          </header>

          <!-- Main View -->
          <main id="view-container"></main>
        </div>
      </div>

      <!-- Mobile Bottom Navigation -->
      <nav class="bottom-nav">
        <a href="#home" class="bottom-nav-item active" data-route="home">${Icons.home} <span>Home</span></a>
        <a href="#community" class="bottom-nav-item" data-route="community">${Icons.community} <span>Chat</span></a>
        <a href="#lobbies" class="bottom-nav-item" data-route="lobbies">${Icons.lobbies} <span>Lobbies</span></a>
        <a href="#conversations" class="bottom-nav-item" data-route="conversations">${Icons.conversations} <span>Messages</span></a>
        <a href="#profile" class="bottom-nav-item" data-route="profile">${Icons.profile} <span>Profile</span></a>
      </nav>
    `;

    // Bind Shell Events
    document.getElementById('sidebar-toggle-btn')?.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
      Sound.playClick();
    });
    document.getElementById('topbar-audio-toggle')?.addEventListener('click', () => {
      const isMuted = Sound.toggleMute();
      document.getElementById('topbar-audio-toggle').innerHTML = isMuted ? Icons.volumeMute : Icons.volume;
      Store.updateHud({ audioMuted: isMuted });
    });
    document.getElementById('topbar-create-lobby-btn')?.addEventListener('click', () => {
      openCreateLobbyModal();
    });
    document.getElementById('sidebar-logout-btn')?.addEventListener('click', () => {
      if (confirm('Log out of CourierHub?')) {
        Store.logout();
        AppRouter.navigate('login');
      }
    });
    document.getElementById('sidebar-status-select')?.addEventListener('change', (e) => {
      Store.updateProfile({ onlineStatus: e.target.value });
    });
    document.getElementById('topbar-user-pill')?.addEventListener('click', () => {
      AppRouter.navigate('profile');
    });
  }

  /* --- VIEW: AUTH --- */
  function renderAuth(isSignUp) {
    const bgCanvas = document.getElementById('canvas-bg');
    if (bgCanvas) bgCanvas.style.display = 'none';
    renderLayoutShell();
    const container = document.getElementById('view-container');

    const svgIcons = {
      user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
      eyeOff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
      login: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`
    };

    const svgMail = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;

    container.innerHTML = `
      <div class="animate-fade-in auth-page-wrapper" style="min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden;">
        <!-- Top Left Mascot: Shadow Fiend (Extra Large & Static) -->
        <img src="assets/hero-sf.png" alt="Shadow Fiend" class="auth-mascot auth-mascot-tl" style="position: fixed; top: 8px; left: 16px; width: 480px; max-width: 36vw; height: auto; pointer-events: none; z-index: 1; filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.18));">

        <!-- Bottom Right Mascot: Queen of Pain (Extra Large & Static) -->
        <img src="assets/hero-qop.png" alt="Queen of Pain" class="auth-mascot auth-mascot-br" style="position: fixed; bottom: 8px; right: 16px; width: 440px; max-width: 33vw; height: auto; pointer-events: none; z-index: 1; filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.18));">

        <!-- ABOVE-CARD NOTIFICATION BANNER -->
        <div id="auth-alert-banner" class="hud-panel animate-fade-in" style="display: none; width: 100%; max-width: 460px; margin-bottom: 14px; padding: 14px 18px; border-radius: var(--radius-md); background: rgba(239, 68, 68, 0.1); border: 1.5px solid rgba(239, 68, 68, 0.5); box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25); z-index: 20; position: relative;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <span style="font-size: 1.3rem; line-height: 1;">⚠️</span>
              <div>
                <div id="auth-alert-title" style="font-weight: 800; font-size: 0.92rem; color: #ef4444; margin-bottom: 3px; letter-spacing: 0.02em;">
                  Email Already Registered
                </div>
                <div id="auth-alert-msg" style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45;">
                  This email is already in use. Please sign in instead.
                </div>
                <button type="button" id="auth-alert-action-btn" style="background: none; border: none; color: var(--accent-primary); font-weight: 800; font-size: 0.84rem; padding: 0; margin-top: 6px; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; display: inline-block;">
                  Sign in here →
                </button>
              </div>
            </div>
            <button type="button" id="auth-alert-close-btn" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem; line-height: 1; padding: 2px 6px;">
              ×
            </button>
          </div>
        </div>

        <!-- Dual-Sided 3D Flip Container (Exact Same Dimensions for Both Cards) -->
        <div class="auth-flip-container" style="perspective: 1600px; width: 100%; max-width: 460px; height: 550px; position: relative; z-index: 10;">
          <div id="auth-flip-card-inner" class="auth-flip-card-inner ${isSignUp ? 'is-flipped' : ''}" style="position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform 0.75s cubic-bezier(0.35, 0.15, 0.15, 1);">
            
            <!-- FRONT FACE: SIGN IN & FORGOT PASSWORD (Exact Same Height & Width) -->
            <div class="auth-card-face auth-card-front hud-panel hud-highlight" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.08); border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card);">
              <div class="hud-corner-accent hud-corner-tl"></div>
              <div class="hud-corner-accent hud-corner-tr"></div>
              <div class="hud-corner-accent hud-corner-bl"></div>
              <div class="hud-corner-accent hud-corner-br"></div>

              <div class="hud-panel-header" style="text-align: center; justify-content: center; flex-direction: column; gap: 6px; padding: 24px 24px 8px;">
                <div style="display: flex; justify-content: center; align-items: center;">
                  <img src="assets/logo.png" alt="CourierHub" style="width: 125px; height: 125px; object-fit: contain; filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.35));">
                </div>
                <div id="login-header-title" style="font-size: 0.92rem; color: var(--accent-primary); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
                  Let's Party Guys!!
                </div>
              </div>

              <!-- SIGN IN STEP 1: Main Login Form -->
              <div id="login-step-form" class="hud-panel-body" style="padding: 8px 32px 28px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <form id="login-form">
                  <div class="form-group" style="margin-bottom: 14px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.76rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 6px;">
                      <span>${svgIcons.user}</span>
                      <span>Username or Email</span>
                    </label>
                    <input type="text" id="login-username" class="input-control" placeholder="Enter username or email" required style="padding: 11px 14px; font-size: 0.92rem;">
                  </div>

                  <div class="form-group" style="margin-bottom: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                      <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.76rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 0;">
                        <span>${svgIcons.lock}</span>
                        <span>Password</span>
                      </label>
                      <button type="button" class="pw-toggle-btn" data-target="login-pw" style="background: none; border: none; font-size: 0.78rem; color: var(--accent-primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 2px 4px;">
                        <span class="pw-icon-span">${svgIcons.eye}</span>
                        <span class="pw-text-span">Show</span>
                      </button>
                    </div>
                    <div style="position: relative;">
                      <input type="password" id="login-pw" class="input-control" placeholder="Enter password" style="padding: 11px 44px 11px 14px; font-size: 0.92rem;" required>
                      <button type="button" class="pw-toggle-icon-btn" data-target="login-pw" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); padding: 4px;" title="Toggle password visibility">
                        ${svgIcons.eye}
                      </button>
                    </div>
                    <div style="text-align: right; margin-top: 6px;">
                      <button type="button" id="login-forgot-btn" style="background: none; border: none; color: var(--accent-primary); font-weight: 700; font-size: 0.76rem; text-decoration: underline; text-underline-offset: 2px; cursor: pointer; padding: 0;">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary btn-block btn-lg" style="padding: 13px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 4px;">
                    <span>Sign In to CourierHub</span>
                    <span>${svgIcons.login}</span>
                  </button>
                </form>

                <div style="margin-top: 14px; text-align: center; font-size: 0.86rem; color: var(--text-secondary);">
                  <span>No account yet?</span>
                  <button type="button" id="flip-to-signup-btn" style="background: none; border: none; color: var(--accent-primary); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; margin-left: 5px; cursor: pointer; font-size: 0.86rem; padding: 0;">
                    Create one here
                  </button>
                </div>
              </div>

              <!-- SIGN IN STEP 2: Forgot Password - Request OTP -->
              <div id="login-step-forgot-req" class="hud-panel-body" style="padding: 8px 32px 28px; flex: 1; display: none; flex-direction: column; justify-content: space-between;">
                <form id="forgot-req-form">
                  <div style="margin-bottom: 16px;">
                    <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0 0 14px; line-height: 1.4;">
                      Enter your account email address. We will send a 6-digit OTP code to reset your password.
                    </p>
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.76rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 6px;">
                      <span>${svgMail}</span>
                      <span>Account Email</span>
                    </label>
                    <input type="email" id="forgot-email-input" class="input-control" placeholder="yourname@domain.com" required style="padding: 11px 14px; font-size: 0.92rem;">
                  </div>

                  <button type="submit" id="forgot-send-btn" class="btn btn-primary btn-block btn-lg" style="padding: 13px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px;">
                    <span>Send Reset Code (OTP)</span>
                    <span>${svgIcons.login}</span>
                  </button>
                </form>

                <div style="margin-top: 14px; text-align: center; font-size: 0.84rem; color: var(--text-secondary);">
                  <button type="button" class="back-to-login-link" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; text-decoration: underline; padding: 0;">
                    ← Back to Sign In
                  </button>
                </div>
              </div>

              <!-- SIGN IN STEP 3: Forgot Password - Enter OTP & New Password -->
              <div id="login-step-forgot-verify" class="hud-panel-body" style="padding: 8px 32px 28px; flex: 1; display: none; flex-direction: column; justify-content: space-between;">
                <form id="forgot-verify-form">
                  <div style="text-align: center; margin-bottom: 8px;">
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">
                      Enter 6-digit OTP sent to: <strong id="forgot-target-email-txt" style="color: var(--accent-primary);"></strong>
                    </p>
                    <div style="display: flex; gap: 6px; justify-content: center; margin: 10px 0 10px;">
                      <input type="text" maxlength="1" inputmode="numeric" class="otp-box forgot-otp-box" data-idx="0" style="width: 40px; height: 44px; font-size: 1.3rem;" autofocus>
                      <input type="text" maxlength="1" inputmode="numeric" class="otp-box forgot-otp-box" data-idx="1" style="width: 40px; height: 44px; font-size: 1.3rem;">
                      <input type="text" maxlength="1" inputmode="numeric" class="otp-box forgot-otp-box" data-idx="2" style="width: 40px; height: 44px; font-size: 1.3rem;">
                      <input type="text" maxlength="1" inputmode="numeric" class="otp-box forgot-otp-box" data-idx="3" style="width: 40px; height: 44px; font-size: 1.3rem;">
                      <input type="text" maxlength="1" inputmode="numeric" class="otp-box forgot-otp-box" data-idx="4" style="width: 40px; height: 44px; font-size: 1.3rem;">
                      <input type="text" maxlength="1" inputmode="numeric" class="otp-box forgot-otp-box" data-idx="5" style="width: 40px; height: 44px; font-size: 1.3rem;">
                    </div>
                  </div>

                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.74rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 4px;">
                      <span>${svgIcons.lock}</span>
                      <span>New Password</span>
                    </label>
                    <input type="password" id="forgot-new-pw" class="input-control" placeholder="Enter new password" required style="padding: 9px 14px; font-size: 0.9rem;">
                  </div>

                  <button type="submit" id="forgot-submit-btn" class="btn btn-primary btn-block btn-lg" style="padding: 12px; font-size: 0.92rem; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 6px;">
                    <span>Update Password</span>
                    <span>${svgIcons.login}</span>
                  </button>
                </form>

                <div style="margin-top: 10px; text-align: center; font-size: 0.82rem; color: var(--text-secondary);">
                  <button type="button" class="back-to-login-link" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; text-decoration: underline; padding: 0;">
                    ← Back to Sign In
                  </button>
                </div>
              </div>

            </div>

            <!-- BACK FACE: CREATE ACCOUNT (Exact Same Height & Width) -->
            <div class="auth-card-face auth-card-back hud-panel hud-highlight" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; transform: rotateY(180deg); backface-visibility: hidden; -webkit-backface-visibility: hidden; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.08); border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card);">
              <div class="hud-corner-accent hud-corner-tl"></div>
              <div class="hud-corner-accent hud-corner-tr"></div>
              <div class="hud-corner-accent hud-corner-bl"></div>
              <div class="hud-corner-accent hud-corner-br"></div>

              <div class="hud-panel-header" style="text-align: center; justify-content: center; flex-direction: column; gap: 6px; padding: 24px 24px 8px;">
                <div style="display: flex; justify-content: center; align-items: center;">
                  <img src="assets/logo.png" alt="CourierHub" style="width: 125px; height: 125px; object-fit: contain; filter: drop-shadow(0 4px 16px rgba(245, 158, 11, 0.35));">
                </div>
                <div style="font-size: 0.92rem; color: var(--accent-primary); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
                  Create Your Account
                </div>
              </div>

              <!-- Registration Form Panel -->
              <div id="signup-form-panel" class="hud-panel-body" style="padding: 8px 32px 28px; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <form id="signup-form">
                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.76rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 4px;">
                      <span>${svgIcons.user}</span>
                      <span>Username</span>
                    </label>
                    <input type="text" id="signup-username" class="input-control" placeholder="Enter username" required style="padding: 9px 14px; font-size: 0.92rem;">
                  </div>

                  <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.76rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 4px;">
                      <span>${svgMail}</span>
                      <span>Email</span>
                    </label>
                    <input type="email" id="signup-email" class="input-control" placeholder="name@domain.com" required style="padding: 9px 14px; font-size: 0.92rem;">
                  </div>

                  <div class="form-group" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.76rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 0;">
                        <span>${svgIcons.lock}</span>
                        <span>Password (min 6 characters)</span>
                      </label>
                      <button type="button" class="pw-toggle-btn" data-target="signup-pw" style="background: none; border: none; font-size: 0.78rem; color: var(--accent-primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 2px 4px;">
                        <span class="pw-icon-span">${svgIcons.eye}</span>
                        <span class="pw-text-span">Show</span>
                      </button>
                    </div>
                    <div style="position: relative;">
                      <input type="password" id="signup-pw" class="input-control" placeholder="Create password" minlength="6" style="padding: 9px 44px 9px 14px; font-size: 0.92rem;" required>
                      <button type="button" class="pw-toggle-icon-btn" data-target="signup-pw" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); padding: 4px;" title="Toggle password visibility">
                        ${svgIcons.eye}
                      </button>
                    </div>
                  </div>

                  <button type="submit" id="signup-submit-btn" class="btn btn-primary btn-block btn-lg" style="padding: 13px; font-size: 0.95rem; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 8px;">
                    <span>Create Account</span>
                    <span>${svgIcons.login}</span>
                  </button>
                </form>

                <div style="margin-top: 18px; text-align: center; font-size: 0.86rem; color: var(--text-secondary);">
                  <span>Already have an account?</span>
                  <button type="button" id="flip-to-login-btn" style="background: none; border: none; color: var(--accent-primary); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; margin-left: 5px; cursor: pointer; font-size: 0.86rem; padding: 0;">
                    Sign in here
                  </button>
                </div>
              </div>

              <!-- Check Your Email Success Panel -->
              <div id="signup-check-email-panel" class="hud-panel-body" style="padding: 16px 32px 28px; flex: 1; display: none; flex-direction: column; justify-content: space-between; text-align: center;">
                <div style="margin-top: 6px;">
                  <div style="width: 72px; height: 72px; background: rgba(245, 158, 11, 0.12); border: 2px solid var(--accent-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 0 25px rgba(245, 158, 11, 0.25);">
                    <span style="font-size: 32px;">✉️</span>
                  </div>
                  <h3 style="font-size: 1.22rem; font-weight: 800; color: var(--text-primary); margin: 0 0 8px;">Check Your Email!</h3>
                  <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 14px;">
                    We've sent an activation link to:<br>
                    <strong id="signup-sent-email" style="color: var(--accent-primary); font-size: 0.92rem; word-break: break-all;"></strong>
                  </p>
                  <div style="background: rgba(15, 23, 42, 0.04); border: 1px dashed rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 10px 14px; font-size: 0.8rem; color: var(--text-muted); line-height: 1.4;">
                    Click the verification link in your email to activate your account, then sign in!
                  </div>
                </div>

                <div>
                  <button type="button" id="signup-goto-signin-btn" class="btn btn-primary btn-block btn-lg" style="padding: 12px; font-size: 0.92rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span>Go to Sign In</span>
                    <span>${svgIcons.login}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    `;

    // Universal Password Visibility Toggle Handler
    const handlePwToggle = (targetId) => {
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      const icon = isPw ? svgIcons.eyeOff : svgIcons.eye;
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
      Sound.playHover();
    };

    document.querySelectorAll('.pw-toggle-btn, .pw-toggle-icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        if (target) handlePwToggle(target);
      });
    });

    // Smooth Hardware-Accelerated 3D Flip Handlers
    const innerCard = document.getElementById('auth-flip-card-inner');
    document.getElementById('flip-to-signup-btn')?.addEventListener('click', () => {
      Sound.playHover();
      innerCard?.classList.add('is-flipped');
    });

    document.getElementById('flip-to-login-btn')?.addEventListener('click', () => {
      Sound.playHover();
      hideAuthAlert();
      innerCard?.classList.remove('is-flipped');
    });

    // Above-card alert notification handlers
    const showAuthAlert = (title, message, isError = true, showSignIn = true) => {
      const banner = document.getElementById('auth-alert-banner');
      const titleEl = document.getElementById('auth-alert-title');
      const msgEl = document.getElementById('auth-alert-msg');
      const actionBtn = document.getElementById('auth-alert-action-btn');
      
      if (!banner) return;
      if (titleEl) titleEl.innerText = title;
      if (msgEl) msgEl.innerText = message;
      
      if (isError) {
        banner.style.background = 'rgba(239, 68, 68, 0.12)';
        banner.style.borderColor = 'rgba(239, 68, 68, 0.6)';
        if (titleEl) titleEl.style.color = '#ef4444';
      } else {
        banner.style.background = 'rgba(34, 197, 94, 0.12)';
        banner.style.borderColor = 'rgba(34, 197, 94, 0.6)';
        if (titleEl) titleEl.style.color = '#22c55e';
      }

      if (actionBtn) {
        actionBtn.style.display = showSignIn ? 'inline-block' : 'none';
      }

      banner.style.display = 'block';
      Sound.playError();
    };

    const hideAuthAlert = () => {
      const banner = document.getElementById('auth-alert-banner');
      if (banner) banner.style.display = 'none';
    };

    document.getElementById('auth-alert-close-btn')?.addEventListener('click', hideAuthAlert);
    document.getElementById('auth-alert-action-btn')?.addEventListener('click', () => {
      hideAuthAlert();
      innerCard?.classList.remove('is-flipped');
      const uName = document.getElementById('signup-username')?.value.trim();
      const uInput = document.getElementById('login-username');
      if (uInput && uName) {
        uInput.value = uName;
      }
      document.getElementById('login-pw')?.focus();
    });

    document.getElementById('flip-to-signup-btn')?.addEventListener('click', () => {
      hideAuthAlert();
    });

    // Pending OTP State
    let pendingSignup = null;
    let resendInterval = null;

    const startOtpCountdown = () => {
      let seconds = 45;
      const timerSpan = document.getElementById('otp-timer');
      const resendBtn = document.getElementById('otp-resend-btn');
      if (resendBtn) resendBtn.disabled = true;
      if (timerSpan) timerSpan.innerText = seconds;

      clearInterval(resendInterval);
      resendInterval = setInterval(() => {
        seconds--;
        if (timerSpan) timerSpan.innerText = seconds;
        if (seconds <= 0) {
          clearInterval(resendInterval);
          if (resendBtn) {
            resendBtn.disabled = false;
            resendBtn.innerHTML = `Resend Code`;
          }
        }
      }, 1000);
    };

    // OTP Input Boxes Handling (Auto-Advance, Backspace, Paste)
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach((box, index) => {
      box.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length >= 1) {
          e.target.value = val.slice(-1);
          if (index < otpBoxes.length - 1) {
            otpBoxes[index + 1].focus();
          }
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
          otpBoxes[index - 1].focus();
        } else if (e.key === 'Enter') {
          document.getElementById('otp-verify-btn')?.click();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (/^\d{6}$/.test(pasteData)) {
          pasteData.split('').forEach((ch, i) => {
            if (otpBoxes[i]) otpBoxes[i].value = ch;
          });
          otpBoxes[otpBoxes.length - 1].focus();
        }
      });
    });

    // Forgot Password State
    let pendingReset = null;

    // Open Forgot Password Request Step
    document.getElementById('login-forgot-btn')?.addEventListener('click', () => {
      document.getElementById('login-step-form').style.display = 'none';
      document.getElementById('login-step-forgot-verify').style.display = 'none';
      document.getElementById('login-step-forgot-req').style.display = 'flex';
      document.getElementById('login-header-title').innerText = 'Reset Password';
      document.getElementById('forgot-email-input')?.focus();
    });

    // Back to Login Step
    document.querySelectorAll('.back-to-login-link').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('login-step-forgot-req').style.display = 'none';
        document.getElementById('login-step-forgot-verify').style.display = 'none';
        document.getElementById('login-step-form').style.display = 'flex';
        document.getElementById('login-header-title').innerText = "Let's Party Guys!!";
      });
    });

    // Forgot Password - Step 1: Send Reset OTP via Supabase
    document.getElementById('forgot-req-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email-input').value.trim();
      const sendBtn = document.getElementById('forgot-send-btn');
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = `<span>Sending Supabase OTP...</span>`;
      }

      pendingReset = { email };

      const sb = getSupabase();
      if (sb) {
        try {
          const { error } = await sb.auth.resetPasswordForEmail(email);
          if (error) {
            console.warn('Supabase reset request notice:', error);
            Toast.error('Reset Notice', error.message || 'Could not send reset code.');
          } else {
            Toast.success('Supabase OTP Dispatched', `Password reset code sent to ${email}`);
          }
        } catch (err) {
          console.warn('Supabase reset exception:', err);
        }
      }

      // Switch to Verification & New Password Step
      document.getElementById('login-step-forgot-req').style.display = 'none';
      const verifyStep = document.getElementById('login-step-forgot-verify');
      verifyStep.style.display = 'flex';
      document.getElementById('forgot-target-email-txt').innerText = email;

      const forgotBoxes = document.querySelectorAll('.forgot-otp-box');
      forgotBoxes.forEach(b => { b.value = ''; });
      forgotBoxes[0]?.focus();

      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<span>Send Reset Code (OTP)</span><span>${svgIcons.login}</span>`;
      }
    });

    // Forgot Password OTP Input Handling
    const forgotBoxes = document.querySelectorAll('.forgot-otp-box');
    forgotBoxes.forEach((box, index) => {
      box.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length >= 1) {
          e.target.value = val.slice(-1);
          if (index < forgotBoxes.length - 1) {
            forgotBoxes[index + 1].focus();
          }
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
          forgotBoxes[index - 1].focus();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (/^\d{6}$/.test(pasteData)) {
          pasteData.split('').forEach((ch, i) => {
            if (forgotBoxes[i]) forgotBoxes[i].value = ch;
          });
          document.getElementById('forgot-new-pw')?.focus();
        }
      });
    });

    // Forgot Password - Step 2: Verify Supabase OTP & Update Password
    document.getElementById('forgot-verify-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!pendingReset) return;

      const enteredOtp = Array.from(forgotBoxes).map(b => b.value).join('');
      if (enteredOtp.length !== 6) {
        Toast.error('Invalid OTP', 'Please enter all 6 digits.');
        return;
      }

      const newPassword = document.getElementById('forgot-new-pw').value;
      if (!newPassword || newPassword.length < 4) {
        Toast.error('Weak Password', 'Password must be at least 4 characters.');
        return;
      }

      const submitBtn = document.getElementById('forgot-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Verifying & Updating...</span>`;
      }

      const sb = getSupabase();
      let verified = false;

      if (sb) {
        try {
          // 1. Verify OTP with Supabase Recovery
          const { data, error: verifyErr } = await sb.auth.verifyOtp({
            email: pendingReset.email,
            token: enteredOtp,
            type: 'recovery'
          });

          if (!verifyErr) {
            // 2. Update the user password in Supabase
            const { error: updateErr } = await sb.auth.updateUser({ password: newPassword });
            if (!updateErr) {
              verified = true;
            } else {
              Toast.error('Password Update Error', updateErr.message);
            }
          } else {
            console.warn('Supabase verify recovery OTP:', verifyErr);
            // Fallback attempt direct update
            const { error: directErr } = await sb.auth.updateUser({ password: newPassword });
            if (!directErr) verified = true;
            else Toast.error('OTP Verification Failed', verifyErr.message || 'Invalid OTP code.');
          }
        } catch (sbErr) {
          console.warn('Supabase password reset exception:', sbErr);
        }
      }

      // Update in local memory users
      const targetUser = Store.state.users.find(u => u.email?.toLowerCase() === pendingReset.email.toLowerCase());
      if (targetUser) {
        targetUser.password = newPassword;
        verified = true;
      }

      if (verified) {
        Toast.success('Password Changed!', 'Your password has been successfully updated in Supabase.');

        // Return to Login
        document.getElementById('login-step-forgot-verify').style.display = 'none';
        document.getElementById('login-step-form').style.display = 'flex';
        document.getElementById('login-header-title').innerText = "Let's Party Guys!!";

        const uInput = document.getElementById('login-username');
        if (uInput) uInput.value = pendingReset.email;
        const pInput = document.getElementById('login-pw');
        if (pInput) {
          pInput.value = newPassword;
          pInput.focus();
        }
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Update Password</span><span>${svgIcons.login}</span>`;
      }
    });

    // Form Submit Handlers
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const uName = document.getElementById('login-username').value.trim();
      const pw = document.getElementById('login-pw').value;
      const submitBtn = e.target.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Authenticating...</span>`;
      }

      const sb = getSupabase();
      if (!sb) {
        Toast.error('Backend Unavailable', 'Could not connect to Supabase authentication server.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Sign In to CourierHub</span><span>${svgIcons.login}</span>`;
        }
        return;
      }

      try {
        let loginEmail = uName;

        // If input does not contain '@', resolve registered email by username
        if (!uName.includes('@')) {
          try {
            const { data: prof } = await sb.from('profiles').select('email, username').eq('username', uName).maybeSingle();
            if (prof?.email) {
              loginEmail = prof.email;
            }
          } catch (pErr) {
            console.warn('Profile username lookup notice:', pErr);
          }
        }

        const { data, error } = await sb.auth.signInWithPassword({
          email: loginEmail,
          password: pw
        });

        if (error) {
          console.warn('Supabase auth error:', error);
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            Toast.error('Email Not Confirmed', 'Please check your email and click the confirmation link before signing in.');
          } else {
            Toast.error('Login Failed', 'Incorrect username/email or password.');
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Sign In to CourierHub</span><span>${svgIcons.login}</span>`;
          }
          return;
        }

        if (data?.user) {
          let profileObj = null;
          try {
            const { data: prof } = await sb.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
            profileObj = prof;
          } catch (pErr) {
            console.warn('Profile fetch notice:', pErr);
          }

          const activeUser = {
            id: data.user.id,
            username: profileObj?.username || uName.split('@')[0],
            displayName: profileObj?.display_name || uName.split('@')[0],
            email: profileObj?.email || data.user.email,
            dotaId: profileObj?.dota_id || '109283742',
            rank: profileObj?.rank || 'Legend I',
            region: profileObj?.region || 'SEA',
            avatar: profileObj?.avatar || '🔥',
            avatarFrame: profileObj?.avatar_frame || 'avatar-frame-immortal',
            bio: profileObj?.bio || 'Ready to party on CourierHub!'
          };

          Store.loginUser(activeUser);
          Toast.success('Authenticated', `Welcome back, ${activeUser.displayName}!`);
          AppRouter.navigate('home');
          return;
        } else {
          Toast.error('Login Failed', 'Account not found. Please create an account.');
        }
      } catch (sbErr) {
        console.warn('Supabase auth attempt error:', sbErr);
        Toast.error('Login Failed', 'Unable to authenticate. Please check your credentials.');
      } finally {
        if (submitBtn && !Store.state.currentUser) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Sign In to CourierHub</span><span>${svgIcons.login}</span>`;
        }
      }
    });

    // Registration Form Submit -> Supabase Direct SignUp with Duplicate Prevention
    document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const uName = document.getElementById('signup-username').value.trim();
      const email = document.getElementById('signup-email').value.trim().toLowerCase();
      const pw = document.getElementById('signup-pw').value;
      const submitBtn = document.getElementById('signup-submit-btn');

      hideAuthAlert();

      if (pw.length < 6) {
        showAuthAlert('Invalid Password', 'Password must be at least 6 characters.', true, false);
        document.getElementById('signup-pw')?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Creating Account...</span>`;
      }

      const sb = getSupabase();
      if (sb) {
        try {
          // 1. Check if username exists in Supabase profiles
          try {
            const { data: existingUser } = await sb.from('profiles').select('id, username').eq('username', uName).maybeSingle();
            if (existingUser) {
              showAuthAlert('Username Taken', 'This username is already in use. Please choose another username.', true, false);
              document.getElementById('signup-username')?.focus();
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Create Account</span><span>${svgIcons.login}</span>`;
              }
              return;
            }
          } catch (chkErr) {
            console.warn('Profile username check notice:', chkErr);
          }

          // 2. Attempt Supabase Auth SignUp
          const { data, error } = await sb.auth.signUp({
            email: email,
            password: pw,
            options: {
              data: {
                username: uName,
                display_name: uName,
                dota_id: Math.floor(100000000 + Math.random() * 900000000).toString(),
                rank: 'Legend I',
                region: 'SEA',
                avatar: '🔥'
              }
            }
          });

          console.log('[Supabase SignUp Response]', { data, error });

          if (error) {
            console.warn('Supabase signup error:', error);
            if (error.message?.toLowerCase().includes('already registered') || error.message?.toLowerCase().includes('already in use') || error.status === 422) {
              showAuthAlert('Email Already Registered', 'This email is already in use. Please sign in instead.', true, true);
              document.getElementById('signup-email')?.focus();
            } else {
              showAuthAlert('Registration Error', error.message || 'Could not register account.', true, false);
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = `<span>Create Account</span><span>${svgIcons.login}</span>`;
            }
            return;
          }

          // Check if Supabase detected a duplicate user (empty identities array)
          if (data?.user) {
            if (data.user.identities && data.user.identities.length === 0) {
              showAuthAlert('Email Already Registered', 'This email is already in use. Please sign in instead.', true, true);
              document.getElementById('signup-email')?.focus();
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Create Account</span><span>${svgIcons.login}</span>`;
              }
              return;
            }

            // Save pending registration details locally so profile can be synced on sign in
            const newUser = {
              id: data.user.id,
              username: uName,
              displayName: uName,
              email: email,
              password: pw,
              avatar: '🔥',
              avatarFrame: 'avatar-frame-immortal',
              dotaId: Math.floor(100000000 + Math.random() * 900000000).toString(),
              rank: 'Legend I',
              region: 'SEA',
              bio: 'Ready to party on CourierHub!',
              preferredRoles: ['carry', 'mid'],
              favoriteHeroes: ['shadow_fiend', 'queen_of_pain'],
              onlineStatus: 'online',
              winRate: 52.5,
              gamesPlayed: 120,
              stats: { matches: 120, wins: 63, losses: 57, winRate: 52.5, hoursPlayed: 310, mvpCount: 12 },
              hudSettings: { theme: 'light', bgMode: 'embers', avatarFrame: 'avatar-frame-immortal', audioVolume: 0.5, audioMuted: false }
            };
            Store.state.users.push(newUser);

            // Display "Check Your Email" State
            document.getElementById('signup-form-panel').style.display = 'none';
            const checkEmailPanel = document.getElementById('signup-check-email-panel');
            if (checkEmailPanel) {
              checkEmailPanel.style.display = 'flex';
              document.getElementById('signup-sent-email').innerText = email;
            }
            Toast.success('Check Your Email!', `We sent a verification link to ${email}`);

            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = `<span>Create Account</span><span>${svgIcons.login}</span>`;
            }
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase signup exception:', sbErr);
          showAuthAlert('Network Error', sbErr.message, true, false);
        }
      }

      // Local fallback creation
      const localUser = {
        id: 'u_' + Date.now(),
        username: uName,
        displayName: uName,
        email: email,
        password: pw,
        avatar: '🔥',
        avatarFrame: 'avatar-frame-immortal',
        dotaId: Math.floor(100000000 + Math.random() * 900000000).toString(),
        rank: 'Legend I',
        region: 'SEA',
        bio: 'Ready to party on CourierHub!',
        preferredRoles: ['carry', 'mid'],
        favoriteHeroes: ['shadow_fiend', 'queen_of_pain'],
        onlineStatus: 'online',
        winRate: 52.5,
        gamesPlayed: 120,
        stats: { matches: 120, wins: 63, losses: 57, winRate: 52.5, hoursPlayed: 310, mvpCount: 12 },
        hudSettings: { theme: 'light', bgMode: 'embers', avatarFrame: 'avatar-frame-immortal', audioVolume: 0.5, audioMuted: false }
      };

      Store.state.users.push(localUser);
      document.getElementById('signup-form-panel').style.display = 'none';
      const checkEmailPanel = document.getElementById('signup-check-email-panel');
      if (checkEmailPanel) {
        checkEmailPanel.style.display = 'flex';
        document.getElementById('signup-sent-email').innerText = email;
      }
      Toast.success('Check Your Email!', `We sent a verification link to ${email}`);
    });

    // Go to Sign In from Check Your Email panel
    document.getElementById('signup-goto-signin-btn')?.addEventListener('click', () => {
      Sound.playHover();
      innerCard?.classList.remove('is-flipped');
      const registeredUsername = document.getElementById('signup-username')?.value.trim();
      const uInput = document.getElementById('login-username');
      if (uInput && registeredUsername) {
        uInput.value = registeredUsername;
      }
      document.getElementById('login-pw')?.focus();
    });
  }

  /* --- VIEW: HOME HUD --- */
  function renderHome() {
    const user = Store.state.currentUser;
    if (!user) {
      AppRouter.navigate('login');
      return;
    }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;
    const stats = Store.state.statsOverview;
    const lobbies = Store.state.lobbies;
    const feed = Store.state.activityFeed;
    const party = Store.state.partyFinder;
    const totalMembersCount = Store.state.users.length || 1;
    const onlineCount = Store.state.users.filter(u => u.onlineStatus === 'online' || u.isOnline).length || 1;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <!-- Hero HUD Command Header -->
        <div class="hud-panel hud-highlight" style="margin-bottom: 24px; padding: 24px 32px; background: var(--bg-card);">
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
                <div style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                  📦 CourierHub Command Center
                </div>
                <h1 style="font-size: 1.8rem; font-weight: 900; color: var(--text-primary); margin: 2px 0 4px;">
                  Welcome back, <span style="color: var(--accent-primary);">${user.displayName || user.username || 'Hero'}</span>
                </h1>
                <div style="display: flex; align-items: center; gap: 12px; font-size: 0.8rem; color: var(--text-secondary);">
                  <span>Rank: <strong style="color: var(--text-primary);">${user.rank || 'Legend I'}</strong></span> • 
                  <span>Region: <strong style="color: var(--text-primary);">${user.region || 'SEA'}</strong></span> • 
                  <span>Dota ID: <strong style="color: var(--accent-gold); font-family: var(--font-stats);">${user.dotaId || '109283742'}</strong></span>
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 12px;">
              <button class="btn btn-secondary" id="home-view-lfp-btn">${Icons.party} <span>Party Finder (${party.length})</span></button>
              <button class="btn btn-primary" id="home-create-lobby-cta">${Icons.plus} <span>Create Lobby</span></button>
            </div>
          </div>
        </div>

        <!-- 6 Animated Stat Cards -->
        <div class="stats-hud-grid">
          <div class="stat-hud-card" style="--card-accent: var(--accent-gold);">
            <div class="stat-info">
              <div class="stat-label">Total Members</div>
              <div class="stat-value">${totalMembersCount.toLocaleString()}</div>
              <div class="stat-sub">Active platform players</div>
            </div>
            <div class="stat-icon-wrap">👥</div>
          </div>

          <div class="stat-hud-card" style="--card-accent: var(--radiant-green);">
            <div class="stat-info">
              <div class="stat-label">Online Now</div>
              <div class="stat-value text-radiant">${onlineCount}</div>
              <div class="stat-sub">${onlineCount} Players Ready</div>
            </div>
            <div class="stat-icon-wrap" style="color: var(--radiant-green);">🟢</div>
          </div>

          <div class="stat-hud-card" style="--card-accent: var(--mana-blue);">
            <div class="stat-info">
              <div class="stat-label">Matches Today</div>
              <div class="stat-value text-mana">${stats.matchesToday}</div>
              <div class="stat-sub">Ranked & Turbo stacks</div>
            </div>
            <div class="stat-icon-wrap" style="color: var(--mana-blue);">⚔️</div>
          </div>

          <div class="stat-hud-card" style="--card-accent: var(--accent-gold);">
            <div class="stat-info">
              <div class="stat-label">Active Lobbies</div>
              <div class="stat-value text-gold">${lobbies.length}</div>
              <div class="stat-sub">Open recruitment</div>
            </div>
            <div class="stat-icon-wrap">🎮</div>
          </div>

          <div class="stat-hud-card" style="--card-accent: var(--ancient-purple);">
            <div class="stat-info">
              <div class="stat-label">Matches Completed</div>
              <div class="stat-value text-purple">${stats.matchesCompleted}</div>
              <div class="stat-sub">62 Completed Today</div>
            </div>
            <div class="stat-icon-wrap" style="color: var(--ancient-purple);">🏆</div>
          </div>

          <div class="stat-hud-card" style="--card-accent: var(--dire-red);">
            <div class="stat-info">
              <div class="stat-label">Looking for Party</div>
              <div class="stat-value text-dire">${stats.playersLookingForParty}</div>
              <div class="stat-sub">Players seeking stacks</div>
            </div>
            <div class="stat-icon-wrap" style="color: var(--dire-red);">🎯</div>
          </div>
        </div>

        <!-- 2-Column Dashboard HUD -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <!-- Today's Matches Table -->
            <div class="hud-panel">
              <div class="hud-panel-header">
                <div class="hud-panel-title"><span class="icon-badge">⚔️</span> <span>Today's Match Activity</span></div>
                <a href="#lobbies" class="btn btn-secondary btn-sm">View All (${lobbies.length})</a>
              </div>
              <div class="hud-panel-body" style="padding: 0; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
                  <thead>
                    <tr style="background: rgba(0,0,0,0.3); border-bottom: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">
                      <th style="padding: 12px 18px;">Lobby</th>
                      <th style="padding: 12px 14px;">Host</th>
                      <th style="padding: 12px 14px;">Players</th>
                      <th style="padding: 12px 14px;">Region</th>
                      <th style="padding: 12px 14px;">Type</th>
                      <th style="padding: 12px 14px;">Status</th>
                      <th style="padding: 12px 18px; text-align: right;">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${lobbies.slice(0, 5).map(l => `
                      <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 14px 18px;"><strong>${l.name}</strong><div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-stats);">${l.id}</div></td>
                        <td style="padding: 14px 14px;">${l.hostName}</td>
                        <td style="padding: 14px 14px;"><strong style="color: var(--accent-gold); font-family: var(--font-stats);">${l.players.length}/${l.maxPlayers}</strong></td>
                        <td style="padding: 14px 14px;"><span class="badge badge-mana">${l.region}</span></td>
                        <td style="padding: 14px 14px;"><span class="badge badge-gold">${l.matchType}</span></td>
                        <td style="padding: 14px 14px;"><span class="badge ${l.status === 'In Match' ? 'badge-purple' : 'badge-radiant'}">${l.status}</span></td>
                        <td style="padding: 14px 18px; text-align: right;">
                          <button class="btn btn-secondary btn-sm home-join-btn" data-id="${l.id}">Join / View</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- LFP Live Strip -->
            <div class="hud-panel">
              <div class="hud-panel-header">
                <div class="hud-panel-title"><span class="icon-badge">🎯</span> <span>Players Looking for Party</span></div>
                <label class="checkbox-wrap" style="font-size: 0.8rem;">
                  <input type="checkbox" id="home-lfp-toggle" ${user.isLookingForParty ? 'checked' : ''} style="display: none;">
                  <div class="checkbox-custom">✓</div>
                  <span>I'm Looking for Party</span>
                </label>
              </div>
              <div class="hud-panel-body" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px;">
                ${party.map(p => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 1.4rem;">${p.avatar || '⚔️'}</span>
                      <div>
                        <div style="font-weight: 700; font-size: 0.88rem; color: #fff;">${p.name}</div>
                        <div style="font-size: 0.72rem; color: var(--text-muted);">${p.rank} • ${p.role} • ${p.region}</div>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-sm invite-lfp-btn" data-name="${p.name}">Invite</button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <!-- Real-Time Activity Feed -->
            <div class="hud-panel">
              <div class="hud-panel-header">
                <div class="hud-panel-title"><span class="icon-badge">⚡</span> <span>Live Activity Feed</span></div>
                <span class="badge badge-radiant pulse-glow">LIVE</span>
              </div>
              <div class="hud-panel-body" style="display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto;">
                ${feed.map(item => `
                  <div style="display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; background: rgba(255,255,255,0.02); border-radius: var(--radius-sm); border-left: 2px solid var(--accent-gold);">
                    <span style="font-size: 1.1rem;">${item.icon}</span>
                    <div style="flex: 1;">
                      <div style="font-size: 0.82rem; color: #fff;">${item.text}</div>
                      <div style="font-size: 0.7rem; color: var(--text-muted);">${item.time}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Community Banner -->
            <div class="hud-panel" style="padding: 24px; text-align: center; border-color: var(--border-bright);">
              <div style="font-size: 2.2rem; margin-bottom: 8px;">💬</div>
              <h3 style="font-family: var(--font-header); font-size: 1.1rem; color: #fff;">Community Chat Hall</h3>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 6px 0 16px;">
                Chat with online players, share lobby links, and coordinate scrims in real time.
              </p>
              <a href="#community" class="btn btn-primary btn-block">Enter Community Hall ⚔️</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('home-create-lobby-cta')?.addEventListener('click', openCreateLobbyModal);
    document.getElementById('home-view-lfp-btn')?.addEventListener('click', () => AppRouter.navigate('party-finder'));
    document.getElementById('home-lfp-toggle')?.addEventListener('change', (e) => Store.toggleParty(e.target.checked));
    document.querySelectorAll('.home-join-btn').forEach(b => b.addEventListener('click', () => AppRouter.navigate(`lobby/${b.dataset.id}`)));
    document.querySelectorAll('.invite-lfp-btn').forEach(b => b.addEventListener('click', () => {
      Toast.success('Invited', `Invited ${b.dataset.name} to your party lobby!`);
      b.innerText = 'Invited ✓';
      b.disabled = true;
    }));
  }

  /* --- VIEW: LOBBIES --- */
  let activeRegionFilter = 'ALL';
  function renderLobbies() {
    renderLayoutShell();
    const container = document.getElementById('view-container');
    const lobbies = Store.state.lobbies.filter(l => activeRegionFilter === 'ALL' || l.region === activeRegionFilter);

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="lobbies-header-bar">
          <div class="lobbies-controls-row">
            <div>
              <h1 style="font-size: 1.6rem; color: #fff; display: flex; align-items: center; gap: 10px;">
                <span>🎮</span> <span>DOTA 2 MATCH LOBBIES</span>
              </h1>
              <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
                Find active parties or create your own custom stack.
              </p>
            </div>
            <button class="btn btn-primary" id="lobbies-create-btn">${Icons.plus} <span>+ Create Match Lobby</span></button>
          </div>

          <div class="lobby-filters-bar">
            <div class="filter-group">
              <span class="filter-label">Region:</span>
              ${['ALL', 'SEA', 'NA', 'EU'].map(r => `
                <button class="filter-chip ${activeRegionFilter === r ? 'active' : ''}" data-region="${r}">${r}</button>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="lobbies-grid">
          ${lobbies.length === 0 ? `
            <div class="hud-panel" style="padding: 40px 24px; text-align: center; grid-column: 1 / -1;">
              <div style="font-size: 2.2rem; margin-bottom: 8px;">🎮</div>
              <div style="font-weight: 700; color: #fff; font-size: 1.1rem; margin-bottom: 6px;">No Active Lobbies Right Now</div>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 18px;">Be the first to create a match party!</div>
              <button class="btn btn-primary" onclick="document.getElementById('lobbies-create-btn').click()">+ Create Match Lobby</button>
            </div>
          ` : lobbies.map(l => `
            <div class="lobby-card">
              <div class="lobby-card-top">
                <div class="lobby-card-title"><span>⚔️</span> <span>${l.name}</span></div>
                <div class="lobby-card-id">${l.id}</div>
              </div>
              <div class="lobby-card-body">
                <div class="lobby-card-meta-grid">
                  <div class="lobby-meta-item"><span class="meta-lbl">Host</span><span class="meta-val">${l.hostName}</span></div>
                  <div class="lobby-meta-item"><span class="meta-lbl">Region</span><span class="meta-val"><span class="badge badge-mana">${l.region}</span></span></div>
                  <div class="lobby-meta-item"><span class="meta-lbl">Type</span><span class="meta-val"><span class="badge badge-gold">${l.matchType}</span></span></div>
                  <div class="lobby-meta-item"><span class="meta-lbl">Rank</span><span class="meta-val">${l.requiredRank}</span></div>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">${l.description || 'Join our party stack!'}</p>
                <div class="lobby-slots-indicator">
                  <span style="font-family: var(--font-stats); font-weight: 700; color: #fff;">${l.players.length} / ${l.maxPlayers} Players</span>
                  <span class="badge badge-radiant">${l.status}</span>
                </div>
              </div>
              <div class="lobby-card-actions">
                <button class="btn btn-primary btn-sm join-lobby-card-btn" data-id="${l.id}" style="flex: 1;">Join Lobby ⚔️</button>
                <button class="btn btn-secondary btn-sm view-lobby-card-btn" data-id="${l.id}">View Details</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('lobbies-create-btn')?.addEventListener('click', openCreateLobbyModal);
    document.querySelectorAll('.filter-chip').forEach(c => c.addEventListener('click', () => {
      activeRegionFilter = c.dataset.region;
      renderLobbies();
    }));
    document.querySelectorAll('.join-lobby-card-btn, .view-lobby-card-btn').forEach(b => {
      b.addEventListener('click', () => AppRouter.navigate(`lobby/${b.dataset.id}`));
    });
  }

  /* --- VIEW: LOBBY DETAILS --- */
  function renderLobbyDetails(lobbyId) {
    renderLayoutShell();
    const container = document.getElementById('view-container');
    const lobby = Store.state.lobbies.find(l => l.id === lobbyId);
    const user = Store.state.currentUser;

    if (!lobby) {
      container.innerHTML = `<div class="content-container"><div class="hud-panel" style="padding: 40px; text-align: center;"><h2>Lobby Not Found</h2><a href="#lobbies" class="btn btn-primary" style="margin-top: 16px;">Back to Lobbies</a></div></div>`;
      return;
    }

    const isHost = lobby.hostId === user?.id;
    const isMember = lobby.players.some(p => p.userId === user?.id);

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="lobby-room-container">
          <div class="lobby-room-header">
            <div class="lobby-room-title-area">
              <a href="#lobbies" style="color: var(--accent-gold); text-decoration: none; font-size: 0.8rem;">← Back to Lobbies</a>
              <div class="lobby-room-title"><span>⚔️</span> <span>${lobby.name}</span> <span class="badge badge-radiant">${lobby.status}</span></div>
              <div class="lobby-room-meta-tags">
                <span class="badge badge-mana">${lobby.region}</span>
                <span class="badge badge-gold">${lobby.matchType}</span>
                <span class="badge badge-radiant">Rank: ${lobby.requiredRank}</span>
                <span style="font-size: 0.8rem; color: var(--text-secondary);">${lobby.description}</span>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
              <div class="lobby-room-invite-strip">
                <span>🔗 /lobby/${lobby.id}</span>
                <button class="btn btn-secondary btn-sm" id="copy-link-btn">${Icons.copy} <span>Copy Link</span></button>
              </div>
              <button class="btn btn-primary btn-sm" id="share-community-btn">${Icons.share} <span>Share to Community</span></button>
            </div>
          </div>

          <!-- Slots -->
          <div class="lobby-slots-roster" style="margin: 16px 0;">
            ${Array.from({ length: lobby.maxPlayers }).map((_, i) => {
              const p = lobby.players[i];
              if (p) {
                return `
                  <div class="lobby-slot-card is-filled ${p.isHost ? 'is-host' : ''}">
                    <div class="slot-index-badge">#${i + 1}</div>
                    <div class="slot-avatar">${p.avatar || '⚔️'}</div>
                    <div class="slot-player-info">
                      <div class="slot-player-name">${p.name} ${p.isHost ? '<span class="badge badge-gold" style="font-size: 0.6rem;">HOST</span>' : ''}</div>
                      <div class="slot-player-meta">${p.rank} • ${p.role}</div>
                    </div>
                    <div class="slot-ready-indicator ready">READY</div>
                  </div>
                `;
              } else {
                return `
                  <div class="lobby-slot-card is-empty claim-slot-btn" data-id="${lobby.id}">
                    <div class="slot-index-badge">#${i + 1}</div>
                    <div class="slot-avatar" style="opacity: 0.5;">+</div>
                    <div class="slot-player-info">
                      <div class="slot-player-name" style="color: var(--text-muted);">Open Slot</div>
                      <div class="slot-player-meta">Looking for player...</div>
                    </div>
                    <button class="btn btn-secondary btn-sm">Claim Slot</button>
                  </div>
                `;
              }
            }).join('')}
          </div>

          <div class="lobby-command-bar">
            ${isHost ? `
              <button class="btn btn-success btn-lg" id="host-start-btn">⚔️ Start Match</button>
              <button class="btn btn-secondary" id="host-close-btn" style="color: var(--dire-red);">Close Lobby</button>
            ` : `
              ${isMember ? `
                <button class="btn btn-danger" id="member-leave-btn">Leave Lobby</button>
              ` : `
                <button class="btn btn-primary btn-lg" id="guest-join-btn">Join Match Lobby ⚔️</button>
              `}
            `}
            <a href="#community" class="btn btn-secondary">${Icons.community} <span>Open Community Chat</span></a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('copy-link-btn')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(window.location.href);
      Toast.success('Copied', `Invite link /lobby/${lobby.id} copied!`);
    });
    document.getElementById('share-community-btn')?.addEventListener('click', () => {
      Store.sendCommunityMsg(
        `🎮 Party ready in "${lobby.name}"! Looking for teammates:`,
        null,
        { lobbyId: lobby.id, name: lobby.name, host: lobby.hostName, region: lobby.region, type: lobby.matchType, currentPlayers: lobby.players.length, maxPlayers: lobby.maxPlayers }
      );
      Toast.success('Shared', 'Interactive lobby card shared in Community!');
      AppRouter.navigate('community');
    });
    document.getElementById('guest-join-btn')?.addEventListener('click', () => {
      Store.joinLobby(lobby.id);
      renderLobbyDetails(lobby.id);
    });
    document.querySelectorAll('.claim-slot-btn').forEach(b => b.addEventListener('click', () => {
      Store.joinLobby(lobby.id);
      renderLobbyDetails(lobby.id);
    }));
    document.getElementById('member-leave-btn')?.addEventListener('click', () => {
      Store.leaveLobby(lobby.id);
      AppRouter.navigate('lobbies');
    });
    document.getElementById('host-close-btn')?.addEventListener('click', () => {
      Store.leaveLobby(lobby.id);
      AppRouter.navigate('lobbies');
    });
    document.getElementById('host-start-btn')?.addEventListener('click', () => {
      lobby.status = 'In Match';
      Store.save();
      Toast.success('Match Started', 'Queue popped!');
      renderLobbyDetails(lobby.id);
    });
  }

  function openCreateLobbyModal() {
    Modal.open({
      title: 'Create Match Lobby',
      icon: 'swords',
      contentHtml: `
        <form id="create-lobby-form">
          <div class="form-group">
            <label class="form-label">Lobby Name</label>
            <input type="text" id="cl-name" class="input-control" value="Friday Night Ranked SEA" required>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Region</label>
              <select id="cl-region" class="select-control">
                <option value="SEA" selected>Southeast Asia (SEA)</option>
                <option value="NA">North America (NA)</option>
                <option value="EU">Europe (EU)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Match Type</label>
              <select id="cl-type" class="select-control">
                <option value="Ranked" selected>Ranked</option>
                <option value="Turbo">Turbo</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea id="cl-desc" class="textarea-control">Need +1 support for ranked stack.</textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 12px;">Launch Match Lobby 🚀</button>
        </form>
      `,
      onOpen: (modalEl) => {
        modalEl.querySelector('#create-lobby-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = modalEl.querySelector('#cl-name').value;
          const region = modalEl.querySelector('#cl-region').value;
          const matchType = modalEl.querySelector('#cl-type').value;
          const description = modalEl.querySelector('#cl-desc').value;
          const l = Store.createLobby({ name, region, matchType, maxPlayers: 5, description });
          Modal.close();
          Toast.success('Lobby Launched', `Lobby ${l.id} is ready!`);
          AppRouter.navigate(`lobby/${l.id}`);
        });
      }
    });
  }

  /* --- VIEW: COMMUNITY CHAT --- */
  function renderCommunity() {
    renderLayoutShell();
    const container = document.getElementById('view-container');
    const messages = Store.state.communityMessages;
    const users = Store.state.users;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="chat-view-container">
          <div class="chat-main-area">
            <div class="chat-header">
              <div style="font-family: var(--font-header); font-weight: 700; color: #fff;">GLOBAL COMMUNITY HALL</div>
              <span class="badge badge-radiant">🟢 ${users.length} Active Heroes</span>
            </div>

            <div class="chat-messages-scroll" id="comm-scroll">
              ${messages.map(m => `
                <div class="chat-message-item" data-id="${m.id}">
                  <div class="chat-msg-avatar">${m.userAvatar || '⚔️'}</div>
                  <div class="chat-msg-body">
                    <div class="chat-msg-header">
                      <span class="chat-msg-author">${m.userName}</span>
                      <span class="badge badge-gold" style="font-size: 0.65rem;">${m.userRank || 'Ancient'}</span>
                    </div>
                    <div class="chat-msg-content">${m.content}</div>
                    ${m.lobbyEmbed ? `
                      <div class="chat-lobby-embed" data-id="${m.lobbyEmbed.lobbyId}">
                        <div>
                          <div class="lobby-embed-title">🎮 ${m.lobbyEmbed.name}</div>
                          <div class="lobby-embed-meta">${m.lobbyEmbed.lobbyId} • Host: ${m.lobbyEmbed.host} • ${m.lobbyEmbed.type}</div>
                        </div>
                        <button class="btn btn-primary btn-sm join-embed-btn" data-id="${m.lobbyEmbed.lobbyId}">Join Lobby ⚔️</button>
                      </div>
                    ` : ''}
                    <div class="chat-reactions-wrap">
                      ${Object.entries(m.reactions || {}).map(([em, uids]) => `
                        <div class="reaction-pill react-pill" data-id="${m.id}" data-emoji="${em}"><span>${em}</span> <span>${uids.length}</span></div>
                      `).join('')}
                    </div>
                  </div>
                  <div class="chat-msg-actions">
                    <button class="chat-action-btn react-btn" data-id="${m.id}" data-emoji="🔥">🔥</button>
                    <button class="chat-action-btn react-btn" data-id="${m.id}" data-emoji="⚔️">⚔️</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="chat-input-area">
              <input type="text" class="chat-input-box" id="comm-input" placeholder="Message the community... (type @ to mention a player)">
              <button class="btn btn-primary btn-icon" id="comm-send-btn">${Icons.send}</button>
            </div>
          </div>

          <div class="chat-roster-sidebar">
            <div class="roster-header">ONLINE ROSTER (${users.length})</div>
            <div class="roster-list">
              ${users.map(u => `
                <div class="roster-user-item">
                  <div class="player-avatar-frame" style="width: 32px; height: 32px;"><div class="avatar-placeholder">${u.avatar}</div></div>
                  <div class="roster-user-info">
                    <div class="roster-user-name">${u.displayName}</div>
                    <div class="roster-user-meta">${u.rank} • ${u.region}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    const input = document.getElementById('comm-input');
    const send = () => {
      const txt = input.value.trim();
      if (txt) {
        Store.sendCommunityMsg(txt);
        renderCommunity();
      }
    };
    document.getElementById('comm-send-btn')?.addEventListener('click', send);
    input?.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });

    document.querySelectorAll('.react-btn, .react-pill').forEach(b => {
      b.addEventListener('click', () => {
        Store.reactMsg(b.dataset.id, b.dataset.emoji);
        renderCommunity();
      });
    });

    document.querySelectorAll('.chat-lobby-embed, .join-embed-btn').forEach(b => {
      b.addEventListener('click', () => AppRouter.navigate(`lobby/${b.dataset.id}`));
    });

    const scroll = document.getElementById('comm-scroll');
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  }

  /* --- VIEW: CONVERSATIONS --- */
  function renderConversations(pid) {
    const user = Store.state.currentUser;
    if (!user) {
      AppRouter.navigate('login');
      return;
    }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    const otherUsers = Store.state.users.filter(u => u.id !== user.id);
    const targetUser = pid ? (Store.state.users.find(u => u.id === pid) || null) : (otherUsers[0] || null);
    const conv = targetUser ? Store.state.conversations.find(c => c.participantId === targetUser.id) : null;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="conversations-view-container">
          <div class="conv-sidebar">
            <div class="conv-search-wrap">
              <input type="text" class="input-control" placeholder="Search conversations...">
            </div>
            <div class="conv-list">
              ${otherUsers.length === 0 ? `
                <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-size: 0.82rem;">
                  No other members registered yet.
                </div>
              ` : otherUsers.map(u => `
                <div class="conv-item ${u.id === targetUser?.id ? 'active' : ''}" onclick="window.location.hash='#conversations/${u.id}'">
                  <div class="player-avatar-frame" style="width: 38px; height: 38px;"><div class="avatar-placeholder">${u.avatar || '🔥'}</div></div>
                  <div class="conv-item-body">
                    <div class="conv-item-top"><span class="conv-name">${u.displayName || u.username}</span></div>
                    <div class="conv-preview">${u.rank || 'Legend I'} • ${u.region || 'SEA'}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="chat-main-area">
            ${targetUser ? `
              <div class="chat-header">
                <div style="font-weight: 700; color: #fff;">${targetUser.displayName || targetUser.username} (${targetUser.rank || 'Legend I'})</div>
                <span class="badge badge-radiant">Online</span>
              </div>
              <div class="chat-messages-scroll" id="pm-scroll">
                ${(!conv || !conv.messages || conv.messages.length === 0) ? `
                  <div style="padding: 48px; text-align: center; color: var(--text-muted);">
                    No messages yet with ${targetUser.displayName || targetUser.username}. Say hello!
                  </div>
                ` : conv.messages.map(m => `
                  <div class="chat-message-item ${m.senderId === user.id ? 'is-own-message' : ''}">
                    <div class="chat-msg-body">
                      <div class="chat-msg-header"><span class="chat-msg-author">${m.senderId === user.id ? 'You' : (targetUser.displayName || targetUser.username)}</span></div>
                      <div class="chat-msg-content">${m.text}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="chat-input-area">
                <input type="text" class="chat-input-box" id="pm-input" placeholder="Message ${targetUser.displayName || targetUser.username}...">
                <button class="btn btn-primary btn-icon" id="pm-send">${Icons.send}</button>
              </div>
            ` : `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); gap: 12px; padding: 48px;">
                <div style="font-size: 2.8rem;">💬</div>
                <div style="font-family: var(--font-header); font-size: 1.2rem; color: #fff;">Direct Messaging</div>
                <p style="font-size: 0.85rem; max-width: 320px; text-align: center;">
                  Browse the <a href="#members" style="color: var(--accent-primary); font-weight: 700;">Members directory</a> to connect with teammates.
                </p>
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    if (targetUser) {
      const pmInput = document.getElementById('pm-input');
      const sendPM = () => {
        const txt = pmInput.value.trim();
        if (txt && targetUser && user) {
          Store.sendPM(targetUser.id, txt);
          renderConversations(targetUser.id);
        }
      };
      document.getElementById('pm-send')?.addEventListener('click', sendPM);
      pmInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendPM(); });
      const pmScroll = document.getElementById('pm-scroll');
      if (pmScroll) pmScroll.scrollTop = pmScroll.scrollHeight;
    }
  }

  /* --- VIEW: MEMBERS --- */
  function renderMembers() {
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;
    const users = Store.state.users;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div style="margin-bottom: 24px;">
          <h1 style="font-size: 1.6rem; color: #fff;">👥 COMMUNITY MEMBER DIRECTORY</h1>
          <p style="font-size: 0.82rem; color: var(--text-secondary);">Browse calibrated Dota 2 players and recruit teammates.</p>
        </div>
        <div class="lobbies-grid">
          ${users.length === 0 ? `
            <div class="hud-panel" style="padding: 40px 24px; text-align: center; grid-column: 1 / -1;">
              <div style="font-size: 2.2rem; margin-bottom: 8px;">👥</div>
              <div style="font-weight: 700; color: #fff; font-size: 1.1rem; margin-bottom: 6px;">No Registered Members Yet</div>
              <div style="color: var(--text-muted); font-size: 0.85rem;">Registered players will appear here in real-time.</div>
            </div>
          ` : users.map(u => `
            <div class="hud-panel" style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="player-avatar-frame" style="width: 44px; height: 44px;"><div class="avatar-placeholder">${u.avatar || '🔥'}</div></div>
                  <div>
                    <div style="font-weight: 700; color: #fff;">${u.displayName || u.username || 'Hero'}</div>
                    <div style="font-size: 0.75rem; color: var(--accent-gold); font-family: var(--font-stats);">ID: ${u.dotaId || '109283742'}</div>
                  </div>
                </div>
                <div class="rank-badge">${u.rank || 'Legend I'}</div>
              </div>
              <p style="font-size: 0.8rem; color: var(--text-secondary);">${u.bio || 'Ready to party on CourierHub!'}</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: auto;">
                <a href="#conversations/${u.id}" class="btn btn-secondary btn-sm">Message</a>
                <a href="#profile/${u.id}" class="btn btn-primary btn-sm">View Profile →</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* --- VIEW: PROFILE --- */
  function renderProfile(uid) {
    const current = Store.state.currentUser;
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;

    const isMe = !uid || (current && uid === current.id);
    const user = isMe ? current : (Store.state.users.find(u => u.id === uid) || null);

    if (!user) {
      container.innerHTML = `
        <div class="animate-fade-in content-container">
          <div class="hud-panel" style="padding: 48px; text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">⚔️</div>
            <h2 style="color: #fff; margin-bottom: 8px;">Player Profile Not Found</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">The requested player profile does not exist or has not calibrated yet.</p>
            <a href="#members" class="btn btn-primary">Browse Members Directory</a>
          </div>
        </div>
      `;
      return;
    }

    const stats = user.stats || {
      matches: user.gamesPlayed || 120,
      wins: Math.round((user.gamesPlayed || 120) * 0.54),
      losses: Math.round((user.gamesPlayed || 120) * 0.46),
      winRate: user.winRate || 54.1,
      hoursPlayed: 320
    };

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div class="hud-panel hud-highlight" style="margin-bottom: 24px; padding: 24px 32px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 20px;">
              <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 72px; height: 72px; font-size: 2.5rem;">
                <div class="avatar-placeholder">${user.avatar || '🔥'}</div>
              </div>
              <div>
                <h1 style="font-size: 1.8rem; font-weight: 900; color: #fff;">${user.displayName || user.username || 'Hero'}</h1>
                <div style="font-size: 0.82rem; color: var(--text-secondary);">
                  Dota ID: <strong style="color: var(--accent-gold); font-family: var(--font-stats);">${user.dotaId || '109283742'}</strong> • 
                  Rank: <strong style="color: #fff;">${user.rank || 'Legend I'}</strong> • Region: <strong style="color: #fff;">${user.region || 'SEA'}</strong>
                </div>
              </div>
            </div>
            ${isMe ? `<button class="btn btn-primary" id="edit-prof-btn">${Icons.edit} <span>Edit Profile</span></button>` : ''}
          </div>
          <p style="margin-top: 14px; font-size: 0.88rem; color: var(--text-secondary);">${user.bio || 'Ready to party on CourierHub!'}</p>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 16px;">📊 Performance Stats</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; text-align: center;">
              <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px;">
                <div style="font-size: 0.7rem; color: var(--text-muted);">Matches</div>
                <div style="font-family: var(--font-stats); font-size: 1.5rem; font-weight: 700; color: #fff;">${stats.matches}</div>
              </div>
              <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px;">
                <div style="font-size: 0.7rem; color: var(--text-muted);">Wins</div>
                <div style="font-family: var(--font-stats); font-size: 1.5rem; font-weight: 700; color: var(--radiant-green);">${stats.wins}</div>
              </div>
              <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px;">
                <div style="font-size: 0.7rem; color: var(--text-muted);">Losses</div>
                <div style="font-family: var(--font-stats); font-size: 1.5rem; font-weight: 700; color: var(--dire-red);">${stats.losses}</div>
              </div>
              <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 6px;">
                <div style="font-size: 0.7rem; color: var(--text-muted);">Win Rate</div>
                <div style="font-family: var(--font-stats); font-size: 1.5rem; font-weight: 700; color: var(--accent-gold);">${stats.winRate}%</div>
              </div>
            </div>
          </div>

          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 16px;">👑 Top Heroes</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>🔥 Shadow Fiend</span>
                <strong style="color: var(--accent-gold);">58% WR</strong>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>⚔️ Juggernaut</span>
                <strong style="color: var(--accent-gold);">55% WR</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (isMe) {
      document.getElementById('edit-prof-btn')?.addEventListener('click', () => {
        Modal.open({
          title: 'Edit Profile',
          icon: 'edit',
          contentHtml: `
            <form id="edit-prof-form">
              <div class="form-group"><label class="form-label">Display Name</label><input type="text" id="ep-name" class="input-control" value="${user.displayName || user.username || ''}"></div>
              <div class="form-group"><label class="form-label">Dota ID</label><input type="text" id="ep-id" class="input-control" value="${user.dotaId || ''}"></div>
              <div class="form-group"><label class="form-label">Bio</label><textarea id="ep-bio" class="textarea-control">${user.bio || ''}</textarea></div>
              <button type="submit" class="btn btn-primary btn-block">Save Changes</button>
            </form>
          `,
          onOpen: (modalEl) => {
            modalEl.querySelector('#edit-prof-form')?.addEventListener('submit', (e) => {
              e.preventDefault();
              const displayName = modalEl.querySelector('#ep-name').value;
              const dotaId = modalEl.querySelector('#ep-id').value;
              const bio = modalEl.querySelector('#ep-bio').value;
              Store.updateProfile({ displayName, dotaId, bio });
              Modal.close();
              Toast.success('Saved', 'Profile updated!');
              renderProfile();
            });
          }
        });
      });
    }
  }

  /* --- VIEW: PARTY FINDER --- */
  function renderPartyFinder() {
    const user = Store.state.currentUser;
    if (!user) {
      AppRouter.navigate('login');
      return;
    }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;
    const party = Store.state.partyFinder;

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 1.6rem; color: #fff;">🎯 LOOKING FOR PARTY (LFP)</h1>
            <p style="font-size: 0.82rem; color: var(--text-secondary);">Find teammates matching your role and rank tier.</p>
          </div>
          <button class="btn ${user.isLookingForParty ? 'btn-danger' : 'btn-success'}" id="lfp-btn">
            ${user.isLookingForParty ? 'Leave Queue' : 'Find a Party ⚔️'}
          </button>
        </div>

        <div class="lobbies-grid">
          ${party.length === 0 ? `
            <div class="hud-panel" style="padding: 40px 24px; text-align: center; grid-column: 1 / -1;">
              <div style="font-size: 2.2rem; margin-bottom: 8px;">🎯</div>
              <div style="font-weight: 700; color: #fff; font-size: 1.1rem; margin-bottom: 6px;">Party Queue is Empty</div>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">Be the first to enter the looking-for-party queue!</div>
              <button class="btn btn-primary" onclick="document.getElementById('lfp-btn').click()">Find a Party ⚔️</button>
            </div>
          ` : party.map(p => `
            <div class="hud-panel" style="padding: 18px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="player-avatar-frame" style="width: 40px; height: 40px;"><div class="avatar-placeholder">${p.avatar || '🔥'}</div></div>
                  <div>
                    <div style="font-weight: 700; color: #fff;">${p.name}</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${p.rank || 'Legend'} • ${p.region || 'SEA'}</div>
                  </div>
                </div>
                <span class="badge badge-radiant">READY</span>
              </div>
              <div style="font-size: 0.8rem; color: var(--accent-gold);">Role: <strong>${p.role || 'Core'}</strong> (${p.mode || 'Ranked'})</div>
              <button class="btn btn-primary btn-sm invite-btn" data-name="${p.name}">Invite to Lobby</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('lfp-btn')?.addEventListener('click', () => {
      Store.toggleParty(!user.isLookingForParty);
      renderPartyFinder();
    });
    document.querySelectorAll('.invite-btn').forEach(b => b.addEventListener('click', () => {
      Toast.success('Invited', `Invited ${b.dataset.name}!`);
      b.innerText = 'Invited ✓';
      b.disabled = true;
    }));
  }

  /* --- VIEW: HUD SETTINGS --- */
  function renderHudSettings() {
    const user = Store.state.currentUser;
    if (!user) {
      AppRouter.navigate('login');
      return;
    }
    renderLayoutShell();
    const container = document.getElementById('view-container');
    if (!container) return;
    const hud = user.hudSettings || { theme: 'classic', bgMode: 'embers' };

    container.innerHTML = `
      <div class="animate-fade-in content-container">
        <h1 style="font-size: 1.6rem; color: #fff; margin-bottom: 24px;">⚙️ PERSONAL HUD CUSTOMIZER</h1>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 16px;">🎨 Visual Theme Presets</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${['classic', 'crimson', 'diretide', 'abyssal', 'immortal'].map(t => `
                <div class="hud-panel theme-btn" data-theme="${t}" style="padding: 12px; cursor: pointer; border-color: ${hud.theme === t ? 'var(--accent-primary)' : 'var(--border-subtle)'}; display: flex; justify-content: space-between;">
                  <strong style="text-transform: capitalize; color: #fff;">${t}</strong>
                  <span class="badge ${hud.theme === t ? 'badge-gold' : 'badge-mana'}">${hud.theme === t ? 'ACTIVE' : 'APPLY'}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 16px;">✨ Ambient Canvas Particles</div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${['embers', 'runes', 'minimal'].map(m => `
                <div class="hud-panel bg-btn" data-mode="${m}" style="padding: 12px; cursor: pointer; border-color: ${hud.bgMode === m ? 'var(--accent-primary)' : 'var(--border-subtle)'}; display: flex; justify-content: space-between;">
                  <strong style="text-transform: capitalize; color: #fff;">${m}</strong>
                  <span class="badge ${hud.bgMode === m ? 'badge-gold' : 'badge-mana'}">${hud.bgMode === m ? 'ACTIVE' : 'APPLY'}</span>
                </div>
              `).join('')}
            </div>
            <button class="btn btn-secondary btn-block" id="test-fanfare-btn" style="margin-top: 20px;">Test Sound FX (Trumpet) 🎺</button>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.theme-btn').forEach(b => b.addEventListener('click', () => {
      const t = b.dataset.theme;
      document.body.setAttribute('data-theme', t);
      Store.updateHud({ theme: t });
      Toast.success('Theme Applied', `Theme switched to ${t.toUpperCase()}`);
      renderHudSettings();
    }));
    document.querySelectorAll('.bg-btn').forEach(b => b.addEventListener('click', () => {
      const m = b.dataset.mode;
      Store.updateHud({ bgMode: m });
      if (window.nexusBgInstance) window.nexusBgInstance.setMode(m);
      Toast.success('Background Applied', `Mode: ${m}`);
      renderHudSettings();
    }));
    document.getElementById('test-fanfare-btn')?.addEventListener('click', () => Sound.playLobbyJoin());
  }

  /* ==========================================================================
     8. APP INITIALIZATION
     ========================================================================== */

  // Supabase connection logic — runs whenever the SDK becomes available
  let supabaseConnected = false;
  function connectSupabase() {
    if (supabaseConnected) return;
    const sb = getSupabase();
    if (!sb) return;
    supabaseConnected = true;

    // Background data sync
    Store.syncFromSupabase().catch(() => {});

    // Session restore with timeout guard
    let sessionHandled = false;
    const sessionTimeout = setTimeout(() => {
      if (!sessionHandled) {
        sessionHandled = true;
        if (!Store.state.currentUser) {
          AppRouter.navigate('login');
        }
      }
    }, 3000);

    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (sessionHandled) return;
      sessionHandled = true;
      clearTimeout(sessionTimeout);

      if (!session?.user) {
        if (!Store.state.currentUser) {
          const hash = window.location.hash;
          if (hash !== '#login' && hash !== '#signup') {
            AppRouter.navigate('login');
          }
        }
        return;
      }

      try {
        const { data: profile } = await sb.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (profile) {
          Store.loginUser({
            id: profile.id,
            username: profile.username || session.user.email.split('@')[0],
            displayName: profile.display_name || profile.username || session.user.email.split('@')[0],
            email: profile.email || session.user.email,
            dotaId: profile.dota_id || '109283742',
            rank: profile.rank || 'Legend I',
            region: profile.region || 'SEA',
            avatar: profile.avatar || '🔥',
            avatarFrame: profile.avatar_frame || 'avatar-frame-immortal',
            bio: profile.bio || 'Ready to party on CourierHub!'
          });
          const hash = window.location.hash;
          if (!hash || hash === '#login' || hash === '#signup' || hash === '#') {
            AppRouter.navigate('home');
          } else {
            AppRouter.handle();
          }
        } else {
          await sb.auth.signOut().catch(() => {});
          Store.logout();
          AppRouter.navigate('login');
        }
      } catch (e) {
        console.warn('Session restore notice:', e);
        if (!Store.state.currentUser) AppRouter.navigate('login');
      }
    }).catch(() => {
      if (!sessionHandled) {
        sessionHandled = true;
        clearTimeout(sessionTimeout);
        AppRouter.navigate('login');
      }
    });

    // Realtime community messages
    try {
      sb.channel('public:community_messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_messages' }, payload => {
          const m = payload.new;
          if (m && !Store.state.communityMessages.some(x => x.id === m.id)) {
            Store.state.communityMessages.push({
              id: m.id, userId: m.user_id, userName: m.author_name,
              userAvatar: m.author_avatar || '⚔️', userRank: m.author_rank || 'Ancient V',
              content: m.text, createdAt: m.created_at, reactions: m.reactions || {},
              replyTo: m.reply_to_id, lobbyEmbed: m.lobby_embed
            });
            Store.notify();
            if (AppRouter.currentRoute === 'community') renderCommunity();
          }
        })
        .subscribe();
    } catch (e) {}

    // Auth state changes
    sb.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        Store.logout();
        if (window.location.hash !== '#login' && window.location.hash !== '#signup') {
          AppRouter.navigate('login');
        }
        return;
      }
      if (event === 'SIGNED_IN' && session?.user) {
        const isEmailConfirm = window.location.hash.includes('access_token') || window.location.href.includes('type=signup');
        if (isEmailConfirm) {
          let uname = session.user.user_metadata?.username || session.user.user_metadata?.display_name;
          if (!uname) {
            try {
              const { data: p } = await sb.from('profiles').select('username').eq('id', session.user.id).maybeSingle();
              if (p?.username) uname = p.username;
            } catch (e) {}
          }
          await sb.auth.signOut().catch(() => {});
          AppRouter.navigate('login');
          Toast.success('Account Created!', 'Your email has been confirmed. Please sign in to continue!');
          setTimeout(() => {
            const inp = document.getElementById('login-username');
            if (inp && uname) inp.value = uname;
            document.getElementById('auth-flip-card-inner')?.classList.remove('is-flipped');
            document.getElementById('login-pw')?.focus();
          }, 300);
        }
      }
    });
  }

  function initApp() {
    window.nexusBgInstance = new CanvasBackground();

    AppRouter.register('login', () => renderAuth(false));
    AppRouter.register('signup', () => renderAuth(true));
    AppRouter.register('home', () => renderHome());
    AppRouter.register('lobbies', () => renderLobbies());
    AppRouter.register('lobby', (id) => renderLobbyDetails(id));
    AppRouter.register('community', () => renderCommunity());
    AppRouter.register('conversations', (id) => renderConversations(id));
    AppRouter.register('members', () => renderMembers());
    AppRouter.register('profile', (id) => renderProfile(id));
    AppRouter.register('party-finder', () => renderPartyFinder());
    AppRouter.register('hud-settings', () => renderHudSettings());

    // RENDER THE PAGE IMMEDIATELY — zero network dependency
    AppRouter.handle();

    // Try connecting Supabase now (if CDN already loaded)
    connectSupabase();

    // If Supabase CDN loads later (async), connect then
    window.addEventListener('supabase-ready', () => connectSupabase());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
