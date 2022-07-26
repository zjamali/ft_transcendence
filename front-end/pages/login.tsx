import React, { useContext, useState } from 'react'
import { ChatContext } from '../context/chatContext'
import loginStyle from '../styles/Chat.module.css'
import { v4 as uuidv4 } from 'uuid'

export default function Login(props: any) {
  // const { state, setMainUser } = useContext(ChatContext)

  return (
    <div className={loginStyle.container}>
      <div className={loginStyle.loginContainner}>
        <form
          className={loginStyle.loginForm}
          action="http://localhost:5000/auth/42"
        >
          <img src="/42logo-white.svg" alt="42logo" />
          <button type="submit">login</button>
        </form>
      </div>
    </div>
  )
}
