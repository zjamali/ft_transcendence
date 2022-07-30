import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/chatContext'
import login2fa from '../styles/Chat.module.css'
import { InputError } from '../components/chat/createChannel'
import Modal from 'react-modal'
export default function Create2FA(props: any) {
  const [opne2faModal, setOpne2faModal] = useState(false)
  const { state } = useContext(AppContext)

  return (
    <>
      {state.mainUser ? (
        <>
          <button
            onClick={(e) => {
              e.preventDefault()
              setOpne2faModal(true)
            }}
          >
            opne 2fa{' '}
          </button>
          <Modal
            isOpen={opne2faModal}
            // onAfterOpen={afterOpenModal}
            onRequestClose={() => {
              setOpne2faModal(false)
            }}
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
                height: '400px',
                border: 'none',
                borderRadius: '20px',
                backgroundColor: '#212B36',
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
              },
            }}
            contentLabel="Example Modal"
          >
            <form className={login2fa.login2fa}>
              <img
                src="http://localhost:5000/2fa/generate"
                width={196}
                height={196}
              />
              <div>
                <label htmlFor="pinCode">Pin Code:</label>
                <input type="text" name="pinCode" id="pinCode" />
              </div>
              <div>
                <InputError message="Incorrect Pin Code" />
              </div>
              <div>
                <button type="submit" className={login2fa.room_button}>
                  submit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setOpne2faModal(false)
                  }}
                  className={login2fa.leave_room + ' ' + login2fa.room_button}
                >
                  cancel
                </button>
              </div>
            </form>
          </Modal>
        </>
      ) : (
        ''
      )}
    </>
  )
}
