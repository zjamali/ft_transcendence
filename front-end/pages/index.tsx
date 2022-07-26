import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Chat from './chat'
import ChatProvider, { ChatContext } from '../context/chatContext'
import Login from './login'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Profile from '../components/Profile/components/Profile'

const Home: NextPage = () => {
  const [login, setLogin] = useState<boolean>(false)
  const { state, setMainUser } = useContext(ChatContext)

  useEffect(() => {
    axios
      .get('http://localhost:5000/users/me', { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setMainUser({ ...res.data })
        }
      })
      .catch(() => {
        setLogin(false)
      })
  }, [])

  useEffect(() => {
    if (state.mainUser) setLogin(true)
  }, [state])

  return (
    <div>
      {!login && <Login login={login} setLogin={setLogin} />}
      {login && <Profile />}
    </div>
  )
}

export default Home
