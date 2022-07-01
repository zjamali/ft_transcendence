import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/Chat.module.css'
import ChatRightSide from '../components/chat/chatRightSide'
import ChatLeftSide from '../components/chat/chatLeftSide'
import NoReceiver from '../components/chat/noReceiver'
import { ChatContext } from '../context/chatContext'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'

export default function Chat() {
  const { state, sockets, setContacts, setsEventSockets } = useContext(
    ChatContext,
  )
  const [onConnection, setOnConnection] = useState(true)
  useEffect(() => {
    console.log('state : ', state)
    setsEventSockets(io('http://localhost:5000/events'))
    fetchAllusers()

    // return () => sockets.events.disconnect();
  }, [])

  function fetchAllusers() {
    axios
      .get('http://localhost:5000/users', { withCredentials: true })
      .then((res) => {
        setContacts([...res.data])
      })
  }
  function setContactStatus(status: boolean, user: any) {
    let contacts = [...state.contacts]
    if (
      contacts.filter((contact) => {
        contact.id === user.id
      }).length === 1
    ) {
      contacts.map((user) => {
        if (user.id === user.id) {
          user.isOnline = status
        }
      })
      setContacts([...contacts]);
    } else fetchAllusers()
  }
  useEffect(() => {
    console.log('event socket : ', sockets.events)
    if (sockets.events) {
      /// onConnection : socket connection emit event IAM ONLINE just ONCONNECTION
      if (onConnection) {
        setOnConnection(false)
        sockets.events.emit(
          'IAM ONLINE',
          { ...state.mainUser, isOnline: true },
          () => {
            console.log('IAM online')
          },
        )
        return
      }
      sockets.events.on('A_USER_STATUS_UPDATED', (user: any) => {
        setContactStatus(user.isOnline, user);
      })

    }
  }, [sockets])

  return (
    <div className={styles.chatComponentStyle}>
      <ChatLeftSide />
      {state.receiver ? <ChatRightSide /> : <NoReceiver />}
    </div>
  )
}
