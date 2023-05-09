// Express App definition

const express = require('express');
const session = require('express-session');
// const cors = require('cors');

const userRoutes = require('./src/routes/UserRoute');
const postRoutes = require('./src/routes/PostRoute');
const path = require('path');
require('./src/database/initDB');
require('dotenv').config();
const newErrorHandler = require('./src/middlewares/errorHandler');

const app = express();
const vuePort = process.env.VUE_PORT;

// Adds headers to the response object to avoid CORS errors
// This will allow requests from all origins to access your API. 
app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${vuePort}`);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Complex CORS requests: require an initial OPTIONS request (called the "pre-flight request")
app.options('/*', (_, res) => {
    res.sendStatus(200);
});
// app.options('/*', cors());

// For any incoming request of Content-type == application/json
// => extract the request JSON body and put it in the req object as a body property (req.body).
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// To serve the static media directory
app.use('/media', express.static(path.join(__dirname, 'media')));


// To use Express sessions with Redis
const redis = require('redis');
const {createClient} = require('redis');

// Initialize client
let redisClient = createClient({
    host: 'localhost',
    port: process.env.REDIS_PORT,
    // url: " redis://localhost:6379"
})
// const redisClient = redis.createClient(6379,'127.0.0.1');
redisClient.connect().catch(console.error)
redisClient.on('connect', () => {
    console.log('Connected to Redis successfully.');
})
redisClient.on('error', (err) => {
    console.error('Could not establish a connection with redis. ' + err);
});


//Initialize store
const RedisStore = require('connect-redis').default;
const sessionStore = new RedisStore({
    client: redisClient,
    // prefix: 'myapp:'
})


// Initialize session storage
const IN_PROD = process.env.NODE_ENV === 'production';
const ONE_DAY = 1000 * 60 * 60 * 24;
const ONE_HOUR = 1000 * 60 * 60 * 1;
app.use(session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: ONE_DAY,
        secure: IN_PROD, // if true only transmit cookie over https
        httpOnly: true // if true prevent client side JS from reading the cookie
    },
    
}));


// Set the endpoint and then the router to be used
app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

app.use(newErrorHandler);

module.exports = app;