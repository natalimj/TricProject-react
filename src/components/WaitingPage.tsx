import React from 'react';
import '../style/WaitingPage.css';
import { BeatLoader } from "react-spinners";
import Constants from '../util/Constants';

interface Props {
  startScreen: boolean;
}

const WaitingPage: React.FC<Props> = ({startScreen}) => {
  return (
    <div data-cy="spinner" className='waiting-container' style={{ marginTop: "300px" }}>
      <BeatLoader color="#FFADCB" size={100} speedMultiplier={1} />
      <div className='waiting-container__text'>{startScreen ? Constants.WAITING_PROMPT_BEGIN : Constants.WAITING_PROMPT_RESULT}</div>
    </div>
  )
}

export default WaitingPage;