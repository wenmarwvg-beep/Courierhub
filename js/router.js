/**
 * Ancient Nexus - Hash Router
 * Parses current route hash, handles deep links (/lobby/:id, /profile/:id),
 * checks auth protection, and triggers views.
 */

import { Store } from './store.js';

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = 'home';
    this.currentParams = {};
    this.redirectAfterLogin = null;

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path.startsWith('#') ? path : '#' + path;
  }

  handleRoute() {
    let hash = window.location.hash.slice(1) || 'home';
    if (hash.startsWith('/')) hash = hash.slice(1);

    // Clean query/trailing slashes
    const parts = hash.split('/');
    const mainPath = parts[0] || 'home';
    const param = parts[1] || null;

    // Check if user is logged in
    const isAuth = !!Store.state.currentUser;

    if (!isAuth && mainPath !== 'login' && mainPath !== 'signup') {
      this.redirectAfterLogin = hash;
      this.currentRoute = 'login';
      if (this.routes['login']) {
        this.routes['login']();
      }
      return;
    }

    if (isAuth && (mainPath === 'login' || mainPath === 'signup')) {
      this.navigate('home');
      return;
    }

    this.currentRoute = mainPath;
    this.currentParams = { id: param };

    if (this.routes[mainPath]) {
      this.routes[mainPath](param);
    } else if (this.routes['home']) {
      this.routes['home']();
    }

    // Update active nav links in sidebar and bottom navigation
    this.updateActiveNavLinks(mainPath);
  }

  updateActiveNavLinks(route) {
    document.querySelectorAll('.nav-link, .bottom-nav-item').forEach(el => {
      const href = el.getAttribute('href') || '';
      const linkRoute = href.replace('#', '').split('/')[0];
      if (linkRoute === route || (route === 'lobby' && linkRoute === 'lobbies') || (route === 'profile' && linkRoute === 'profile')) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }
}

export const AppRouter = new Router();
