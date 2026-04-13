const { google } = require('googleapis');
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_MOBILE_REDIRECT_URI = process.env.GOOGLE_MOBILE_REDIRECT_URI;

// Default client (Web)
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// Helper to get a client with a specific redirect URI (e.g., for mobile IP)
const getOAuth2Client = (isMobile = false) => {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    isMobile ? GOOGLE_MOBILE_REDIRECT_URI : GOOGLE_REDIRECT_URI
  );
};

module.exports = {
  oauth2Client,
  getOAuth2Client,
  GOOGLE_REDIRECT_URI,
  GOOGLE_MOBILE_REDIRECT_URI
};