/* ==========================================================================
   CourierHub - Resend Email Client Service
   ========================================================================== */

export const EmailService = {
  /**
   * Send an email via the CourierHub Resend backend endpoint
   */
  async sendEmail({ to, subject, type, data, html }) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, type, data, html })
      });
      const result = await response.json();
      return result;
    } catch (err) {
      console.warn('Email dispatch notice:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Send One-Time Password (OTP) Verification Email
   */
  async sendOtp(to, otp) {
    return this.sendEmail({
      to,
      subject: `Your CourierHub Verification Code: ${otp}`,
      type: 'otp',
      data: { otp }
    });
  },

  /**
   * Send Welcome Email upon new user registration
   */
  async sendWelcomeEmail(to, username, rank = 'Legend I', region = 'SEA', dotaId = '109283742') {
    return this.sendEmail({
      to,
      subject: "Welcome to CourierHub — Let's Party Guys!!",
      type: 'welcome',
      data: { username, rank, region, dotaId }
    });
  },

  /**
   * Send Match Lobby Invitation Email
   */
  async sendLobbyInvite(to, senderName, lobbyTitle, rankTier = 'Legend', region = 'SEA', gameMode = 'Ranked All Pick') {
    return this.sendEmail({
      to,
      subject: `⚔️ ${senderName} invited you to a Dota 2 Match Lobby on CourierHub!`,
      type: 'lobby_invite',
      data: { senderName, lobbyTitle, rankTier, region, gameMode }
    });
  },

  /**
   * Send Party Matchmaking Request Email
   */
  async sendPartyInvite(to, senderName, partyTitle, rolesNeeded = 'Core, Support', region = 'SEA') {
    return this.sendEmail({
      to,
      subject: `🛡️ ${senderName} is looking for party members on CourierHub!`,
      type: 'party_invite',
      data: { senderName, partyTitle, rolesNeeded, region }
    });
  }
};
