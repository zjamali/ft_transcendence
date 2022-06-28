import React, { useContext } from 'react'
import chatStyles from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import Room from './room'
import { ChatContext } from '../../context/chatContext'

function NoContacts(props: { message: string }) {
  return (
    <div className={chatStyles.no_contacts}>
      <h4>{props.message}</h4>
    </div>
  )
}

function CreateRoom() {
  return (
    <div className={chatStyles.create_room}>
      <button className={chatStyles.create_room_button}> + Room</button>
    </div>
  )
}

export default function ChatRooms() {
  const { state } = useContext(ChatContext)
  return (
    <>
      <div className={chatStyles.roomsList}>
        {state.rooms &&
          state.rooms?.map((room: any) => {
            return <Room key={uniqid()} room={room} receiver={state.receiver} />
          })}
        {!state.rooms?.length && <NoContacts message="No Rooms" />}
        <CreateRoom />
      </div>
    </>
  )
}
