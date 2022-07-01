import React, { useContext, useEffect, useState } from 'react'
import styles from '../styles/Chat.module.css'
import ChatRightSide from '../components/chat/chatRightSide'
import ChatLeftSide from '../components/chat/chatLeftSide'
import NoReceiver from '../components/chat/noReceiver'
import { ChatContext } from '../context/chatContext'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'

export default function Chat() {
  const { state, setContacts } = useContext(ChatContext)

  useEffect(() => {
    console.log('state : ', state)
    // setsChatSockets(io('http://localhost:5000/chat'));
    fetchAllusers()
  }, [])

  function fetchAllusers() {
    axios
      .get('http://localhost:5000/users', { withCredentials: true })
      .then((res) => {
        setContacts([...res.data])
      })
  }
  // useEffect(() => {
  //   if (sockets.chat) {
  //     console.log('connection')
  //     console.log('socket :  ', sockets.chat)
  //     sockets.chat.on('connect', () => {
  //       sockets.chat.emit('createUser', {
  //         ...state.mainUser,
  //         socket: sockets.chat.id,
  //       })
  //     })
  //     fetchAllusers();

  //     sockets.chat.on("aUserStatusUpdated" , ()=>{
  //       fetchAllusers();
  //     })
  //   }
  // }, [sockets.chat])

  return (
    <div className={styles.chatComponentStyle}>
      <ChatLeftSide />
      {state.receiver ? <ChatRightSide /> : <NoReceiver />}
    </div>
  )
}
