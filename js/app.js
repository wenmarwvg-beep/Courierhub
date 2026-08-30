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
     2. SVG ICONS & HERO SKIN BUNDLES REGISTRY (Abyssal Soulfire Signature)
     ========================================================================== */
  const Icons = {
    // Navigation & Tabs (Apple SF Symbols style)
    home: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.182V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9.818a2 2 0 0 0-.663-1.488L13.337 2.694a2 2 0 0 0-2.674 0L3.663 8.694A2 2 0 0 0 3 10.182z"/><path d="M9 22v-7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v7"/></svg>`,
    feed: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>`,
    community: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    conversations: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    lobbies: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4m-2-2v4m7-2h.01m3-2h.01m0 4h.01"/></svg>`,
    party: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M9.5 6.5L21 18v3h-3L6.5 9.5"/></svg>`,
    members: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
    
    // Apple Dropdown & Banner Controls
    edit: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    profileCard: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="4"/><circle cx="9" cy="10" r="2.5"/><line x1="15" y1="8" x2="17" y2="8"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    palette: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".75" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".75" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".75" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".75" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2Z"/></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z"/></svg>`,

    // Apple-Inspired Interaction Controls
    search: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    
    // Apple Send Icons
    send: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>`,
    sendArrowUp: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
    
    // Apple Social Interactions
    heart: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    heartFilled: `<svg viewBox="0 0 24 24" width="17" height="17" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    comment: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    share: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="3" ry="3"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    userPlus: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
    userCheck: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>`,
    chatBubble: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    
    // Profile Card Metadata Icons
    region: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    location: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    dotaId: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="4"/><circle cx="9" cy="10" r="2.5"/><line x1="15" y1="8" x2="17" y2="8"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`,
    quote: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 8z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2h3c0 4-2 6-4 8z"/></svg>`,
    gender: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="5"/><line x1="19" y1="5" x2="13.6" y2="10.4"/><polyline points="15 5 19 5 19 9"/></svg>`,
    rankCrown: `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5v-2z"/></svg>`,
    id: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="4"/><circle cx="9" cy="10" r="2.5"/><line x1="15" y1="8" x2="17" y2="8"/><line x1="15" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>`,

    // Apple-styled Precision Dota Ranks Badges
    rankHerald: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gHerald" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/></linearGradient></defs><polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#gHerald)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/><polygon points="18,8 26,13 26,23 18,28 10,23 10,13" fill="#1e293b" opacity="0.85"/></svg>`,
    rankGuardian: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gGuardian" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs><polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#gGuardian)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/><polygon points="18,8 26,13 26,23 18,28 10,23 10,13" fill="#064e3b" opacity="0.85"/></svg>`,
    rankCrusader: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gCrusader" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#gCrusader)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/><polygon points="18,8 26,13 26,23 18,28 10,23 10,13" fill="#0f172a" opacity="0.85"/></svg>`,
    rankArchon: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gArchon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#c084fc"/><stop offset="100%" stop-color="#9333ea"/></linearGradient></defs><polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#gArchon)" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/><polygon points="18,8 26,13 26,23 18,28 10,23 10,13" fill="#3b0764" opacity="0.85"/><circle cx="18" cy="18" r="3.5" fill="#f0abfc"/></svg>`,
    rankLegend: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gLegend" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs><polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#gLegend)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/><polygon points="18,8 26,13 26,23 18,28 10,23 10,13" fill="#451a03" opacity="0.85"/><polygon points="18,12 21,17 15,17" fill="#fef08a"/></svg>`,
    rankAncient: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gAncient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2dd4bf"/><stop offset="100%" stop-color="#0d9488"/></linearGradient></defs><polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#gAncient)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/><polygon points="18,8 26,13 26,23 18,28 10,23 10,13" fill="#042f2e" opacity="0.85"/><polygon points="18,11 23,18 18,25 13,18" fill="#99f6e4"/></svg>`,
    rankDivine: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gDivine" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#be123c"/></linearGradient></defs><polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#gDivine)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/><polygon points="18,8 26,13 26,23 18,28 10,23 10,13" fill="#4c0519" opacity="0.85"/><circle cx="18" cy="18" r="3.5" fill="#ffffff"/></svg>`,
    rankImmortal: `<svg viewBox="0 0 36 36" width="24" height="24"><defs><linearGradient id="gImmortal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fbbf24"/><stop offset="50%" stop-color="#f97316"/><stop offset="100%" stop-color="#dc2626"/></linearGradient></defs><polygon points="18,2 32,9 32,27 18,34 4,27 4,9" fill="url(#gImmortal)" stroke="rgba(255,255,255,0.6)" stroke-width="1.8"/><polygon points="18,7 27,13 27,23 18,29 9,23 9,13" fill="#2a0808" opacity="0.9"/><circle cx="18" cy="18" r="4" fill="#ffffff"/></svg>`
  };
  window.Icons = Icons;

  const SHADOW_FIEND_CHAT_ICON_SVG = `
    <svg class="sf-chat-flame" viewBox="0 0 40 40" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sfFlameOuter" x1="20" y1="36" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#800000" />
          <stop offset="35%" stop-color="#ff1100" />
          <stop offset="75%" stop-color="#ff5500" />
          <stop offset="100%" stop-color="#ffcc00" />
        </linearGradient>
        
        <linearGradient id="sfSoulCore" x1="20" y1="30" x2="20" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ff2200" />
          <stop offset="50%" stop-color="#ff9900" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>

        <linearGradient id="sfHornArmor" x1="4" y1="8" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#300808" />
          <stop offset="50%" stop-color="#180406" />
          <stop offset="100%" stop-color="#050102" />
        </linearGradient>

        <linearGradient id="sfHornRim" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ff4422" />
          <stop offset="70%" stop-color="#880000" />
          <stop offset="100%" stop-color="#ff2200" />
        </linearGradient>

        <filter id="sfFlameGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Demonic Obsidian Horn Armor Spikes -->
      <path d="M7 26C5 18 8 10 12 6C11 11 12 16 15 19C12 21 8 23 7 26Z" fill="url(#sfHornArmor)" stroke="url(#sfHornRim)" stroke-width="1.3" stroke-linejoin="round" />
      <path d="M33 26C35 18 32 10 28 6C29 11 28 16 25 19C28 21 32 23 33 26Z" fill="url(#sfHornArmor)" stroke="url(#sfHornRim)" stroke-width="1.3" stroke-linejoin="round" />

      <!-- Outer Roaring Netherflame -->
      <path d="M20 4C16.8 11 11 15 11 23C11 29 15 34 20 34C25 34 29 29 29 23C29 15 23.2 11 20 4Z" fill="url(#sfFlameOuter)" filter="url(#sfFlameGlow)" />
      
      <!-- Left Flickering Flame Tongue -->
      <path d="M16 28C14 26 13 22 15 18C16 20 17 21 17 23C17 25 16.5 27 16 28Z" fill="#ff7700" opacity="0.95" />

      <!-- Right Flickering Flame Tongue -->
      <path d="M24 28C26 26 27 22 25 18C24 20 23 21 23 23C23 25 23.5 27 24 28Z" fill="#ff7700" opacity="0.95" />

      <!-- Blazing Soul Core (White Hot Heart) -->
      <path d="M20 12C18 17 15 20 15 25C15 28.5 17.2 31.5 20 31.5C22.8 31.5 25 28.5 25 25C25 20 22 17 20 12Z" fill="url(#sfSoulCore)" />

      <!-- Demonic Nether Eyes Crest in Center -->
      <path d="M17 23L19 25L17 27" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M23 23L21 25L23 27" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="20" cy="20" r="1.3" fill="#ffffff" />

      <!-- Base Nether Collar Armor -->
      <path d="M13 33C17 35.5 23 35.5 27 33C25.5 36.5 14.5 36.5 13 33Z" fill="#180406" stroke="#ff2200" stroke-width="1" />
    </svg>
  `;

  const SKIN_BUNDLES = [
    {
      id: 'shadow-fiend',
      name: 'Shadow Fiend — Abyssal Soulfire',
      hero: 'Shadow Fiend (Nevermore)',
      banner: 'assets/banner-shadow-fiend.jpg',
      cardBg: 'assets/sf-container-bg.jpg',
      tag: '🔥 Abyssal Soulfire',
      accent: '#ff2200',
      borderColor: '#ff5522',
      borderGlow: '#ff2200',
      borderHead: '#ffffff',
      bgStyle: 'shadow-fiend',
      chatBadge: '🔥',
      chatIconSvg: SHADOW_FIEND_CHAT_ICON_SVG,
      chatIconName: 'Abyssal Soulfire Crest',
      desc: 'Exclusive Nevermore theme. Synchronizes full-bleed Requiem artwork, red soulfire laser border travel path, obsidian demonic container backdrop, atmospheric ember particles, and blazing Netherflame soul crest.'
    }
  ];

  function isImageAvatar(avatar) {
    if (!avatar || typeof avatar !== 'string') return false;
    return avatar.startsWith('data:image') ||
           avatar.startsWith('http://') ||
           avatar.startsWith('https://') ||
           avatar.startsWith('assets/') ||
           avatar.startsWith('images/') ||
           avatar.includes('.jpg') ||
           avatar.includes('.png') ||
           avatar.includes('.webp') ||
           avatar.includes('.gif') ||
           avatar.includes('.svg');
  }

  function renderAvatarHTML(avatar, extraStyle = '', className = '') {
    const av = avatar || 'assets/avatar-shadow-fiend.jpg';
    if (isImageAvatar(av)) {
      return `<img src="${encodeURI(av)}" class="${className}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit; display: block; ${extraStyle}" alt="Avatar" />`;
    }
    return `<span class="${className}" style="${extraStyle}">${av}</span>`;
  }

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
    rankCrown: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path><path d="M5 20h14"></path></svg>`,
    camera: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`,
    palette: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    upload: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`
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
            avatar: 'assets/avatar-shadow-fiend.jpg',
            avatarFrame: 'avatar-frame-immortal',
            skin: 'shadow-fiend',
            banner: 'Shadow Fiend Requiem.jpg',
            followersCount: '100k',
            followingCount: '10',
            quote: 'The path to victory is paved with courage, patience, and unbreakable teamwork.',
            winRate: 64.2,
            gamesPlayed: 1540,
            onlineStatus: 'online'
          }
        ],
        lobbies: [],
        communityMessages: [],
        communityPosts: [
          {
            id: 'post_tourney_season3',
            authorId: 'user_wenmar_master',
            authorName: 'wenmar',
            authorAvatar: '👑',
            authorRank: 'Divine V',
            badge: 'Founder',
            timestamp: 'Just now',
            tag: 'Tournament',
            tagColor: 'var(--accent-gold)',
            content: '🏆 CourierHub SEA Championship Season 3 registration is officially OPEN! Assemble your 5-man squad. Match schedule and brackets will be streamed live. Divine & Immortal divisions will have exclusive rewards!',
            likes: 28,
            likedByMe: true,
            comments: [
              { author: 'MiranaShadow', avatar: '🏹', text: 'Our team is locked in! Signed up for SEA Div 1.', timestamp: '15 mins ago' },
              { author: 'InvokerPro', avatar: '⚡', text: 'Looking for a Pos 5 support player for the tournament.', timestamp: '5 mins ago' }
            ]
          },
          {
            id: 'post_meta_736c',
            authorId: 'user_valvedota',
            authorName: 'CourierHub Meta Bot',
            authorAvatar: '🤖',
            authorRank: 'Immortal',
            badge: 'News',
            timestamp: '3 hours ago',
            tag: 'Patch 7.36c Analysis',
            tagColor: 'var(--mana-blue)',
            content: '📊 Patch 7.36c Meta Breakdown: Facet adjustments have boosted Ringmaster and Shadow Fiend win rates by +4.8% in high MMR SEA brackets. What are your favorite facet builds right now?',
            likes: 45,
            likedByMe: false,
            comments: [
              { author: 'JuggernautSlash', avatar: '⚔️', text: 'The blade fury facet is super strong with swift blink right now.', timestamp: '2 hours ago' }
            ]
          },
          {
            id: 'post_battlecup_prep',
            authorId: 'user_phantom_assassin',
            authorName: 'ShadowAssassin',
            authorAvatar: '🗡️',
            authorRank: 'Ancient IV',
            badge: 'LFP',
            timestamp: '6 hours ago',
            tag: 'Looking for Party',
            tagColor: 'var(--radiant-green)',
            content: '⚔️ Tier 7 SEA Battle Cup tonight at 8:00 PM GMT+8! Need 1 Offlane Pos 3 and 1 Pos 4 Roamer. English/Tagalog mic, PMA only. Drop your Dota IDs below!',
            likes: 19,
            likedByMe: false,
            comments: [
              { author: 'EarthShakerSlam', avatar: '💥', text: 'Pos 4 Earthshaker / Tusk ready! Added you.', timestamp: '4 hours ago' }
            ]
          }
        ],
        partyFinder: [
          {
            id: 'party_1',
            leader: 'wenmar',
            avatar: '👑',
            rank: 'Divine V',
            mode: 'Ranked All Pick',
            region: 'SEA',
            currentMembers: 3,
            maxMembers: 5,
            rolesNeeded: ['Pos 3 Offlane', 'Pos 5 Support'],
            note: 'Grinding MMR tonight, looking for communicative and PMA teammates.'
          },
          {
            id: 'party_2',
            leader: 'ShadowFiendPro',
            avatar: '⚔️',
            rank: 'Ancient IV',
            mode: 'SEA Battle Cup (Tier 7)',
            region: 'SEA',
            currentMembers: 4,
            maxMembers: 5,
            rolesNeeded: ['Pos 1 Hard Carry'],
            note: 'Tier 7 Battle Cup squad practicing strategies and hero facets.'
          },
          {
            id: 'party_3',
            leader: 'CrystalMaidenLover',
            avatar: '❄️',
            rank: 'Legend III',
            mode: 'Unranked / Turbo Fun',
            region: 'SEA',
            currentMembers: 2,
            maxMembers: 5,
            rolesNeeded: ['Any Role Welcome'],
            note: 'Chill games and cavern crawl / guild quests.'
          }
        ],
        statsOverview: { totalMembers: 1, onlineNow: 1, activeLobbies: 0, partyQueue: 0 },
        friends: [
          {
            id: 'friend_topson',
            name: 'Topson',
            avatar: '⚡',
            rank: 'Divine V',
            role: 'Pos 2 Mid',
            status: 'online',
            statusText: 'Online • In Lobby',
            badge: 'OG',
            lastMessage: 'Let\'s party up for ranked!'
          },
          {
            id: 'friend_miracle',
            name: 'Miracle-',
            avatar: '🦅',
            rank: 'Immortal #14',
            role: 'Pos 1 Carry',
            status: 'in_match',
            statusText: '⚔️ In Match (18m)',
            badge: 'Nigma',
            lastMessage: 'LF Pos 5 for Battle Cup'
          },
          {
            id: 'friend_ana',
            name: 'Ana',
            avatar: '👑',
            rank: 'Divine IV',
            role: 'Pos 1 Carry',
            status: 'online',
            statusText: 'Online • Ready',
            badge: 'Carry',
            lastMessage: 'Ready when you are.'
          },
          {
            id: 'friend_abed',
            name: 'Abed',
            avatar: '🌪️',
            rank: 'Immortal #45',
            role: 'Pos 2 Mid',
            status: 'online',
            statusText: 'Online • In Party',
            badge: 'SEA Mid',
            lastMessage: 'G for ranked stack tonight?'
          },
          {
            id: 'friend_kuku',
            name: 'Kuku',
            avatar: '🛡️',
            rank: 'Divine III',
            role: 'Pos 3 Offlane',
            status: 'away',
            statusText: '🟡 Away (10m)',
            badge: 'Offlane',
            lastMessage: 'Need 1 for 5-stack later'
          },
          {
            id: 'friend_yatoro',
            name: 'Yatoro',
            avatar: '🐉',
            rank: 'Immortal #3',
            role: 'Pos 1 Carry',
            status: 'in_match',
            statusText: '⚔️ In Match (32m)',
            badge: 'Team Spirit',
            lastMessage: 'GG WP last match'
          }
        ],
        activeChatHeads: [],
        openChatFriendId: null,
        isFriendsListOpen: false,
        chatMessages: {
          'friend_topson': [
            { sender: 'friend', text: 'Hey bro, are you grinding MMR today?', timestamp: '10:14 AM' },
            { sender: 'user', text: 'Yeah, let\'s assemble a 5-man stack.', timestamp: '10:16 AM' },
            { sender: 'friend', text: 'Let\'s party up for ranked!', timestamp: '10:18 AM' }
          ],
          'friend_ana': [
            { sender: 'friend', text: 'Ready when you are.', timestamp: 'Yesterday' }
          ]
        }
      };
    }
    load() {
      try {
        const saved = localStorage.getItem('courierhub_state_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          const defaults = this.getDefaults();
          if (parsed.currentUser) {
            if (!parsed.currentUser.skin) parsed.currentUser.skin = 'shadow-fiend';
            if (!parsed.currentUser.banner) parsed.currentUser.banner = 'Shadow Fiend Requiem.jpg';
          }
          return {
            ...defaults,
            ...parsed,
            currentUser: parsed.currentUser ? { 
              skin: 'shadow-fiend', 
              banner: 'Shadow Fiend Requiem.jpg', 
              followersCount: '100k',
              followingCount: '10',
              ...parsed.currentUser,
              avatar: (parsed.currentUser.avatar && (parsed.currentUser.avatar.startsWith('data:image') || parsed.currentUser.avatar.includes('.jpg') || parsed.currentUser.avatar.includes('.png') || parsed.currentUser.avatar.includes('.webp') || parsed.currentUser.avatar.startsWith('http'))) ? parsed.currentUser.avatar : 'assets/avatar-shadow-fiend.jpg'
            } : null,
            friends: parsed.friends && parsed.friends.length ? parsed.friends : defaults.friends,
            chatMessages: parsed.chatMessages || defaults.chatMessages,
            activeChatHeads: parsed.activeChatHeads || defaults.activeChatHeads,
            openChatFriendId: parsed.openChatFriendId || null,
            isFriendsListOpen: false
          };
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
      this.skin = 'souls-embers';
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.init();
      this.loop = this.loop.bind(this);
      this.loop();
    }
    setSkin(skinStyle) {
      this.skin = skinStyle || 'souls-embers';
      this.init();
    }
    resize() {
      if (!this.canvas) return;
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }
    init() {
      this.particles = [];
      const count = this.skin === 'souls-embers' ? 55 : (this.skin === 'starlight-cosmic' ? 65 : 45);
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * (this.skin === 'souls-embers' ? 4.5 : 3) + 1,
          speedY: Math.random() * 0.85 + 0.35,
          speedX: (Math.random() - 0.5) * (this.skin === 'souls-embers' ? 0.6 : 0.3),
          alpha: Math.random() * 0.65 + 0.25,
          pulse: Math.random() * Math.PI * 2,
          isSoulWisp: Math.random() > 0.68
        });
      }
    }
    loop() {
      requestAnimationFrame(this.loop);
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.pulse += 0.035;
        p.y -= p.speedY;
        p.x += Math.sin(p.pulse) * p.speedX;

        if (p.y < -30) {
          p.y = this.height + 30;
          p.x = Math.random() * this.width;
        }

        this.ctx.save();
        this.ctx.beginPath();

        if (this.skin === 'souls-embers') {
          // Shadow Fiend — Requiem Souls & Netherflame Embers
          const currentAlpha = p.alpha * (0.55 + Math.sin(p.pulse) * 0.35);
          const rad = p.isSoulWisp ? p.size * 1.8 : p.size;
          this.ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
          this.ctx.shadowBlur = p.isSoulWisp ? 16 : 8;
          this.ctx.shadowColor = '#ff2200';
          this.ctx.fillStyle = p.isSoulWisp 
            ? `rgba(255, 34, 0, ${currentAlpha * 0.65})` 
            : `rgba(255, 120, 0, ${currentAlpha * 0.5})`;
          this.ctx.fill();
        } else if (this.skin === 'starlight-cosmic') {
          // Purple Galaxy Cosmic Dust
          const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#a855f7';
          this.ctx.fillStyle = `rgba(168, 85, 247, ${currentAlpha * 0.45})`;
          this.ctx.fill();
        } else if (this.skin === 'digital-grid') {
          // Cyberpunk Cyan Data Spark
          this.ctx.rect(p.x, p.y, p.size * 1.6, p.size * 1.6);
          this.ctx.shadowBlur = 8;
          this.ctx.shadowColor = '#06b6d4';
          this.ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.45})`;
          this.ctx.fill();
        } else if (this.skin === 'blood-embers') {
          // Crimson Fury Embers
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#ef4444';
          this.ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha * 0.45})`;
          this.ctx.fill();
        } else {
          // Arcade / Default Golden
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.shadowBlur = 6;
          this.ctx.shadowColor = '#f59e0b';
          this.ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.35})`;
          this.ctx.fill();
        }
        this.ctx.restore();
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

        if (isAuth) renderFloatingChat();
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
                ${renderAvatarHTML(user.avatar)}
                <div class="status-dot status-online" style="width: 10px; height: 10px; border-width: 2px; bottom: -1px; right: -1px;"></div>
              </div>

              <!-- Dropdown Chevron Icon -->
              <span class="topbar-user-chevron" id="user-menu-chevron">▼</span>
            </button>

            <!-- Dropdown Card (Clean Rounded Card with No Sharp Dark Corner Accents) -->
            <div id="user-dropdown-card" class="user-dropdown-card">
              <!-- User Preview Header -->
              <div style="display: flex; align-items: center; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
                <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 2px solid var(--accent-gold); flex-shrink: 0; background: var(--bg-secondary); overflow: hidden;">
                  ${renderAvatarHTML(user.avatar)}
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

              <!-- Action Menu Items (Apple-styled) -->
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <button type="button" class="dropdown-item-btn" id="dropdown-edit-profile-btn">
                  ${Icons.edit}
                  <span>Edit Profile</span>
                </button>

                <button type="button" class="dropdown-item-btn dropdown-item-danger" id="dropdown-logout-btn">
                  ${Icons.logout}
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
      document.getElementById('floating-chat-container')?.remove();
      Toast.success('Signed Out', 'See you next match, Hero!');
      AppRouter.navigate('login');
    });

    // Mount Floating Chat System & Connect Supabase Realtime
    renderFloatingChat();
    initRealtimeChat();
  }

  /* ==========================================================================
     SUPABASE REALTIME LIVE CHAT & PRESENCE ENGINE
     ========================================================================== */
  let activeRealtimeChatChannel = null;

  function initRealtimeChat() {
    const user = Store.state.currentUser;
    const sb = getSupabase();
    if (!sb || !user) return;

    if (activeRealtimeChatChannel) {
      try {
        sb.removeChannel(activeRealtimeChatChannel);
      } catch (e) {}
    }

    try {
      const myId = user.id || user.username;
      activeRealtimeChatChannel = sb.channel('courierhub_realtime_chat', {
        config: {
          presence: { key: myId },
          broadcast: { self: false }
        }
      });

      // 1. Realtime Broadcast DM Delivery (Cross-device instant messaging)
      activeRealtimeChatChannel.on('broadcast', { event: 'dm_message' }, ({ payload }) => {
        if (!payload) return;
        const { senderId, receiverId, senderName, senderAvatar, senderRank, text, timestamp } = payload;
        
        if (receiverId === myId || receiverId === user.username || receiverId === user.id) {
          if (!Store.state.chatMessages) Store.state.chatMessages = {};
          if (!Store.state.chatMessages[senderId]) Store.state.chatMessages[senderId] = [];

          Store.state.chatMessages[senderId].push({
            sender: 'friend',
            text: text,
            timestamp: timestamp || 'Just now'
          });

          // Ensure sender is in friends list
          if (!Store.state.friends) Store.state.friends = [];
          let friendObj = Store.state.friends.find(f => f.id === senderId || f.name === senderName);
          if (!friendObj) {
            friendObj = {
              id: senderId,
              name: senderName || 'Hero Player',
              avatar: senderAvatar || '👑',
              rank: senderRank || 'Divine V',
              role: 'Online Player',
              status: 'online',
              statusText: '🟢 Online Live',
              lastMessage: text
            };
            Store.state.friends.unshift(friendObj);
          } else {
            friendObj.lastMessage = text;
            friendObj.status = 'online';
          }

          // Pin circular chat head above chat icon
          if (!Store.state.activeChatHeads) Store.state.activeChatHeads = [];
          if (!Store.state.activeChatHeads.includes(senderId)) {
            Store.state.activeChatHeads.push(senderId);
          }

          Store.save();
          if (window.Sound) window.Sound.playMessage();

          if (Store.state.openChatFriendId !== senderId) {
            Toast.success(`💬 ${senderName}`, text.length > 45 ? text.substring(0, 45) + '...' : text);
          }

          renderFloatingChat();

          setTimeout(() => {
            const body = document.getElementById('chat-messages-body');
            if (body) body.scrollTop = body.scrollHeight;
          }, 50);
        }
      });

      // 2. Realtime Postgres Changes Listener
      activeRealtimeChatChannel.on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      }, (payload) => {
        const newMsg = payload.new;
        if (!newMsg) return;
        if (newMsg.receiver_id === user.id && newMsg.sender_id !== user.id) {
          const senderId = newMsg.sender_id;
          if (!Store.state.chatMessages) Store.state.chatMessages = {};
          if (!Store.state.chatMessages[senderId]) Store.state.chatMessages[senderId] = [];

          const isDuplicate = Store.state.chatMessages[senderId].some(m => m.text === newMsg.text && (Date.now() - (m.receivedAt || 0) < 4000));
          if (!isDuplicate) {
            Store.state.chatMessages[senderId].push({
              sender: 'friend',
              text: newMsg.text,
              timestamp: new Date(newMsg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              receivedAt: Date.now()
            });

            if (!Store.state.activeChatHeads) Store.state.activeChatHeads = [];
            if (!Store.state.activeChatHeads.includes(senderId)) {
              Store.state.activeChatHeads.push(senderId);
            }

            Store.save();
            if (window.Sound) window.Sound.playMessage();
            renderFloatingChat();
          }
        }
      });

      // 3. Supabase Realtime Presence (Live Online Tracking)
      activeRealtimeChatChannel.on('presence', { event: 'sync' }, () => {
        const state = activeRealtimeChatChannel.presenceState();
        for (const key in state) {
          const presences = state[key];
          if (presences && presences.length) {
            presences.forEach(p => {
              if (p.userId && p.userId !== myId) {
                let friendObj = Store.state.friends.find(f => f.id === p.userId || f.name === p.username);
                if (friendObj) {
                  friendObj.status = 'online';
                  friendObj.statusText = '🟢 Online Live';
                } else {
                  Store.state.friends.push({
                    id: p.userId,
                    name: p.displayName || p.username,
                    avatar: p.avatar || '⚔️',
                    rank: p.rank || 'Divine V',
                    role: 'Online Player',
                    status: 'online',
                    statusText: '🟢 Online Live',
                    lastMessage: 'Active now on CourierHub'
                  });
                }
              }
            });
          }
        }
        renderFloatingChat();
      });

      activeRealtimeChatChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await activeRealtimeChatChannel.track({
            userId: myId,
            username: user.username,
            displayName: user.displayName || user.username,
            avatar: user.avatar || '👑',
            rank: user.rank || 'Divine V',
            onlineAt: new Date().toISOString()
          }).catch(() => {});
        }
      });
    } catch (err) {
      console.warn('Realtime chat channel init notice:', err);
    }
  }

  /* ==========================================================================
     FLOATING CHAT & ACTIVE CIRCLE FRIENDS CHAT HEADS
     ========================================================================== */
  function renderFloatingChat() {
    const user = Store.state.currentUser;
    let chatContainer = document.getElementById('floating-chat-container');

    if (!user) {
      chatContainer?.remove();
      return;
    }

    if (!chatContainer) {
      chatContainer = document.createElement('div');
      chatContainer.id = 'floating-chat-container';
      document.body.appendChild(chatContainer);
    }

    const friends = Store.state.friends || [];
    const activeHeadIds = Store.state.activeChatHeads || [];
    const openFriendId = Store.state.openChatFriendId;
    const isFriendsListOpen = !!Store.state.isFriendsListOpen;
    const onlineCount = friends.filter(f => f.status !== 'offline').length;
    const openFriend = friends.find(f => f.id === openFriendId);
    const messages = openFriendId ? (Store.state.chatMessages?.[openFriendId] || []) : [];

    let html = '';

    // 1. ACTIVE DIRECT CHAT WINDOW
    if (openFriend) {
      html += `
        <div id="active-chat-window" class="hud-panel animate-fade-in" style="
          position: absolute;
          bottom: 0;
          right: 76px;
          width: 360px;
          height: 500px;
          max-height: 82vh;
          background: rgba(13, 19, 33, 0.96);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1.5px solid rgba(255, 34, 0, 0.4);
          box-shadow: 0 28px 65px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 34, 0, 0.15);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          z-index: 1510;
        ">
          <!-- Chat Window Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(255, 34, 0, 0.22) 0%, rgba(15, 23, 42, 0.9) 100%);
            border-bottom: 1px solid rgba(255, 34, 0, 0.3);
          ">
            <div class="chat-header-profile-trigger clickable-player-trigger" title="Click to view ${openFriend.name}'s Profile Card" style="display: flex; align-items: center; gap: 10px; min-width: 0; cursor: pointer;">
              <div style="position: relative; width: 38px; height: 38px; border-radius: 50%; background: #0f172a; border: 2px solid #ff2200; padding: 2px; box-sizing: border-box; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
                ${renderAvatarHTML(openFriend.avatar)}
                <div class="status-dot status-${openFriend.status || 'online'}" style="position: absolute; bottom: -1px; right: -1px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #0f172a; background: ${openFriend.status === 'in_match' ? '#f59e0b' : '#16a34a'};"></div>
              </div>
              <div style="min-width: 0;">
                <div style="font-weight: 800; font-size: 0.95rem; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px;">
                  <span>${openFriend.name}</span>
                  <span class="badge badge-gold" style="font-size: 0.68rem; padding: 1px 6px;">${openFriend.rank}</span>
                </div>
                <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${openFriend.statusText || 'Online'}
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 4px;">
              <button type="button" id="chat-window-minimize-btn" title="Minimize" style="background: transparent; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; padding: 2px 6px; border-radius: 4px; line-height: 1;">–</button>
              <button type="button" id="chat-window-close-btn" title="Close" style="background: transparent; border: none; font-size: 1rem; color: #94a3b8; cursor: pointer; padding: 2px 6px; border-radius: 4px; line-height: 1;">✕</button>
            </div>
          </div>

          <!-- Quick Dota Quick-Chat Pills -->
          <div style="
            display: flex;
            gap: 6px;
            padding: 8px 12px;
            background: rgba(10, 16, 28, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            overflow-x: auto;
            scrollbar-width: none;
          ">
            ${['⚔️ Party up?', '🏆 Ready for ranked', 'GG WP!', '🛡️ Need 1 more'].map(qc => `
              <button type="button" class="chat-quick-pill" data-msg="${qc}" style="
                font-size: 0.72rem;
                font-weight: 700;
                color: #ff5522;
                background: rgba(255, 34, 0, 0.15);
                border: 1px solid rgba(255, 34, 0, 0.35);
                border-radius: 12px;
                padding: 3px 9px;
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.15s ease;
              " onmouseover="this.style.background='rgba(255, 34, 0, 0.28)';" onmouseout="this.style.background='rgba(255, 34, 0, 0.15)';">
                ${qc}
              </button>
            `).join('')}
          </div>

          <!-- Chat Messages Body -->
          <div id="chat-messages-body" style="
            flex: 1;
            padding: 14px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: rgba(8, 12, 22, 0.92);
          ">
            <div style="text-align: center; margin: 2px 0 8px;">
              <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 600; background: rgba(30, 41, 59, 0.8); padding: 2px 10px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08);">Today</span>
            </div>

            ${messages.length === 0 ? `
              <div style="text-align: center; padding: 40px 10px; color: #94a3b8;">
                <div style="font-size: 2rem; margin-bottom: 6px; display: flex; justify-content: center; color: #38bdf8;">${Icons.chat}</div>
                <div style="font-size: 0.84rem; font-weight: 600; color: #f8fafc;">No messages yet with ${openFriend.name}</div>
                <div style="font-size: 0.76rem; margin-top: 2px;">Say hello or invite them to party up!</div>
              </div>
            ` : messages.map(msg => {
              const isMe = msg.sender === 'user';
              return `
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: ${isMe ? 'flex-end' : 'flex-start'};
                  max-width: 82%;
                  align-self: ${isMe ? 'flex-end' : 'flex-start'};
                ">
                  <div style="
                    background: ${isMe ? 'linear-gradient(135deg, #ff2200 0%, #d97706 100%)' : 'rgba(30, 41, 59, 0.95)'};
                    color: #ffffff;
                    border-radius: ${isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
                    padding: 9px 13px;
                    font-size: 0.88rem;
                    line-height: 1.4;
                    box-shadow: ${isMe ? '0 3px 12px rgba(255, 34, 0, 0.35)' : '0 2px 6px rgba(0, 0, 0, 0.4)'};
                    border: ${isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.12)'};
                    word-break: break-word;
                  ">
                    ${msg.text}
                  </div>
                  <span style="font-size: 0.68rem; color: #94a3b8; margin-top: 3px; padding: 0 4px;">
                    ${msg.timestamp || 'Just now'}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Apple-Style Messages Input Footer -->
          <div style="
            padding: 10px 14px;
            background: rgba(10, 16, 28, 0.96);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          ">
            <div class="apple-input-capsule">
              <input type="text" id="chat-direct-input" class="apple-input-field" placeholder="iMessage • ${openFriend.name}..." autocomplete="off" />
              <button type="button" id="chat-direct-send-btn" class="apple-send-circle-btn" title="Send message">
                ${Icons.send}
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // 2. FRIENDS LIST WINDOW (When main chat button is clicked)
    if (isFriendsListOpen) {
      html += `
        <div id="friends-list-window" class="hud-panel animate-fade-in" style="
          position: absolute;
          bottom: 70px;
          right: 0;
          width: 330px;
          height: 450px;
          max-height: 80vh;
          background: rgba(13, 19, 33, 0.96);
          backdrop-filter: blur(20px);
          border-radius: 18px;
          border: 1px solid rgba(255, 34, 0, 0.4);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85), 0 0 20px rgba(255, 34, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 10001;
        ">
          <!-- Friends List Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: linear-gradient(135deg, rgba(255, 34, 0, 0.25) 0%, rgba(15, 23, 42, 0.95) 100%);
            border-bottom: 1px solid rgba(255, 34, 0, 0.3);
          ">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.15rem; filter: drop-shadow(0 0 6px #ff2200);">${activeSkin.chatBadge || '🔥'}</span>
              <div>
                <h3 style="font-family: var(--font-header); font-size: 1.05rem; font-weight: 800; color: #ffffff; margin: 0;">
                  Dota 2 Friends
                </h3>
                <div style="font-size: 0.72rem; color: #34d399; font-weight: 700;">
                  🟢 ${onlineCount} Online
                </div>
              </div>
            </div>

            <button type="button" id="friends-list-close-btn" style="
              background: transparent;
              border: none;
              font-size: 1.1rem;
              color: #94a3b8;
              cursor: pointer;
              padding: 4px 6px;
            ">✕</button>
          </div>

          <!-- Search Input -->
          <div style="padding: 10px 14px; background: rgba(10, 16, 28, 0.9); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
            <input type="text" id="friends-search-input" placeholder="🔍 Search friend or rank..." style="
              width: 100%;
              border: 1px solid rgba(255, 255, 255, 0.18);
              border-radius: 8px;
              padding: 7px 12px;
              font-size: 0.84rem;
              color: #ffffff;
              background: rgba(8, 12, 22, 0.9);
              outline: none;
              font-family: inherit;
              box-sizing: border-box;
            " />
          </div>

          <!-- Vertical Friends List -->
          <div id="friends-vertical-list" style="
            flex: 1;
            overflow-y: auto;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            background: rgba(8, 12, 22, 0.92);
          ">
            ${friends.map(f => {
              const statusColor = f.status === 'in_match' ? '#f59e0b' : (f.status === 'away' ? '#94a3b8' : '#10b981');
              return `
                <div class="friend-list-row" data-friend-id="${f.id}" style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 8px 10px;
                  border-radius: 12px;
                  background: rgba(15, 23, 42, 0.75);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  cursor: pointer;
                  transition: all 0.15s ease;
                " onmouseover="this.style.background='rgba(255, 34, 0, 0.18)'; this.style.borderColor='rgba(255, 34, 0, 0.45)';" onmouseout="this.style.background='rgba(15, 23, 42, 0.75)'; this.style.borderColor='rgba(255, 255, 255, 0.1)';">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
                    <!-- Friend Avatar Circle -->
                    <div style="position: relative; width: 42px; height: 42px; border-radius: 50%; background: #0f172a; border: 2px solid #ff2200; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; flex-shrink: 0;">
                      <span>${f.avatar}</span>
                      <div style="position: absolute; bottom: -1px; right: -1px; width: 11px; height: 11px; border-radius: 50%; background: ${statusColor}; border: 2px solid #0f172a;"></div>
                    </div>

                    <div style="min-width: 0;">
                      <div style="display: flex; align-items: center; gap: 6px; flex-wrap: nowrap;">
                        <span style="font-weight: 800; font-size: 0.92rem; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${f.name}</span>
                        <span class="badge badge-gold" style="font-size: 0.65rem; padding: 1px 5px;">${f.rank}</span>
                      </div>
                      <div style="font-size: 0.74rem; color: #94a3b8; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
                        ${f.statusText || f.role || 'Online'}
                      </div>
                    </div>
                  </div>

                  <!-- Apple Message Icon at right of username -->
                  <button type="button" class="friend-row-msg-btn" title="Send message to ${f.name}" style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    color: #38bdf8;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    flex-shrink: 0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                  ">
                    ${Icons.chat}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    // 3. CHAT HEADS STACK (Placed vertically ABOVE the main chat icon)
    html += `
      <div id="chat-heads-stack">
        ${activeHeadIds.map(hid => {
          const friend = friends.find(f => f.id === hid);
          if (!friend) return '';
          const isActive = friend.id === openFriendId;
          const statusClass = `status-${friend.status || 'online'}`;
          return `
            <div class="friend-chat-head-wrapper" title="${friend.name} (${friend.rank})">
              <button type="button" class="friend-chat-head-btn ${isActive ? 'active' : ''}" data-friend-id="${friend.id}">
                <span>${friend.avatar}</span>
                <div class="friend-chat-head-status ${statusClass}"></div>
              </button>
              <button type="button" class="friend-chat-head-close" data-close-friend-id="${friend.id}" title="Close Chat Head">✕</button>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // 4. MAIN CHAT TRIGGER BUTTON (Skin Themed & Glowing Radar Ping)
    html += `
      <button type="button" id="main-chat-trigger-btn" class="main-chat-btn ${isFriendsListOpen ? 'active' : ''}" title="Dota Friends & Chat (${activeSkin.name})" aria-label="Open Dota Friends and Chat">
        <!-- Outer Ambient Halo Glow Ring -->
        <div class="chat-btn-halo"></div>

        <!-- Orbital Revolving Embers Ring -->
        <div class="chat-btn-orbit-ring">
          <div class="chat-orbit-dot"></div>
          <div class="chat-orbit-dot-2"></div>
        </div>

        <!-- Specular Light Sheen Reflection -->
        <div class="chat-btn-sheen"></div>

        <!-- Glowing Custom Skin Chat Icon / Close Morph (Skin Bundle Icon Preserved) -->
        <div class="chat-btn-icon-wrapper">
          <div class="chat-custom-skin-icon" style="display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
            ${activeSkin.chatIconSvg || `<span style="font-size: 1.55rem; filter: drop-shadow(0 0 8px ${activeSkin.accent});">${activeSkin.chatBadge}</span>`}
          </div>
          <span class="chat-btn-close-icon">✕</span>
        </div>

        <!-- Radiant Live Status Gem with Radar Ping -->
        <div class="chat-online-gem" title="${onlineCount} Friends Online">
          <div class="chat-gem-ping-wrapper">
            <span class="chat-gem-ping" style="background: rgba(255, 255, 255, 0.8);"></span>
            <span class="chat-gem-dot" style="background: #ffffff; box-shadow: 0 0 6px #ff2200;"></span>
          </div>
          <span class="chat-gem-count">${onlineCount}</span>
        </div>
      </button>
    `;

    chatContainer.innerHTML = html;

    // Attach Event Listeners
    attachFloatingChatEvents();
  }

  function attachFloatingChatEvents() {
    const mainBtn = document.getElementById('main-chat-trigger-btn');
    if (mainBtn) {
      mainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Store.state.isFriendsListOpen = !Store.state.isFriendsListOpen;
        if (window.Sound) window.Sound.playClick();
        renderFloatingChat();
      });
    }

    document.getElementById('friends-list-close-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      Store.state.isFriendsListOpen = false;
      renderFloatingChat();
    });

    // Search filter in friends list
    const searchInput = document.getElementById('friends-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.friend-list-row').forEach(row => {
          const friendId = row.getAttribute('data-friend-id');
          const friend = (Store.state.friends || []).find(f => f.id === friendId);
          if (friend) {
            const match = friend.name.toLowerCase().includes(query) || (friend.rank && friend.rank.toLowerCase().includes(query)) || (friend.role && friend.role.toLowerCase().includes(query));
            row.style.display = match ? 'flex' : 'none';
          }
        });
      });
    }

    // Click on friend in friends list -> add active chat head & open chat window
    document.querySelectorAll('.friend-list-row').forEach(row => {
      row.addEventListener('click', () => {
        const friendId = row.getAttribute('data-friend-id');
        if (!friendId) return;

        if (!Store.state.activeChatHeads) Store.state.activeChatHeads = [];
        if (!Store.state.activeChatHeads.includes(friendId)) {
          Store.state.activeChatHeads.push(friendId);
        }
        Store.state.openChatFriendId = friendId;
        Store.state.isFriendsListOpen = false;
        Store.save();
        if (window.Sound) window.Sound.playClick();
        renderFloatingChat();

        setTimeout(() => {
          document.getElementById('chat-direct-input')?.focus();
          const body = document.getElementById('chat-messages-body');
          if (body) body.scrollTop = body.scrollHeight;
        }, 50);
      });
    });

    // Click on friend chat head -> toggle/open direct chat window
    document.querySelectorAll('.friend-chat-head-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const friendId = btn.getAttribute('data-friend-id');
        if (Store.state.openChatFriendId === friendId) {
          Store.state.openChatFriendId = null;
        } else {
          Store.state.openChatFriendId = friendId;
          Store.state.isFriendsListOpen = false;
        }
        Store.save();
        if (window.Sound) window.Sound.playClick();
        renderFloatingChat();

        setTimeout(() => {
          document.getElementById('chat-direct-input')?.focus();
          const body = document.getElementById('chat-messages-body');
          if (body) body.scrollTop = body.scrollHeight;
        }, 50);
      });
    });

    // Close chat head button (✕)
    document.querySelectorAll('.friend-chat-head-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const friendId = btn.getAttribute('data-close-friend-id');
        Store.state.activeChatHeads = (Store.state.activeChatHeads || []).filter(id => id !== friendId);
        if (Store.state.openChatFriendId === friendId) {
          Store.state.openChatFriendId = null;
        }
        Store.save();
        if (window.Sound) window.Sound.playClick();
        renderFloatingChat();
      });
    });

    // Open Profile Card on chat header click
    document.querySelector('.chat-header-profile-trigger')?.addEventListener('click', () => {
      if (openFriend) {
        openPlayerProfileCardModal(openFriend);
      }
    });

    // Minimize & Close chat window buttons
    document.getElementById('chat-window-minimize-btn')?.addEventListener('click', () => {
      Store.state.openChatFriendId = null;
      Store.save();
      renderFloatingChat();
    });

    document.getElementById('chat-window-close-btn')?.addEventListener('click', () => {
      Store.state.openChatFriendId = null;
      Store.save();
      renderFloatingChat();
    });

    // Send Message Handler
    const sendMessage = (textToSend) => {
      const openFriendId = Store.state.openChatFriendId;
      if (!openFriendId) return;
      const input = document.getElementById('chat-direct-input');
      const text = textToSend || (input ? input.value.trim() : '');
      if (!text) return;

      if (!Store.state.chatMessages) Store.state.chatMessages = {};
      if (!Store.state.chatMessages[openFriendId]) Store.state.chatMessages[openFriendId] = [];

      // Ensure friend is in active chat heads
      if (!Store.state.activeChatHeads) Store.state.activeChatHeads = [];
      if (!Store.state.activeChatHeads.includes(openFriendId)) {
        Store.state.activeChatHeads.push(openFriendId);
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      Store.state.chatMessages[openFriendId].push({
        sender: 'user',
        text: text,
        timestamp: timeStr
      });

      const friendObj = (Store.state.friends || []).find(f => f.id === openFriendId);
      if (friendObj) friendObj.lastMessage = text;

      // Broadcast over Supabase Realtime Channel
      if (activeRealtimeChatChannel) {
        activeRealtimeChatChannel.send({
          type: 'broadcast',
          event: 'dm_message',
          payload: {
            id: 'dm_' + Date.now(),
            senderId: user.id || user.username,
            receiverId: openFriendId,
            senderName: user.displayName || user.username,
            senderAvatar: user.avatar || '👑',
            senderRank: user.rank || 'Divine V',
            text: text,
            timestamp: timeStr
          }
        }).catch(() => {});
      }

      // Persist to Supabase DB if user is authenticated with UUID
      const sb = getSupabase();
      if (sb && user.id && typeof user.id === 'string' && user.id.length > 20) {
        sb.from('direct_messages').insert({
          sender_id: user.id,
          receiver_id: friendObj?.supabaseId || user.id,
          text: text
        }).then(() => {}).catch(() => {});
      }

      Store.save();
      if (window.Sound) window.Sound.playMessage();
      if (input) input.value = '';

      renderFloatingChat();

      setTimeout(() => {
        const body = document.getElementById('chat-messages-body');
        if (body) body.scrollTop = body.scrollHeight;
        document.getElementById('chat-direct-input')?.focus();
      }, 50);

      // Automated Dota response simulation for bot/squad friends
      const isBotFriend = ['friend_topson', 'friend_miracle', 'friend_ana', 'friend_abed', 'friend_kuku', 'friend_yatoro'].includes(openFriendId);
      if (isBotFriend) {
        setTimeout(() => {
          const replies = [
            "G! Let's party up and queue for ranked.",
            "Nice! Invite me to party lobby, I'm ready.",
            "Let's lock in and pick our signature heroes!",
            "On it! Let's get that MMR win.",
            "I'm in! Let me just finish this drink."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          if (!Store.state.chatMessages[openFriendId]) Store.state.chatMessages[openFriendId] = [];
          Store.state.chatMessages[openFriendId].push({
            sender: 'friend',
            text: randomReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });

          if (friendObj) friendObj.lastMessage = randomReply;
          Store.save();
          if (window.Sound) window.Sound.playMessage();

          renderFloatingChat();

          setTimeout(() => {
            const body = document.getElementById('chat-messages-body');
            if (body) body.scrollTop = body.scrollHeight;
          }, 50);
        }, 1200);
      }
    };

    document.getElementById('chat-direct-send-btn')?.addEventListener('click', () => sendMessage());

    document.getElementById('chat-direct-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });

    // Quick-chat pills
    document.querySelectorAll('.chat-quick-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const msg = pill.getAttribute('data-msg');
        if (msg) sendMessage(msg);
      });
    });
  }

  /* ==========================================================================
     UI SKIN THEME SYNCHRONIZER
     ========================================================================== */
  function applySkinToUI(skinId, customBanner = null) {
    const user = Store.state.currentUser;
    if (!user) return;
    const skin = SKIN_BUNDLES.find(s => s.id === (skinId || user.skin || 'shadow-fiend')) || SKIN_BUNDLES[0];
    
    // 1. Set data-skin on body
    document.body.setAttribute('data-skin', skin.id);

    // 2. Set Canvas Background Engine Style
    if (window.nexusBgInstance) {
      window.nexusBgInstance.setSkin(skin.bgStyle);
    }

    // 3. Update Live Banner on Profile if on view
    const activeBannerUrl = customBanner || user.banner || skin.banner;
    const liveBanner = document.querySelector('.profile-fullwidth-banner');
    if (liveBanner) {
      liveBanner.style.backgroundImage = `url("${encodeURI(activeBannerUrl)}")`;
    }

    // 4. Update SVG Neon Border Laser Stroke Colors on Rectangle Profile Picture
    const track = document.querySelector('.profile-neon-svg .neon-border-track');
    const glow = document.querySelector('.profile-neon-svg .neon-border-glow');
    const traveler = document.querySelector('.profile-neon-svg .neon-border-traveler');
    const head = document.querySelector('.profile-neon-svg .neon-border-head');
    if (track) track.style.stroke = `${skin.accent}33`;
    if (glow) glow.style.stroke = skin.borderGlow;
    if (traveler) traveler.style.stroke = skin.borderColor;
    if (head) head.style.stroke = skin.borderHead;

    // 5. Update Profile Left Column Container Background (Gender/SEA/Address/Rank/Tabs)
    const profileContainer = document.querySelector('.profile-vertical-details');
    if (profileContainer) {
      profileContainer.style.backgroundImage = `url("${encodeURI(skin.cardBg || 'assets/sf-container-bg.jpg')}")`;
    }

    // 6. Update Floating Chat Trigger Button
    renderFloatingChat();
  }

  /* --- MODAL: CHANGE HERO & AESTHETIC SKIN --- */
  function openChangeSkinModal() {
    const user = Store.state.currentUser;
    if (!user) return;

    document.getElementById('change-skin-modal')?.remove();
    if (window.Sound) window.Sound.playClick();

    const skin = SKIN_BUNDLES[0]; // Shadow Fiend — Abyssal Soulfire

    const modalHtml = `
      <div id="change-skin-modal" class="modal-overlay" style="position: fixed; inset: 0; background: rgba(10, 15, 26, 0.75); backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; z-index: 2100; padding: 20px;">
        <div class="hud-panel" style="width: 100%; max-width: 680px; max-height: 92vh; overflow-y: auto; padding: 26px 30px; border-radius: var(--radius-lg); background: rgba(13, 19, 33, 0.96); backdrop-filter: blur(20px); border: 1.5px solid rgba(255, 34, 0, 0.4); box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 34, 0, 0.2); position: relative; animation: fadeInDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
          
          <!-- Modal Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, rgba(255, 34, 0, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%); color: #ff2200; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; border: 1px solid rgba(255, 34, 0, 0.35); box-shadow: 0 0 16px rgba(255, 34, 0, 0.25);">
                🎭
              </div>
              <div>
                <h3 style="font-family: var(--font-header); font-size: 1.35rem; font-weight: 900; color: #ffffff; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <span>Hero Skin: Abyssal Soulfire</span>
                  <span class="badge" style="font-size: 0.7rem; padding: 2px 7px; background: #ff2200; color: #ffffff; font-weight: 800;">SIGNATURE</span>
                </h3>
                <p style="font-size: 0.82rem; color: #94a3b8; margin: 2px 0 0;">
                  Synchronizes Cover Banner, Neon Border Laser, Obsidian Armor Container, Ambient Background & Chat Icon.
                </p>
              </div>
            </div>
            <button id="close-change-skin-btn" style="background: transparent; border: none; font-size: 1.4rem; color: #94a3b8; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color 0.2s ease;">✕</button>
          </div>

          <!-- 1. LIVE MULTI-ELEMENT PREVIEW -->
          <div style="margin-bottom: 22px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 0.82rem; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em;">Active Skin Preview</span>
              <span style="font-size: 0.8rem; font-weight: 800; color: ${skin.accent};">
                ${skin.tag}
              </span>
            </div>
            
            <div id="modal-skin-live-banner" class="banner-preview-wrapper" style="height: 180px; background-image: url('${encodeURI(skin.banner)}');">
              <div class="profile-banner-ambient"></div>
              <div class="profile-banner-grid"></div>
              
              <!-- Mini Rectangular Avatar with Live SVG Neon Laser Path -->
              <div style="position: absolute; left: 20px; bottom: 14px; z-index: 15; display: flex; align-items: center; gap: 16px;">
                <div style="position: relative; width: 62px; height: 80px; border-radius: 12px; background: #0a0307; display: flex; align-items: center; justify-content: center;">
                  <!-- Mini SVG Traveling Border Laser -->
                  <svg style="position: absolute; inset: -2px; width: calc(100% + 4px); height: calc(100% + 4px); overflow: visible; pointer-events: none; z-index: 20;" viewBox="0 0 62 80">
                    <rect x="2" y="2" width="58" height="76" rx="10" ry="10" pathLength="1000" fill="none" stroke="${skin.accent}33" stroke-width="2.5" />
                    <rect x="2" y="2" width="58" height="76" rx="10" ry="10" pathLength="1000" fill="none" stroke="${skin.borderGlow}" stroke-width="5" stroke-linecap="round" stroke-dasharray="220 280 220 280" style="animation: neonBorderPathTravel 3.2s linear infinite; filter: blur(3px);" />
                    <rect x="2" y="2" width="58" height="76" rx="10" ry="10" pathLength="1000" fill="none" stroke="${skin.borderColor}" stroke-width="3" stroke-linecap="round" stroke-dasharray="180 320 180 320" style="animation: neonBorderPathTravel 3.2s linear infinite;" />
                    <rect x="2" y="2" width="58" height="76" rx="10" ry="10" pathLength="1000" fill="none" stroke="${skin.borderHead}" stroke-width="3" stroke-linecap="round" stroke-dasharray="55 445 55 445" style="animation: neonBorderPathTravel 3.2s linear infinite;" />
                  </svg>
                  <div style="width: 100%; height: 100%; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; z-index: 10;">
                    ${renderAvatarHTML(user.avatar)}
                  </div>
                </div>

                <div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <div style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 900; color: #ffffff; text-shadow: 0 2px 10px rgba(0,0,0,0.95); line-height: 1.2;">
                      ${user.displayName || user.username}
                    </div>
                    <div style="font-size: 0.7rem; font-weight: 700; color: #ffffff; background: rgba(10, 15, 26, 0.8); border: 1px solid rgba(255, 34, 0, 0.4); padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
                      ${user.followersCount || '100k'} followers • ${user.followingCount || '10'} Following
                    </div>
                  </div>
                  <div style="font-size: 0.78rem; color: rgba(255,255,255,0.9); font-style: italic; text-shadow: 0 1px 4px rgba(0,0,0,0.9); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
                    “${user.quote || 'The path to victory is paved with courage...'}”
                  </div>
                </div>
              </div>

              <!-- Mini Floating Chat Trigger Preview -->
              <div style="position: absolute; right: 16px; bottom: 14px; z-index: 15; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                <span style="font-size: 0.68rem; font-weight: 700; color: #ffffff; text-shadow: 0 1px 4px rgba(0,0,0,0.9);">Chat Icon Preview</span>
                <div style="position: relative; width: 48px; height: 48px; border-radius: 50%; background: radial-gradient(circle at 35% 25%, #2a0808 0%, #150508 45%, #080204 80%, #000000 100%); border: 2px solid ${skin.accent}; box-shadow: 0 0 20px ${skin.accent}88, inset 0 2px 4px rgba(255,100,50,0.4); display: flex; align-items: center; justify-content: center;">
                  <div style="transform: scale(0.85); display: flex; align-items: center; justify-content: center;">
                    ${skin.chatIconSvg || `<span>${skin.chatBadge}</span>`}
                  </div>
                </div>
              </div>
            </div>

            <div style="font-size: 0.82rem; color: #cbd5e1; margin-top: 10px; font-style: italic;">
              ${skin.desc}
            </div>
          </div>

          <!-- 2. SYNCHRONIZED THEME BUNDLE BREAKDOWN -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
              Included Theme Components
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
              <div style="padding: 12px 14px; border-radius: 12px; background: rgba(255, 34, 0, 0.08); border: 1px solid rgba(255, 34, 0, 0.25); display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 1.25rem;">🖼️</span>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #ffffff; font-weight: 800;">Requiem Cover Banner</strong>
                  <span style="font-size: 0.74rem; color: #94a3b8;">1920×360 demonic artwork</span>
                </div>
              </div>

              <div style="padding: 12px 14px; border-radius: 12px; background: rgba(255, 34, 0, 0.08); border: 1px solid rgba(255, 34, 0, 0.25); display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 1.25rem;">⚡</span>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #ffffff; font-weight: 800;">Netherflame Border Laser</strong>
                  <span style="font-size: 0.74rem; color: #94a3b8;">Continuous perimeter orbit</span>
                </div>
              </div>

              <div style="padding: 12px 14px; border-radius: 12px; background: rgba(255, 34, 0, 0.08); border: 1px solid rgba(255, 34, 0, 0.25); display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 1.25rem;">🌌</span>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #ffffff; font-weight: 800;">Atmospheric Background</strong>
                  <span style="font-size: 0.74rem; color: #94a3b8;">Abyssal battlefield & rising embers</span>
                </div>
              </div>

              <div style="padding: 12px 14px; border-radius: 12px; background: rgba(255, 34, 0, 0.08); border: 1px solid rgba(255, 34, 0, 0.25); display: flex; align-items: flex-start; gap: 10px;">
                <span style="font-size: 1.25rem;">🔥</span>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #ffffff; font-weight: 800;">Demonic Chat & Scrollbars</strong>
                  <span style="font-size: 0.74rem; color: #94a3b8;">Custom chat crest & soulfire scrollbars</span>
                </div>
              </div>

              <div style="padding: 12px 14px; border-radius: 12px; background: rgba(255, 34, 0, 0.08); border: 1px solid rgba(255, 34, 0, 0.25); display: flex; align-items: flex-start; gap: 10px; grid-column: 1 / -1;">
                <span style="font-size: 1.25rem;">👹</span>
                <div>
                  <strong style="display: block; font-size: 0.85rem; color: #ffffff; font-weight: 800;">Nevermore Obsidian Armor Panel</strong>
                  <span style="font-size: 0.74rem; color: #94a3b8;">Themed container backdrop for Gender, SEA Region, Address, Rank & Tabs</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Footer -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
            <button type="button" id="cancel-change-skin-btn" class="btn btn-secondary" style="padding: 8px 18px; color: #cbd5e1;">
              Close
            </button>
            <button type="button" id="save-change-skin-btn" class="btn btn-primary" style="padding: 9px 24px; font-weight: 800; background: linear-gradient(135deg, #ff2200 0%, #d97706 100%); border: none; box-shadow: 0 4px 16px rgba(255, 34, 0, 0.4);">
              🎭 Equip Abyssal Soulfire
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('change-skin-modal');
    const close = () => modal?.remove();

    // Close handlers
    document.getElementById('close-change-skin-btn')?.addEventListener('click', close);
    document.getElementById('cancel-change-skin-btn')?.addEventListener('click', close);
    modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });

    // Save & Apply
    document.getElementById('save-change-skin-btn')?.addEventListener('click', () => {
      user.skin = skin.id;
      user.banner = skin.banner;
      Store.save();

      applySkinToUI(user.skin, user.banner);

      if (window.Sound) window.Sound.playVictory();
      Toast.success('Skin Equipped!', `Equipped ${skin.name} bundle.`);
      close();
    });
  }

  /* --- MODAL: EDIT PROFILE --- */
  function openEditProfileModal() {
    const user = Store.state.currentUser;
    if (!user) return;

    document.getElementById('edit-profile-modal')?.remove();

    const heroAvatarPresets = [
      { name: 'Shadow Fiend', img: 'assets/avatar-shadow-fiend.jpg' },
      { name: 'Invoker', img: 'assets/avatar-invoker.jpg' },
      { name: 'Juggernaut', img: 'assets/avatar-juggernaut.jpg' }
    ];

    let currentSelectedAvatar = user.avatar || 'assets/avatar-shadow-fiend.jpg';

    const modalHtml = `
      <div id="edit-profile-modal" class="modal-overlay" style="position: fixed; inset: 0; background: rgba(10, 15, 26, 0.82); backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px;">
        <div class="hud-panel" style="width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; padding: 26px 28px; border-radius: var(--radius-lg); background: rgba(13, 19, 33, 0.98); backdrop-filter: blur(20px); border: 1.5px solid rgba(255, 34, 0, 0.45); box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 34, 0, 0.25); position: relative; animation: fadeInDown 0.25s ease;">
          
          <!-- Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.3rem;">✏️</span>
              <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 900; color: #ffffff; margin: 0;">
                Edit Profile
              </h3>
            </div>
            <button id="close-edit-profile-btn" style="background: transparent; border: none; font-size: 1.4rem; color: #94a3b8; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: color 0.2s ease;">✕</button>
          </div>

          <form id="edit-profile-form" style="display: flex; flex-direction: column; gap: 14px;">
            
            <!-- 1. PROFILE PICTURE IMAGE SELECTOR / UPLOAD -->
            <div>
              <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                Profile Picture (Image Upload & Presets)
              </label>
              
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 10px;">
                <!-- Live Avatar Preview Frame -->
                <div style="position: relative; width: 72px; height: 88px; border-radius: 14px; background: #0c0204; border: 2px solid #ff2200; box-shadow: 0 0 18px rgba(255, 34, 0, 0.45); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <div id="edit-avatar-preview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                    ${renderAvatarHTML(currentSelectedAvatar)}
                  </div>
                </div>
                
                <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                  <!-- Upload Image File Button -->
                  <div>
                    <input type="file" id="edit-profile-avatar-file" accept="image/*" style="display: none;">
                    <button type="button" id="trigger-avatar-upload-btn" class="btn btn-secondary" style="font-size: 0.82rem; font-weight: 700; padding: 7px 14px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; border-color: rgba(255, 34, 0, 0.4); background: rgba(255, 34, 0, 0.1); color: #ffffff;">
                      <span>📷</span>
                      <span>Upload Profile Image</span>
                    </button>
                  </div>

                  <!-- Preset Hero Avatars -->
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Presets:</span>
                    <div style="display: flex; gap: 8px;">
                      ${heroAvatarPresets.map(hp => `
                        <button type="button" class="avatar-hero-preset-btn ${hp.img === currentSelectedAvatar ? 'active' : ''}" data-avatar-img="${hp.img}" title="${hp.name}" style="
                          width: 38px;
                          height: 38px;
                          border-radius: 10px;
                          padding: 0;
                          overflow: hidden;
                          background: #000;
                          border: 2px solid ${hp.img === currentSelectedAvatar ? '#ff2200' : 'rgba(255, 255, 255, 0.15)'};
                          box-shadow: ${hp.img === currentSelectedAvatar ? '0 0 10px rgba(255, 34, 0, 0.6)' : 'none'};
                          cursor: pointer;
                          transition: all 0.18s ease;
                        ">
                          <img src="${hp.img}" alt="${hp.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                        </button>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Direct Image URL Input (Alternative) -->
              <div>
                <input type="text" id="edit-profile-avatar-url" class="input-control" placeholder="Or paste direct image URL (https://...)" value="${(typeof currentSelectedAvatar === 'string' && (currentSelectedAvatar.startsWith('http://') || currentSelectedAvatar.startsWith('https://'))) ? currentSelectedAvatar : ''}" style="width: 100%; font-size: 0.8rem; padding: 6px 10px;">
              </div>
            </div>

            <!-- 2. DISPLAY NAME (Preserves user exact casing format) -->
            <div>
              <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
                Display Name <span style="font-size: 0.74rem; color: #94a3b8; font-weight: normal;">(Letter casing is preserved exactly)</span>
              </label>
              <input type="text" id="edit-profile-name" class="input-control" value="${user.displayName || user.username}" required style="width: 100%; font-weight: 700; font-size: 0.95rem;">
            </div>

            <!-- 3. GENDER & RANK TIER -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Gender</label>
                <select id="edit-profile-gender" class="input-control" style="width: 100%;">
                  <option value="Male" ${(user.gender || 'Male') === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${(user.gender || '') === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other" ${(user.gender || '') === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Rank Tier</label>
                <select id="edit-profile-rank" class="input-control" style="width: 100%;">
                  ${['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine I', 'Divine II', 'Divine III', 'Divine IV', 'Divine V', 'Immortal'].map(r => `
                    <option value="${r}" ${(user.rank || 'Divine V') === r ? 'selected' : ''}>${r}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- 4. REGION & DOTA FRIEND ID -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Region</label>
                <select id="edit-profile-region" class="input-control" style="width: 100%;">
                  ${['SEA', 'US East', 'US West', 'Europe West', 'Europe East', 'China', 'South America', 'Japan', 'Australia'].map(reg => `
                    <option value="${reg}" ${(user.region || 'SEA') === reg ? 'selected' : ''}>${reg}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Dota Friend ID</label>
                <input type="text" id="edit-profile-dotaid" class="input-control" value="${user.dotaId || '782910432'}" placeholder="e.g. 782910432" style="width: 100%;">
              </div>
            </div>

            <!-- 5. ADDRESS / LOCATION -->
            <div>
              <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Address / Location</label>
              <input type="text" id="edit-profile-address" class="input-control" value="${user.address || 'Philippines, Metro Manila'}" placeholder="e.g. Philippines, Metro Manila" style="width: 100%;">
            </div>

            <!-- 6. CUSTOM QUOTE -->
            <div>
              <label style="display: block; font-size: 0.8rem; color: #cbd5e1; margin-bottom: 5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Custom Quote / Motto</label>
              <input type="text" id="edit-profile-quote" class="input-control" value="${user.quote || 'The path to victory is paved with courage, patience, and unbreakable teamwork.'}" placeholder="Your signature quote on the banner" style="width: 100%;">
            </div>

            <!-- Footer Buttons -->
            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
              <button type="button" class="btn btn-secondary" id="cancel-edit-profile-btn" style="padding: 8px 18px;">Cancel</button>
              <button type="submit" class="btn btn-primary" style="padding: 9px 24px; font-weight: 800; background: linear-gradient(135deg, #ff2200 0%, #d97706 100%); border: none; box-shadow: 0 4px 16px rgba(255, 34, 0, 0.4);">
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('edit-profile-modal');
    const close = () => modal?.remove();
    const previewEl = document.getElementById('edit-avatar-preview');
    const fileInput = document.getElementById('edit-profile-avatar-file');
    const uploadBtn = document.getElementById('trigger-avatar-upload-btn');
    const urlInput = document.getElementById('edit-profile-avatar-url');

    const updatePreview = (newAvatar) => {
      currentSelectedAvatar = newAvatar;
      if (previewEl) {
        previewEl.innerHTML = renderAvatarHTML(newAvatar);
      }
      modal.querySelectorAll('.avatar-hero-preset-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-avatar-img') === newAvatar;
        btn.style.borderColor = isSelected ? '#ff2200' : 'rgba(255, 255, 255, 0.15)';
        btn.style.boxShadow = isSelected ? '0 0 10px rgba(255, 34, 0, 0.6)' : 'none';
      });
    };

    // File Upload Trigger
    uploadBtn?.addEventListener('click', () => fileInput?.click());

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          Toast.error('File Too Large', 'Please select an image smaller than 5MB.');
          return;
        }
        const reader = new FileReader();
        reader.onload = (re) => {
          if (re.target?.result) {
            updatePreview(re.target.result);
            if (urlInput) urlInput.value = '';
          }
        };
        reader.readAsDataURL(file);
      }
    });

    // Preset hero avatar click events
    modal.querySelectorAll('.avatar-hero-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const avImg = btn.getAttribute('data-avatar-img');
        if (avImg) {
          updatePreview(avImg);
          if (urlInput) urlInput.value = '';
        }
      });
    });

    // Custom URL input event
    urlInput?.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        updatePreview(val);
      }
    });

    document.getElementById('close-edit-profile-btn')?.addEventListener('click', close);
    document.getElementById('cancel-edit-profile-btn')?.addEventListener('click', close);
    modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });

    document.getElementById('edit-profile-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('edit-profile-name').value.trim();
      const newGender = document.getElementById('edit-profile-gender').value;
      const newAddress = document.getElementById('edit-profile-address').value.trim();
      const newQuote = document.getElementById('edit-profile-quote').value.trim();
      const newRank = document.getElementById('edit-profile-rank').value;
      const newDotaId = document.getElementById('edit-profile-dotaid').value.trim();
      const newRegion = document.getElementById('edit-profile-region').value;

      user.avatar = currentSelectedAvatar || user.avatar || 'assets/avatar-shadow-fiend.jpg';
      user.displayName = newName || user.username;
      user.gender = newGender;
      user.address = newAddress;
      user.quote = newQuote || 'The path to victory is paved with courage, patience, and unbreakable teamwork.';
      user.rank = newRank;
      user.dotaId = newDotaId;
      user.region = newRegion;

      Store.save();
      const sb = getSupabase();
      if (sb && user.id) {
        await sb.from('profiles').update({
          avatar: user.avatar,
          display_name: user.displayName,
          gender: user.gender,
          rank: user.rank,
          region: user.region,
          address: user.address,
          dota_id: user.dotaId,
          quote: user.quote
        }).eq('id', user.id).catch(() => {});
      }

      if (window.Sound) window.Sound.playClick();
      Toast.success('Profile Updated!', 'Your profile details have been saved.');
      close();
      renderLayoutShell();
      renderHome();
    });
  }

  /* --- MODAL: TWO-COLUMN PLAYER PROFILE CARD (Shadow Fiend Bundle Theme) --- */
  function openPlayerProfileCardModal(targetUserOrName, isSelfView = false) {
    const currentUser = Store.state.currentUser;
    if (!currentUser) return;

    document.getElementById('player-profile-card-modal')?.remove();

    // Resolve target player object
    let target = null;
    if (typeof targetUserOrName === 'string') {
      const nameQuery = targetUserOrName.trim();
      target = (Store.state.users || []).find(u => 
        (u.displayName && u.displayName.toLowerCase() === nameQuery.toLowerCase()) || 
        (u.username && u.username.toLowerCase() === nameQuery.toLowerCase()) || 
        u.id === nameQuery
      );
      if (!target) {
        target = (Store.state.friends || []).find(f => 
          (f.name && f.name.toLowerCase() === nameQuery.toLowerCase()) || 
          f.id === nameQuery
        );
      }
      if (!target && currentUser && (
        (currentUser.displayName && currentUser.displayName.toLowerCase() === nameQuery.toLowerCase()) ||
        (currentUser.username && currentUser.username.toLowerCase() === nameQuery.toLowerCase()) ||
        currentUser.id === nameQuery
      )) {
        target = currentUser;
      }
      if (!target) {
        // Find from posts author
        const p = (Store.state.communityPosts || []).find(post => post.authorName && post.authorName.toLowerCase() === nameQuery.toLowerCase());
        if (p) {
          target = {
            id: p.authorId || ('user_' + nameQuery),
            displayName: p.authorName,
            username: p.authorName,
            avatar: p.authorAvatar || 'assets/avatar-shadow-fiend.jpg',
            rank: p.authorRank || 'Divine',
            region: 'SEA',
            address: 'SEA Server',
            dotaId: '782910432',
            followersCount: '12.4k',
            followingCount: '8',
            quote: 'Mastering the lane with focus, precision, and relentless carry play.'
          };
        }
      }
      if (!target) {
        target = {
          id: 'user_' + nameQuery,
          displayName: nameQuery,
          username: nameQuery,
          avatar: 'assets/avatar-shadow-fiend.jpg',
          rank: 'Ancient V',
          region: 'SEA',
          address: 'Philippines, Metro Manila',
          dotaId: '694208173',
          followersCount: '8.5k',
          followingCount: '14',
          quote: 'Ready to battle on Ancient grounds!'
        };
      }
    } else if (targetUserOrName && typeof targetUserOrName === 'object') {
      target = targetUserOrName;
    } else {
      target = currentUser;
    }

    const targetDisplayName = target.displayName || target.name || target.username || 'Hero';
    const isSelf = isSelfView || (currentUser && (target.id === currentUser.id || targetDisplayName.toLowerCase() === (currentUser.displayName || currentUser.username).toLowerCase()));

    // Social relationships
    if (!Store.state.followingList) {
      Store.state.followingList = ['MiranaShadow', 'InvokerPro', 'DOTA2_Official'];
    }
    let isFollowing = (Store.state.followingList || []).includes(targetDisplayName);
    let isFriend = (Store.state.friends || []).some(f => f.name && f.name.toLowerCase() === targetDisplayName.toLowerCase());

    const targetFollowers = target.followersCount || (isSelf ? (currentUser.followersCount || '100k') : '24.8k');
    const targetFollowing = target.followingCount || (isSelf ? (currentUser.followingCount || '10') : '15');

    // Retrieve target player's personal feed posts
    const targetPosts = (Store.state.communityPosts || []).filter(p => 
      (p.authorName && p.authorName.toLowerCase() === targetDisplayName.toLowerCase()) || 
      p.authorId === target.id ||
      (isSelf && (p.badge === 'Founder' || p.authorName === currentUser.username))
    );

    const postsToRender = targetPosts.length > 0 ? targetPosts : [
      {
        id: 'post_card_demo_' + Date.now(),
        authorName: targetDisplayName,
        authorAvatar: target.avatar || 'assets/avatar-shadow-fiend.jpg',
        authorRank: target.rank || 'Divine V',
        timestamp: '2 hours ago',
        tag: 'Ranked Highlight',
        content: `⚔️ Dominating performance in SEA Ranked with Shadow Fiend! Secured a clean 16/1/12 KDA and locked in the win. GG WP team! 🔥`,
        likes: 48,
        likedByMe: true,
        comments: [
          { author: 'InvokerPro', avatar: 'assets/avatar-invoker.jpg', text: 'Clean Requiem positioning! That setup won the match.', timestamp: '1 hour ago' },
          { author: 'JuggernautSlash', avatar: 'assets/avatar-juggernaut.jpg', text: 'Top tier shadow raze hits.', timestamp: '30 mins ago' }
        ]
      }
    ];

    const modalHtml = `
      <div id="player-profile-card-modal" class="modal-overlay" style="position: fixed; inset: 0; background: rgba(8, 12, 22, 0.85); backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; z-index: 2050; padding: 20px;">
        <div class="player-profile-card-dialog">
          <!-- Close Button -->
          <button id="close-profile-card-btn" title="Close Profile Card" style="position: absolute; top: 16px; right: 18px; z-index: 50; background: rgba(10, 15, 26, 0.7); border: 1px solid rgba(255, 34, 0, 0.4); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 1.1rem; cursor: pointer; transition: all 0.2s ease;">✕</button>
          
          <!-- LEFT COLUMN (30% Width): Player Bio & Social Actions -->
          <div class="profile-card-left-col">
            <!-- Avatar with inner gap and status dot -->
            <div class="profile-card-avatar-box">
              ${renderAvatarHTML(target.avatar || 'assets/avatar-shadow-fiend.jpg')}
              <div class="status-dot status-online" style="position: absolute; bottom: 4px; right: 4px; width: 12px; height: 12px; border: 2px solid #080204; border-radius: 50%; background: #16a34a; box-shadow: 0 0 8px #16a34a;"></div>
            </div>

            <div style="text-align: center;">
              <div style="font-family: var(--font-header); font-size: 1.35rem; font-weight: 900; color: #ffffff; line-height: 1.2; text-shadow: 0 2px 8px rgba(0,0,0,0.8); text-transform: none !important;">
                ${targetDisplayName}
              </div>
              <div style="margin-top: 6px;">
                <span class="badge badge-gold" style="font-size: 0.75rem; padding: 2px 10px; font-weight: 800;">👑 ${target.rank || 'Divine V'}</span>
              </div>
            </div>

            <!-- Followers / Following Pill -->
            <div class="profile-card-followers-pill" title="👤 Followers: ${targetFollowers} | ➡️ Following: ${targetFollowing}">
              <span style="font-weight: 800; color: #ffffff;">${targetFollowers} <span style="font-weight: 500; color: rgba(255,255,255,0.7);">followers</span></span>
              <span style="color: #ff3311; font-weight: 900;">•</span>
              <span style="font-weight: 800; color: #ffffff;">${targetFollowing} <span style="font-weight: 500; color: rgba(255,255,255,0.7);">Following</span></span>
            </div>

            <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(255, 34, 0, 0.5), transparent); margin: 2px 0;"></div>

            <!-- Detailed Info Items -->
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
              <div style="display: flex; align-items: center; gap: 8px; color: #cbd5e1;">
                <span style="color: var(--accent-gold);">${Icons.region}</span>
                <span style="font-weight: 700; color: #94a3b8;">Region:</span>
                <span style="color: #ffffff; margin-left: auto; font-weight: 700;">${target.region || 'SEA'}</span>
              </div>

              <div style="display: flex; align-items: center; gap: 8px; color: #cbd5e1;">
                <span style="color: var(--accent-gold);">${Icons.location}</span>
                <span style="font-weight: 700; color: #94a3b8;">Location:</span>
                <span style="color: #ffffff; margin-left: auto; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 135px;" title="${target.address || 'Philippines, Metro Manila'}">${target.address || 'Philippines, Metro Manila'}</span>
              </div>

              <div style="display: flex; align-items: center; gap: 8px; color: #cbd5e1;">
                <span style="color: var(--accent-gold);">🆔</span>
                <span style="font-weight: 700; color: #94a3b8;">Dota ID:</span>
                <span style="color: #f8fafc; margin-left: auto; font-family: monospace; font-weight: 800; font-size: 0.88rem; background: rgba(0, 0, 0, 0.55); padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(255, 34, 0, 0.35);">${target.dotaId || '782910432'}</span>
              </div>
            </div>

            <!-- Quote / Motto Box -->
            <div style="background: rgba(0, 0, 0, 0.55); border: 1px solid rgba(255, 34, 0, 0.3); border-radius: 10px; padding: 9px 11px; font-size: 0.78rem; font-style: italic; color: #cbd5e1; line-height: 1.4; text-align: center;">
              “${target.quote || 'The path to victory is paved with courage, patience, and unbreakable teamwork.'}”
            </div>

            <!-- Social Action Buttons (Apple-Style Follow, Add Friend, Message) -->
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: auto; padding-top: 6px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button type="button" id="card-follow-toggle-btn" class="${isFollowing ? 'btn-card-following' : 'btn-card-follow'}" style="border-radius: 9999px;">
                  ${isFollowing ? Icons.check : Icons.plus} <span>${isFollowing ? 'Following' : 'Follow'}</span>
                </button>
                <button type="button" id="card-friend-toggle-btn" class="${isFriend ? 'btn-card-friends-active' : 'btn-card-friend'}" style="border-radius: 9999px;">
                  ${isFriend ? Icons.userCheck : Icons.userPlus} <span>${isFriend ? 'Friends' : 'Add Friend'}</span>
                </button>
              </div>
              <button type="button" id="card-direct-message-btn" class="apple-capsule-btn" style="width: 100%; padding: 9px; font-weight: 700; background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2);">
                ${Icons.chatBubble} <span>Send Message</span>
              </button>
            </div>
          </div>

          <!-- RIGHT COLUMN (70% Width): Personal Activity & Match Feed -->
          <div class="profile-card-right-col">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 12px;">
              <div>
                <h3 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 900; color: #ffffff; margin: 0; display: flex; align-items: center; gap: 8px;">
                  <span>📜</span>
                  <span>${targetDisplayName}'s Personal Feed</span>
                </h3>
                <p style="font-size: 0.78rem; color: #94a3b8; margin: 2px 0 0;">
                  Public battle highlights, hero performance records, and status updates.
                </p>
              </div>
            </div>

            <!-- Feed Posts Stream inside Card -->
            <div id="profile-card-feed-stream" style="display: flex; flex-direction: column; gap: 14px; overflow-y: auto;">
              ${postsToRender.map(post => `
                <div class="feed-post-card" style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; background: rgba(13, 19, 33, 0.85); border-radius: 12px; border: 1px solid rgba(255, 34, 0, 0.2);">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 38px; height: 38px; border-radius: 50%; background: #0f172a; padding: 2px; box-sizing: border-box; overflow: hidden; border: 1.5px solid #ff2200; flex-shrink: 0;">
                        ${renderAvatarHTML(post.authorAvatar || target.avatar)}
                      </div>
                      <div>
                        <div style="font-weight: 800; color: #ffffff; font-size: 0.92rem;">${post.authorName}</div>
                        <div style="font-size: 0.72rem; color: #94a3b8;">${post.timestamp}</div>
                      </div>
                    </div>
                    <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: rgba(255, 34, 0, 0.15); color: #ff5522; border: 1px solid rgba(255, 34, 0, 0.3);">
                      ${post.tag || 'Activity Log'}
                    </span>
                  </div>

                  <div style="color: #f8fafc; font-size: 0.92rem; line-height: 1.55; white-space: pre-wrap;">${post.content}</div>

                  <!-- Post Comments & Reactions -->
                  <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                    <div style="display: flex; gap: 12px; font-size: 0.82rem; color: #cbd5e1; font-weight: 700;">
                      <span>❤️ ${post.likes || 0} GG</span>
                      <span>💬 ${(post.comments || []).length} Replies</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('player-profile-card-modal');
    const close = () => modal?.remove();

    document.getElementById('close-profile-card-btn')?.addEventListener('click', close);
    modal?.addEventListener('click', (e) => { if (e.target === modal) close(); });

    // Follow Toggle Button Handler
    const followBtn = document.getElementById('card-follow-toggle-btn');
    followBtn?.addEventListener('click', () => {
      if (!Store.state.followingList) Store.state.followingList = [];
      const list = Store.state.followingList;
      const idx = list.indexOf(targetDisplayName);

      if (idx !== -1) {
        list.splice(idx, 1);
        isFollowing = false;
        followBtn.className = 'btn-card-follow';
        followBtn.innerText = '➕ Follow';
        Toast.info('Unfollowed', `You unfollowed ${targetDisplayName}.`);
      } else {
        list.push(targetDisplayName);
        isFollowing = true;
        followBtn.className = 'btn-card-following';
        followBtn.innerText = '✓ Following';
        if (window.Sound) window.Sound.playVictory();
        Toast.success('Following!', `You are now following ${targetDisplayName}'s public feed.`);
      }
      Store.save();
    });

    // Friend Toggle Button Handler
    const friendBtn = document.getElementById('card-friend-toggle-btn');
    friendBtn?.addEventListener('click', () => {
      if (!Store.state.friends) Store.state.friends = [];
      const existingIdx = Store.state.friends.findIndex(f => f.name && f.name.toLowerCase() === targetDisplayName.toLowerCase());

      if (existingIdx !== -1) {
        Store.state.friends.splice(existingIdx, 1);
        isFriend = false;
        friendBtn.className = 'btn-card-friend';
        friendBtn.innerText = '➕ Add Friend';
        Toast.info('Friend Removed', `${targetDisplayName} removed from your friends list.`);
      } else {
        Store.state.friends.push({
          id: target.id || ('friend_' + Date.now()),
          name: targetDisplayName,
          avatar: target.avatar || 'assets/avatar-shadow-fiend.jpg',
          rank: target.rank || 'Ancient V',
          status: 'online',
          statusText: 'In Main Menu'
        });
        isFriend = true;
        friendBtn.className = 'btn-card-friends-active';
        friendBtn.innerText = '🤝 Friends';
        if (window.Sound) window.Sound.playVictory();
        Toast.success('Friend Added!', `${targetDisplayName} is now in your Dota 2 friends list.`);
      }
      Store.save();
      renderFloatingChat();
    });

    // Direct Message Button Handler
    document.getElementById('card-direct-message-btn')?.addEventListener('click', () => {
      close();
      if (!Store.state.friends) Store.state.friends = [];
      let friend = Store.state.friends.find(f => f.name && f.name.toLowerCase() === targetDisplayName.toLowerCase());
      if (!friend) {
        friend = {
          id: target.id || ('friend_' + Date.now()),
          name: targetDisplayName,
          avatar: target.avatar || 'assets/avatar-shadow-fiend.jpg',
          rank: target.rank || 'Ancient V',
          status: 'online',
          statusText: 'In Main Menu'
        };
        Store.state.friends.push(friend);
        Store.save();
      }
      Store.state.openChatFriendId = friend.id;
      Store.state.isFriendsListOpen = false;
      renderFloatingChat();
      if (window.Sound) window.Sound.playMessage();
    });
  }

  /* --- MODAL: PRIVACY POLICY --- */
  function openPrivacyPolicyModal() {
    document.getElementById('legal-info-modal')?.remove();
    if (window.Sound) window.Sound.playClick();

    const modalHtml = `
      <div id="legal-info-modal" class="modal-overlay" style="position: fixed; inset: 0; background: rgba(10, 15, 26, 0.75); backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; z-index: 2100; padding: 20px;">
        <div class="hud-panel" style="width: 100%; max-width: 580px; max-height: 85vh; overflow-y: auto; padding: 28px; border-radius: var(--radius-lg); background: rgba(13, 19, 33, 0.96); backdrop-filter: blur(20px); border: 1.5px solid rgba(255, 34, 0, 0.4); box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 34, 0, 0.2); position: relative; animation: fadeInDown 0.25s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">🔒</span>
              <h2 style="font-family: var(--font-header); font-size: 1.3rem; font-weight: 800; color: #ff2200; margin: 0;">Privacy Policy</h2>
            </div>
            <button id="close-legal-modal-btn" style="background: transparent; border: none; font-size: 1.4rem; color: #94a3b8; cursor: pointer;">✕</button>
          </div>

          <div style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
            <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">Last Updated: August 2026</p>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">1. Information We Collect</h3>
              <p style="margin: 0;">CourierHub collects your account credentials (display name, username, email), region preference, rank tier, in-game roles, bio, and community posts to deliver our matchmaking and team formation services.</p>
            </div>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">2. How Your Data is Used</h3>
              <p style="margin: 0;">Your data is used strictly for lobby organization, party finder coordination, community discussions, and real-time multiplayer notification services.</p>
            </div>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">3. Security & Data Protection</h3>
              <p style="margin: 0;">We protect player records using high-grade encrypted authentication pipelines. We will never sell or distribute your personal gaming information to third-party advertisers.</p>
            </div>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">4. Account Control</h3>
              <p style="margin: 0;">You can update your personal information or request account deletion at any time by accessing your profile settings.</p>
            </div>
          </div>

          <div style="margin-top: 22px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
            <button type="button" id="confirm-legal-modal-btn" class="btn btn-primary" style="padding: 9px 24px; font-weight: 700; background: linear-gradient(135deg, #ff2200 0%, #d97706 100%); border: none; box-shadow: 0 4px 16px rgba(255, 34, 0, 0.4);">Acknowledge & Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('legal-info-modal');
    document.getElementById('close-legal-modal-btn')?.addEventListener('click', () => modal?.remove());
    document.getElementById('confirm-legal-modal-btn')?.addEventListener('click', () => modal?.remove());
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  /* --- MODAL: TERMS & CONDITIONS --- */
  function openTermsConditionsModal() {
    document.getElementById('legal-info-modal')?.remove();
    if (window.Sound) window.Sound.playClick();

    const modalHtml = `
      <div id="legal-info-modal" class="modal-overlay" style="position: fixed; inset: 0; background: rgba(10, 15, 26, 0.75); backdrop-filter: blur(14px); display: flex; align-items: center; justify-content: center; z-index: 2100; padding: 20px;">
        <div class="hud-panel" style="width: 100%; max-width: 580px; max-height: 85vh; overflow-y: auto; padding: 28px; border-radius: var(--radius-lg); background: rgba(13, 19, 33, 0.96); backdrop-filter: blur(20px); border: 1.5px solid rgba(255, 34, 0, 0.4); box-shadow: 0 30px 70px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 34, 0, 0.2); position: relative; animation: fadeInDown 0.25s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">📜</span>
              <h2 style="font-family: var(--font-header); font-size: 1.3rem; font-weight: 800; color: #ff2200; margin: 0;">Terms & Conditions</h2>
            </div>
            <button id="close-legal-modal-btn" style="background: transparent; border: none; font-size: 1.4rem; color: #94a3b8; cursor: pointer;">✕</button>
          </div>

          <div style="font-size: 0.9rem; color: #cbd5e1; line-height: 1.6; display: flex; flex-direction: column; gap: 14px;">
            <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">Last Updated: August 2026</p>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">1. Acceptance of Community Terms</h3>
              <p style="margin: 0;">By creating a CourierHub account or participating in lobbies and party matches, you agree to uphold our sportsmanship standards and terms of service.</p>
            </div>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">2. Fair Play & Competitive Integrity</h3>
              <p style="margin: 0;">CourierHub strictly prohibits griefing, abusive communications, smurfing, win-trading, and cheating. Violators will face immediate lobby suspensions or permanent account bans.</p>
            </div>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">3. Party Finder & Match Participation</h3>
              <p style="margin: 0;">Players who join competitive parties or Battle Cup stacks agree to show up on schedule and treat fellow party members with respect.</p>
            </div>
            <div>
              <h3 style="font-size: 0.98rem; font-weight: 700; color: #ffffff; margin: 0 0 4px;">4. Valve & Dota 2 Trademarks</h3>
              <p style="margin: 0;">Dota 2, Valve Corporation, hero icons, and related game assets are registered trademarks of Valve Corporation. CourierHub is an independent esports community hub.</p>
            </div>
          </div>

          <div style="margin-top: 22px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
            <button type="button" id="confirm-legal-modal-btn" class="btn btn-primary" style="padding: 9px 24px; font-weight: 700; background: linear-gradient(135deg, #ff2200 0%, #d97706 100%); border: none; box-shadow: 0 4px 16px rgba(255, 34, 0, 0.4);">I Agree & Close</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = document.getElementById('legal-info-modal');
    document.getElementById('close-legal-modal-btn')?.addEventListener('click', () => modal?.remove());
    document.getElementById('confirm-legal-modal-btn')?.addEventListener('click', () => modal?.remove());
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
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
                avatar: profile?.avatar || (isWenmar ? 'assets/avatar-shadow-fiend.jpg' : 'assets/avatar-shadow-fiend.jpg'),
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
              avatar: 'assets/avatar-shadow-fiend.jpg',
              avatarFrame: 'avatar-frame-immortal',
              quote: 'The path to victory is paved with courage, patience, and unbreakable teamwork.',
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
              avatar: 'assets/avatar-shadow-fiend.jpg',
              avatarFrame: 'avatar-frame-immortal',
              quote: 'Ready to battle on Ancient grounds!'
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

    const activeSkin = SKIN_BUNDLES.find(s => s.id === (user.skin || 'shadow-fiend')) || SKIN_BUNDLES[0];
    const activeBanner = user.banner || activeSkin.banner;

    container.innerHTML = `
      <div class="animate-fade-in profile-fullwidth-wrapper" data-skin="${activeSkin.id}">
        <!-- 1. FULL-WIDTH TOP COVER BANNER (100% Edge-to-Edge) -->
        <div class="profile-fullwidth-banner" style="background-image: url('${encodeURI(activeBanner)}');">
          <div class="profile-banner-ambient"></div>
          <div class="profile-banner-grid"></div>
          <div class="hud-corner-accent hud-corner-tl"></div>
          <div class="hud-corner-accent hud-corner-tr"></div>

          <!-- Floating Banner Actions (View Profile Card alongside Change Skin) -->
          <div style="
            position: absolute;
            right: 24px;
            bottom: 18px;
            z-index: 35;
            display: flex;
            align-items: center;
            gap: 10px;
          ">
            <!-- View Profile Card Button -->
            <button type="button" id="banner-view-profile-card-btn" class="apple-pill-action" style="
              padding: 9px 18px;
              font-size: 0.88rem;
              font-weight: 800;
              background: rgba(10, 16, 28, 0.78);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: #ffffff;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
              cursor: pointer;
            ">
              ${Icons.profileCard}
              <span>View Profile Card</span>
            </button>

            <!-- Change Skin Button -->
            <button type="button" id="profile-change-skin-btn" class="apple-capsule-btn" style="
              padding: 9px 18px;
              font-size: 0.88rem;
              font-weight: 800;
              cursor: pointer;
            ">
              ${Icons.palette}
              <span>Change Skin</span>
            </button>
          </div>
        </div>

        <!-- 2. CONSTRAINED PROFILE CONTAINER -->
        <div class="profile-content-container" style="position: relative; z-index: 20;">
          <div class="profile-main-layout" style="display: flex; gap: 36px; align-items: flex-start; position: relative; z-index: 25; margin-top: -160px;">
            
            <!-- Left Column (Rectangle Avatar + Horizontal Info Rows Stacked Below) - Sticky on Scroll -->
            <div class="profile-left-column" style="
              width: 260px;
              max-width: 100%;
              flex-shrink: 0;
              position: -webkit-sticky;
              position: sticky;
              top: 80px;
              align-self: flex-start;
              z-index: 40;
            ">
              <!-- Rectangle Profile Image with Neon Border Travel Path Animation -->
              <div class="profile-avatar-anchor">
                <!-- SVG Traveling Neon Border Line (Traces the Exact Perimeter) -->
                <svg class="profile-neon-svg" viewBox="0 0 260 350" preserveAspectRatio="none">
                  <!-- Base Track Line -->
                  <rect class="neon-border-track" x="3" y="3" width="254" height="344" rx="24" ry="24" pathLength="1000" style="stroke: ${activeSkin.accent}33;" />
                  <!-- Glowing Neon Laser Trail (Dual pulses traveling around border) -->
                  <rect class="neon-border-glow" x="3" y="3" width="254" height="344" rx="24" ry="24" pathLength="1000" style="stroke: ${activeSkin.borderGlow};" />
                  <!-- Sharp Traveling Red Laser Beam -->
                  <rect class="neon-border-traveler" x="3" y="3" width="254" height="344" rx="24" ry="24" pathLength="1000" style="stroke: ${activeSkin.borderColor};" />
                  <!-- White-Hot Leading Laser Head Tip -->
                  <rect class="neon-border-head" x="3" y="3" width="254" height="344" rx="24" ry="24" pathLength="1000" style="stroke: ${activeSkin.borderHead};" />
                </svg>

                <div class="profile-large-avatar ${user.avatarFrame || 'avatar-frame-immortal'}">
                  <div class="profile-avatar-glow-overlay"></div>
                  ${renderAvatarHTML(user.avatar)}
                </div>
                <div class="profile-status-badge" title="Online & Ready" style="z-index: 65;"></div>
              </div>

              <!-- Below the rectangle profile image: Horizontal Info Items with Premium Icons Only (Cardless) -->
              <div class="profile-vertical-details" style="display: flex; flex-direction: column; gap: 6px; margin-top: 10px;">
                
                <!-- Gender (Icon + Value) -->
                <div class="profile-info-row">
                  <div class="profile-icon-badge" title="Gender" style="width: 30px; height: 30px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(245, 158, 11, 0.25);">
                    ${Icons.gender}
                  </div>
                  <span style="font-size: 0.92rem; font-weight: 600; color: #ffffff; text-transform: capitalize; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">${user.gender || 'male'}</span>
                </div>

                <!-- Region (Icon + Value) -->
                <div class="profile-info-row">
                  <div class="profile-icon-badge" title="Region" style="width: 30px; height: 30px; border-radius: 8px; background: rgba(2, 132, 199, 0.12); color: var(--mana-blue); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(2, 132, 199, 0.25);">
                    ${Icons.region}
                  </div>
                  <span style="font-size: 0.92rem; font-weight: 600; color: #ffffff; text-shadow: 0 1px 4px rgba(0,0,0,0.8);">${user.region || 'Sea'}</span>
                </div>

                <!-- Address (Icon + Value) -->
                <div class="profile-info-row">
                  <div class="profile-icon-badge" title="Address" style="width: 30px; height: 30px; border-radius: 8px; background: rgba(239, 68, 68, 0.12); color: #ef4444; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(239, 68, 68, 0.25);">
                    ${Icons.location}
                  </div>
                  <span style="font-size: 0.92rem; font-weight: 600; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 4px rgba(0,0,0,0.8);" title="${user.address || 'phillpines metro manila'}">${user.address || 'phillpines metro manila'}</span>
                </div>

                <!-- Rank (Icon + Value) -->
                <div class="profile-info-row">
                  <div class="profile-icon-badge" title="Rank Tier" style="width: 30px; height: 30px; border-radius: 8px; background: rgba(217, 119, 6, 0.15); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid rgba(217, 119, 6, 0.35);">
                    ${Icons.rankCrown}
                  </div>
                  <span style="font-size: 0.92rem; font-weight: 800; color: #fde047; text-shadow: 0 1px 6px rgba(0,0,0,0.9);">${user.rank || 'Divine V'}</span>
                </div>

                <!-- Divider Line below Gender/Region/Address/Rank -->
                <div class="profile-info-divider"></div>

                <!-- Navigation Tabs below the divider: Your Feed Tab, Community Tab & Party Tab -->
                <div class="profile-nav-tabs">
                  <!-- Your Feed Tab (Above Community Tab) -->
                  <button type="button" id="profile-tab-your-feed-btn" class="side-tab-btn active">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 28px; height: 28px; border-radius: 8px; background: rgba(255, 34, 0, 0.22); display: flex; align-items: center; justify-content: center; color: #ff5522;">
                        ${Icons.feed}
                      </div>
                      <span>Your Feed</span>
                    </div>
                    <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: rgba(255, 34, 0, 0.25); color: #ffffff;">Personal</span>
                  </button>

                  <!-- Community Tab -->
                  <button type="button" id="profile-tab-community-btn" class="side-tab-btn">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 28px; height: 28px; border-radius: 8px; background: rgba(14, 165, 233, 0.18); display: flex; align-items: center; justify-content: center; color: #38bdf8;">
                        ${Icons.community}
                      </div>
                      <span>Community</span>
                    </div>
                    <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: rgba(14, 165, 233, 0.18); color: #38bdf8;">Feed</span>
                  </button>

                  <!-- Party Tab -->
                  <button type="button" id="profile-tab-party-btn" class="side-tab-btn">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <div style="width: 28px; height: 28px; border-radius: 8px; background: rgba(16, 185, 129, 0.18); display: flex; align-items: center; justify-content: center; color: #34d399;">
                        ${Icons.party}
                      </div>
                      <span>Party</span>
                    </div>
                    <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 6px; background: rgba(16, 185, 129, 0.18); color: #34d399;">Live</span>
                  </button>
                </div>

                <!-- Divider line below the Party Tab -->
                <div class="profile-section-divider" style="
                  width: 100%;
                  height: 1px;
                  background: rgba(255, 34, 0, 0.3);
                  margin: 14px 0 10px;
                  border: none;
                "></div>

                <!-- Privacy Policy & Terms & Conditions in One Line -->
                <div class="profile-legal-links" style="display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 4px 0 2px; flex-wrap: nowrap;">
                  <button type="button" id="profile-privacy-policy-btn" style="
                    background: transparent;
                    border: none;
                    font-size: 0.76rem;
                    font-weight: 600;
                    color: #94a3b8;
                    padding: 2px 4px;
                    cursor: pointer;
                    transition: color 0.15s ease;
                    white-space: nowrap;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                  " onmouseover="this.style.color='#ff5522';" onmouseout="this.style.color='#94a3b8';">
                    Privacy Policy
                  </button>

                  <span style="color: rgba(148, 163, 184, 0.4); font-size: 0.72rem; user-select: none;">•</span>

                  <button type="button" id="profile-terms-conditions-btn" style="
                    background: transparent;
                    border: none;
                    font-size: 0.76rem;
                    font-weight: 600;
                    color: #94a3b8;
                    padding: 2px 4px;
                    cursor: pointer;
                    transition: color 0.15s ease;
                    white-space: nowrap;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                  " onmouseover="this.style.color='#ff5522';" onmouseout="this.style.color='#94a3b8';">
                    Terms & Conditions
                  </button>
                </div>

              </div>
            </div>

            <!-- Right Column: Banner Overlay (Name & Quote) + Interactive Tab Views Below -->
            <div class="profile-right-column" style="flex: 1; min-width: 320px; display: flex; flex-direction: column; gap: 0; position: relative; z-index: 25;">
              
              <!-- Banner Overlay Section (Name & Transparent Quote strictly ON the 160px banner area) -->
              <div class="profile-banner-beside-content" style="
                height: 160px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 12px;
                padding-bottom: 10px;
                box-sizing: border-box;
                position: relative;
                z-index: 30;
              ">
                <!-- Name of the User on Banner + Followers Count -->
                <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                  <h1 class="profile-display-name" style="font-family: var(--font-header); font-size: 2.6rem; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: 0.01em; line-height: 1.15; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9), 0 0 24px rgba(0, 0, 0, 0.65);">
                    ${user.displayName || user.username}
                  </h1>
                  <div class="profile-banner-followers" title="👤 Followers: ${user.followersCount || '100k'} people who follow your public posts | ➡️ Following: ${user.followingCount || '10'} players you follow" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 16px;
                    border-radius: 9999px;
                    background: rgba(10, 15, 26, 0.78);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 34, 0, 0.4);
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.6), 0 0 16px rgba(255, 34, 0, 0.25);
                    font-size: 0.92rem;
                    line-height: 1;
                    cursor: default;
                  ">
                    <span style="font-weight: 800; color: #ffffff; letter-spacing: 0.02em;">
                      ${user.followersCount || '100k'} <span style="font-weight: 600; color: rgba(255, 255, 255, 0.78);">followers</span>
                    </span>
                    <span style="color: #ff3311; font-size: 0.95rem; font-weight: 900;">•</span>
                    <span style="font-weight: 800; color: #ffffff; letter-spacing: 0.02em;">
                      ${user.followingCount || '10'} <span style="font-weight: 600; color: rgba(255, 255, 255, 0.78);">Following</span>
                    </span>
                  </div>
                </div>

                <!-- Customizable Quote on Banner with Transparent Background -->
                <div class="profile-quote-card" style="
                  display: flex;
                  align-items: flex-start;
                  gap: 8px;
                  background: transparent;
                  border: none;
                  padding: 2px 0 0;
                  max-width: 660px;
                  box-shadow: none;
                  position: relative;
                ">
                  <span style="font-size: 2rem; line-height: 1; color: #ff2200; font-family: Georgia, serif; user-select: none; opacity: 0.95;">“</span>
                  <p id="profile-quote-display" style="font-size: 1.08rem; font-style: italic; color: #f8fafc; line-height: 1.5; margin: 0; font-weight: 600; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);">
                    ${user.quote || 'The path to victory is paved with courage, patience, and unbreakable teamwork.'}
                  </p>
                  <span style="font-size: 2rem; line-height: 1; color: #ff2200; font-family: Georgia, serif; user-select: none; opacity: 0.95;">”</span>
                </div>
              </div>

              <!-- 0. YOUR FEED TAB VIEW (Personal Posts & Match Highlights) -->
              <div id="home-your-feed-tab-view" class="your-feed-area" style="
                margin-top: 32px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                position: relative;
                z-index: 10;
              ">
                <!-- Feed Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255, 34, 0, 0.18); color: #ff5522; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; border: 1px solid rgba(255, 34, 0, 0.35);">
                      📰
                    </div>
                    <div>
                      <h2 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.2;">
                        Your Personal Feed
                      </h2>
                      <p style="font-size: 0.82rem; color: #94a3b8; margin: 0;">
                        Personal battle logs, match highlights & shared achievements
                      </p>
                    </div>
                  </div>
                  <span class="badge badge-gold" style="font-size: 0.78rem; padding: 4px 10px; font-weight: 700;">✨ PERSONAL</span>
                </div>

                <!-- Your Feed Post Composer Card -->
                <div class="feed-composer-card" style="padding: 18px 20px;">
                  <div style="display: flex; gap: 12px; align-items: flex-start;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; border: 2px solid #ff2200; flex-shrink: 0; box-shadow: 0 2px 8px rgba(255, 34, 0, 0.35);">
                      ${renderAvatarHTML(user.avatar)}
                    </div>
                    <div style="flex: 1;">
                      <textarea id="your-feed-post-input" placeholder="Share your latest match victory, build strategy, or status update..." rows="2" style="
                        width: 100%;
                        border: 1px solid rgba(255, 255, 255, 0.16);
                        border-radius: 10px;
                        padding: 12px 14px;
                        font-size: 0.92rem;
                        color: #ffffff;
                        background: rgba(8, 12, 22, 0.85);
                        resize: none;
                        outline: none;
                        font-family: inherit;
                        box-sizing: border-box;
                        transition: all 0.2s ease;
                      " onfocus="this.style.background='rgba(15, 23, 42, 0.95)'; this.style.borderColor='#ff2200';" onblur="this.style.background='rgba(8, 12, 22, 0.85)'; this.style.borderColor='rgba(255, 255, 255, 0.16)';"></textarea>

                      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 0.8rem; font-weight: 700; color: #cbd5e1;">Tag:</span>
                          <select id="your-feed-post-tag" style="
                            padding: 6px 12px;
                            border-radius: 8px;
                            border: 1px solid rgba(255, 255, 255, 0.18);
                            font-size: 0.82rem;
                            font-weight: 600;
                            color: #ffffff;
                            background: rgba(8, 12, 22, 0.95);
                            outline: none;
                            cursor: pointer;
                          ">
                            <option value="Match Highlight">⚡ Match Highlight</option>
                            <option value="Tournament">🏆 Tournament</option>
                            <option value="Looking for Party">⚔️ Looking for Party</option>
                            <option value="Strategy & Meta">📜 Strategy & Meta</option>
                            <option value="Discussion">💬 Discussion</option>
                          </select>
                        </div>

                        <button type="button" id="your-feed-post-submit-btn" class="apple-capsule-btn">
                          ${Icons.send} <span>Post to Your Feed</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Your Feed Posts List Container -->
                <div id="your-feed-posts-list" style="display: flex; flex-direction: column; gap: 16px;">
                  <!-- Dynamic Your Feed Posts populated by renderYourFeedPosts() -->
                </div>
              </div>

              <!-- 1. COMMUNITY TAB VIEW (Strictly BELOW Banner & Beside Left Column) -->
              <div id="home-community-tab-view" class="community-news-feed-area" style="
                margin-top: 32px;
                display: none;
                flex-direction: column;
                gap: 20px;
                position: relative;
                z-index: 10;
              ">
                
                <!-- Feed Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(14, 165, 233, 0.18); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; border: 1px solid rgba(14, 165, 233, 0.35);">
                      💬
                    </div>
                    <div>
                      <h2 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.2;">
                        Community News Feed
                      </h2>
                      <p style="font-size: 0.82rem; color: #94a3b8; margin: 0;">
                        Tournament updates, match highlights & player discussions
                      </p>
                    </div>
                  </div>
                  <span class="badge badge-gold" style="font-size: 0.78rem; padding: 4px 10px; font-weight: 700;">🔴 LIVE FEED</span>
                </div>

                <!-- Feed Post Composer Card -->
                <div class="feed-composer-card" style="padding: 18px 20px;">
                  <div style="display: flex; gap: 12px; align-items: flex-start;">
                    <div style="width: 44px; height: 44px; border-radius: 50%; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; border: 2px solid #ff2200; flex-shrink: 0; box-shadow: 0 2px 8px rgba(255, 34, 0, 0.35);">
                      ${renderAvatarHTML(user.avatar)}
                    </div>
                    <div style="flex: 1;">
                      <textarea id="feed-post-input" placeholder="What's happening on your Dota 2 journey, ${user.displayName || user.username}? Share match highlights, meta strategies, or party up..." rows="2" style="
                        width: 100%;
                        border: 1px solid rgba(255, 255, 255, 0.16);
                        border-radius: 10px;
                        padding: 12px 14px;
                        font-size: 0.92rem;
                        color: #ffffff;
                        background: rgba(8, 12, 22, 0.85);
                        resize: none;
                        outline: none;
                        font-family: inherit;
                        box-sizing: border-box;
                        transition: all 0.2s ease;
                      " onfocus="this.style.background='rgba(15, 23, 42, 0.95)'; this.style.borderColor='#ff2200';" onblur="this.style.background='rgba(8, 12, 22, 0.85)'; this.style.borderColor='rgba(255, 255, 255, 0.16)';"></textarea>

                      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; flex-wrap: wrap; gap: 10px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <span style="font-size: 0.8rem; font-weight: 700; color: #cbd5e1;">Tag:</span>
                          <select id="feed-post-tag" style="
                            padding: 6px 12px;
                            border-radius: 8px;
                            border: 1px solid rgba(255, 255, 255, 0.18);
                            font-size: 0.82rem;
                            font-weight: 600;
                            color: #ffffff;
                            background: rgba(8, 12, 22, 0.95);
                            outline: none;
                            cursor: pointer;
                          ">
                            <option value="Tournament">🏆 Tournament</option>
                            <option value="Match Highlight">⚡ Match Highlight</option>
                            <option value="Looking for Party">⚔️ Looking for Party</option>
                            <option value="Strategy & Meta">📜 Strategy & Meta</option>
                            <option value="Discussion">💬 Discussion</option>
                          </select>
                        </div>

                        <button type="button" id="feed-post-submit-btn" class="apple-capsule-btn">
                          ${Icons.send} <span>Publish Post</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Feed Posts List Container -->
                <div id="community-feed-list" style="display: flex; flex-direction: column; gap: 16px;">
                  <!-- Dynamic Feed Posts populated by renderCommunityFeedPosts() -->
                </div>

              </div>

              <!-- 2. PARTY TAB VIEW (Strictly BELOW Banner & Beside Left Column) -->
              <div id="home-party-tab-view" style="margin-top: 32px; display: none; flex-direction: column; gap: 20px; position: relative; z-index: 10;">
                
                <!-- Party Finder Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(16, 185, 129, 0.18); color: #34d399; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; border: 1px solid rgba(16, 185, 129, 0.35);">
                      ⚔️
                    </div>
                    <div>
                      <h2 style="font-family: var(--font-header); font-size: 1.25rem; font-weight: 800; color: #ffffff; margin: 0; line-height: 1.2;">
                        Party Finder & Squad Lobby
                      </h2>
                      <p style="font-size: 0.82rem; color: #94a3b8; margin: 0;">
                        Find competitive teammates, Battle Cup stacks & casual parties
                      </p>
                    </div>
                  </div>
                  <button type="button" id="create-party-request-btn" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.84rem; font-weight: 700; background: linear-gradient(135deg, #ff2200 0%, #d97706 100%); border: none; box-shadow: 0 4px 14px rgba(255, 34, 0, 0.35);">
                    + Create Party
                  </button>
                </div>

                <!-- Active Parties List Container -->
                <div id="home-party-list" style="display: flex; flex-direction: column; gap: 14px;">
                  <!-- Dynamically populated by renderHomePartyList() -->
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>
    `;

    // Function to render party finder list
    const renderHomePartyList = () => {
      const partyContainer = document.getElementById('home-party-list');
      if (!partyContainer) return;

      const parties = Store.state.partyFinder || [];
      if (parties.length === 0) {
        partyContainer.innerHTML = `
          <div class="glass-container" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">⚔️</div>
            <div style="font-weight: 700; color: #ffffff;">No active parties right now</div>
            <div style="font-size: 0.85rem; color: #94a3b8; margin-top: 4px;">Click "+ Create Party" to recruit players for your stack!</div>
          </div>
        `;
        return;
      }

      partyContainer.innerHTML = parties.map(party => `
        <div class="party-card" style="
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        ">
          <div style="display: flex; align-items: center; gap: 14px; min-width: 240px;">
            <div class="user-profile-card-trigger clickable-player-trigger" data-author-name="${party.leader}" title="Click to view ${party.leader}'s Profile Card" style="width: 44px; height: 44px; border-radius: 50%; background: #0f172a; padding: 2.5px; box-sizing: border-box; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; border: 2px solid #ff2200; flex-shrink: 0; box-shadow: 0 2px 8px rgba(255, 34, 0, 0.35); cursor: pointer;">
              ${renderAvatarHTML(party.avatar || 'assets/avatar-shadow-fiend.jpg')}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="user-profile-card-trigger clickable-player-trigger" data-author-name="${party.leader}" title="Click to view ${party.leader}'s Profile Card" style="font-weight: 800; color: #ffffff; font-size: 1rem; cursor: pointer;">${party.leader}'s Stack</span>
                <span class="badge badge-gold" style="font-size: 0.72rem; padding: 2px 7px;">${party.rank || 'Divine'}</span>
                <span style="font-size: 0.74rem; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: rgba(14, 165, 233, 0.18); color: #38bdf8;">${party.region || 'SEA'}</span>
              </div>
              <div style="font-size: 0.84rem; color: #cbd5e1; margin-top: 2px; font-weight: 600;">
                Mode: <span style="color: #ffffff;">${party.mode}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 200px;">
            <div style="font-size: 0.78rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Roles Needed:</div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${(party.rolesNeeded || ['Any Role']).map(r => `
                <span style="font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: rgba(30, 41, 59, 0.8); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.12);">
                  ${r}
                </span>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="text-align: right;">
              <div style="font-size: 0.95rem; font-weight: 800; color: ${party.currentMembers >= party.maxMembers ? '#ef4444' : '#34d399'};">
                ${party.currentMembers}/${party.maxMembers}
              </div>
              <div style="font-size: 0.72rem; color: #94a3b8;">Slots Filled</div>
            </div>

            <button type="button" class="join-party-action-btn btn btn-primary" data-party-id="${party.id}" ${party.currentMembers >= party.maxMembers ? 'disabled' : ''} style="padding: 8px 16px; font-size: 0.84rem; font-weight: 700; background: linear-gradient(135deg, #ff2200 0%, #d97706 100%); border: none; box-shadow: 0 4px 14px rgba(255, 34, 0, 0.35);">
              ${party.currentMembers >= party.maxMembers ? 'Full' : '🎮 Join Party'}
            </button>
          </div>
        </div>
      `).join('');

      // Attach profile card triggers
      partyContainer.querySelectorAll('.user-profile-card-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const authorName = el.getAttribute('data-author-name');
          if (authorName) {
            openPlayerProfileCardModal(authorName);
          }
        });
      });

      // Attach join party handlers
      partyContainer.querySelectorAll('.join-party-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const partyId = btn.getAttribute('data-party-id');
          const party = (Store.state.partyFinder || []).find(p => p.id === partyId);
          if (party && party.currentMembers < party.maxMembers) {
            party.currentMembers++;
            Store.save();
            if (window.Sound) window.Sound.playVictory();
            Toast.success('Joined Party!', `You have joined ${party.leader}'s party. Prepare for battle!`);
            renderHomePartyList();
          }
        });
      });
    };

    // Attach Tab Switch Handlers (Your Feed vs Community vs Party)
    const yourFeedTabBtn = document.getElementById('profile-tab-your-feed-btn');
    const communityTabBtn = document.getElementById('profile-tab-community-btn');
    const partyTabBtn = document.getElementById('profile-tab-party-btn');
    const yourFeedView = document.getElementById('home-your-feed-tab-view');
    const communityView = document.getElementById('home-community-tab-view');
    const partyView = document.getElementById('home-party-tab-view');

    const setActiveTabStyle = (activeBtn) => {
      [yourFeedTabBtn, communityTabBtn, partyTabBtn].forEach(btn => {
        if (!btn) return;
        if (btn === activeBtn) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    };

    if (yourFeedTabBtn && communityTabBtn && partyTabBtn && yourFeedView && communityView && partyView) {
      // Switch to Your Feed Tab
      yourFeedTabBtn.addEventListener('click', () => {
        setActiveTabStyle(yourFeedTabBtn);
        yourFeedView.style.display = 'flex';
        communityView.style.display = 'none';
        partyView.style.display = 'none';
        renderYourFeedPosts();
        if (window.Sound) window.Sound.playClick();
      });

      // Switch to Community Tab
      communityTabBtn.addEventListener('click', () => {
        setActiveTabStyle(communityTabBtn);
        yourFeedView.style.display = 'none';
        communityView.style.display = 'flex';
        partyView.style.display = 'none';
        renderCommunityFeedPosts();
        if (window.Sound) window.Sound.playClick();
      });

      // Switch to Party Tab
      partyTabBtn.addEventListener('click', () => {
        setActiveTabStyle(partyTabBtn);
        yourFeedView.style.display = 'none';
        communityView.style.display = 'none';
        partyView.style.display = 'flex';
        renderHomePartyList();
        if (window.Sound) window.Sound.playClick();
      });
    }

    // Helper: Render Post Cards (shared between Your Feed and Community Feed)
    const renderPostCardHTML = (post, isPersonalFeed) => {
      const isLiked = post.likedByMe;
      const commentsCount = (post.comments || []).length;
      return `
        <div class="feed-post-card" style="
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        ">
          <!-- Post Author Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="user-profile-card-trigger clickable-player-trigger" data-author-name="${post.authorName}" title="Click to view ${post.authorName}'s Profile Card" style="width: 42px; height: 42px; border-radius: 50%; background: #0f172a; padding: 2.5px; box-sizing: border-box; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; border: 2px solid #ff2200; flex-shrink: 0; box-shadow: 0 2px 8px rgba(255, 34, 0, 0.35); cursor: pointer;">
                ${renderAvatarHTML(post.authorAvatar || 'assets/avatar-shadow-fiend.jpg')}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span class="user-profile-card-trigger clickable-player-trigger" data-author-name="${post.authorName}" title="Click to view ${post.authorName}'s Profile Card" style="font-weight: 800; color: #ffffff; font-size: 0.98rem; cursor: pointer;">${post.authorName}</span>
                  ${post.badge ? `<span style="font-size: 0.72rem; font-weight: 800; padding: 2px 7px; border-radius: 6px; background: rgba(255, 34, 0, 0.18); color: #ff5522;">${post.badge}</span>` : ''}
                  <span class="badge badge-gold" style="font-size: 0.72rem; padding: 1px 6px;">${post.authorRank || 'Divine'}</span>
                </div>
                <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 1px;">
                  ${post.timestamp}
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.76rem; font-weight: 700; padding: 3px 9px; border-radius: 6px; background: rgba(30, 41, 59, 0.8); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.12);">
                ${post.tag || 'Discussion'}
              </span>
              ${isPersonalFeed ? `
                <button type="button" class="feed-delete-btn" data-post-id="${post.id}" title="Delete Post" style="background: transparent; border: none; font-size: 0.85rem; color: #94a3b8; cursor: pointer; padding: 4px;" onmouseover="this.style.color='#ef4444';" onmouseout="this.style.color='#94a3b8';">
                  🗑️
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Post Text Content -->
          <div style="color: #f8fafc; font-size: 0.94rem; line-height: 1.6; white-space: pre-wrap;">${post.content}</div>

          <!-- Post Actions (Apple-style Like, Comment, Share) -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 2px;">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <!-- Apple Like Button -->
              <button type="button" class="feed-like-btn apple-pill-action ${isLiked ? 'is-liked' : ''}" data-post-id="${post.id}">
                ${isLiked ? Icons.heartFilled : Icons.heart} <span>${post.likes || 0}</span> GG
              </button>

              <!-- Apple Comment Toggle Button -->
              <button type="button" class="feed-comment-toggle-btn apple-pill-action" data-post-id="${post.id}">
                ${Icons.comment} <span>${commentsCount}</span> Comments
              </button>
            </div>

            <!-- Apple Share Button -->
            <button type="button" class="feed-share-btn apple-pill-action" data-post-id="${post.id}">
              ${Icons.share} <span>Share</span>
            </button>
          </div>

          <!-- Comments Expandable Container -->
          <div id="comments-section-${post.id}" class="feed-comments-container" style="display: none; padding-top: 10px; border-top: 1px dashed rgba(255, 255, 255, 0.15); flex-direction: column; gap: 10px;">
            <div class="comments-list" style="display: flex; flex-direction: column; gap: 8px;">
              ${(post.comments || []).map(c => `
                <div style="display: flex; gap: 10px; background: rgba(10, 15, 26, 0.85); padding: 10px 12px; border-radius: 12px; font-size: 0.88rem; border: 1px solid rgba(255, 255, 255, 0.08);">
                  <div class="user-profile-card-trigger clickable-player-trigger" data-author-name="${c.author}" title="Click to view ${c.author}'s Profile Card" style="width: 28px; height: 28px; border-radius: 50%; background: #0f172a; padding: 1.5px; box-sizing: border-box; overflow: hidden; border: 1px solid #ff2200; flex-shrink: 0; cursor: pointer;">
                    ${renderAvatarHTML(c.avatar || 'assets/avatar-shadow-fiend.jpg')}
                  </div>
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                      <span class="user-profile-card-trigger clickable-player-trigger" data-author-name="${c.author}" title="Click to view ${c.author}'s Profile Card" style="font-weight: 700; color: #ffffff; cursor: pointer;">${c.author}</span>
                      <span style="font-size: 0.72rem; color: #94a3b8;">${c.timestamp || 'Just now'}</span>
                    </div>
                    <p style="margin: 2px 0 0; color: #cbd5e1; line-height: 1.4;">${c.text}</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Apple-Style Comment Input Capsule -->
            <div class="apple-input-capsule" style="margin-top: 6px;">
              <input type="text" id="comment-input-${post.id}" class="apple-input-field" placeholder="Reply to ${post.authorName}..." />
              <button type="button" class="feed-submit-comment-btn apple-send-circle-btn" data-post-id="${post.id}" title="Send reply">
                ${Icons.send}
              </button>
            </div>
          </div>
        </div>
      `;
    };

    // Helper: Attach Post Card Listeners (Like, Toggle comments, Submit comment, Share, Delete, Profile Card Click)
    const attachPostCardListeners = (container, refreshFn) => {
      if (!container) return;

      // Profile Card Triggers (Author Avatar & Author Name)
      container.querySelectorAll('.user-profile-card-trigger').forEach(el => {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const authorName = el.getAttribute('data-author-name');
          if (authorName) {
            openPlayerProfileCardModal(authorName);
          }
        });
      });

      container.querySelectorAll('.feed-like-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const postId = btn.getAttribute('data-post-id');
          const post = (Store.state.communityPosts || []).find(p => p.id === postId);
          if (post) {
            post.likedByMe = !post.likedByMe;
            post.likes = (post.likes || 0) + (post.likedByMe ? 1 : -1);
            Store.save();
            if (window.Sound) window.Sound.playClick();
            refreshFn();
          }
        });
      });

      container.querySelectorAll('.feed-comment-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const postId = btn.getAttribute('data-post-id');
          const commentsSec = document.getElementById(`comments-section-${postId}`);
          if (commentsSec) {
            commentsSec.style.display = commentsSec.style.display === 'none' ? 'flex' : 'none';
          }
        });
      });

      container.querySelectorAll('.feed-submit-comment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const postId = btn.getAttribute('data-post-id');
          const input = document.getElementById(`comment-input-${postId}`);
          if (!input || !input.value.trim()) return;

          const text = input.value.trim();
          const post = (Store.state.communityPosts || []).find(p => p.id === postId);
          if (post) {
            if (!post.comments) post.comments = [];
            post.comments.push({
              author: user.displayName || user.username,
              avatar: user.avatar || 'assets/avatar-shadow-fiend.jpg',
              text: text,
              timestamp: 'Just now'
            });
            Store.save();
            if (window.Sound) window.Sound.playMessage();
            Toast.success('Comment Posted', 'Your reply has been added to the discussion.');
            refreshFn();
            const commentsSec = document.getElementById(`comments-section-${postId}`);
            if (commentsSec) commentsSec.style.display = 'flex';
          }
        });
      });

      container.querySelectorAll('.feed-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const postId = btn.getAttribute('data-post-id');
          if (confirm('Delete this post from your feed?')) {
            Store.state.communityPosts = (Store.state.communityPosts || []).filter(p => p.id !== postId);
            Store.save();
            Toast.success('Post Deleted', 'Your post has been removed.');
            refreshFn();
          }
        });
      });

      container.querySelectorAll('.feed-share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigator.clipboard?.writeText?.(window.location.href);
          if (window.Sound) window.Sound.playClick();
          Toast.success('Link Copied', 'Post link copied to clipboard.');
        });
      });
    };

    // Function to render Your Personal Feed posts
    const renderYourFeedPosts = () => {
      const yourFeedList = document.getElementById('your-feed-posts-list');
      if (!yourFeedList) return;

      const myPosts = (Store.state.communityPosts || []).filter(p => 
        p.authorName === (user.displayName || user.username) || 
        p.authorName === user.username || 
        p.authorId === user.id || 
        (user.username === 'wenmar' && (p.badge === 'Founder' || p.authorName.toLowerCase().includes('wenmar')))
      );

      if (myPosts.length === 0) {
        yourFeedList.innerHTML = `
          <div style="text-align: center; padding: 48px 20px; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid rgba(226, 232, 240, 0.95); box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);">
            <div style="font-size: 2.8rem; margin-bottom: 10px;">📰</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">Your Feed is Ready!</div>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 6px; max-width: 420px; margin-left: auto; margin-right: auto; line-height: 1.5;">
              Share your Dota 2 match victories, hero highlights, tournament achievements, or status updates to build your gaming profile feed.
            </div>
          </div>
        `;
        return;
      }

      yourFeedList.innerHTML = myPosts.map(post => renderPostCardHTML(post, true)).join('');
      attachPostCardListeners(yourFeedList, renderYourFeedPosts);
    };

    // Function to render Community Feed posts
    const renderCommunityFeedPosts = () => {
      const feedList = document.getElementById('community-feed-list');
      if (!feedList) return;

      const posts = Store.state.communityPosts || [];
      if (posts.length === 0) {
        feedList.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid rgba(226, 232, 240, 0.95);">
            <div style="font-size: 2.5rem; margin-bottom: 8px;">🎮</div>
            <div style="font-weight: 700; color: var(--text-primary);">No posts yet</div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Be the first hero to share a post on CourierHub!</div>
          </div>
        `;
        return;
      }

      feedList.innerHTML = posts.map(post => renderPostCardHTML(post, false)).join('');
      attachPostCardListeners(feedList, renderCommunityFeedPosts);
    };

    // Initial renders
    renderYourFeedPosts();
    renderCommunityFeedPosts();

    // Attach Your Feed Post Composer Handler
    document.getElementById('your-feed-post-submit-btn')?.addEventListener('click', () => {
      const textarea = document.getElementById('your-feed-post-input');
      const tagSelect = document.getElementById('your-feed-post-tag');
      if (!textarea || !textarea.value.trim()) {
        Toast.error('Empty Post', 'Please write something to post on your feed.');
        return;
      }

      const content = textarea.value.trim();
      const tag = tagSelect ? tagSelect.value : 'Match Highlight';

      const newPost = {
        id: 'post_' + Date.now(),
        authorId: user.id || 'user_anon',
        authorName: user.displayName || user.username,
        authorAvatar: user.avatar || '👑',
        authorRank: user.rank || 'Divine V',
        badge: user.username === 'wenmar' ? 'Founder' : 'Member',
        timestamp: 'Just now',
        tag: tag,
        content: content,
        likes: 0,
        likedByMe: false,
        comments: []
      };

      if (!Store.state.communityPosts) Store.state.communityPosts = [];
      Store.state.communityPosts.unshift(newPost);
      Store.save();

      textarea.value = '';
      if (window.Sound) window.Sound.playVictory();
      Toast.success('Posted to Your Feed!', 'Your update is now live on your profile.');
      renderYourFeedPosts();
      renderCommunityFeedPosts();
    });

    // Attach Community Composer Submit Handler
    document.getElementById('feed-post-submit-btn')?.addEventListener('click', () => {
      const textarea = document.getElementById('feed-post-input');
      const tagSelect = document.getElementById('feed-post-tag');
      if (!textarea || !textarea.value.trim()) {
        Toast.error('Empty Post', 'Please write something to post on the community feed.');
        return;
      }

      const content = textarea.value.trim();
      const tag = tagSelect ? tagSelect.value : 'Discussion';

      const newPost = {
        id: 'post_' + Date.now(),
        authorId: user.id || 'user_anon',
        authorName: user.displayName || user.username,
        authorAvatar: user.avatar || '👑',
        authorRank: user.rank || 'Divine V',
        badge: user.username === 'wenmar' ? 'Founder' : 'Member',
        timestamp: 'Just now',
        tag: tag,
        content: content,
        likes: 0,
        likedByMe: false,
        comments: []
      };

      if (!Store.state.communityPosts) Store.state.communityPosts = [];
      Store.state.communityPosts.unshift(newPost);
      Store.save();

      textarea.value = '';
      if (window.Sound) window.Sound.playVictory();
      Toast.success('Post Published!', 'Your update is now live on the CourierHub community feed.');
      renderCommunityFeedPosts();
      renderYourFeedPosts();
    });

    // Attach Create Party button handler
    document.getElementById('create-party-request-btn')?.addEventListener('click', () => {
      const mode = prompt('Enter Game Mode (e.g. Ranked All Pick, Battle Cup):', 'Ranked All Pick');
      if (!mode) return;
      const roles = prompt('Roles Needed (e.g. Pos 3 Offlane, Pos 5 Support):', 'Pos 3 Offlane, Pos 5 Support');

      const newParty = {
        id: 'party_' + Date.now(),
        leader: user.displayName || user.username,
        avatar: user.avatar || '👑',
        rank: user.rank || 'Divine V',
        mode: mode.trim(),
        region: user.region || 'SEA',
        currentMembers: 1,
        maxMembers: 5,
        rolesNeeded: roles ? roles.split(',').map(s => s.trim()) : ['Any Role'],
        note: 'Recruiting teammates on CourierHub.'
      };

      if (!Store.state.partyFinder) Store.state.partyFinder = [];
      Store.state.partyFinder.unshift(newParty);
      Store.save();
      if (window.Sound) window.Sound.playVictory();
      Toast.success('Party Created!', 'Your party recruitment is now live for other players to join.');
      renderHomePartyList();
    });

    // View Profile Card from Banner
    document.getElementById('banner-view-profile-card-btn')?.addEventListener('click', () => {
      openPlayerProfileCardModal(user);
    });

    // Change Skin Vault Listener
    document.getElementById('profile-change-skin-btn')?.addEventListener('click', () => {
      openChangeSkinModal();
    });

    // Privacy Policy and Terms & Conditions button listeners
    document.getElementById('profile-privacy-policy-btn')?.addEventListener('click', () => {
      openPrivacyPolicyModal();
    });

    document.getElementById('profile-terms-conditions-btn')?.addEventListener('click', () => {
      openTermsConditionsModal();
    });
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
            <div class="player-avatar-frame ${user.avatarFrame || 'avatar-frame-immortal'}" style="width: 80px; height: 80px; font-size: 2.8rem; margin: 0 auto 16px; overflow: hidden; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              ${renderAvatarHTML(user.avatar)}
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
          <!-- 1. Hero & Aesthetic Skin Vault Panel -->
          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 14px;">🎭 Hero & Aesthetic Skin Vault</div>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 16px;">
              Equip synchronized hero themes (Cover Banner, Neon Border Laser, Ambient Background & Chat Icon).
            </p>
            <div class="banner-preview-wrapper" id="hud-settings-banner-preview" style="height: 120px; margin-bottom: 16px; background-image: url('${encodeURI(user.banner || 'Shadow Fiend Requiem.jpg')}');">
              <div class="profile-banner-ambient"></div>
              <div class="profile-banner-grid"></div>
            </div>
            <button class="btn btn-primary btn-block" id="hud-open-skin-modal-btn" style="background: linear-gradient(135deg, #ff2200 0%, #d97706 100%); border: none; font-weight: 800;">
              🎭 Open Skin Vault
            </button>
          </div>

          <!-- 2. Visual Theme Presets Panel -->
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

          <!-- 3. Sound Synthesizer Panel -->
          <div class="hud-panel" style="padding: 24px;">
            <div class="hud-panel-title" style="margin-bottom: 16px;">🔊 Sound Synthesizer</div>
            <button class="btn btn-secondary btn-block" id="test-fanfare-btn" style="margin-bottom: 12px;">🎺 Test Fanfare Sound</button>
            <button class="btn btn-secondary btn-block" id="test-notif-btn">🔔 Test Notification Chime</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('hud-open-skin-modal-btn')?.addEventListener('click', () => {
      openChangeSkinModal();
    });

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

    // Initialize active hero skin
    if (Store.state.currentUser) {
      applySkinToUI(Store.state.currentUser.skin || 'shadow-fiend', Store.state.currentUser.banner);
    }

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
