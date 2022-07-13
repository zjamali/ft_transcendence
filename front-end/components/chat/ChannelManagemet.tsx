import { useContext, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import channelManagemetStyle from '../../styles/Chat.module.css'

export default function ChannelManagement() {
  const { state } = useContext(ChatContext)
  console.log('room state :', state.receiver)
  const [isJoined, setIsJoined] = useState<boolean>(false);
  return (
    <div className={channelManagemetStyle.room_management}>
      {!isJoined ? (
        <button className={channelManagemetStyle.room_button}>join</button>
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
