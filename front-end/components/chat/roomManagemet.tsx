import { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import roomManagemetStyle from '../../styles/Chat.module.css'

export default function RoomManagement() {
  const { state } = useContext(ChatContext)
  console.log('room state :', state.receiver)
  return (
    <div className={roomManagemetStyle.room_management}>
      <button className={roomManagemetStyle.room_button}>manage</button>
      <button className={roomManagemetStyle.room_button}>join</button>
      <button
        className={
          roomManagemetStyle.room_button + ' ' + roomManagemetStyle.leave_room
        }
      >
        leave
      </button>
    </div>
  )
}
