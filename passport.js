const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const UserSchema = require('./src/models/user.schema');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google",
            scope:["profile", "email"]
        },
        async (accessToken, refereshToken, profile, callback) => {
            try{

                let user = await UserSchema.findOne({googleId: profile.id})

                if(!user){
                    const userObj = {
                       email: profile.emails[0].value,
                       profile_image: profile.photos[0].value,
                       googleId: profile.id,
                       is_verified: profile.emails[0].verified,
                       registration_date: Date.now() 
                    }

                    user = await UserSchema.create(userObj)
                }
                callback(null, user)
            }catch(error){
                console.log("error: ",error);
                callback(error, null);
            }
            
        }
    )
)

passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    done(null, user)
})