/**
 * Ancient Nexus - Toast Notification Manager
 */

import { Sound } from '../audio.js';

class ToastManager {
  constructor() {
    this.container = null;
  }

  ensureContainer() {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
  }

  show(title, message, type = 'info', duration = 4000) {
    this.ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '⚔️',
      info: '⚡',
      warning: '⚠️',
      error: '🛑'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || '⚡'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    this.container.appendChild(toast);
    Sound.playNotification();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(60px)';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  success(title, message) { this.show(title, message, 'success'); }
  info(title, message) { this.show(title, message, 'info'); }
  warning(title, message) { this.show(title, message, 'warning'); }
  error(title, message) { this.show(title, message, 'error'); }
}

export const Toast = new ToastManager();
