import React, { useEffect, useRef, useState } from 'react'
import '../../style/FinalResult.css';
import Constants from '../../util/Constants';
import UserApi from '../../api/UserApi';
import IUserData from '../../models/User';
import IFinalResultData from '../../models/FinalResult';
import ExportAsImage from '../../util/ExportAsImage';
import moment from 'moment';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { BsInfoCircle } from 'react-icons/bs';
import PlayInfo from './PlayInfo';

/**
 *  Component for displaying user's final result with question theme and answer categories.
 *  The user can download the final result as an image, 
 *  view the play info or give feedback.
 *  Contains <PlayInfo> component.
 *
 * @ author Natali Munk-Jakobsen / Bogdan Mezei
 */
const FinalResult = () => {
  const currentUser: IUserData = useAppSelector((state: RootState) => state.user);
  const [finalResult, setFinalResult] = useState<IFinalResultData>();
  const [showPlayInfo, setShowPlayInfo] = useState<boolean>(false)
  const exportRef = useRef<HTMLHeadingElement>(null);
  const today = moment().format('DD-MM-YYYY');

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      '../../util/icons/' + currentUser.imagePath + '.png'
    ]

    cacheImages(imgs);
  }, [currentUser.imagePath]);


  useEffect(() => {
    UserApi.getFinalResult(currentUser.userId)
      .then((response: any) => {
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
                {isLoading ? (<></>) : (<><div className="final-result__avatar-container">
                  <img src={require('../../util/icons/' + currentUser.imagePath + '.png')} alt="user icon" />
                </div></>)}
                <div className="final-result__text-container">
                  <span e2e-id="finalUsername">{currentUser.username}</span>
                  <span>{today}</span>
                  <span>{Constants.HUMANLAB}</span>
                </div>
              </div>
              <div className="final-result__result-box">
                <div>{Constants.FINAL_RESULT_FIELD}</div>
                {finalResult?.categoryRateList && finalResult?.categoryRateList.map((categoryRate, index) => (
                  <div key={index}>
                    <div className="final-result__title">
                      <span className="final-result__answer-text final-result__answer-text--left">{categoryRate.category}</span>
                      <span className="final-result__answer-text">{categoryRate.oppositeCategory}</span>
                    </div>
                    <div className="final-result__slider">
                      <div className="final-result__first-rate" style={{ "width": `${Math.round(categoryRate.rate)}%` }}><span className='final-result__answer--text'>
                        {categoryRate.rate !== 0 && `${Math.round(categoryRate.rate)}%`}</span></div>
                      <div className="final-result__second-rate" style={{ "width": `${Math.round(100 - categoryRate.rate)}%` }}><span className='final-result__answer--text'>
                        {(100 - categoryRate.rate) !== 0 && `${Math.round(100 - categoryRate.rate)}%`}</span></div>
                    </div>
                  </div>
                ))}
                {finalResult?.finalCategoryList && finalResult?.finalCategoryList.map((finalCategory, index) => (
                  <p key={finalCategory.questionTheme + index}>{finalCategory.questionTheme} - {finalCategory.answerFirstCategory} and {finalCategory.answerSecondCategory}</p>
                ))}
              </div>
            </div>
            <a href="https://forms.gle/nrpYtFY8C7QdDMqQ8" target="_blank" rel="noreferrer">
            <div className='final-result__download'>{Constants.FEEDBACK}</div>
            </a>
            <div className='final-result__spacing'></div>
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