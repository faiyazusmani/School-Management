const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback';

  if (!clientID || !clientSecret) {
    console.warn('⚠️ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not provided in environment. Google Passport strategy initialization skipped.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const googleId = profile.id;
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
          const name = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim() || 'Google User';
          const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

          if (!email) {
            return done(new Error('No email address associated with this Google account'), null);
          }

          const isSuperAdminEmail = process.env.SUPER_ADMIN_EMAIL && email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL.toLowerCase();

          // 1. Check if user exists by googleId
          let user = await User.findOne({ googleId });

          if (user) {
            if (isSuperAdminEmail && user.role !== 'super_admin') {
              user.role = 'super_admin';
              await user.save();
            }
            return done(null, user);
          }

          // 2. Check if user exists by email (account linking)
          user = await User.findOne({ email });

          if (user) {
            user.googleId = googleId;
            if (!user.avatar || user.avatar.includes('unsplash')) {
              user.avatar = avatar;
            }
            if (isSuperAdminEmail) {
              user.role = 'super_admin';
            }
            await user.save();
            return done(null, user);
          }

          // 3. Create new user if account doesn't exist
          user = await User.create({
            name,
            email,
            googleId,
            avatar,
            role: isSuperAdminEmail ? 'super_admin' : 'student',
            status: 'active',
            authProvider: 'google',
          });

          return done(null, user);
        } catch (error) {
          console.error('Passport Google Strategy Error:', error.message);
          return done(error, null);
        }
      }
    )
  );
};

module.exports = configurePassport;
