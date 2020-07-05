import React, {Component} from 'react'
import key from '../img/key.svg';
class Login extends Component {
state = {
    email: '',
    password: '',
    msg:{},
    isLoading: false
}

login = e => {
    e.preventDefault()
    this.setState({isLoading:true})
    const {email,password} = this.state;
    fetch('https://chatapp-luisleopardi.herokuapp.com/login', {
    body: JSON.stringify({email,password}),
    method: "post",
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
    },
    credentials: 'include'
    })
    .then(res=>res.json())
    .then(resolved=>{
        if(resolved.type === 'error') return this.setState({ msg:{type:resolved.type, body:resolved.msg}, isLoading:false})
        window.location = '/'
    })
    .catch(err=>console.log(err))
}

render() {
const {msg, isLoading} = this.state
return (
    <form className='LoginAndRegisteForm' onSubmit={this.login}> 

        <div className='dashboardHeadline'>
            <h1> Login </h1>
            <div>
                <img src={key} alt="groupChat"/>
            </div>   
        </div> 


        <h2 className={msg.type==='error'? 'red' : msg.type==='success'? 'green' : 'none'}> { msg.body } </h2>

        <label> <p>Email</p>  
            <input type="email" onChange={e=>this.setState({email: e.target.value})}/>
        </label>

        <label> <p>Password</p>  
            <input type="password" onChange={e=>this.setState({password: e.target.value})}/>
        </label>

        <button type='submit' className={isLoading?'loading' : null}> { isLoading? null : 'Login'} </button>

    </form>
  
)}}

export default Login;

