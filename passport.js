const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const {
    ExtractJwt
} = require('passport-jwt');

const LocalStrategy = require('passport-local').Strategy;

const {
    JWT_SECRET
} = require('./config/index.js');
const User = require('./models/user.js');

//JWT Strategy Function
const jwt_validation_function = async (payload, done) => {
    try {
        const user = await User.findById(payload.sub);

        if (!user) {
            return done(null, false);
        }

        done(null, user);

    } catch (error) {

        done(error, false);

    }
};

//JWT Strategy
const jwt_strategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, jwt_validation_function);

//Setting JWT strategy
passport.use(jwt_strategy);



//Local Strategy Function
const local_strategy_function = async (username, password, done) => {
    try {
        //Find user 
        const user = await User.findOne({
            username
        });
        //Failed
        if (!user) {
            return done(null, false);
        }
        //Check passord
        const passed = user.isValid(password);
        //Failed
        if(!passed){
            return done(null,false);
        }

        //Return user
        done(null,user);

    } catch (error) {
        
        done(error, false);
    }
}


//Local Strategy
const local_strategy = new LocalStrategy({
    usernameField: 'username'
}, local_strategy_function);


//Setting local Strategy
passport.use(local_strategy);













//Local Validation
passport.use();