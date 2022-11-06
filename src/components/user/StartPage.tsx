import React, { useState, useEffect } from "react";
import '../../style/StartPage.css';
import UserApi from "../../api/UserApi";
import IQuestionData from '../../models/Question';
import Constants from "../../util/Constants";
import WaitingPage from "../WaitingPage";
import InactiveHomepage from "./InactiveHomepage";
import FinalResult from "./FinalResult";
import WebSocketComponent from "../WebSocketComponent";
import MainPage from "./MainPage";
import UserLoginPage from "./UserLogin";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from "../../app/store";
import { addQuestion } from '../../reducers/questionSlice';
import { setQuestionComponent } from '../../reducers/componentSlice';
import { setStatus } from "../../reducers/statusSlice";
import TricLogo from '../../util/icons/TRIC.svg';
import Modal from 'react-modal';

const StartPage = () => {
  const dispatch = useAppDispatch();
  const isActive: boolean = useAppSelector((state: RootState) => state.status.isActive);
  const userSubmitted: boolean = useAppSelector((state: RootState) => state.component.userJoinedValue);
  const finalResultShowed: boolean = useAppSelector((state: RootState) => state.component.finalResultShowed);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [playStarted, setPlayStarted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onQuestionMessageReceived = (msg: IQuestionData) => {
    dispatch(addQuestion(msg));
    dispatch(setQuestionComponent(true));
    setPlayStarted(true);
  }

  const onStatusMessageReceived = (msg: boolean) => {
    dispatch(setStatus(msg))
  }

  useEffect(() => {
    UserApi.getAppStatus()
      .then((response: any) => {
        dispatch(setStatus(response.data))
        if (!isActive) {
          setPlayStarted(false);
        }
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, [dispatch, isActive])

  return (
    <>
      {!isActive ? (
        <>
          <InactiveHomepage />
          <WebSocketComponent topics={['/topic/status']} onMessage={(msg: boolean) => onStatusMessageReceived(msg)} />
        </>
      ) : (
        <>
          <WebSocketComponent topics={['/topic/status']} onMessage={(msg: boolean) => onStatusMessageReceived(msg)} />
          {finalResultShowed ? (<FinalResult />) : (
            <div className="start-page">
              <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionMessageReceived(msg)} />
              {sessionStarted ? (
                <div className="start-page-user">
                  {userSubmitted ? (
                    <div className="start-page-question"> {playStarted ? (<MainPage />) : (<WaitingPage startScreen={true} />)}</div>
                  ) : (
                    <UserLoginPage />
                  )}
                </div>
              ) : (
                <div className="start-page-landing">
                  <div className="start-page-landing__title">
                    <img src={TricLogo} alt="TRIC icon" />
                  </div>
                  <div className="start-page-landing-icon">
                    <img src={require('../../util/icons/imageMale1.png')} alt="Landing page icon" />
                  </div>
                  <>
                    <button onClick={() => { setIsOpen(true) }} className='question__submit-button question__active-button' e2e-id="join">
                      {Constants.JOIN_BUTTON}
                    </button>
                    <Modal onRequestClose={() => setIsOpen(false)}
                      style={{
                        overlay: {
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.6)'
                        },
                        content: {
                          position: 'absolute',
                          top: '15%',
                          left: '10%',
                          right: '10%',
                          bottom: '15%',
                          border: '5px solid #181818',
                          background: '#3D3D3D',
                          overflow: 'auto',
                          WebkitOverflowScrolling: 'touch',
                          borderRadius: '4px',
                          outline: 'none',
                          padding: '20px'
                        }
                      }} isOpen={isOpen}>
                      <span className='question__timer-text'>
                        Do you agree to selling your soul to HumanLab for eternity? Therby becoming a slave in this and all future lives.
                      </span>
                      <button e2e-id="agree" className={'question__submit-button question__active-button'} onClick={() => {
                        setIsOpen(false)
                        setSessionStarted(true)
                      }
                      }>Agree</button>
                      <button className={'question__submit-button question__active-button'} onClick={() => { setIsOpen(false) }
                      }>Disagree</button>
                    </Modal>
                  </>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
export default StartPage