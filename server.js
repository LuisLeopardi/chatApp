const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const User = require('./models/users');
const MongoStore = require ('connect-mongo')(session);
const path = require('path');
require('dotenv').config()
// MIDDLEWARES

const sessionMiddleware = (session({
  name:'chatSession',
  secret: process.env.SESSION_SECRET,
  resave: false,
  rolling:true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 60 * 60 * 60 * 24,
    secure: true,
    httpOnly: true,
  }
}));

app.use(sessionMiddleware);
app.use(express.json());
app.use(cors({credentials:true, origin:'https://chatapp-luisleopardi.herokuapp.com/'}))

// CONECTIONS

if(process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
  app.use(express.static('client/build'));
  app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const server = require('http').createServer(app);
const port = process.env.PORT || 5000;
server.listen(port);
const io = require('socket.io')(server);
io.use(function(socket,next){
  sessionMiddleware(socket.request, socket.request.res || {}, next);
})
mongoose
.connect(
    process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(()=>{ console.log('DB conected') })
.catch(err=>{ console.log(err) })

// ROUTES 

const register = require('./routes/api/register');
const login = require('./routes/api/login');
const home = require('./routes/api/home');
const logout = require('./routes/api/logout');
const profile = require('./routes/api/profile');

app.use('/home', home);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/profile', profile);

// CHAT


io.on('connection', socket => {

  const user = socket.request.session.username;
  let location;

  socket.on('activeUser', async ({username, room, avatar})=>{
    io.emit('online', {username, location, avatar})
  })

  socket.on('join', ({ user, room }) => { 
    socket.join(room)
    socket.broadcast.to(room).emit('message', { username:'admin', message: `${user} has joined` })
  });

  socket.on('exit', ({room, username}) => {
    socket.broadcast.to(room).emit('message', {username:'admin', message:`${username} has left` }) 
    socket.leave(room)
  });

  socket.on('sendPrivateMessage', async ({message, sender, reciver})=>{
    socket.broadcast.emit(`privateMsg${reciver}`, {reciver,message,sender});
    })
});


  

