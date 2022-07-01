import React, { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import userStyles from '../../styles/Chat.module.css'
import  Avatar from './avatar'

export default function MainUser(props: any) {
  const {state} = useContext(ChatContext)
  return (
    <div className={userStyles.main_user}>
      <Avatar image={state.mainUser?.image} />
      <div>
        <h3>{state.mainUser.firstName + ' ' + state.mainUser.lastName}</h3>
        <p>{'@' + state.mainUser.userName} </p>
      </div>
    </div>
  )
}
