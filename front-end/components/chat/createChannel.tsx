import React, { ReactChild, Ref, useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import craeteChannelStyle from '../../styles/Chat.module.css'
import { validateName, validatePassword } from '../../regex/createChannelRegex'
import { Channel } from '../../utils/interfaces'

export function InputError(props: { message: string }) {
  return (
    <div className={craeteChannelStyle.input_error}>
      <h5>{props.message}</h5>
    </div>
  )
}

export function CreateChannel({
  setModalIsOpen,
}: {
  setModalIsOpen: any
}) {
  const { state } = useContext(AppContext)
  const [roomName, setRoomName] = useState<string>('')
  const [validateRoomName, setValidateRoomName] = useState<boolean>(true)
  const [roomType, setRoomType] = useState<string>('Public')
  const [roomPassword, setRoomPassword] = useState<string>('')
  const [ValidateRoomPassword, setValidateRoomPassword] = useState<boolean>(
    true,
  )

  function createRoom(newRoom: Channel) {
    state.chatSocket.emit('CREATE_CHANNEL', newRoom)
    setModalIsOpen(false)
  }

  function validateRoom(e: any) {
    e.preventDefault()

    if (validateName.test(roomName)) {
      setValidateRoomName(true)
      if (roomType === 'Private') {
        if (validatePassword.test(roomPassword)) {
          setValidateRoomPassword(true)
          // setIsProtected(true);
          createRoom({
            roomName: roomName,
            owner: state.mainUser.id,
            admins: [state.mainUser.id],
            isProtected: true,
            password: roomPassword,
            created_at: Date(),
            roomType: roomType,
            ActiveUsers: [state.mainUser.id],
          })
         
        } else setValidateRoomPassword(false)
      } else {
       
        createRoom({
          roomName: roomName,
          owner: state.mainUser.id,
          admins: [state.mainUser.id],
          isProtected: false,
          created_at: Date(),
          roomType: roomType,
          ActiveUsers: [state.mainUser.id],
        })
      }
    } else setValidateRoomName(false)
  }

  function handleRoomName(e: React.ChangeEvent<HTMLInputElement>) {
    setRoomName(e.target.value)
  }
  function handleRoomPassword(e: React.ChangeEvent<HTMLInputElement>) {
    setRoomPassword(e.target.value)
  }

  return (
    <div className={craeteChannelStyle.new_room}>
      <form onSubmit={(e) => validateRoom(e)}>
        <label htmlFor="ChannelName">Channel Room</label>
        <div>
          <input
            style={{padding: '10px'}}
            type="text"
            name="ChannelName"
            id="ChannelName"
            value={roomName}
            placeholder="Channel Name"
            onChange={(e) => handleRoomName(e)}
          />
        </div>
        {!validateRoomName ? (
          <InputError message="   please use [A-Za-z0-9]" />
        ) : (
          <InputError message="‎" />
        )}
        <div className={craeteChannelStyle.channelType}>
          {roomType === 'Public' ? (
            <>
              <button  disabled={true}>
                Public
              </button>
              <button className={craeteChannelStyle.selected}
                onClick={(e) => {
                  e.preventDefault()
                  setRoomType('Private')
                }}
              >
                Private
              </button>
            </>
          ) : (
            <>
              <button className={craeteChannelStyle.selected}
                onClick={(e) => {
                  e.preventDefault()
                  setRoomType('Public')
                }}
              >
                Public
              </button>
              <button  disabled={true}>
                Private
              </button>
            </>
          )}
        </div>
        {roomType === 'Private' && (
          <div>
            <label htmlFor="ChannelPassword">Password</label>
            <div>
              <input
              style={{padding: '10px'}}
                type="password"
                name="roomPassword"
                id="roomPassword"
                value={roomPassword}
                placeholder="password"
                onChange={(e) => handleRoomPassword(e)}
              />
            </div>
            {!ValidateRoomPassword ? (
              <InputError message="   choose a password min 8 characters max 16" />
            ) : (
              <InputError message=" " />
            )}
          </div>
        )}

        <div className={craeteChannelStyle.create_Channel}>
          <button
            type="submit"
            className={craeteChannelStyle.create_Channel_button}
          >
            create Channel
          </button>
        </div>
      </form>
    </div>
  )
}
