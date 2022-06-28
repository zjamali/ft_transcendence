import React, { useContext } from 'react'
import roomStyles from '../../styles/Chat.module.css'
import {RoomComponentProps} from './interfaces'
import  Avatar from './avatar'
import { ChatContext } from '../../context/chatContext'

export default function Room(props: RoomComponentProps) {
  const {setReceiver} = useContext(ChatContext)
  return (
    <div className={props.room.id === props.receiver?.id
      ? roomStyles.contact + ' ' + roomStyles.selected_contact
      : roomStyles.contact} 
      onClick={() => setReceiver(props.room)} >
      <div className={roomStyles.contact_avatar}>
        <Avatar image={props.room.image} />
        <h4>{props.room.room_name}</h4>
      </div>
    </div>
  )
}
