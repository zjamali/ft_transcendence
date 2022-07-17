import { useContext, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import channelManagemetStyle from '../../styles/Chat.module.css'
import Modal from 'react-modal'
import { InputError } from './createChannel'

function ChannelSettings(props: any) {
  const [openSettingModal, setOpenSettingModal] = useState(false)

  return (
    <div className={channelManagemetStyle.channleSettings}>
      <button
        className={channelManagemetStyle.room_button}
        onClick={ ()=> setOpenSettingModal(true)}
      >
        settings
      </button>
      {openSettingModal && (
        <Modal
          isOpen={openSettingModal}
          // onAfterOpen={afterOpenModal}
          onRequestClose={() => setOpenSettingModal(false)}
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
              height: '250px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: '#212B36',
            },
          }}
          contentLabel="Example Modal"
        >
          <button
            className={
              channelManagemetStyle.room_button +
              ' ' +
              channelManagemetStyle.leave_room
            }
            onClick={props.leaveRoom}
          >
            leave
          </button>
        </Modal>
      )}
    </div>
  )
}

function JoinProtectedRoom(props: any) {
  const [password, setPassword] = useState<string>('')
  const [validatePasswordState, setValidatePasswordState] = useState(false)
  const [passwordIsWrong, setPasswordIsWrong] = useState(false)
  const { setIsUserJoinedChannel } = useContext(ChatContext)

  function handleForm(e: any) {
    e.preventDefault()
    if (password.length) {
      setValidatePasswordState(false)
      props.chatSocket.current.emit(
        'CHECK_ROOM_PASSWORD',
        { room_id: props.room_id, password: password },
        (responce: any) => {
          console.log('join protected room : ', responce)
          if (responce === false) {
            setPasswordIsWrong(true)
          } else {
            setPasswordIsWrong(false)
            setIsUserJoinedChannel(true)
            props.joinRoom()
            props.setOpenPasswordModal(false)
          }
        },
      )
    } else {
      setValidatePasswordState(true)
    }
  }

  return (
    <div className={channelManagemetStyle.joinProtectedRoom}>
      <form onSubmit={(e) => handleForm(e)}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="channel Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        {validatePasswordState && <InputError message="Enter Password" />}
        {passwordIsWrong && <InputError message="wrong Password" />}
        <button type="submit" className={channelManagemetStyle.room_button}>
          submit
        </button>
      </form>
    </div>
  )
}

export default function ChannelManagement({
  joinRoom,
  leaveRoom,
  chatSocket,
}: {
  joinRoom: () => void
  leaveRoom: () => void
  chatSocket: any
}) {
  const { state, setIsUserJoinedChannel } = useContext(ChatContext)
  console.log('room state :', state.receiver)
  const [openPasswordModal, setOpenPasswordModal] = useState(false)
  function ChannalJoinHandle() {
    if (state.receiver.isProtected) {
      console.log('the room is protected')
      setOpenPasswordModal(true)
    } else {
      console.log('join is clicked')
      setIsUserJoinedChannel(true)
      joinRoom()
    }
  }

  return (
    <>
      <div className={channelManagemetStyle.room_management}>
        {!state.isUserJoinedChannel ? (
          <button
            className={channelManagemetStyle.room_button}
            onClick={ChannalJoinHandle}
          >
            join
          </button>
        ) : (
          <ChannelSettings leaveRoom={leaveRoom} />
        )}
      </div>
      <Modal
        isOpen={openPasswordModal}
        // onAfterOpen={afterOpenModal}
        onRequestClose={() => setOpenPasswordModal(false)}
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
            height: '250px',
            border: 'none',
            borderRadius: '20px',
            backgroundColor: '#212B36',
          },
        }}
        contentLabel="Example Modal"
      >
        <JoinProtectedRoom
          chatSocket={chatSocket}
          setOpenPasswordModal={setOpenPasswordModal}
          room_id={state.receiver.id}
          joinRoom={joinRoom}
        />
      </Modal>
    </>
  )
}
