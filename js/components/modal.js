/**
 * Ancient Nexus - Modal Dialog Manager
 */

import { Icons } from '../../assets/icons.js';
import { Sound } from '../audio.js';

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close();
      }
    });
  }

  open({ title, icon = 'swords', contentHtml, footerHtml = '', maxWidth = '540px', onOpen = null }) {
    this.close(); // Close any currently open modal

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
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
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;

    document.body.appendChild(overlay);
    this.activeModal = overlay;

    // Trigger transition
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    Sound.playClick();

    // Close handlers
    overlay.querySelector('#modal-close-btn').addEventListener('click', () => this.close());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    if (typeof onOpen === 'function') {
      onOpen(overlay);
    }

    return overlay;
  }

  close() {
    if (this.activeModal) {
      this.activeModal.classList.remove('active');
      const modalToKill = this.activeModal;
      this.activeModal = null;
      setTimeout(() => {
        if (modalToKill && modalToKill.parentNode) {
          modalToKill.parentNode.removeChild(modalToKill);
        }
      }, 200);
      Sound.playHover();
    }
  }
}

export const Modal = new ModalManager();
