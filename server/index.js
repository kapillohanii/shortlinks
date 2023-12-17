// index.js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const isAuthenticated = require('./middleware'); // Include the middleware
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.URI;
const redis = require("redis");
const RedisStore = require("connect-redis").default;

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_ENDPOINT,
    port: process.env.REDIS_PORT
  }
});

redisClient.connect().catch(console.error);



let redisStore = new RedisStore({
  client: redisClient,
});

mongoose.connect(uri, {});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const corsOptions = {
  origin: process.env.CLIENT_URL, // Update with your frontend's origin
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store: redisStore,
  secret: process.env.SECRET_KEY, resave: false, saveUninitialized: false,
  cookie: {
    sameSite: 'None', // Allow cross-site cookies
    secure: true, // Ensure cookies are sent only over HTTPS
  }
}));
app.use(passport.initialize());
app.use(passport.session());



const shortLinksRouter = require('./routes/shortLinks');
const usersRouter = require('./routes/users');


app.use('/users', usersRouter);
app.use('/shortlinks', shortLinksRouter);
app.use(isAuthenticated);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
