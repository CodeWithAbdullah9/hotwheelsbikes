const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Customer = require('../models/Customer');

passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    if (!email) return done(null, false);

    // Find existing user by googleId or email
    let user = await Customer.findOne({ $or: [{ googleId: profile.id }, { email }] });

    if (user) {
      // Update Google info if not set
      if (!user.googleId) {
        user.googleId = profile.id;
        user.profilePicture = profile.photos?.[0]?.value || '';
        user.isVerified = true;
        await user.save();
      }
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    }

    // Create new user
    user = await Customer.create({
      name:           profile.displayName || email.split('@')[0],
      email,
      googleId:       profile.id,
      profilePicture: profile.photos?.[0]?.value || '',
      isVerified:     true,
      password:       null,
    });

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;
