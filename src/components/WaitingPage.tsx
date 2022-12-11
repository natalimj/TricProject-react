import React from 'react';
import '../style/WaitingPage.css';
import { BeatLoader, RingLoader } from "react-spinners";
import Constants from '../util/Constants';

interface Props {
  message: string;
  onAdmin: boolean
}

const WaitingPage: React.FC<Props> = ({ message, onAdmin }) => {
  return (
    <>
      {!onAdmin ? (<div e2e-id="spinner" className='waiting-container'>
        <BeatLoader color="#FFADCB" size={100} speedMultiplier={1} />
        <div className='waiting-container__text'>{message ? message : Constants.WAITING_DEFAULT}</div>
      </div>)
        : (
          <div e2e-id="spinner" className='waiting-container-small'>
            <RingLoader color="#FFADCB" size={100} speedMultiplier={1} />
            <div className='waiting-container__text'>{message ? message : Constants.WAITING_DEFAULT}</div>
          </div>
        )}
    </>
  )
}

export default WaitingPage;