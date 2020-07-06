import React, {Component} from 'react';
import lock from '../img/lock.svg';
class Register extends Component {
state = {
    name:'',
    email:'',
    password:'',
    confirmPass:'',
    msg:{},
    isLoading: false
}
register = e => {

    e.preventDefault();
    this.setState({isLoading:true})
    const {name,email,password,confirmPass} = this.state;

    const payload = {
        name,
        email,
        password
    }

    if (password !== confirmPass) {
        this.setState({ msg: {body:'passwords do not match', type: 'error'}, isLoading:false })
    } else if (!password || !name || !email || !confirmPass) {
        this.setState({ msg: {body:'please fill in all fields', type: 'error'}, isLoading:false })
    } else if (password.length < 3) {
        this.setState({ msg: {body:'password must be at least 3 characters long', type: 'error'}, isLoading:false })
    } else if (password.length > 100) {
        this.setState({ msg: {body:'password can not have more than 100 characters', type: 'error'}, isLoading:false })
    } else if (name.length < 3) {
        this.setState({ msg: {body:'the username must be at least 3 characters long', type: 'error'}, isLoading:false })
    } else if (name.length > 20) {
        this.setState({ msg: {body:'the username can not have more than 20 characters', type: 'error'}, isLoading:false })
    } else {
        fetch('https://chatapp-luisleopardi.herokuapp.com//register', {
        body: JSON.stringify({payload}),
        method: "post",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache': 'no-cache'
        },
        credentials: 'include'
        })
        .then(res=>res.json())
        .then(data=>{
            this.setState({ msg: {
                type: data.type,
                body: data.msg
            }, isLoading:false  
        })
        })
        .catch(e=>{
            console.log(e)
            this.setState({ msg: {
                type: 'error',
                body: 'unknow error, please try again later'
            }, isLoading:false  
        })
        })
    }
    
}
render() {
const {msg, isLoading} = this.state
return (
    <form className='LoginAndRegisteForm' onSubmit={this.register}>

        <div className='dashboardHeadline'>
            <h1> Register </h1>
            <div>
                <img src={lock} alt="groupChat"/>
            </div>   
        </div> 

        <h2 className={msg.type==='error'? 'red' : msg.type==='success'? 'green' : 'none'}> { msg.body } </h2>

        <label> <p>Name</p>     
            <input type="text" onChange={e=>this.setState({name:e.target.value})}/>
        </label>

        <label> <p>Email</p>  
            <input type="email" onChange={e=>this.setState({email:e.target.value})}/>
        </label>

        <label> <p>Password</p>  
            <input type="password" onChange={e=>this.setState({password:e.target.value})}/>
        </label>

        <label> <p>Repeat Password </p> 
            <input type="password" onChange={e=>this.setState({confirmPass:e.target.value})}/>
        </label>

        <button type='submit' className={isLoading?'loading' : null}> { isLoading? null : 'Regsiter'} </button>
    </form>
  
)}}

export default Register;

