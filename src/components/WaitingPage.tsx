import React from 'react';
import '../style/WaitingPage.css';
import { BeatLoader } from "react-spinners";
import Constants from '../util/Constants';

interface Props {
  message : string;
}

const WaitingPage: React.FC<Props> = ({ message}) => {
  return (
    <div e2e-id="spinner" className='waiting-container'>
      <BeatLoader color="#FFADCB" size={100} speedMultiplier={1} />
      <div className='waiting-container__text'>{ message ? message : Constants.WAITING_DEFAULT}</div>
    </div>
  )
}

export default WaitingPage;