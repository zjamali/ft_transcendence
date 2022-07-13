import React, { useContext } from 'react'
import channel from '../../styles/Chat.module.css'
import {ChannelComponentProps} from '../../utils/interfaces'
import Avatar from 'react-avatar';
import { ChatContext } from '../../context/chatContext'

export default function Channel(props: ChannelComponentProps) {
  const {setReceiver} = useContext(ChatContext)
  return (
    <div className={props.channel.id === props.receiver?.id
      ? channel.contact + ' ' + channel.selected_contact
      : channel.contact} 
      onClick={() => setReceiver(props.channel)} >
      <div className={channel.contact_avatar}>
      <Avatar name={props.channel.roomName} size="50" round={true}/>
        <h4>{props.channel.roomName}</h4>
      </div>
    </div>
  )
}
