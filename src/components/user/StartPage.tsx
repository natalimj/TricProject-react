import React, { useState, useEffect } from "react";
import '../../style/StartPage.css';
import '../../style/Modal.css';
import UserApi from "../../api/UserApi";
import IQuestionData from '../../models/Question';
import Constants from "../../util/Constants";
import WaitingPage from "../WaitingPage";
import InactiveHomepage from "./InactiveHomepage";
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

/**
 * Landing view for application users
 * where they can join the play and see the login view
 * after accepting personal information agreement.
 * Contains <UserLogin> component.
 *
 * @ author Daria-Maria Popa / Bogdan Mezei
 */
const StartPage = () => {
  const dispatch = useAppDispatch();
  const isActive: boolean = useAppSelector((state: RootState) => state.status.isActive);
  const userSubmitted: boolean = useAppSelector((state: RootState) => state.component.userJoinedValue);
  const [sessionStarted, setSessionStarted] = useState<boolean>(false);
  const [playStarted, setPlayStarted] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onQuestionMessageReceived = (msg: IQuestionData) => {
    dispatch(addQuestion(msg));
    dispatch(setQuestionComponent(true));
    setPlayStarted(true);
  }

  const onStatusMessageReceived = (msg: boolean) => {
    dispatch(setStatus(msg))
  }

  const cacheImages = async (srcArray) => {
    const promises = await srcArray.map((src) => {
      return new Promise(function (resolve, reject) {
        const img = new Image();
        img.src = src;

      });
    });
    await Promise.all(promises);
    setIsLoading(false);
  };


  useEffect(() => {
    const imgs = [
      TricLogo,
      '../../util/icons/imageMale1.png'
    ]

    cacheImages(imgs);
  }, []);

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
        </>) : (
        <>
          {!isLoading ?
            (
              <>
                <div className="start-page">
                  <WebSocketComponent topics={['/topic/status']} onMessage={(msg: boolean) => onStatusMessageReceived(msg)} />
                  <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionMessageReceived(msg)} />
                  {sessionStarted ? (
                    <div className="start-page-user">
                      {userSubmitted ? (
                        <div className="start-page-question"> {playStarted ? (<MainPage />) : (<WaitingPage message={Constants.WAITING_PROMPT_BEGIN} onAdmin={false}/>)}</div>
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
                        <button onClick={() => { setIsOpen(true) }} className='submit-button' e2e-id="join">
                          {Constants.JOIN_BUTTON}
                        </button>
                        <Modal onRequestClose={() => setIsOpen(false)} isOpen={isOpen} className='modal__content' overlayClassName='modal__overlay'>
                          <span className='modal__text'>
                            {Constants.PERSONAL_INFORMATION_AGREEMENT}
                          </span>
                          <button e2e-id="agree" className='modal__button' onClick={() => {
                            setIsOpen(false)
                            setSessionStarted(true)
                          }}>{Constants.AGREE_BUTTON}</button>
                          <button className='modal__button modal__button--secondary' onClick={() => { setIsOpen(false) }}>{Constants.DISAGREE_BUTTON}</button>
                        </Modal>
                      </>
                    </div>
                  )}
                </div>
              </>
            ) : null}
        </>
      )}
    </>
  );
}
export default StartPage