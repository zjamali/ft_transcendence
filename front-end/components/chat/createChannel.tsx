import React, { ReactChild, Ref, useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import craeteChannelStyle from '../../styles/Chat.module.css'
import { validateName, validatePassword } from '../../regex/createChannelRegex'
import { Channel } from '../../utils/interfaces'

function InputError(props: { message: string }) {
  return (
    <div className={craeteChannelStyle.input_error}>
      <h5>{props.message}</h5>
    </div>
  )
}

export function CreateChannel({
  chatSocket,
  setModalIsOpen,
}: {
  chatSocket: any
  setModalIsOpen: any
}) {
  const { state } = useContext(ChatContext)
  const [roomName, setRoomName] = useState<string>('')
  const [validateRoomName, setValidateRoomName] = useState<boolean>(true)
  const [roomType, setRoomType] = useState<string>('Public')
  const [roomPassword, setRoomPassword] = useState<string>('')
  const [ValidateRoomPassword, setValidateRoomPassword] = useState<boolean>(
    true,
  )

  function createRoom(newRoom: Channel) {
    chatSocket.current.emit('CREATE_CHANNEL', newRoom)
    setModalIsOpen(false)
  }

  function validateRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const typeOfRoom = roomType.indexOf('Public') !== -1 ? 'Public' : 'Private'

    if (validateName.test(roomName)) {
      setValidateRoomName(true)
      if (roomType.indexOf('Protected') != -1) {
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
            roomType: typeOfRoom,
            ActiveUsers: [state.mainUser.id],
          })
          console.log('create room protected')
        } else setValidateRoomPassword(false)
      } else {
        console.log('create room not protected')
        createRoom({
          roomName: roomName,
          owner: state.mainUser.id,
          admins: [state.mainUser.id],
          isProtected: false,
          created_at: Date(),
          roomType: typeOfRoom,
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
          {roomType === 'Public' && (
            <>
              <button className={craeteChannelStyle.selected}>Public</button>
              <button onClick={(e) => setRoomType('Public-Protected')}>
                Public-Protected
              </button>
              <button onClick={(e) => setRoomType('Private')}>Private</button>
              <button onClick={(e) => setRoomType('Private-Protected')}>
                Private-Protected
              </button>
            </>
          )}
          {roomType === 'Private' && (
            <>
              <button onClick={(e) => setRoomType('Public')}>Public</button>
              <button onClick={(e) => setRoomType('Public-Protected')}>
                Public-Protected
              </button>
              <button className={craeteChannelStyle.selected}>Private</button>
              <button onClick={(e) => setRoomType('Private-Protected')}>
                Private-Protected
              </button>
            </>
          )}
          {roomType === 'Public-Protected' && (
            <>
              <button onClick={(e) => setRoomType('Public')}>Public</button>
              <button className={craeteChannelStyle.selected}>
                Public-Protected
              </button>
              <button onClick={(e) => setRoomType('Private')}>Private</button>
              <button onClick={(e) => setRoomType('Private-Protected')}>
                Private-Protected
              </button>
            </>
          )}
          {roomType === 'Private-Protected' && (
            <>
              <button onClick={(e) => setRoomType('Public')}>Public</button>
              <button onClick={(e) => setRoomType('Public-Protected')}>
                Public-Protected
              </button>
              <button onClick={(e) => setRoomType('Private')}>Private</button>
              <button className={craeteChannelStyle.selected}>
                Private-Protected
              </button>
            </>
          )}
        </div>
        {roomType.indexOf('Protected') != -1 && (
          <div>
            <label htmlFor="ChannelPassword">Password</label>
            <div>
              <input
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
