import React, { useContext } from 'react'
import chatStyles from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import Room from './Channel'
import { AppContext } from '../../context/AppContext'
import Channel from './Channel'
import Modal from 'react-modal'
import { CreateChannel } from './createChannel'
import axios from 'axios'



function NoChannels(props: { message: string }) {
  return (
    <div className={chatStyles.no_contacts}>
      <h4>{props.message}</h4>
    </div>
  )
}

export default function Channels() {
  const { state } = useContext(AppContext)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)


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
            onClick={() => setModalIsOpen(true)}
          >
            {' '}
            + Room
          </button>
        </div>
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={()=> setModalIsOpen(false)}
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
              height: '500px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: '#212B36',
            }
          }}
          contentLabel="Example Modal"
        >
          <CreateChannel setModalIsOpen={setModalIsOpen}/>
        </Modal>
      </div>
    </>
  )
}
