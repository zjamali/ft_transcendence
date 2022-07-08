import React, { useContext, useState } from 'react'
import { useRef, useEffect } from 'react'
import chatPannelStyle from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import { isContact } from '../../utils/utils'
import ChannelManagement from './ChannelManagemet'
import MessageComponent from './message'
import Reciever from './reciever'
import { ChatContext } from '../../context/chatContext'
import io, { Socket } from 'socket.io-client'
import { Message } from '../../utils/interfaces'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ChatPannel() {
  //chat socket if a reciver is set
  const chatSocket = useRef<any>(null)

  const notify = (message: string) => toast(message)
  /// automatic scroll message
  const { state } = useContext(ChatContext)
  const chatContainer = useRef<HTMLDivElement>(null)
  const [messageInput, setMessageinput] = useState<string>('')
  const messagesList = useRef<any>([])
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState<null | Message>(null)

  console.log('channel pannel build')

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollIntoView({ behavior: 'smooth' })
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    try {
      messagesList.current = []
      setMessages([])
      axios
        .get(`http://localhost:5000/messages/${state.receiver.id}`, {
          withCredentials: true,
        })
        .then((responce) => {
          messagesList.current = [...responce.data]
          setMessages([...messagesList.current])
        })
    } catch (error) {
      console.log('get messages history error : ', error)
    }
  }, [state.receiver])

  useEffect(() => {
    //////
    /* creation Sockets start */
    if (!chatSocket.current)
      chatSocket.current = io('http://localhost:5000/chat', {
        withCredentials: true,
      })

    try {
      chatSocket.current.on('NEW_MESSAGE', (newMessage: any) => {
        console.log('wa message : ', newMessage)
        setNewMessage({ ...newMessage })
      })
    } catch (error) {
      console.log('sockets error', error)
    }

    return () => {
      console.log('close sockets')
      if (chatSocket.current) chatSocket?.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (newMessage) {
      console.log('reciever : ', state.receiver)
      console.log('new message : ', newMessage)
      if (
        state.receiver.id === newMessage.senderId ||
        newMessage.senderId === state.mainUser.id
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

  const sendMessage = (e: any) => {
    e.preventDefault()
    console.log('send message')
    const message = {
      senderId: state.mainUser.id,
      senderName: `${state.mainUser.firstName} ${state.mainUser.lastName}`,
      receiverId: state.receiver.id,
      createdAt: Date(),
      content: messageInput,
      isChannel: false,
    }
    chatSocket.current.emit('SEND_MESSAGE', { ...message })
    setMessageinput('')
  }

  return (
    <div className={chatPannelStyle.message}>
      <div className={chatPannelStyle.message_head}>
        <div className={chatPannelStyle.reciverInfo}>
          <Reciever />
        </div>
        {state.receiver &&
          (isContact(state.receiver) ? '' : <ChannelManagement />)}
      </div>
      <div className={chatPannelStyle.message_body}>
        <div ref={chatContainer} className={chatPannelStyle.messages_list}>
          {/* {state.messages &&
            state.messages.map((message : any) => {
              return <MessageComponent key={uniqid()} message={message} mainUser={state.mainUser} />
            })} */}
          {messages &&
            messages.map((message: any) => {
              return (
                <MessageComponent
                  key={uniqid()}
                  message={message}
                  mainUser={state.mainUser}
                />
              )
            })}
        </div>
        <div className={chatPannelStyle.message_input}>
          <form
            onSubmit={(e) => {
              sendMessage(e)
            }}
          >
            <input
              type="text"
              name="message"
              id="message_content"
              value={messageInput}
              onChange={(e) => {
                setMessageinput(e.target.value)
              }}
            />
            <button type="submit">
              <img
                src="/images/icons/send_icon.png"
                alt="send"
                width={30}
                height={30}
              />{' '}
            </button>
          </form>
        </div>
      </div>
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
