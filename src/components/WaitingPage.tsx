import React from 'react';
import { BeatLoader } from "react-spinners";
import Constants from '../util/Constants';

function WaitingPage() {
  return (
    <div data-testid="waiting-spinner" style={{ marginTop: "300px" }}>
      <BeatLoader color="#FFADCB" size={100} speedMultiplier={1} />
      <h5>{Constants.WAITING_PROMPT}</h5>
    </div>
  )
}

export default WaitingPage;