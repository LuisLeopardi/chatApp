import React, {useEffect, useState, useRef} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket = io('https://chatapp-luisleopardi.herokuapp.com/');

const Chat = ({location, setChatRoom, setLocation}) => {

const [ room, setRoom ] = useState ('');
const [ username, setName ] = useState ('');
const [ message, setMessage ] = useState('');
const [ messages, setMessages ] = useState([]);
const focusView = useRef(null);

useEffect(()=>{
    const { name, room } = queryString.parse(location.search);
    console.log()
    setRoom(room);
    setName(name);
    setChatRoom(room);
    setLocation(false);

    socket.emit('join', { user:name, room })

    return () => {
        setChatRoom(null)
        socket.emit('exit', {room, username})
    }

},[location.search, setChatRoom])

useEffect(()=>{
    socket.on('message', (message)=>{
        setMessages([...messages, message])
    })
})

const sendMessage = (e) => {
    e.preventDefault();
    if(message) {
        setMessages([...messages, {message, username}])
        socket.emit(`sendMessage`, {message, username, room})
        setMessage('')
    }
}

useEffect(()=>{
    if(messages.length > 0){
        console.log('f')
        focusView.current.scrollIntoView({ block: 'start' })
    }
},[messages])

return (
<div className='chat'>
    <div className='chatTitle'>
        <a href='/' className='return'> return </a>   
        <h1> Chat Room {room} </h1>
    </div>
    <div className='chatMessages'>
        {
        messages.map((obj, i)=> 
        <div 
        key={obj.username + i} 
        className={obj.username !== username ? 'message' : 'yourMessage'}
        ref={i === messages.length - 1? focusView : null}
        >  
            <p style={obj.username !== username ?{display:'block'}:{display:'none'}} className='sender'> {`${obj.username} says:`  } </p>
            <p className='text'> {obj.message} </p>  
            </div> 
            )
        }
    </div> 
    <div className='chatInputs'>
        <input type="text" value={message} onKeyPress={e=> e.key === 'Enter' ? sendMessage  : null} onChange={e=>setMessage(e.target.value)}/>
        <button onClick={sendMessage}> Send </button>
    </div>
</div>
)  
}
export default Chat;