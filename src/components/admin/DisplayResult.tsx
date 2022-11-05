import React, { useState } from 'react'
import '../../style/Result.css';
import IResultData from '../../models/Result';
import Constants from '../../util/Constants';
import WebSocketComponent from '../WebSocketComponent';

const DisplayResult = () => {
    const [result, setResult] = useState<IResultData>(Constants.initialResultState);
    const [showResult, setShowResult] = useState<boolean>(false);

    const onMessageReceived = (msg: IResultData) => {
        setResult(msg);
        setShowResult(true);
    }

    return (<>
        <WebSocketComponent topics={['/topic/result']} onMessage={(msg: IResultData) => onMessageReceived(msg)} />
        {showResult &&
            <div className='admin-result'>
                <div className="admin-result__inner-container">
                    <div className="result__box">
                        <div className="result__text">{Constants.VOTE_RESULT_FIELD} {result?.question.questionNumber}</div>
                        <div className="result__question-text result__text--larger">{result?.question.questionText}</div>
                        <div className="result__title admin-result__title">
                            <span className="result__answer-text">{result.firstAnswer.answerText}</span>
                            <span className="result__answer-text result__answer-text--right">{result.secondAnswer.answerText}</span>
                        </div>
                        <div className="result__slider">
                            <div className="result__answer-bar result__answer-bar--left"
                                style={{ "width": `${result.firstAnswerRate}%` }}> {result.firstAnswerRate !== 0 && `${result.firstAnswerRate}%`}</div>
                            <div className="result__answer-bar result__answer-bar--right"
                                style={{ "width": `${result.secondAnswerRate}%` }}>{result.secondAnswerRate !== 0 && `${result.secondAnswerRate}%`}</div>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>
    )
}

export default DisplayResult