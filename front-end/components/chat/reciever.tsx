import React, { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import reciverStyle from '../../styles/Chat.module.css'
import Avatar from './avatar'
import { isContact } from '../../utils/utils'

export default function Reciever() {
  const { state } = useContext(ChatContext)
  return (
    <>
      {isContact(state.receiver) ? (
        <div className={reciverStyle.main_user}>
          <Avatar image={state.receiver.image} />
          <div>
            <h3>{`${state.receiver.firstName} ${state.receiver.lastName}` }</h3>
            <p>@{state.receiver.userName}</p>
          </div>
        </div>
      ) : (
        <div className={reciverStyle.main_user}>
          <Avatar image={state.receiver.image} />
          <div>
            <h3>{state.receiver.room_name}</h3>
          </div>
        </div>
      )}
    </>
  )
}
