import React from 'react'
import Constants from '../util/Constants'

const InactiveHomepage = () => {
  return (
    <div className='innactive-container'>
      <div>
        {Constants.NO_ACTIVE_PLAY}
      </div>
      <div>
        {Constants.MORE_INFO_TEXT}
      </div>
      <div>
        {Constants.MORE_INFO_LINK}
      </div>
    </div>
  )
}

export default InactiveHomepage