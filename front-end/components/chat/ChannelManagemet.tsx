import { useContext, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import channelManagemetStyle from '../../styles/Chat.module.css'

export default function ChannelManagement({
  joinRoom,
}: {
  joinRoom: () => void
}) {
  const { state, setIsUserJoinedChannel } = useContext(ChatContext)
  console.log('room state :', state.receiver)

  function ChannalJoinHandle() {
    console.log("join is clicked");
    setIsUserJoinedChannel(true);
    joinRoom()
  }

  return (
    <div className={channelManagemetStyle.room_management}>
      {!state.isUserJoinedChannel ? (
        <button
          className={channelManagemetStyle.room_button}
          onClick={ChannalJoinHandle}
        >
          join
        </button>
      ) : (
        <button
          className={
            channelManagemetStyle.room_button +
            ' ' +
            channelManagemetStyle.leave_room
          }
        >
          leave
        </button>
      )}
    </div>
  )
}
