import React, { useContext, useState } from 'react'
import { ChatContext } from '../context/chatContext'
import loginStyle from '../styles/Chat.module.css'
import {v4 as uuidv4} from 'uuid'

export default function Login(props :  any) {
  const {state, setMainUser} = useContext(ChatContext);
  const handleLogin = (e: any ) =>
  {
    //  e.preventDefault();
    console.log("event : ", e);
    // props.setLogin(true);
    // const User = {
    //   id : uuidv4(),
    //   image: '/images/contacts/default_avatar.jpeg',
    //   userName: userNameInput,
    //   lastName: userNameInput,
    //   firstName: userNameInput,
    // }
    // setMainUser({...User});
    // props.setLogin(true);
    // const response = fetch('http://localhost:5000/auth/42/');
    // console.log("response : ", response);
  }

  return (
    <div className={loginStyle.loginContainner}>
        <form className={loginStyle.loginForm} action="http://localhost:5000/auth/42">
            <img src="/42logo-white.svg" alt="42logo"  />
            {/* <button type="submit" onClick={(e)=> {handleLogin(e)}} >login</button> */}
            <button type="submit" onClick={(e)=> {handleLogin(e)}} >login</button>
        </form>
    </div>
  )
}