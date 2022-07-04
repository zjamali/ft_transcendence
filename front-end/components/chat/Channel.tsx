import React, { useContext } from 'react'
import channel from '../../styles/Chat.module.css'
import {ChannelComponentProps} from '../../utils/interfaces'
import  Avatar from './avatar'
import { ChatContext } from '../../context/chatContext'

export default function Channel(props: ChannelComponentProps) {
  const {setReceiver} = useContext(ChatContext)
  return (
    <div className={props.channel.id === props.receiver?.id
      ? channel.contact + ' ' + channel.selected_contact
      : channel.contact} 
      onClick={() => setReceiver(props.channel)} >
      <div className={channel.contact_avatar}>
        <Avatar image={props.channel.image} />
        <h4>{props.channel.channel_name}</h4>
      </div>
    </div>
  )
}
