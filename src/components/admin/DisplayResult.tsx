import React, { useState } from 'react'
import '../../style/Result.css';
import IResultData from '../../models/Result';
import Constants from '../../util/Constants';
import WebSocketComponent from '../WebSocketComponent';
import IQuestionData from '../../models/Question';
import Timer from './Timer';
import WaitingPage from '../WaitingPage';

const DisplayResult = () => {

    const initialQuestionState = {
        questionNumber: 0,
        questionText: '',
        answers: [],
        time: 0,
        theme: ""
    }
    const initialResultState = {
        question: initialQuestionState,
        firstAnswerRate: 0.0,
        secondAnswerRate: 0.0,
        firstAnswer: {
            answerText: "",
            firstCategory: "",
            secondCategory: ""
        },
        secondAnswer: {
            answerText: "",
            firstCategory: "",
            secondCategory: ""
        }
    };

    const [result, setResult] = useState<IResultData>(initialResultState);
    const [question, setQuestion] = useState<IQuestionData>(initialQuestionState);
    const [showQuestion, setShowQuestion] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(100);
    const [showTimer, setShowTimer] = useState<boolean>(false);
    const [waitForVoting, setWaitForVoting] = useState<boolean>(false);

    const onResultMessageReceived = (msg: IResultData) => {
        setResult(msg);
        setShowResult(true);
        setShowQuestion(false);
        setWaitForVoting(false)
    }

    const onQuestionMessageReceived = (msg: IQuestionData) => {
        setQuestion(msg);
        setShowQuestion(true);
        setShowResult(false);
        setWaitForVoting(true)
    }

    const onAdminQuestionMessageReceived = (msg: IQuestionData) => {
        setQuestion(msg);
        setShowQuestion(true);
        setShowResult(false);
        setWaitForVoting(false)
    }

    const onTimerMessageReceived = (msg: number) => {
        setShowTimer(true)
        setTimer(msg)
    }

    return (<>
        <WebSocketComponent topics={['/topic/result']} onMessage={(msg: IResultData) => onResultMessageReceived(msg)} />
        <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionMessageReceived(msg)} />
        <WebSocketComponent topics={['/topic/adminQuestion']} onMessage={(msg: IQuestionData) => onAdminQuestionMessageReceived(msg)} />
        <WebSocketComponent topics={['/topic/timer']} onMessage={(msg: number) => onTimerMessageReceived(msg)} />
        {showTimer && <Timer count={timer} setShowTimer={setShowTimer}/>} 
        {!showTimer && showQuestion &&
            <div className='admin-result'>
                <div className="admin-result__inner-container">
                    <div className="result__box">
                        <div className="result__question-text result__text--header">{question.questionText}</div>
                    </div>
                   {waitForVoting && <WaitingPage message={Constants.WAITING_PROMPT_RESULT} onAdmin={true}/>} 
                </div> 
            </div>
        }

        {!showTimer && showResult &&
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