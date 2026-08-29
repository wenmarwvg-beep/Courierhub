/**
 * Ancient Nexus - Authentication View (Login & Sign Up)
 * Supports email/username login, sign up with Dota 2 Player ID and hero avatars,
 * and convenient 1-click Demo Hero Switcher profiles.
 */

import { Store } from '../store.js';
import { AppRouter } from '../router.js';
import { AvatarIcons } from '../../assets/heroes.js';
import { Toast } from '../components/toast.js';
import { Sound } from '../audio.js';

export function renderAuthView(isSignUp = false) {
  const bgCanvas = document.getElementById('canvas-bg');
  if (bgCanvas) bgCanvas.style.display = 'none';
  const container = document.getElementById('view-container');
  if (!container) return;

  const svgIcons = {
    user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
    login: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
    mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  };

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
                    <span>Username</span>
                  </label>
                  <input type="text" id="login-username" class="input-control" placeholder="Enter username" required style="padding: 11px 14px; font-size: 0.92rem;">
                </div>

                <div class="form-group" style="margin-bottom: 18px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label class="form-label" style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.76rem; letter-spacing: 0.06em; color: var(--text-secondary); margin-bottom: 0;">
                      <span>${svgIcons.lock}</span>
                      <span>Password</span>
                    </label>
                    <button type="button" class="pw-toggle-btn" data-target="login-password" style="background: none; border: none; font-size: 0.78rem; color: var(--accent-primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 2px 4px;">
                      <span class="pw-icon-span">${svgIcons.eye}</span>
                      <span class="pw-text-span">Show</span>
                    </button>
                  </div>
                  <div style="position: relative;">
                    <input type="password" id="login-password" class="input-control" placeholder="Enter password" style="padding: 11px 44px 11px 14px; font-size: 0.92rem;" required>
                    <button type="button" class="pw-toggle-icon-btn" data-target="login-password" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); padding: 4px;" title="Toggle password visibility">
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
                    <span>${svgIcons.mail}</span>
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
                      <span>${svgIcons.mail}</span>
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
                      <button type="button" class="pw-toggle-btn" data-target="signup-password" style="background: none; border: none; font-size: 0.78rem; color: var(--accent-primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; padding: 2px 4px;">
                        <span class="pw-icon-span">${svgIcons.eye}</span>
                        <span class="pw-text-span">Show</span>
                      </button>
                    </div>
                    <div style="position: relative;">
                      <input type="password" id="signup-password" class="input-control" placeholder="Create password" minlength="6" style="padding: 9px 44px 9px 14px; font-size: 0.92rem;" required>
                      <button type="button" class="pw-toggle-icon-btn" data-target="signup-password" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); padding: 4px;" title="Toggle password visibility">
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
    </div>
  `;

  initAuthEvents(isSignUp);
}

function initAuthEvents(isSignUp) {
  // Password visibility toggle handler
  const handlePwToggle = (targetId) => {
    const input = document.getElementById(targetId);
    if (!input) return;
    const isPw = input.type === 'password';
    input.type = isPw ? 'text' : 'password';
    const eyeSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeOffSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`;
    const icon = isPw ? eyeOffSvg : eyeSvg;
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
    hideAuthAlert();
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
    document.getElementById('login-password')?.focus();
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

  // OTP Input Boxes Handling
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

  // Forgot Password - Step 1: Send Reset OTP
  document.getElementById('forgot-req-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email-input').value.trim();
    const sendBtn = document.getElementById('forgot-send-btn');
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.innerHTML = `<span>Sending Supabase OTP...</span>`;
    }

    pendingReset = { email };

    if (window.supabase) {
      try {
        const { error } = await SupabaseService.sendPasswordResetOtp(email);
        if (error) {
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

  // Forgot Password - Step 2: Verify OTP & Change Password in Supabase
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

    let verified = false;
    if (window.supabase) {
      try {
        await SupabaseService.verifyPasswordResetOtp(pendingReset.email, enteredOtp);
        await SupabaseService.updatePassword(newPassword);
        verified = true;
      } catch (sbErr) {
        console.warn('Supabase password reset exception:', sbErr);
        Toast.error('Verification Error', sbErr.message || 'Incorrect OTP code.');
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
      const pInput = document.getElementById('login-password');
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

  // Login form submit
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (window.supabase) {
      try {
        const data = await SupabaseService.signIn(username, password);
        if (data?.user) {
          const profile = await SupabaseService.getUserProfile(data.user.id);
          const activeUser = profile ? {
            id: profile.id,
            username: profile.username || username,
            displayName: profile.display_name || username,
            email: profile.email || data.user.email,
            dotaId: profile.dota_id || '109283742',
            rank: profile.rank || 'Legend I',
            region: profile.region || 'SEA',
            avatar: profile.avatar || '🔥',
            avatarFrame: profile.avatar_frame || 'avatar-frame-immortal',
            bio: profile.bio || 'Ready to party on CourierHub!'
          } : {
            id: data.user.id,
            username: username,
            displayName: username,
            email: data.user.email,
            dotaId: '109283742',
            rank: 'Legend I',
            region: 'SEA',
            avatar: '🔥',
            avatarFrame: 'avatar-frame-immortal',
            bio: 'Ready to party on CourierHub!'
          };

          Store.loginUser(activeUser);
          Toast.success('Authenticated', `Welcome back to CourierHub, ${activeUser.displayName}!`);
          const targetRoute = AppRouter.redirectAfterLogin || 'home';
          AppRouter.redirectAfterLogin = null;
          AppRouter.navigate(targetRoute);
          return;
        } else {
          Toast.error('Login Failed', 'Incorrect username or password.');
        }
      } catch (err) {
        console.warn('Supabase sign in notice:', err);
        Toast.error('Login Failed', err.message || 'Incorrect username or password.');
      }
    } else {
      Toast.error('Backend Unavailable', 'Could not connect to Supabase authentication server.');
    }
  });

  // Registration Form Submit -> Supabase Direct SignUp with Duplicate Prevention
  document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const submitBtn = document.getElementById('signup-submit-btn');

    hideAuthAlert();

    if (password.length < 6) {
      showAuthAlert('Invalid Password', 'Password must be at least 6 characters.', true, false);
      document.getElementById('signup-password')?.focus();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Creating Account...</span>`;
    }

    if (window.supabase) {
      try {
        // 1. Check Supabase profiles for duplicate username
        try {
          const { data: existingProfile } = await window.supabase.from('profiles').select('id, username').eq('username', username).maybeSingle();
          if (existingProfile) {
            showAuthAlert('Username Taken', 'This username is already taken. Please choose another username.', true, false);
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

        // 2. Supabase Auth SignUp
        const { data, error } = await window.supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username,
              display_name: username,
              dota_id: Math.floor(100000000 + Math.random() * 900000000).toString(),
              rank: 'Legend I',
              region: 'SEA',
              avatar: '🔥'
            }
          }
        });

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

          const newUser = {
            id: data.user.id,
            username: username,
            displayName: username,
            email: email,
            password: password,
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

          // Display Check Your Email panel
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

    // Local fallback
    const localNewUser = {
      id: 'u_' + Date.now(),
      username: username,
      displayName: username,
      email: email,
      password: password,
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

    Store.state.users.push(localNewUser);
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
    const innerCard = document.getElementById('auth-flip-card-inner');
    if (innerCard) {
      innerCard.classList.remove('is-flipped');
    }
    const sentEmail = document.getElementById('signup-sent-email')?.innerText;
    const uInput = document.getElementById('login-username');
    if (uInput && sentEmail) {
      uInput.value = sentEmail;
    }
    document.getElementById('login-password')?.focus();
  });

  // Resend OTP
  document.getElementById('otp-resend-btn')?.addEventListener('click', async () => {
    if (!pendingSignup) return;
    Toast.info('Resending OTP...', `Requesting new code from Supabase for ${pendingSignup.email}`);
    if (window.supabase) {
      try {
        await SupabaseService.signUp(pendingSignup.username, pendingSignup.email, pendingSignup.password);
        Toast.success('OTP Resent', `New code sent to ${pendingSignup.email}`);
      } catch (err) {
        Toast.info('Resend Notice', 'Please check your inbox.');
      }
    }
    startOtpCountdown();
  });

  // Back to edit
  document.getElementById('otp-back-btn')?.addEventListener('click', () => {
    document.getElementById('signup-step-otp').style.display = 'none';
    document.getElementById('signup-step-form').style.display = 'flex';
    document.getElementById('signup-header-title').innerText = 'Create Your Account';
  });

  // STEP 2: Verify Supabase OTP
  document.getElementById('otp-verify-btn')?.addEventListener('click', async () => {
    if (!pendingSignup) return;
    const enteredOtp = Array.from(otpBoxes).map(b => b.value).join('');

    if (enteredOtp.length !== 6) {
      Toast.error('Invalid OTP', 'Please enter all 6 digits.');
      return;
    }

    const verifyBtn = document.getElementById('otp-verify-btn');
    if (verifyBtn) {
      verifyBtn.disabled = true;
      verifyBtn.innerHTML = `<span>Verifying with Supabase...</span>`;
    }

    const { username, email, password } = pendingSignup;
    let authUser = null;

    if (window.supabase) {
      try {
        const data = await SupabaseService.verifySignupOtp(email, enteredOtp);
        if (data?.user) {
          authUser = data.user;
        }
      } catch (sbErr) {
        console.warn('Supabase OTP verification exception:', sbErr);
        Toast.error('Verification Error', sbErr.message || 'Incorrect OTP code.');
        if (verifyBtn) {
          verifyBtn.disabled = false;
          verifyBtn.innerHTML = `<span>Verify & Create Account</span><span>${svgIcons.login}</span>`;
        }
        return;
      }
    }

    const newUser = {
      id: authUser ? authUser.id : 'u_' + Date.now(),
      username,
      displayName: username,
      email,
      password,
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
    Store.loginUser(newUser);
    Toast.success('Supabase Account Verified!', `Welcome to CourierHub, ${username}!`);

    const targetRoute = AppRouter.redirectAfterLogin || 'home';
    AppRouter.redirectAfterLogin = null;
    AppRouter.navigate(targetRoute);
  });
}
