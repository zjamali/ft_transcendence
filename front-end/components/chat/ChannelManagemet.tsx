import { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import channelManagemetStyle from '../../styles/Chat.module.css'
import Modal from 'react-modal'
import { InputError } from './createChannel'
import Select from 'react-select'
import axios from 'axios'
import { User } from '../../utils/interfaces'
import ReactLoading from 'react-loading'

function ManageMembers(props: any) {
  const { state } = useContext(ChatContext)
  const [timetoMute, setTimetoMute] = useState(0)
  const [Admins, setAdmins] = useState<[{}]>([{}])
  const [banned, setBanned] = useState<[{}]>([{}])
  const [kickedUser, setKickedUser] = useState<[{}]>([{}])
  const [mutedUsers, setMutedUsers] = useState<[{}]>([{}])
  const [selectedAdminsOption, setSelectedAdminsOption] = useState<[] | null>(
    null,
  )
  const [selectedBannedsOption, setSelectedBannedsOption] = useState<[] | null>(
    null,
  )
  const [selectedMutedusersOption, setSelectedMutedusersOption] = useState<
    [] | null
  >(null)
  const [selectedKickedUserOption, setSelectedKickedUserOption] = useState<
    [] | null
  >(null)
  const [isFormCorrects, setIsFormCorrects] = useState(true)
  const [isPasswordCorrects, setIsPasswordCorrect] = useState(true)
  const [updatePassword, setUpdatePassword] = useState('')

  const [loadingRoomDataIsDone, setLoadingRoomDataIsDone] = useState<boolean>(
    false,
  )

  const [roomSettingOption, setRoomSettingOption] = useState({
    value: 'default',
    label: 'default',
  })
  const roomSettingAllOption =
    props.room.owner === state.mainUser.id
      ? [
          { value: 'admins', label: 'set / unset admins' },
          { value: 'password', label: 'add / edit-delete password' },
          { value: 'muted', label: 'mute / umute  users' },
          { value: 'banned', label: 'ban / unban a user' },
          { value: 'kick', label: 'kick a user' },
        ]
      : [
          { value: 'muted', label: 'mute / umute  users' },
          { value: 'banned', label: 'ban / unban a user' },
          { value: 'kick', label: 'kick a user' },
        ]

  async function getRoomMembers(roomid: string) {
    try {
      return await axios.get(`http://localhost:5000/rooms/${roomid}/members`, {
        withCredentials: true,
      })
    } catch (error) {
      return null
    }
  }

  async function getRoomAdmins(roomid: string) {
    try {
      return await axios.get(`http://localhost:5000/rooms/${roomid}/admins`, {
        withCredentials: true,
      })
    } catch (error) {
      return null
    }
  }
  async function getRoomBanned(roomid: string) {
    try {
      return await axios.get(`http://localhost:5000/rooms/${roomid}/banned`, {
        withCredentials: true,
      })
    } catch (error) {
      return null
    }
  }
  async function getRoomMuted(roomid: string) {
    try {
      return await axios.get(`http://localhost:5000/rooms/${roomid}/muted`, {
        withCredentials: true,
      })
    } catch (error) {
      return null
    }
  }

  function removeChannelPassword(e: any) {
    e.preventDefault()
    props.chatSocket.current.emit('ROOM_REMOVE_PASSWORD', {
      admin_id: `${state.mainUser.id}`,
      room_id: `${props.room.id}`,
    })
    props.setOpenSettingModal(false)
  }

  useEffect(() => {
    console.log('active users : ', props.room.ActiveUsers)

    getRoomMembers(props.room.id)
      .then((Allmembers) => {
        return Allmembers?.data.filter((user: User) => {
          return user.id !== props.mainUser.id
        })
      })
      .then((members) => {
        const membersAsOption = members.map((member: User) => {
          return {
            value: member.id,
            label: `${member.firstName} ${member.lastName}`,
          }
        })
        setAdmins(membersAsOption)
        setBanned(membersAsOption)
        setKickedUser(membersAsOption)
        setMutedUsers(membersAsOption)
      })

    getRoomAdmins(props.room.id).then((admins) => {
      const adminAsOption = admins?.data.map((admin: User) => {
        if (admin.id != state.mainUser.id) {
          return {
            value: admin.id,
            label: `${admin.firstName} ${admin.lastName}`,
          }
        }
      })
      console.log('get admins  : ', adminAsOption)
      setSelectedAdminsOption(adminAsOption)
    })

    getRoomBanned(props.room.id).then((bannedUsers) => {
      const bannedAsOption = bannedUsers?.data.map((banned: User) => {
        return {
          value: banned.id,
          label: `${banned.firstName} ${banned.lastName}`,
        }
      })
      console.log('get banned  : ', bannedAsOption)
      setSelectedBannedsOption(bannedAsOption)
    })

    getRoomMuted(props.room.id).then((mutedUsers) => {
      const mutedAsOption = mutedUsers?.data.map((muted: User) => {
        return {
          value: muted.id,
          label: `${muted.firstName} ${muted.lastName}`,
        }
      })
      console.log('get mutedAsOption  : ', mutedAsOption)
      setSelectedMutedusersOption(mutedAsOption)
    })
  }, [])

  useEffect(() => {
    console.log('admins  : ', Admins)
    if (
      selectedAdminsOption &&
      selectedBannedsOption &&
      selectedMutedusersOption
    )
      setLoadingRoomDataIsDone(true)
  }, [selectedAdminsOption, selectedBannedsOption, selectedMutedusersOption])

  const customStyles = {
    option: (provided: any) => ({
      ...provided,
      color: '#212b36',
    }),
  }

  function handleChannelSetting(e: any) {
    e.preventDefault()
    // 'admins', 'muted'
    // 'banned'
    // 'password'
    // 'kick'
    if (
      roomSettingOption.value === 'kick' &&
      loadingRoomDataIsDone &&
      selectedKickedUserOption
    ) {
      /// 'ROOM_KICKED_USER';
      props.chatSocket.current.emit('ROOM_KICKED_USER', {
        admin_id: `${state.mainUser.id}`,
        room_id: `${props.room.id}`,
        new_kicked: selectedKickedUserOption,
      })
    }
    if (
      roomSettingOption.value === 'banned' &&
      loadingRoomDataIsDone &&
      selectedBannedsOption
    ) {
      /// 'ROOM_banne_USER';
      props.chatSocket.current.emit('ROOM_BAN_A_USER', {
        admin_id: `${state.mainUser.id}`,
        room_id: `${props.room.id}`,
        banned: selectedBannedsOption,
      })
    }
    if (roomSettingOption.value === 'muted' && loadingRoomDataIsDone) {
      console.log('mute a user 77777777777')
      props.chatSocket.current.emit('ROOM_MUTE_USERS', {
        admin_id: `${state.mainUser.id}`,
        room_id: `${props.room.id}`,
        muted_user: selectedMutedusersOption,
        timeToMute: timetoMute,
      })
    }
    if (
      roomSettingOption.value === 'admins' &&
      loadingRoomDataIsDone &&
      selectedAdminsOption
    ) {
      /// 'ROOM_SET_ADMIN';
      props.chatSocket.current.emit('ROOM_ADMINS_STATUS', {
        admin_id: `${state.mainUser.id}`,
        room_id: `${props.room.id}`,
        new_admins: [...selectedAdminsOption],
      })
    }
    if (updatePassword.length > 0) {
      setIsPasswordCorrect(false)
    }
    props.setOpenSettingModal(false)
  }

  return (
    <div className={channelManagemetStyle.manageMembers}>
      <div>
        <h3>selection option : </h3>
        <Select
          styles={customStyles}
          onChange={setRoomSettingOption}
          options={roomSettingAllOption}
        />
      </div>
      {loadingRoomDataIsDone ? (
        <form onSubmit={(e) => handleChannelSetting(e)}>
          {roomSettingOption.value === 'admins' && (
            <div>
              <h3>Admis : </h3>
              <Select
                styles={customStyles}
                isMulti
                defaultValue={selectedAdminsOption}
                onChange={setSelectedAdminsOption}
                options={Admins}
              />
            </div>
          )}
          {roomSettingOption.value === 'banned' && (
            <div>
              <h3> banned User : </h3>
              <Select
                styles={customStyles}
                isMulti
                defaultValue={selectedBannedsOption}
                onChange={setSelectedBannedsOption}
                options={banned}
              />
            </div>
          )}
          {roomSettingOption.value === 'muted' && (
            <div>
              <h3> muted User : </h3>
              <Select
                styles={customStyles}
                isMulti
                defaultValue={selectedMutedusersOption}
                onChange={setSelectedMutedusersOption}
                options={mutedUsers}
              />
              <input
                className={channelManagemetStyle.input}
                type="number"
                name="mutedTime"
                id="mutedTime"
                min={0}
                max={60}
                value={timetoMute}
                onChange={(e) => setTimetoMute(e.target.value)}
                placeholder="in minutes"
              />
            </div>
          )}
          {roomSettingOption.value === 'kick' && (
            <div>
              <h3> kick a User : </h3>
              <Select
                styles={customStyles}
                // isMulti
                defaultValue={selectedKickedUserOption}
                onChange={setSelectedKickedUserOption}
                options={kickedUser}
              />
            </div>
          )}
          {roomSettingOption.value === 'password' &&
            state.receiver.owner === state.mainUser.id && (
              <div>
                <h3>
                  {props.room.isProtected ? 'update Password' : 'add password'}
                </h3>

                <input
                  className={channelManagemetStyle.input}
                  type="password"
                  name="update password"
                  id="password"
                  placeholder="new password"
                  value={updatePassword}
                  onChange={(e) => {
                    setUpdatePassword(e.target.value)
                  }}
                />
                {props.room.isProtected ? (
                  <button
                    className={
                      channelManagemetStyle.room_button +
                      ' ' +
                      channelManagemetStyle.leave_room
                    }
                    onClick={(e) => removeChannelPassword(e)}
                  >
                    remove Password
                  </button>
                ) : (
                  ''
                )}
              </div>
            )}
          {!isPasswordCorrects && (
            <InputError message=" enter password between 8 - 16" />
          )}
          {!isFormCorrects && (
            <InputError message=" you can't banne,mute or kick  an admin" />
          )}

          <button className={channelManagemetStyle.room_button} type="submit">
            save
          </button>
        </form>
      ) : (
        <ReactLoading type={'spinningBubbles'} color="#fff" />
      )}
    </div>
  )
}

function ChannelSettings(props: any) {
  const [openSettingModal, setOpenSettingModal] = useState(false)
  const { state } = useContext(ChatContext)
  return (
    <div className={channelManagemetStyle.channleSettings}>
      <button
        className={channelManagemetStyle.room_button}
        onClick={() => setOpenSettingModal(true)}
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
              width: '400px',
              height: '400px',
              border: 'none',
              borderRadius: '20px',
              backgroundColor: '#212B36',
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'flex-start',
            },
          }}
          contentLabel="Example Modal"
        >
          {(state.receiver.admins.includes(state.mainUser.id) ||
            state.receiver.owner === state.mainUser.id) && (
            <ManageMembers
              room={state.receiver}
              mainUser={state.mainUser}
              chatSocket={props.chatSocket}
              setOpenSettingModal={setOpenSettingModal}
            />
          )}
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
  const { state, setIsUserJoinedChannel, setReceiver } = useContext(ChatContext)
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

  useEffect(() => {
    const receiver = state.receiver
    const newReceiver = state.channels.filter(
      (channel) => channel.id === receiver.id,
    )
    if (JSON.stringify(receiver.mutedUsers) !== JSON.stringify(newReceiver[0].mutedUsers)) {
      console.log('reciever updated')
      if (newReceiver[0].mutedUsers.includes(state.mainUser.id))
      {
      console.log("get muted set receiver")
        setReceiver({ ...newReceiver[0] })
      }
      if (
        receiver.mutedUsers?.includes(state.mainUser.id) &&
        !newReceiver[0].mutedUsers.includes(state.mainUser.id)
      )
      {
        console.log("get unmuted set receiver")
        setReceiver({ ...newReceiver[0] })
      }
    }
  }, [state.channels])

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
          <ChannelSettings leaveRoom={leaveRoom} chatSocket={chatSocket} />
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
