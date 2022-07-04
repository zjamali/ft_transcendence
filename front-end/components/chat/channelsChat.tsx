import React, { useContext } from 'react'
import chatStyles from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import Room from './Channel'
import { ChatContext } from '../../context/chatContext'
import Channel from './Channel'

function NoChannels(props: { message: string }) {
  return (
    <div className={chatStyles.no_contacts}>
      <h4>{props.message}</h4>
    </div>
  )
}

function CreateChannel() {
  return (
    <div className={chatStyles.create_room}>
      <button className={chatStyles.create_room_button}> + Room</button>
    </div>
  )
}

export default function Channels() {
  const { state } = useContext(ChatContext)
  return (
    <>
      <div className={chatStyles.roomsList}>
        {state.channels &&
          state.channels?.map((channel: any) => {
            return <Channel key={uniqid()} channel={channel} receiver={state.receiver} />
          })}
        {!state.channels?.length && <NoChannels message="No Channels" />}
        <CreateChannel />
      </div>
    </>
  )
}
