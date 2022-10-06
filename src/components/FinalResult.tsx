import React, { useEffect, useRef, useState } from 'react'
import '../style/FinalResult.css';
import Constants from '../util/Constants';
import UserApi from '../api/UserApi';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import IUserData from '../models/User';
import IFinalResultData from '../models/FinalResult';
import moment from 'moment';
import ExportAsImage from '../util/ExportAsImage';

const FinalResult = () => {

  const currentUser: IUserData = {
    userId: useAppSelector((state: RootState) => state.user.userId),
    username: useAppSelector((state: RootState) => state.user.username),
    imagePath: useAppSelector((state: RootState) => state.user.imagePath)
  }

  const [finalResults, setFinalResults] = useState<IFinalResultData[]>([]);
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

  const exportRef = useRef<HTMLHeadingElement>(null);

  const today = moment().format('DD-MM-YYYY');

  return (
    <div className='finalresult'>
      <div className="finalresult__inner-container">
        <div ref={exportRef} className="pink-background">
          <div className="finalresult__user-box">
            <div className="finalresult__avatar-container">
              <img src={require('../util/icons/' + currentUser.imagePath + '.jpg')} alt="user icon" />
            </div>
            <div className="finalresult__text-container">
              <span>{currentUser.username}</span>
              <span>{today}</span>
              <span>HumanLab</span>
            </div>
          </div>
          <div className="finalresult__result-box"><div>{Constants.FINAL_RESULT_FIELD}</div>

            {finalResults && finalResults.map((finalResult) => (
              <div key={finalResult.category.categoryId}>
                <div className="finalresult__title">
                  <span className="finalresult__answer-text">{finalResult.category.categoryName}</span>
                  <span className="finalresult__answer-text">{finalResult.category.oppositeCategory.categoryName}</span>
                </div>
                <div className="finalresult__slider">

                  <div className="finalresult__first-answer"
                    style={{ "width": `${finalResult.rate}%` }}>{finalResult.rate}%</div>
                  <div className="finalresult__second-answer"
                    style={{ "width": `${100 - finalResult.rate}%` }}>{100 - finalResult.rate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="finalresult__download" onClick={() => ExportAsImage(exportRef.current, `TRIC-${today}`)}>{Constants.DOWNLOAD}</div>
      </div>
    </div>
  )
}

export default FinalResult