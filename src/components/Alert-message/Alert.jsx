import React from 'react'
import './Alert.css'

const Alert = ({ alertMessage }) => {
  return (
    <div className={alertMessage.type}>
      {alertMessage.message}
    </div>
  )
}

export default Alert
