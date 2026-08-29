/**
 * Ancient Nexus - Main Application Bootstrap & Lifecycle
 */

import { Store } from './store.js';
import { AppRouter } from './router.js';
import { CanvasBackground } from './canvas-bg.js';
import { Simulation } from './simulation.js';
import { renderLayoutShell } from './views/layout.js';

// Views
import { renderAuthView } from './views/auth.js';
import { renderHomeView } from './views/home.js';
import { renderCommunityView } from './views/community.js';
import { renderConversationsView } from './views/conversations.js';
import { renderLobbiesView, renderLobbyDetailsView } from './views/lobbies.js';
import { renderMembersView } from './views/members.js';
import { renderProfileView } from './views/profile.js';
import { renderPartyFinderView } from './views/partyFinder.js';
import { renderHudSettingsView } from './views/hudSettings.js';

class AncientNexusApp {
  constructor() {
    this.bgInstance = null;
  }

  init() {
    // 1. Initialize Canvas Ambient Background
    this.bgInstance = new CanvasBackground('canvas-bg');
    window.nexusBgInstance = this.bgInstance;

    // Apply saved HUD theme
    const userTheme = Store.state.currentUser?.hudSettings?.theme || 'classic';
    document.body.setAttribute('data-theme', userTheme);

    const bgMode = Store.state.currentUser?.hudSettings?.bgMode || 'embers';
    this.bgInstance.setMode(bgMode);

    // 2. Start Esports Simulation Engine
    Simulation.start();

    // 3. Register Application Routes
    this.registerRoutes();

    // 4. Subscribe to Store Updates
    Store.subscribe((state) => {
      this.onStateChanged(state);
    });

    // 5. Trigger Initial Route
    AppRouter.handleRoute();
  }

  registerRoutes() {
    // Login & Signup
    AppRouter.register('login', () => {
      renderLayoutShell();
      renderAuthView(false);
    });

    AppRouter.register('signup', () => {
      renderLayoutShell();
      renderAuthView(true);
    });

    // Home / Dashboard HUD
    AppRouter.register('home', () => {
      renderLayoutShell();
      renderHomeView();
    });

    // Community Chat
    AppRouter.register('community', () => {
      renderLayoutShell();
      renderCommunityView();
    });

    // Conversations / PM
    AppRouter.register('conversations', (participantId) => {
      renderLayoutShell();
      renderConversationsView(participantId);
    });

    // Lobbies Finder
    AppRouter.register('lobbies', () => {
      renderLayoutShell();
      renderLobbiesView();
    });

    // Lobby Details / Room
    AppRouter.register('lobby', (lobbyId) => {
      renderLayoutShell();
      renderLobbyDetailsView(lobbyId);
    });

    // Members Directory
    AppRouter.register('members', () => {
      renderLayoutShell();
      renderMembersView();
    });

    // Profile View
    AppRouter.register('profile', (userId) => {
      renderLayoutShell();
      renderProfileView(userId);
    });

    // Party Finder
    AppRouter.register('party-finder', () => {
      renderLayoutShell();
      renderPartyFinderView();
    });

    // HUD Customizer
    AppRouter.register('hud-settings', () => {
      renderLayoutShell();
      renderHudSettingsView();
    });
  }

  onStateChanged(state) {
    // Re-render current route if active
    const currentPath = AppRouter.currentRoute;
    const currentId = AppRouter.currentParams?.id;

    // Apply theme if changed
    if (state.currentUser?.hudSettings?.theme) {
      document.body.setAttribute('data-theme', state.currentUser.hudSettings.theme);
    }
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AncientNexusApp();
  app.init();
});
