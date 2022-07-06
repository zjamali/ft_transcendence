import { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import channelManagemetStyle from '../../styles/Chat.module.css'

export default function ChannelManagement() {
  const { state } = useContext(ChatContext)
  console.log('room state :', state.receiver)
  return (
    <div className={channelManagemetStyle.room_management}>
      <button className={channelManagemetStyle.room_button}>manage</button>
      <button className={channelManagemetStyle.room_button}>join</button>
      <button
        className={
          channelManagemetStyle.room_button + ' ' + channelManagemetStyle.leave_room
        }
      >
        leave
      </button>
    </div>
  )
}
