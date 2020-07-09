import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import edit from '../img/edit.svg';
import defaultpic from '../img/avatars/defaultpic.svg';
import pic1 from '../img/avatars/pic1.svg';
import pic2 from '../img/avatars/pic2.svg';
import pic3 from '../img/avatars/pic3.svg';
import pic4 from '../img/avatars/pic4.svg';
import pic5 from '../img/avatars/pic5.svg';
import pic6 from '../img/avatars/pic6.svg';
import pic7 from '../img/avatars/pic7.svg';

const Profile = ({avatar, username, setLocation}) => {

    const avatarArray = [defaultpic, pic1, pic2, pic3, pic4, pic5, pic6, pic7];
    const [profileAvatar, setAvatartochange] = useState('');
    const [usernameToChange, setUsernameToChange,] = useState('');
    const [disabledInput, setInput] = useState(true);

    const changeAvatar = () => {
        fetch('https://chatapp-luisleopardi.herokuapp.com/profile', {
            method: "post",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({profileAvatar, username, function:'changeAvatar'})
        })
        .then(()=>{
            window.location.reload()
        }) 

    }

    const changeUsername = () => {
        fetch('http://localhost:5000/profile', {
            method: "post",
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({username, usernameToChange, function:'changeUsername'})
        })
        .then(()=>{
            window.location.reload()
        })
    }

    return (

        <div className='profile' onLoad={()=>setLocation(false)}>

            <Link to='/' className='return'> Return </Link>

            <div className='profileInfoWrap'>
                <img className='profileAvatar' src={avatar} alt="profileAvatar"/>
                <div>
                    <p> {username} </p>
                    <div className={disabledInput?'none':'confirm'}>
                        <input type="text" defaultValue={username} onChange={e=>setUsernameToChange(e.target.value)}/>
                         <b> change </b>  
                         <div className='yesOrNo'>
                            <p className='yes' onClick={changeUsername}>yes</p>
                            <p className='no' onClick= {()=> setInput(!disabledInput)}>no</p>  
                        </div>    
                    </div>        
                </div>
                <img className={disabledInput?'changeUsername':'none'} src={edit} alt="edit" onClick= {()=> setInput(!disabledInput)}/>  
            </div>

            
            <div className='changeAvatar'>

                <h2> choose an avatar </h2>
                {
                    avatarArray.map(e=>
                        <div className='avatarWrap' key={e}>
                            <img 
                                src={e} 
                                alt="avatarSelection"
                                onClick={()=>setAvatartochange(e)}
                            />
                            <div className={profileAvatar===e?'confirm':'none'}>
                                <div className='selectavatar'>
                                    <img src={e} alt="avatarSelection"/>
                                    <p> select this avatar ? </p>               
                                </div>
                                <div className='yesOrNo'>
                                    <p className='yes' onClick={changeAvatar}>YES</p>
                                    <p className='no' onClick={()=>setAvatartochange(null)}>NO</p>   
                                </div>
                            </div>
                        </div>
                        
                    )
                }       
            </div>   
        </div>
    )
}

export default Profile;