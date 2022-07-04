import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/Chat.module.css'
import ChatRightSide from '../components/chat/chatPannel'
import ChatLeftSide from '../components/chat/chatSideBar'
import NoReceiver from '../components/chat/noReceiver'
import { ChatContext } from '../context/chatContext'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'

export default function Chat() {
  const { state, sockets, setContacts, setsEventSockets } = useContext(
    ChatContext,
  )
  useEffect(() => {
    console.log("new build");
    try{
      setsEventSockets(io('http://localhost:5000/events', {withCredentials: true}))
      fetchAllusers();
    }
    catch(error)
    {
      console.log("socket error");
    }
    return () => {
      
      if (sockets.events)
      {
        sockets.events.disconnect();
        console.log("delete socket : ", sockets.events);
      }
    };
  }, [])

  function fetchAllusers() {
    try
    {




      axios
      .get('http://localhost:5000/users', { withCredentials: true })
      .then((res) => {
        setContacts([...res.data])
      })
    }
    catch
    {
      console.log("CANT GET ALL USERS");
    }
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
      setContacts([...contacts])
    } else fetchAllusers()
  }

  useEffect(() => {
    console.log('event socket : ', sockets.events)
    if (sockets.events) {
      /// onConnection : socket connection emit event IAM ONLINE just ONCONNECTION
      sockets.events.on('A_USER_STATUS_UPDATED', (user: any) => {
        setContactStatus(user.isOnline, user)
      })
    }
    return () => {
      if (sockets.event) {
        sockets.events.off('A_USER_STATUS_UPDATED', (user: any) => {
          setContactStatus(user.isOnline, user)
        })
      }
    }
  }, [sockets])

  return (
    <div className={styles.chatComponentStyle}>
      <ChatLeftSide />
      {state.receiver ? <ChatRightSide /> : <NoReceiver />}
    </div>
  )
}
