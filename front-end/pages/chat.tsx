/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/Chat.module.css'
import ChatPannel from '../components/chat/chatPannel'
import ChatSideBar from '../components/chat/chatSideBar'
import NoReceiver from '../components/chat/noReceiver'
import { ChatContext } from '../context/chatContext'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'
import { Channel } from '../utils/interfaces'

export default function Chat() {
  const { state, setContacts, setChannels } = useContext(ChatContext)
  // event socket
  const eventsSocket = useRef<any>(null)
  //chat socket if a reciver is set
  const chatSocket = useRef<any>(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [showContacts, setShowContacts] = useState(windowWidth === 800)

  /*  Event Sockets namespace  */

  useEffect(() => {
    //////
    /* creation Sockets start */
    if (!eventsSocket.current)
      eventsSocket.current = io('http://localhost:5000/events', {
        withCredentials: true,
      })

    try {
      fetchAllusers()
      fetchAllChannels()
      eventsSocket.current.on('A_USER_STATUS_UPDATED', (user: any) => {
        setContactStatus(user.isOnline, user)
      })
      chatSocket.current.on('A_CHANNELS_STATUS_UPDATED', () => {
        fetchAllChannels();
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

  function fetchAllChannels() {
    console.log("fetch channels");
    try {
      axios
        .get('http://localhost:5000/rooms', { withCredentials: true })
        .then((res) => {
          console.log('all channels :', res.data)
          if (res.data.length) {
            setChannels([...res.data])
          }
        })
    } catch {
      console.log('CANT GET ALL channels')
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
  
  function setChannelsStatus(channel: Channel) {
    console.log('set Channels ')
    // fetchAllChannels()
  }

  useEffect(() => {
    console.log('messages ', state.messages)
    if (state.messages.length > 0) {
      const lastMessage = state.messages.length - 1
      if (state.messages[lastMessage].senderId === state.mainUser.id)
        console.log('main user message')
    }
  }, [state.messages])

  /*****  end events */

  useEffect(() => {
    //////
    /* creation Sockets start */
    if (!chatSocket.current)
      chatSocket.current = io('http://localhost:5000/chat', {
        withCredentials: true,
      })
  }, [])

  /*** chat sockets  */

  /**** end chat sockets  */
  const updateDimensions = () => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (state.receiver && windowWidth <= 800) setShowContacts(false)
    else setShowContacts(true)
  }, [state.receiver, windowWidth])

  return (
    <>
      <div className={styles.chatComponentStyle}>
        {!showContacts && (
          <button
            className={styles.chatDrawer}
            onClick={() => setShowContacts(!showContacts)}
          >
            <img
              width={20}
              height={20}
              src="/return-icon.png"
              alt="return-icon"
            />{' '}
          </button>
        )}
        {showContacts && <ChatSideBar chatSocket={chatSocket} />}
        <ChatPannel chatSocket={chatSocket} />
      </div>
    </>
  )
}
