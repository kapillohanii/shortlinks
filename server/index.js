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
const sessionConfig = {
  store: new RedisStore({
    client: redisClient,
  }),
  secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true,
  cookie: {
    sameSite: 'Lax', // Allow cross-site cookies
    secure: false,
  }
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
  sessionConfig.cookie.sameSite = 'None';

}

app.use(session(sessionConfig));



app.use(passport.initialize());
app.use(passport.session());



const usersRouter = require('./routes/users');
const shortLinksRouter = require('./routes/shortLinks');


app.use('/users', usersRouter);
app.use(isAuthenticated);
app.use('/shortlinks', shortLinksRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
