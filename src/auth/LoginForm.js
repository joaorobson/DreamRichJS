import React, {Component} from 'react';
import {Auth} from './Auth';
import '../stylesheet/LoginForm.sass';
import {Link} from 'react-router-dom';

// import {AuthorizedRoute, AuthorizedLink} from './routes/Router';

export default class LoginForm extends Component{

  handleForm(event){
    event.preventDefault();
    fetch('/api/auth/',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: event.target.username.value,
        password: event.target.password.value
      })
    })
    .then((e) => e.json())
    .then(Auth.authenticate)
    .catch((e) => {console.log(e);});
  }

  render(){
    return (
      <div>
        <form onSubmit={this.handleForm} >
          <p className="iRich_login">DreamRich</p>
          <p className="do-login">Faça login</p>
          <input type="text" className="input-text" name="username"/>
          <br/>
          <input type="password" className="input-text" name="password"/>
          <br/>
          <button className="highlight-btn">ENTRAR</button>
        </form>
        <Link to="/login/resetpassword" className="forgot-password">Esqueceu a senha?</Link>
    </div>
    );
  }
}