import React from 'react'
import craeteChannelStyle from '../../styles/Chat.module.css'
import { Formik, useFormik, Field } from 'formik'

export function CreateChannel() {
  const formik = useFormik({
    initialValues: {
      channelName: '',
      roomType: 'public',
      isProtected: false,
      password: '',
      owner: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <Formik
      initialValues={{
        channelName: '',
        roomType: 'public',
        isProtected: false,
        password: '',
        owner: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
          console.log("ss");
          console.log(JSON.stringify(values, null, 2))
          setSubmitting(false)
      }}
    >
      {({ errors, touched, isValidating }) => (
        <div className={craeteChannelStyle.new_room}>
          <div>
            <label htmlFor="channelName">
              {' '}
              <h2>Channel Name</h2>
            </label>
            <br />
            <Field
              id="channelName"
              name="channelName"
              type="text"
              placeholder ="Channel Name"
              onChange={formik.handleChange}
              value={formik.values.channelName}
              required={true}
              className={craeteChannelStyle.create_room_input}
            />
          </div>
          <div className={craeteChannelStyle.roomtype}>
            <label htmlFor="roomType">
              <h2>Channel Type</h2>
            </label>
            <Field
              id="roomType1"
              name="roomType"
              type="radio"
              value={'public'}
              required={true}
            />
            <label htmlFor="roomType2">Public</label>
            <Field
              id="roomType2"
              name="roomType"
              type="radio"
              value={'private'}
              required={true}
            />
            <label htmlFor="roomType2">Private</label>
          </div>
          <div>
            <label htmlFor="password">
              <h3>Password</h3>
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder ="password"
              className={craeteChannelStyle.create_room_input}
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </div>
      )}
    </Formik>
  )
}
