import React, { useContext } from 'react'
import channel from '../../styles/Chat.module.css'
import {ChannelComponentProps} from '../../utils/interfaces'
import Avatar from './avatar';
import { ChatContext } from '../../context/chatContext'

export default function Channel(props: ChannelComponentProps) {
  const {setReceiver} = useContext(ChatContext)

  function handleReceiver()
  {
    setReceiver(props.channel);
  }

  return (
    <div className={props.channel.id === props.receiver?.id
      ? channel.contact + ' ' + channel.selected_contact
      : channel.contact} 
      onClick={handleReceiver} >
      <div className={channel.contact_avatar}>
      <Avatar image={props.channel.image}/>
        <h4>{props.channel.roomName}</h4>
      </div>
    </div>
  )
}
