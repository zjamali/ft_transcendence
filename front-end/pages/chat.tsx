import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/Chat.module.css'
import ChatPannel from '../components/chat/chatPannel'
import ChatSideBar from '../components/chat/chatSideBar'
import NoReceiver from '../components/chat/noReceiver'
import { ChatContext } from '../context/chatContext'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'

export default function Chat() {
  const { state, setContacts } = useContext(ChatContext)
  const eventsSocket = useRef<any>(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showContacts, setShowContacts] = useState(windowWidth === 800);
  useEffect(() => {
    //////
    /* creation Sockets start */
    if (!eventsSocket.current)
      eventsSocket.current = io('http://localhost:5000/events', {
        withCredentials: true,
      })

    try {
      fetchAllusers()
      eventsSocket.current.on('A_USER_STATUS_UPDATED', (user: any) => {
        setContactStatus(user.isOnline, user)
      })
    } catch (error) {
      console.log('sockets error', error)
    }

    return () => {
      console.log('close sockets')
      eventsSocket.current.disconnect()
    }
  }, [])

  function fetchAllusers() {
    try {
      axios
        .get('http://localhost:5000/users', { withCredentials: true })
        .then((res) => {
          console.log('all users :', res.data)
          const userContacts = res.data.filter(
            (user: any) => user.id != state.mainUser.id,
          )
          console.log('new contacts : ', userContacts)
          setContacts([...userContacts])
        })
    } catch {
      console.log('CANT GET ALL USERS')
    }
  }

  function setContactStatus(status: boolean, user: any) {
    console.log('set contacts ')
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
    console.log('messages ', state.messages)
    if (state.messages.length > 0) {
      const lastMessage = state.messages.length - 1
      if (state.messages[lastMessage].senderId === state.mainUser.id)
        console.log('main user message')
    }
  }, [state.messages])

  // useEffect(() => {
  //   /* EVENTS */
  //   console.log('event socket : ', sockets.events)
  //   if (sockets.events) {
  //     sockets.events.on('A_USER_STATUS_UPDATED', (user: any) => {
  //       setContactStatus(user.isOnline, user)
  //     })
  //   }
  //   if(sockets.chat)
  //   {
  //     console.log("chat socket : ", sockets.chat);

  //     sockets.chat.on('NEW_MESSAGE', (message: any)=> {
  //         console.log("wa message : ", message);
  //     })
  //   }

  //   /* CHAt */

  //   return () => {
  //     if (sockets.event) {
  //       sockets.events.off('A_USER_STATUS_UPDATED', (user: any) => {
  //         setContactStatus(user.isOnline, user)
  //       })
  //     }
  //   }

  // }, [sockets])

  const updateDimensions = ()=>
  {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () => 
      window.removeEventListener('resize',updateDimensions);
  }, [])
  

  useEffect(() => {
    if (state.receiver && windowWidth <= 800)
      setShowContacts(false);
    else
      setShowContacts(true);
  }, [state.receiver, windowWidth])
  

  return (
    <>
      <div className={styles.chatComponentStyle}>
        {!showContacts &&
        <button className={styles.chatDrawer} onClick={() => setShowContacts(!showContacts)}>
          <img
            width={20}
            height={20}
            src="/return-icon.png"
            alt="return-icon"
          />{' '}
        </button>
}
        {showContacts && <ChatSideBar />}
        {state.receiver ? <ChatPannel /> : <NoReceiver />}
      </div>
    </>
  )
}
