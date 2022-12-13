import React from 'react'
import Constants from '../util/Constants'

/**
 * This component is the landing view for unavailable requests.
 *
 * @ author Natali Munk-Jakobsen 
 */
const Page404: React.FC = () => {
  return (
    <div>
      <p>{Constants.PAGE_404_MESSAGE}</p>
    </div>
  )
}

export default Page404