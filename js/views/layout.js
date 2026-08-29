/**
 * Ancient Nexus - Master Application Layout Shell
 * Renders persistent Sidebar, Topbar, Main Content view mount point, and Mobile bottom nav.
 */

import { Store } from '../store.js';
import { renderSidebar, initSidebarEvents } from '../components/sidebar.js';
import { renderTopbar, initTopbarEvents } from '../components/topbar.js';

export function renderLayoutShell() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const isAuth = !!Store.state.currentUser;

  if (!isAuth) {
    // Unauthenticated layout (fullscreen auth without sidebar)
    root.innerHTML = `
      <main id="view-container" style="min-height: 100vh;"></main>
    `;
    return;
  }

  root.innerHTML = `
    <div class="app-layout">
      <!-- Persistent Left Sidebar -->
      ${renderSidebar()}

      <!-- Main App Body -->
      <div class="app-main">
        <!-- Top Navigation -->
        ${renderTopbar()}

        <!-- Dynamic View Container -->
        <main id="view-container"></main>
      </div>
    </div>
  `;

  initSidebarEvents();
  initTopbarEvents();
}
