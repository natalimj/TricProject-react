import React, { useEffect, useRef, useState } from 'react'
import '../style/FinalResult.css';
import Constants from '../util/Constants';
import UserApi from '../api/UserApi';
import IUserData from '../models/User';
import IFinalResultData from '../models/FinalResult';
import ExportAsImage from '../util/ExportAsImage';
import moment from 'moment';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { BsInfoCircle } from 'react-icons/bs';
import PlayInfo from './PlayInfo';

const FinalResult = () => {
  const currentUser: IUserData = {
    userId: useAppSelector((state: RootState) => state.user.userId),
    username: useAppSelector((state: RootState) => state.user.username),
    imagePath: useAppSelector((state: RootState) => state.user.imagePath)
  }
  const [finalResult, setFinalResult] = useState<IFinalResultData>();
  const [showPlayInfo, setShowPlayInfo] = useState<boolean>(false)
  const exportRef = useRef<HTMLHeadingElement>(null);
  const today = moment().format('DD-MM-YYYY');

  useEffect(() => {
    UserApi.getFinalResult(currentUser.userId)
      .then((response: any) => {
        console.log(response.data)
        setFinalResult(response.data)
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, [currentUser.userId])

  return (
    <>
      {!showPlayInfo &&
        <div className='final-result'>
          <div className="final-result__inner-container">
            <div ref={exportRef} className="final-result__pink-background">
              <div className="final-result__user-box">
                <div className="final-result__avatar-container">
                  <img src={require('../util/icons/' + currentUser.imagePath + '.png')} alt="user icon" />
                </div>
                <div className="final-result__text-container">
                  <span e2e-id="finalUsername">{currentUser.username}</span>
                  <span>{today}</span>
                  <span>{Constants.HUMANLAB}</span>
                </div>
              </div>
              <div className="final-result__result-box">
                <div>{Constants.FINAL_RESULT_FIELD}</div>
                {finalResult?.categoryRateList && finalResult?.categoryRateList.map((categoryRate) => (
                  <div>
                    <div className="final-result__title">
                      <span className="final-result__answer-text final-result__answer-text--left">{categoryRate.category}</span>
                      <span className="final-result__answer-text">{categoryRate.oppositeCategory}</span>
                    </div>
                    <div className="final-result__slider">
                      <div className="final-result__first-rate" style={{ "width": `${categoryRate.rate}%` }}><span className='final-result__answer--text'>
                        {categoryRate.rate !== 0 && `${categoryRate.rate}%`}</span></div>
                      <div className="final-result__second-rate" style={{ "width": `${100 - categoryRate.rate}%` }}><span className='final-result__answer--text'>
                        {(100 - categoryRate.rate) !== 0 && `${100 - categoryRate.rate}%`}</span></div>
                    </div>
                  </div>
                ))}
                {finalResult?.finalCategoryList && finalResult?.finalCategoryList.map((finalCategory) => (

                  <p>{finalCategory.questionTheme} - {finalCategory.answerFirstCategory} / {finalCategory.answerSecondCategory}</p>
                ))}
              </div>
            </div>
            <div className='final-result__buttons'>
              <div className="final-result__download" onClick={() => ExportAsImage(exportRef.current, `TRIC-${today}`)}>{Constants.DOWNLOAD}</div>
              <div className='final-result__info-icon'><BsInfoCircle size={30} onClick={() => setShowPlayInfo(true)} /></div>
            </div>
          </div>
        </div>
      }
      {showPlayInfo && <PlayInfo />}
    </>
  )
}

export default FinalResult