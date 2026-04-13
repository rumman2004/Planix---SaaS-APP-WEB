const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { getOAuth2Client } = require('../config/oauth');
const UserModel = require('../models/userModel');

// 1. Initiate Google Login
exports.googleLogin = (req, res) => {
  const { redirect_uri } = req.query;
  const isMobile = !!redirect_uri;
  const client = getOAuth2Client(isMobile);

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/tasks'
  ];

  console.log(`[OAuth] Starting flow. isMobile: ${isMobile}, returnTo: ${redirect_uri || 'Web Dashboard'}`);

  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    state: redirect_uri || 'web' // Pass the return URL in the state param
  });

  res.redirect(url);
};

// 2. Handle Google Callback
exports.googleCallback = async (req, res) => {
  const { code, state } = req.query;
  const isMobile = state && state !== 'web';
  const client = getOAuth2Client(isMobile);

  try {
    console.log(`[OAuth] Callback received. isMobile: ${isMobile}, state: ${state}`);
    
    // Exchange the authorization code for access and refresh tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Fetch user profile info from Google
    const oauth2 = google.oauth2({ auth: client, version: 'v2' });
    const userInfo = await oauth2.userinfo.get();
    
    const { id, email, name, picture } = userInfo.data;

    // Check if user exists in our PostgreSQL database
    let user = await UserModel.findByGoogleId(id);
    
    // If not, create a new user
    if (!user) {
      user = await UserModel.createUser({
        googleId: id,
        email,
        name,
        avatarUrl: picture,
        refreshToken: tokens.refresh_token
      });
    } else if (tokens.refresh_token) {
      // Very Important: If an existing user grants new permissions (like Tasks), 
      // Google sends a new refresh_token. We MUST update it in the database.
      const pool = require('../config/db');
      await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [tokens.refresh_token, user.id]);
      user.refresh_token = tokens.refresh_token;
    }

    // Generate JWT for session management
    const sessionToken = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Send token in an HTTP-only cookie
    res.cookie('token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Determine final redirect destination from state
    if (isMobile) {
      console.log(`[OAuth] Redirecting back to mobile app with token.`);
      
      // --- FIX: Do not use new URL() for custom 'exp://' schemes. ---
      // String manipulation guarantees the exact intent filter is preserved.
      const separator = state.includes('?') ? '&' : '?';
      const finalMobileUrl = `${state}${separator}token=${sessionToken}`;
      
      res.redirect(finalMobileUrl);
    } else {
      console.log(`[OAuth] Redirecting to web dashboard`);
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }

  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};

// 3. Logout User
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// 4. Get Current User Profile (Used by frontend to check auth state)
exports.getCurrentUser = async (req, res) => {
  try {
    // req.userId is set by the authMiddleware (which we will build later)
    const user = await UserModel.findById(req.userId); 
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};