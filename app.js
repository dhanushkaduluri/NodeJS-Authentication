import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import UserController from './controllers/user.controller.js';
import { UserModel } from './models/user.model.js';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import { compare } from './utils/hashPassword.util.js';

const app = express();

app.set("view engine","ejs")
app.set("views",'./views');
app.use(ejsLayouts)
app.use(express.static('views'));
app.use(express.static('public'));

const userController=new UserController();

// Configure middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use sessions to keep track of user authentication state
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Dummy database for illustration purposes


// Passport local strategy for username/password authentication
passport.use(new LocalStrategy(async (email, password, done) => {
  
  const user =await UserModel.findOne({
    email:email
  });

  if(!user){
    return done(null, false, { message: 'Email not found' });
  }

  console.log(user);
  const check=await compare(user.password,password);

  console.log(check);

  if (check) {
    app.locals.email=email;

    return done(null, user);
  } else {
    return done(null, false, { message: 'Incorrect username or password' });
  }
}));

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'User not found' });
    }
  } catch (error) {
    return done(error);
  }
});


// Example protected route
app.get('/', userController.get);

app.get('/login',userController.getSignIn);

app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    delete app.locals.email;
    // After logging out, destroy the session
    req.session.destroy(function(err) {
      if (err) {
        console.error('Error destroying session:', err);
        return next(err); // Forward the error to the error-handling middleware
      }

      // Redirect the user to the home page or any other desired route
      res.redirect('/');
    });
  });
});


app.get('/reset',userController.resetPassword);

app.post('/reset',userController.postReset);

app.post('/login',userController.signIn);

app.get('/register',userController.getRegister);

app.get('/forgot',userController.forgot);

app.get('/forgot/reset/:email',userController.forgotReset);


app.post('/forgot',userController.postForgot);

app.post('/register',userController.postRegister)


// Start the server
export default app;