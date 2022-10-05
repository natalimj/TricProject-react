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

const FinalResult = () => {
  const currentUser: IUserData = {
    userId: useAppSelector((state: RootState) => state.user.userId),
    username: useAppSelector((state: RootState) => state.user.username),
    imagePath: useAppSelector((state: RootState) => state.user.imagePath)
  }
  const [finalResults, setFinalResults] = useState<IFinalResultData[]>([]);
  const exportRef = useRef<HTMLHeadingElement>(null);
  const today = moment().format('DD-MM-YYYY');

  useEffect(() => {
    UserApi.getFinalResult(currentUser.userId)
      .then((response: any) => {
        console.log(response.data);
        setFinalResults(response.data)
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, [currentUser.userId])

  return (
    <div className='final-result'>
      <div className="final-result__inner-container">
        <div ref={exportRef} className="final-result__pink-background">
          <div className="final-result__user-box">
            <div className="final-result__avatar-container">
              <img src={require('../util/icons/' + currentUser.imagePath + '.jpg')} alt="user icon" />
            </div>
            <div className="final-result__text-container">
              <span>{currentUser.username}</span>
              <span>{today}</span>
              <span>Location??</span>
            </div>
          </div>
          <div className="final-result__result-box"><div>{Constants.FINAL_RESULT_FIELD}</div>

            {finalResults && finalResults.map((finalResult) => (
              <div key={finalResult.category.categoryId}>
                <div className="final-result__title">
                  <span className="final-result__answer-text">{finalResult.category.categoryName}</span>
                  <span className="final-result__answer-text">{finalResult.category.oppositeCategory.categoryName}</span>
                </div>
                <div className="final-result__slider">
                  <div className="final-result__first-answer" style={{ "width": `${finalResult.rate}%` }}>{finalResult.rate}%</div>
                  <div className="final-result__second-answer" style={{ "width": `${100 - finalResult.rate}%` }}>{100 - finalResult.rate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="final-result__download" onClick={() => ExportAsImage(exportRef.current, `TRIC-${today}`)}>{Constants.DOWNLOAD}</div>
      </div>
    </div>
  )
}

export default FinalResult