import React, { useContext, useEffect } from 'react'
import chatStyles from '../../styles/Chat.module.css'
import Contact from './Contact'
import uniqid from 'uniqid'

import { AppContext } from '../../context/AppContext'
import { Console } from 'console'

function NoContacts(props: { message: string }) {
  return (
    <div className={chatStyles.no_contacts}>
      <h4>{props.message}</h4>
    </div>
  )
}

export default function ChatContacts() {
  const { state, setReceiver } = useContext(AppContext)

  // set first contact as receiver 
  // useEffect(() => {
  //   if (!state.receiver && state.contacts)
  //   {
  //     setReceiver(state.contacts[0]);
  //   }
  // }, [state.contacts])
  
  
  return (
    <>
      <div className={chatStyles.Contactslist}>
        {state.contacts &&
          state.contacts?.map((contact: any) => {
            return (
              <Contact
                receiver={{ ...state.receiver }}
                key={uniqid()}
                contact={contact}
              />
            )
          })}
        {!state.contacts?.length && <NoContacts message="No Contacts" />}
      </div>
    </>
  )
}
