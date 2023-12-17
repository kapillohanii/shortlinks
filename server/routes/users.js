// users.js
const express = require('express');
const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

// Configure Passport LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
  

// User login route
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        console.log(req.user);
        return res.status(200).json({ message: 'Login successful', user });
      });
    })(req, res, next);
  });  

// User logout route
router.get('/logout', (req, res) => {
    // Passport automatically provides a logout function on the request object.
    req.logout(function(err) {
        if (err) { return next(err); }
    });

    // Send a response to the frontend indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
});

// User registration route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken.' });
        }

        // Create a new user
        const newUser = new User({ username });
        await newUser.setPassword(password);
        await newUser.save();
        console.log("New user added:", username);

        // Log in the newly registered user
        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            // Send a response to the frontend indicating successful registration
            res.status(201).json({ message: 'Registration successful', user: { username } });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
