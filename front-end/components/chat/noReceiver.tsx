import React from 'react'
import NoReceiverStyle from '../../styles/Chat.module.css'

export default function NoReceiver() {
  return (
    <div className={NoReceiverStyle.noreceiver}><h4>no contact or room selected</h4></div>
  )
}