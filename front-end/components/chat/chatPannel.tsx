import React, { useContext, useState } from 'react'
import { useRef, useEffect } from 'react'
import chatPannelStyle from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import MessageComponent from './message'
import Reciever from './reciever'
import { AppContext } from '../../context/AppContext'
import io, { Socket } from 'socket.io-client'
import { Message } from '../../utils/interfaces'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { InputMessage } from './inputMessage'
import NoReceiver from './noReceiver'
import { isContact } from '../../utils/utils'

function MessagesContainer(props: any) {
  const chatContainer = useRef<HTMLDivElement>(null)
  const { state } = useContext(AppContext)
  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollIntoView({ behavior: 'smooth' })
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight
    }
  }, [props.messages])

  return (
    <div className={chatPannelStyle.message_body}>
      <div ref={chatContainer} className={chatPannelStyle.messages_list}>
        {props.messages &&
          props.messages.map((message: any) => {
            return (
              <MessageComponent
                key={uniqid()}
                message={message}
                mainUser={state.mainUser}
              />
            )
          })}
      </div>
    </div>
  )
}

export default function ChatPannel() {
  const notify = (message: string) => toast(message)
  const { state, setIsUserJoinedChannel, setReceiver } = useContext(AppContext)

  const messagesList = useRef<any>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState<null | Message>(null)

  console.log('channel pannel build')

  useEffect(() => {
    try {
      ///
      if (messagesList?.current[0]?.isChannel) {
        if (state.receiver?.id === messagesList.current[0].roomId) return
      }
      ///
      if (state.receiver && isContact(state.receiver)) {
        messagesList.current = []
        setMessages([])
        axios
          .get(`http://localhost:5000/messages/${state.receiver.id}`, {
            withCredentials: true,
          })
          .then((responce) => {
            if (responce.data.length) {
              messagesList.current = [...responce.data]
              setMessages([...messagesList.current])
            }
          })
      } else {
        if (
          state.receiver &&
          state.receiver.ActiveUsers.includes(state.mainUser.id)
        ) {
          console.log(
            'active users: ',
            state.receiver.ActiveUsers.includes(state.mainUser.id),
          )
          joinRoom()
        } else {
          messagesList.current = []
          setMessages([])
        }
      }
    } catch (error) {
      console.log('get messages history error : ', error)
    }
  }, [state.receiver])

  useEffect(() => {
    //////
    /* creation Sockets start */
    if (!state.chatSocket.current) {
      state.chatSocket.current = io('http://localhost:5000/chat', {
        withCredentials: true,
      })
      state.chatSocket.current.on('connect_failed', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
      state.chatSocket.current.on('connect_error', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
      state.chatSocket.current.on('connect_failed', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
      state.chatSocket.current.on('disconnect', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
    }
    try {
      state.chatSocket.current.on('connect_failed', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
      state.chatSocket.current.on('connect_error', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
      state.chatSocket.current.on('connect_failed', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
      state.chatSocket.current.on('disconnect', () => {
        console.log('Sorry, there seems to be an issue with the connection!')
      })
      state.chatSocket.current.on('NEW_MESSAGE', (newMessage: any) => {
        console.log('wa message : ', newMessage)
        setNewMessage({ ...newMessage })
      })
    } catch (error) {
      console.log('sockets error', error)
    }

    return () => {
      console.log('close sockets')
      if (state.chatSocket.current) state.chatSocket?.current.disconnect()
    }
  }, [])

  useEffect(() => {
    // one to one
    console.log('a new message from server')
    if (newMessage) {
      console.log('reciever : ', state.receiver)
      console.log('new message : ', newMessage)
      if (newMessage.isChannel) {
        if (newMessage.receiverId === state.receiver?.id) {
          messagesList.current = [...messagesList.current, newMessage]
          setMessages([...messagesList.current])
        }
        return
      }
      if (
        state.receiver &&
        (state.receiver.id === newMessage.senderId ||
          newMessage.senderId === state.mainUser.id)
      ) {
        console.log('all messages: ', messages)
        messagesList.current = [...messagesList.current, newMessage]
        setMessages([...messagesList.current])
      } else {
        // send a notification
        console.log('send a nostification')
        notify(`new message from ${newMessage.senderName}`)
      }
    }
  }, [newMessage])

  const sendMessage = (e: any, messageInput: string) => {
    e.preventDefault()
    console.log('messaglsklksf :', messageInput)
    const message = {
      senderId: state.mainUser.id,
      senderName: `${state.mainUser.firstName} ${state.mainUser.lastName}`,
      receiverId: state.receiver.id,
      createdAt: Date(),
      content: messageInput,
      isChannel: !isContact(state.receiver),
    }
    console.log('send message : ', message)
    state.chatSocket.current.emit('SEND_MESSAGE', { ...message })
  }

  function leaveRoom() {
    console.log('leave room ')
    if (state.chatSocket.current) {
      state.chatSocket.current.emit('LEAVE_ROOM', {
        user_id: state.mainUser.id,
        room_id: state.receiver.id,
      })

      setIsUserJoinedChannel(false)
      setReceiver(null)
    }
  }

  function joinRoom() {
    console.log('join room :::')
    if (state.chatSocket.current) {
      state.chatSocket.current.emit('JOIN_ROOM', {
        user_id: state.mainUser.id,
        room_id: state.receiver.id,
      })
      axios
        .get(
          `http://localhost:5000/messages/${state.receiver?.id}?isChannel=true`,
          {
            withCredentials: true,
          },
        )
        .then((responce) => {
          if (messagesList.current[0]?.roomId === responce.data[0]?.roomId) {
            console.log('dont render =========.')
            return
          }
          messagesList.current = []
          setMessages([])
          messagesList.current = [...responce.data]
          setMessages([...messagesList.current])
        })
    }
  }

  return (
    <div className={chatPannelStyle.chatPannel}>
      {state.receiver === null ? (
        <NoReceiver />
      ) : (
        <div className={chatPannelStyle.message}>
          <div className={chatPannelStyle.message_head}>
            <div className={chatPannelStyle.reciverInfo}>
              <Reciever
                chatSocket={state.chatSocket}
                joinRoom={joinRoom}
                leaveRoom={leaveRoom}
              />
            </div>
            {/*  */}
          </div>
          <MessagesContainer messages={messages} />
        </div>
      )}
      {state.receiver &&
        (isContact(state.receiver)
          ? true
          : state.isUserJoinedChannel &&
            !state.receiver.mutedUsers?.includes(state.mainUser.id)) && (
          <InputMessage sendMessage={sendMessage} />
        )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}
