const express = require ('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const User = require('./models/users');
const MongoStore = require ('connect-mongo')(session);
const sessionSecret = require('./config/keys').sessionSecret;
const path = require('path');
require('dotenv').config()
// MIDDLEWARES

app.use(cors({credentials:true, origin:'https://chatapp-luisleopardi.herokuapp.com/'}))
app.use(express.json());
app.use(session({
  name:'chatSession',
  secret: process.env.SESSION_SECRET,
  resave: false,
  rolling:true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 60 * 60 * 60 * 24,
    secure: false,
    httpOnly: false,
  }
  }))


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

    let user;
    let location;

    socket.on('activeUser', ({username, room, avatar})=>{
      user = username
      location = room
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

    socket.on('sendMessage', ({message, username, room}) => {
      socket.broadcast.to(room).emit('message', {message, username})
    })

    socket.on('disconnect', ()=>{
      io.emit('removeUser', {user})
    });
/*
    socket.on(`for${user}`, async ({reciver,message,sender})=>{
      console.log(user)
      let isChat;

      const Reciver = await User.findOne({name:reciver})
      const Sender = await User.findOne({name:sender});

      Reciver.chats.forEach(chat=>{
        if (chat._id === `${Sender._id}${Reciver._id}` || `${Reciver._id}${Sender._id}`) {
          isChat = true
        } else {
          isChat = false
        }
      });

      if(!isChat) {
        await User.updateOne({name:reciver},{
          $push : {
            chats : {
              '_id': `${Sender._id}${Reciver._id}`,
              'messages': { sender, body:message },
            } 
          }
        });
      } else {
        await User.updateOne({name:reciver, "chats._id": `${Sender._id}${Reciver._id}` || `${Reciver._id}${Sender._id}` },{
          $push: {
            'chats.$.messages':{sender, body:message}
          }
        })
      }

    })
*/
    socket.on('sendPrivateMessage', async ({message, sender, reciver})=>{

      const ObjectId = require('mongoose').Types.ObjectId;
      
      let isChat;
      let isChatForReciver;

      const Sender = await User.findOne({name:sender});
      const Reciver = await User.findOne({name:reciver})

      const SenderAndReciver = new ObjectId(`${Sender._id}${Reciver._id}`)
      const ReciverAndSender = new ObjectId(`${Sender._id}${Reciver._id}`)

      Sender.chats.forEach(chat=>{
        if (chat._id === `${Sender._id}${Reciver._id}` || `${Reciver._id}${Sender._id}`) {
          isChat = true
        } else {
          isChat = false
        }
      });

      Reciver.chats.forEach(chat=>{
        if (chat._id === `${Sender._id}${Reciver._id}` || `${Reciver._id}${Sender._id}`) {
          isChatForReciver = true
        } else {
          isChatForReciver = false
        }
      });

      if(!isChat) {
        await User.updateOne({name:sender},{
          $push : {
            chats : {
              '_id': `${Sender._id}${Reciver._id}`,
              'messages': { sender, body:message },
            } 
          }
        });
      } else {
        await User.updateOne({$and:[
          {name:sender},
          {$or:[{'chats._id': SenderAndReciver},{'chats._id': ReciverAndSender}]}
        ]
      },{
          $push: {
            'chats.$.messages':{sender, body:message}
          }
        })
      }

      if(!isChatForReciver) {
        await User.updateOne({name:reciver},{
          $push : {
            chats : {
              '_id': `${Sender._id}${Reciver._id}`,
              'messages': { sender, body:message },
            } 
          }
        });
      } else {
        await User.updateOne({ $and: [
          {name:reciver},
          {$or:[{'chats._id': SenderAndReciver},{'chats._id': ReciverAndSender}]}
        ]
         },{
          $push: {
            'chats.$.messages':{sender, body:message}
          }
        })
      }

      socket.broadcast.emit(`for${reciver}`, {reciver,message,sender})


    })
});


  

