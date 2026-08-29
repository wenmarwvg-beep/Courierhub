/* ==========================================================================
   CourierHub - Node.js Server with Resend Email API & Static Asset Delivery
   ========================================================================== */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_SB2PAV6q_BMS6Wg6ofEsxAkV3Pw4WAhWV';
const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || 'CourierHub <onboarding@resend.dev>';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// HTML Email Templates with CourierHub Styling
function generateEmailHtml(type, data = {}) {
  const brandColor = '#f59e0b';
  const bgDark = '#0f172a';
  const logoUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'; // Fallback badge

  let contentHtml = '';

  if (type === 'otp' || type === 'password_reset') {
    const isReset = type === 'password_reset';
    contentHtml = `
      <div style="text-align: center; padding: 10px 0 25px;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 10px; font-family: 'Cinzel', serif, sans-serif;">${isReset ? 'PASSWORD RESET CODE' : 'VERIFY YOUR ACCOUNT'}</h1>
        <p style="color: #475569; font-size: 15px; margin: 0 0 20px;">${isReset ? 'Use the 6-digit OTP below to reset your CourierHub password:' : 'Use the 6-digit verification code (OTP) below to complete your CourierHub registration:'}</p>
        <div style="background: #0f172a; border: 2px solid ${isReset ? '#ef4444' : '#f59e0b'}; border-radius: 12px; padding: 16px 28px; display: inline-block; margin: 0 auto 20px; letter-spacing: 0.3em; font-size: 34px; font-weight: 900; color: ${isReset ? '#ef4444' : '#f59e0b'}; font-family: monospace, sans-serif; box-shadow: 0 4px 18px ${isReset ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'};">
          ${data.otp || '123456'}
        </div>
        <p style="color: #64748b; font-size: 13px; margin: 0;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;
  } else if (type === 'welcome') {
    contentHtml = `
      <div style="text-align: center; padding: 10px 0 25px;">
        <h1 style="color: #0f172a; font-size: 26px; font-weight: 800; margin: 0 0 10px; font-family: 'Cinzel', serif, sans-serif;">WELCOME TO COURIERHUB!</h1>
        <p style="color: #475569; font-size: 16px; margin: 0 0 20px;">Let's Party Guys!! Your Ancient profile is officially live.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: left; max-width: 400px; margin: 0 auto 25px;">
          <div style="margin-bottom: 8px; color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;">Player Profile</div>
          <div style="color: #0f172a; font-size: 18px; font-weight: 700; margin-bottom: 6px;">⚔️ ${data.username || 'Hero'}</div>
          <div style="color: #475569; font-size: 14px;"><strong>Rank:</strong> ${data.rank || 'Legend I'} | <strong>Region:</strong> ${data.region || 'SEA'}</div>
          <div style="color: #475569; font-size: 14px; margin-top: 4px;"><strong>Dota 2 ID:</strong> ${data.dotaId || '109283742'}</div>
        </div>
        <a href="http://localhost:3000" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 32px; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);">
          ENTER COURIERHUB NOW
        </a>
      </div>
    `;
  } else if (type === 'lobby_invite') {
    contentHtml = `
      <div style="text-align: center; padding: 10px 0 25px;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 10px;">⚔️ MATCH LOBBY INVITATION</h1>
        <p style="color: #475569; font-size: 15px; margin: 0 0 20px;"><strong>${data.senderName || 'A teammate'}</strong> invited you to join a Dota 2 match lobby!</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: left; max-width: 400px; margin: 0 auto 25px;">
          <div style="color: #f59e0b; font-weight: 700; font-size: 16px; margin-bottom: 6px;">${data.lobbyTitle || 'High Skill 5v5 Scrim'}</div>
          <div style="color: #475569; font-size: 14px;"><strong>Region:</strong> ${data.region || 'SEA'} | <strong>Tier:</strong> ${data.rankTier || 'Legend+'}</div>
          <div style="color: #475569; font-size: 14px; margin-top: 4px;"><strong>Game Mode:</strong> ${data.gameMode || 'Captains Mode'}</div>
        </div>
        <a href="http://localhost:3000#lobbies" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 32px; border-radius: 8px; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);">
          JOIN LOBBY NOW
        </a>
      </div>
    `;
  } else if (type === 'party_invite') {
    contentHtml = `
      <div style="text-align: center; padding: 10px 0 25px;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0 0 10px;">🛡️ PARTY MATCHMAKING REQUEST</h1>
        <p style="color: #475569; font-size: 15px; margin: 0 0 20px;"><strong>${data.senderName || 'A teammate'}</strong> is looking for party members!</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: left; max-width: 400px; margin: 0 auto 25px;">
          <div style="color: #0284c7; font-weight: 700; font-size: 16px; margin-bottom: 6px;">${data.partyTitle || 'Ranked Party Grind'}</div>
          <div style="color: #475569; font-size: 14px;"><strong>Roles Needed:</strong> ${data.rolesNeeded || 'Pos 1 Carry, Pos 5 Hard Support'}</div>
          <div style="color: #475569; font-size: 14px; margin-top: 4px;"><strong>Region:</strong> ${data.region || 'SEA'}</div>
        </div>
        <a href="http://localhost:3000#home" style="display: inline-block; background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 32px; border-radius: 8px; font-size: 16px;">
          JOIN PARTY QUEUE
        </a>
      </div>
    `;
  } else {
    contentHtml = `
      <div style="text-align: center; padding: 10px 0 25px;">
        <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 10px;">${data.subject || 'CourierHub Notification'}</h1>
        <p style="color: #475569; font-size: 15px;">${data.message || 'You have a new update from CourierHub.'}</p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>CourierHub</title>
      </head>
      <body style="margin: 0; padding: 30px 15px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          <!-- Header Banner -->
          <div style="background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #f59e0b;">
            <div style="font-size: 22px; font-weight: 900; color: #f59e0b; letter-spacing: 0.08em; text-transform: uppercase;">
              COURIERHUB
            </div>
            <div style="color: #94a3b8; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; margin-top: 4px;">
              LET'S PARTY GUYS!!
            </div>
          </div>

          <!-- Body Content -->
          <div style="padding: 30px 24px;">
            ${contentHtml}
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 18px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
            <p style="margin: 0 0 4px;">CourierHub — Next-Gen Dota 2 Community Platform</p>
            <p style="margin: 0;">Sent with Resend API</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Send Email via Resend REST API
async function sendResendEmail({ to, subject, type, data, html, text }) {
  const emailHtml = html || generateEmailHtml(type, data);
  const payload = {
    from: DEFAULT_FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject: subject || "CourierHub Notification — Let's Party Guys!!",
    html: emailHtml,
    text: text || "You have a new notification from CourierHub: http://localhost:3000"
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.message || resJson.error || 'Failed to send email via Resend');
  }
  return resJson;
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // API Endpoint: /api/send-email
  if (url.pathname === '/api/send-email' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const emailRequest = JSON.parse(body || '{}');
        if (!emailRequest.to) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Recipient "to" email is required' }));
          return;
        }

        const result = await sendResendEmail(emailRequest);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, result }));
      } catch (err) {
        console.error('[Resend Error]', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(__dirname, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 CourierHub Server active on http://localhost:${PORT}`);
  console.log(`📧 Resend Email Integration: Active (API Key connected)`);
  console.log(`======================================================\n`);
});
