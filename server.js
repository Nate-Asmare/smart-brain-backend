const express = require('express');
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'leantan@7525',
        database: 'smartbrain'
    }
});

// console.log(postgres.select('*').from('users'));
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors())

/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/

// app.get('/', (req, res) => {
//     res.send(database.users); //we can remove this code yes we should
// })

app.get('/profile/:id', (req, res) =>  profile.handleProfile(req, res, db))

app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt, salt)})

app.put('/image', (req, res) => {image.handleImage(req, res, db, bcrypt)})

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }
app.listen(PORT, ()=> {
    console.log(`app is running on port ${PORT}`);
})