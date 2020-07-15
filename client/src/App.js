import React, {Component} from 'react';
import {Route, BrowserRouter as Router, Switch, Link} from 'react-router-dom'
import './scss/style.scss';
import Register from './components/register.jsx';
import Login from './components/login.jsx';
import Chat from './components/chat.jsx'
import Profile from './components/profile.jsx'
import Home from './components/home.jsx';
import profile from './img/user.svg';
import lightBulb from './img/lightBulb.svg';
import defaultpic from './img/avatars/defaultpic.svg';
import pic1 from './img/avatars/pic1.svg';
import pic2 from './img/avatars/pic2.svg';
import pic3 from './img/avatars/pic3.svg';
import pic4 from './img/avatars/pic4.svg';
import pic5 from './img/avatars/pic5.svg';
import pic6 from './img/avatars/pic6.svg';
import pic7 from './img/avatars/pic7.svg';
import chat from './img/chat.svg';
import group from './img/group.svg';
import io from 'socket.io-client';
let socket = io('https://chatapp-luisleopardi.herokuapp.com/');

class App extends Component {

state = {
  isFinishedLoading: false,
  username:false,
  avatar:false,
  online: [],
  isInRoom: null,
  selected: group,
  optionStyle: {display:'none'},
  isInDashboard: true,
  messages:[],
}

setMessages = ({reciver, sender, text}) => {
  let messagesArray = [...this.state.messages]
  const chatIndex = this.state.messages.findIndex(e=>e.id===`${reciver}${sender}`||`${sender}${reciver}`)
  console.log(this.state.messages)
  if(chatIndex >= 0) {
    messagesArray[chatIndex] = {
      ...messagesArray[chatIndex],
      messages:[
        ...messagesArray[chatIndex].messages,
        {
          sender,
          text
        }
      ]
    }

    this.setState({
      messages:messagesArray
    });

  } else {
    const newChat = {
      id:`${reciver}${sender}`,
      messages:[{
        sender,
        text
      }]
    }

    this.setState(prevState=>({
      messages:[...prevState.messages, newChat]
    }))
  }
}

setLocation = boolean => {
  this.setState({isInDashboard:boolean})
}

setSelected = icon => {
  this.setState({selected:icon})
}

setChatRoom = room => {
  this.setState({isInRoom:room})
}

logout = () => {
  fetch('https://chatapp-luisleopardi.herokuapp.com/logout', {
    method: "GET",
    credentials: 'include'
  })
}

componentDidMount(){
  fetch('https://chatapp-luisleopardi.herokuapp.com/home', {
  method: "post",
  credentials: 'include',
  body:JSON.stringify({function:"get"}),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Cache': 'no-cache'
},
  })
  .then(res => res.json())
  .then(data => {
      if( !data ) {
          this.setState({ isFinishedLoading:true })
      } else if (data.user === null) {
          this.setState({ isFinishedLoading:true })
      } else {
          if(window.location.pathname == "/login" || window.location.pathname == "/register" ) {
            window.location='/'
          }
          this.setState({username:data.username, avatar:data.avatar, isFinishedLoading:true})
          setInterval( () => {

            socket.emit('activeUser', {username:data.username, room:this.state.isInRoom, avatar:data.avatar})
            console.log(socket)

            socket.on('online', ({username, location, avatar, id})=>{

              const alredyOnline = this.state.online.find((e)=> username===e.username);

              if (alredyOnline) return;

              if (username !== this.state.username) {
                this.setState(prevState => ({
                  online: [...prevState.online, {username, room:location, avatar, id}]
                }))
              }
            });
          }, 1000);
          
          socket.on('removeUser', ({user})=>{
            const filtered = this.state.online.filter(e=> e.username !== user )
            this.setState({ online: filtered })
          })
        }
  })
  .catch(e=>{
    this.setState({ isFinishedLoading:true })
  })
}

click = () => {
  if (this.state.optionStyle.display === 'none') {
    this.setState({optionStyle:{display:'flex'}})
  } else {
    this.setState({optionStyle:{display:'none'}})
  }
} 

render(){
const avatarArray = [defaultpic, pic1, pic2, pic3, pic4, pic5, pic6, pic7];
const {username, avatar, online, isFinishedLoading, selected, optionStyle, isInDashboard, messages} = this.state;
return (

  isFinishedLoading ?

  <div className="App">
    <Router>
      <nav className={isInDashboard?'navigation':'none'}>

        <div className={ username? 'userPicAndName' : 'none'} onClick={username? this.click : null}>
          <img className='userPic' src={ avatar === 'default'? defaultpic : avatar }/>
          <div className='optionsWrap'> 
            <p className='username'> {username} </p>
            <div className='options' style={optionStyle}>
              <div>
                <img src={profile}/> 
                <a href='/profile'> PROFILE </a> 
              </div>

              <div>
                <img src={lightBulb}/> 
                <p onClick={this.logout}> LOGOUT </p> 
              </div>  
            </div>
          </div>
        </div>
        
        <div onClick={()=>this.setSelected(chat)} className={!username? 'none' : selected===chat? 'icon active' : 'icon'}> 
          <img src={chat}/>
        </div>
        
        <div onClick={()=>this.setSelected(group)} className={!username? 'none' : selected===group? 'icon active' : 'icon'}>
          <img src={group}/>
        </div>
        
        <a className={ !username? 'links logo' : 'none'} href='/'> Chat App </a>  
        <a className={ !username? 'links register' : 'none'} href='/register'> register </a>
        <a className={ !username? 'links login' : 'none'} href='/login'> login </a>

      </nav>
      <Switch>
        <Route exact path='/' render={props => 
          (<Home {...props}
            setMessages={this.setMessages} 
            setChatRoom={this.setChatRoom} 
            setLocation={this.setLocation} 
            setSelected={this.setSelected} 
            selected={selected} 
            avatarArray={avatarArray} 
            username={username} 
            avatar={avatar} 
            online={online}
            messages={messages} 
          />)} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route exact path='/chat' render={props => 
          (<Chat {...props} setLocation={this.setLocation} setChatRoom={this.setChatRoom}/>)} />
        <Route exact path='/profile' render={props => 
          (<Profile {...props} setLocation={this.setLocation} avatar={avatar} username={username}/>)} />
      </Switch>
    </Router>
  </div>

  :

  <div className='wait'></div>

  ); 
}}
  
export default App;
