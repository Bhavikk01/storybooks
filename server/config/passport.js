const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../mongodb/models/user_model');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: '681294777470-iovnv0n2koh6eng8us73fe19sh23i9jo.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
        }

        try{
            user = await User.findOne({googleId: profile.id});
            if(user){
                done(null, user);
            }else{
                user = await User.create(newUser);
                done(null, user);
            }
        }catch(error){
            console.log(error);
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })
}

