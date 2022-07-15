import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import reciverStyle from '../../styles/Chat.module.css'
import Avatar from './avatar'
import RoomAvatar from 'react-avatar'

import { isContact } from '../../utils/utils'
import ChannelManagement from './ChannelManagemet'

export default function Reciever({ joinRoom, leaveRoom }: { joinRoom: () => void , leaveRoom:()=>void}) {
  const { state, setIsUserJoinedChannel } = useContext(ChatContext)

  useEffect(() => {
    if (!isContact(state.receiver)) {
      setIsUserJoinedChannel(
        state.receiver.ActiveUsers.includes(state.mainUser.id),
      )
    }
  }, [state.receiver, state.Channels])

  return (
    <>
      {isContact(state.receiver) ? (
        <div className={reciverStyle.main_user}>
          <Avatar image={state.receiver.image} />
          <div>
            <h3>{`${state.receiver.firstName} ${state.receiver.lastName}`}</h3>
            <p>@{state.receiver.userName}</p>
          </div>
        </div>
      ) : (
        <>
          <div className={reciverStyle.receiver_Channel}>
            <div className={reciverStyle.receiverInfo}>
              <RoomAvatar
                name={state.receiver.roomName}
                size="50"
                round={true}
              />
              <div>
                <h3>{state.receiver.roomName}</h3>
              </div>
            </div>
            {<ChannelManagement joinRoom={joinRoom} leaveRoom={leaveRoom}/>}
          </div>
        </>
      )}
    </>
  )
}
