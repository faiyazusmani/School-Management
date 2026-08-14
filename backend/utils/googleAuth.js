const { OAuth2Client } = require('google-auth-library');

const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured in backend environment variables.');
  }
  return new OAuth2Client(clientId);
};

/**
 * Verify Google ID Token against Google Public Key Servers
 * @param {string} idToken Signed ID Token from Google Client
 * @returns {Promise<object>} Verified payload (sub, email, name, picture)
 */
const verifyGoogleIdToken = async (idToken) => {
  try {
    const client = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      emailVerified: payload.email_verified,
      name: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
      avatar: payload.picture,
    };
  } catch (error) {
    console.error('Google ID Token Verification Failed:', error.message);
    throw new Error('Invalid or expired Google ID Token');
  }
};

module.exports = { verifyGoogleIdToken };
