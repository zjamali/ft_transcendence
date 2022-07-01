import React, { useContext, useEffect } from 'react'
import { ChatContext } from '../../context/chatContext'
import ContactStyles from '../../styles/Chat.module.css'
import Avatar from './avatar'
import { ContactComponentProps } from './interfaces'

function Contact(props: ContactComponentProps) {
  const {setReceiver} = useContext(ChatContext);
  return (
    <div
      className={
        props.contact.id === props.receiver.id
          ? ContactStyles.contact + ' ' + ContactStyles.selected_contact
          : ContactStyles.contact
      }
      onClick={() => {
          setReceiver(props.contact);
      }}
    >
      <div className={ContactStyles.contact_avatar}>
        <Avatar image={props.contact.image} />
        <h4>{props.contact.firstName + ' ' + props.contact.lastName}</h4>
      </div>
      <div className={ContactStyles.contact_status}>
        {props.contact.playing && (
          <div className={ContactStyles.playing}>playing</div>
        )}
        {props.contact.isOnline && (
          <div className={ContactStyles.onlineCircle}></div>
        )}
        {!props.contact.isOnline && (
          <div className={ContactStyles.offlineCircle}></div>
        )}
      </div>
    </div>
  )
}

export default Contact
