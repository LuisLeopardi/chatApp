import React, {Component, useEffect, useState, useRef} from 'react'
import smile from '../img/smile.svg';
import group from '../img/group.svg';
import chat from '../img/chat.svg';
import sendMessage from '../img/message.svg';
import location from '../img/location.svg';
import tornado from '../img/tornado.svg';
import volcano from '../img/volcano.svg';
import arrow from '../img/arrow.svg';
import close from '../img/close.svg';
import storm from '../img/storm.svg';
import snow from '../img/snow.svg';
import {Link} from 'react-router-dom';
import io from 'socket.io-client';

let socket = io('https://chatapp-luisleopardi.herokuapp.com/');

class Home extends Component {

componentDidMount(){
    this.props.setLocation(true)
    this.props.setChatRoom(null)
}

render() {

const {avatarArray, username, avatar, online, selected, setSelected, messages, setMessages} = this.props;

return (
    <main>{

        username ?

        <Dashboard 
            selected={selected} 
            avatar={avatar} 
            setSelected={setSelected} 
            username={username} 
            online={online} 
            avatarArray={avatarArray}
            messages={messages}
            setMessages={setMessages}
        />
        :
        <LoginForStartChatting/>

    }</main>
)

}}

export default Home;

const LoginForStartChatting = () => {
return (
<div className='loginInvitation'>
    <h1> Login for start chatting </h1>
    <img className='smile' src={smile} alt="happy face"/>
</div> 
)}

const Dashboard = ({username, online, avatarArray, selected, setSelected, messages, setMessages}) => {
const [reciver, setReciver] = useState(null);
const [usersSidebarClass, setClass] = useState('usersOnline');
const [divStyle, setStyle] = useState({ display: 'flex', opacity:'1' })

const showUsers = () => {
    setClass(usersSidebarClass==='usersOnline'? 'usersOnline deploy' : 'usersOnline');
    setStyle({display: 'flex', opacity:'0' });
    setTimeout(() => {
        setStyle({display: 'none', opacity:'0' });
    }, 300);
}

const closeUsers = () => {
    setClass('usersOnline');
    setStyle({display: 'flex', opacity:'0' });
    setTimeout(() => {
        setStyle({display: 'flex', opacity:'1' });
    }, 300);
}

return (
<div className='lobby'>
    <div className={usersSidebarClass}>
        <img onClick={closeUsers} className='close' src={close}/>
        {
            online.map(obj=>
                <div key={obj.username} className={usersSidebarClass === 'usersOnline'? 'userContainer opacity' : 'userContainer '}>
                    <img src={avatarArray.filter(e=>e===obj.avatar)} alt="userPic" className='userIcon'/>
                    <div className='userInfoWrap'> 
                        <p className='onlineUsername'> {obj.username} </p>
                        <div>
                            <img src={location} alt="location"/>
                            <p className='userLocation'> {obj.room === null ? 'lobby' : obj.room} </p>
                        </div>
                    </div>
                    <img onClick={()=>{setReciver(obj.username); setSelected(chat)}} className='sendMessage' src={sendMessage} alt="sendMessage"/>
                </div>
            )
        }
    </div>

    {
        selected === group ?
        <PublicChat username={username} usersSidebarClass={usersSidebarClass} setClass={setClass}/>
        :
        <PrivateChat setMessages={setMessages} messages={messages} usersSidebarClass={usersSidebarClass} selected={selected} reciver={reciver} username={username}/>
    }

    <div style={divStyle} className='seeWhosOnline' onClick={showUsers}> 
        <span> {online.length} </span>
        <p>online</p> 
        <img src={arrow} alt="arrow"/> 
    </div>

</div> 
)}
const PrivateChat = ({username, reciver, usersSidebarClass, setMessages, messages}) => {

    const [ message, setMessage ] = useState('');
    const focusView = useRef(null)

    useEffect(()=>{
        socket.on(`privateMsg${username}`, ({reciver,message,sender})=>{
            setMessages({to:reciver,sender,text:message});
        })
    })

    const sendMessage = () => {
        setMessages({to:reciver,sender:username,text:message})
        socket.emit('sendPrivateMessage', {message, sender:username, reciver})
        setMessage('')
    }

return (
    <div className={usersSidebarClass==='usersOnline'? 'dashboard' : 'dashboard smaller'}>

        {
            reciver?
            <div className='privateMessage'> 
                <b> {reciver} </b>
                <div className='privateMessageContainer'>
                {
                    messages.map((e,i)=>
                        <div 
                            className={e.sender !== username ? 'message' : 'yourMessage'} 
                            key={Math.random() * 10000 + e.sender}
                            >
                            <p>{e.messages.text}</p> 
                        </div>  
                    )
                }
                </div>
                <div className='chatInputs'> 
                    <input type="text" value={message} onChange={e=>setMessage(e.target.value)}/>
                    <button onClick={sendMessage}> send </button>
                </div>
                
            </div>

            :

            <p className='noUserSelected'> check whos online for start chatting </p>

        }

    </div>
)
}

const PublicChat = ({username, usersSidebarClass}) => {
const chatRoomNames = ['volcano', 'tornado', 'storm', 'snow']
const images = [volcano, tornado, storm, snow]
return (
<div className={usersSidebarClass==='usersOnline'? 'dashboard' : 'dashboard smaller'}>
    <div className='dashboardHeadline'>
        <h1> Chat Rooms </h1>
        <div>
            <img src={group} alt="groupChat"/>
        </div>   
    </div>
    
    <ul className='chatRoomUl'>
    {chatRoomNames.map((e,i)=>
        <Link className='chatRoomItem' 
        to={`/chat?room=${e}&name=${username}`}
        key={e}> 
            <img src={images[i]} alt="chat_room_image"/>
            <p> {e} </p>    
         </Link> 
        )}
    </ul>
</div>
)
}