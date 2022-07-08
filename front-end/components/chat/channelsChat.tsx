import React, { useContext } from 'react'
import chatStyles from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import Room from './Channel'
import { ChatContext } from '../../context/chatContext'
import Channel from './Channel'
import Modal from 'react-modal'
import { CreateChannel } from './createChannel'



function NoChannels(props: { message: string }) {
  return (
    <div className={chatStyles.no_contacts}>
      <h4>{props.message}</h4>
    </div>
  )
}

export default function Channels() {
  const { state } = useContext(ChatContext)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  return (
    <>
      <div className={chatStyles.roomsList}>
        {state.channels &&
          state.channels?.map((channel: any) => {
            return (
              <Channel
                key={uniqid()}
                channel={channel}
                receiver={state.receiver}
              />
            )
          })}
        {!state.channels?.length && <NoChannels message="No Channels" />}
        <div className={chatStyles.create_room}>
          <button
            className={chatStyles.create_room_button}
            onClick={() => setIsOpen(true)}
          >
            {' '}
            + Room
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={()=> setIsOpen(false)}
          style={{
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(22, 28, 36, 0.5)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '400px',
              height: '700px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: '#212B36',
            }
          }}
          contentLabel="Example Modal"
        >
          <CreateChannel />
        </Modal>
      </div>
    </>
  )
}
