import { useEffect, useState } from 'react'
import '../style/Question.css';
import Constants from '../util/Constants';
import UserApi from '../api/UserApi';
import IQuestionData from '../models/Question';
import WaitingPage from './WaitingPage';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import IAnswerData from '../models/Answer';
import { addAnswer } from '../reducers/answerSlice';
import React from 'react';
import WebSocketComponent from './WebSocketComponent';
import FinalResult from './FinalResult';

const Question = () => {
  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const currentQuestion: IQuestionData = {
    questionId: useAppSelector((state: RootState) => state.question.questionId),
    questionNumber: useAppSelector((state: RootState) => state.question.questionNumber),
    questionText: useAppSelector((state: RootState) => state.question.questionText),
    answers: useAppSelector((state: RootState) => [...state.question.answers]),
    time: useAppSelector((state: RootState) => state.question.time),
  }
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswerData>({ answerText: '' });
  const [firstAnswer, setFirstAnswer] = useState<boolean>(false);
  const [secondAnswer, setSecondAnswer] = useState<boolean>(false);
  const [showFinalResult, setshowFinalResult] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(currentQuestion.time);

  const vote = (answer: IAnswerData) => {
    const voteData = {
      userId: userId,
      questionId: currentQuestion.questionId,
      answerId: answer.answerId
    };

    UserApi.saveVote(voteData)
      .then((response: any) => {
        console.log(response.data);
        dispatch(addAnswer(answer));
      })
      .catch((e: Error) => {
        console.log(e);
      });
    setSubmitted(true);
  };

  const chooseAnswer = (answer: IAnswerData, index: number) => {
    setSelectedAnswer(answer);
    if (index === 0) {
      setFirstAnswer(true);
      setSecondAnswer(false);
    } else {
      setFirstAnswer(false);
      setSecondAnswer(true);
    }
  }

  const onFinalResultMessageReceived = () => {
    setshowFinalResult(true);
  }

  useEffect(() => {
    if(timer > 0){
      setTimeout(() => {
        setTimer(timer =>timer-1)
      }, 1000);
    } 
  }, [timer]);

  
  return (
    <div className='question-container'>
      <WebSocketComponent topics={['/topic/finalResult']} onMessage={() => onFinalResultMessageReceived()} />
      {submitted ? ((<WaitingPage />))
        : (showFinalResult ? (<FinalResult />)
          : (<>
          <div className='question'>
            <div className='question__timer-text'> {timer} seconds remaining</div>
            <div className='question__timer'><div className='question__inner-timer' style={{"width" : `${(100*timer)/(currentQuestion.time)}%`}}></div></div>
            <div className='question__header'>
              {Constants.QUESTION_FIELD} {currentQuestion.questionNumber}
            </div>
            <div className='question__header question__header--text'>
              {currentQuestion.questionText}
            </div>
            <div className='question__answer-group'>
              {currentQuestion.answers && currentQuestion.answers.map((answer, index) => (
                <button onClick={() => chooseAnswer(answer, index)} className={(firstAnswer && index === 0) || (secondAnswer && index === 1) ? 'question__answer-button question__active-button' : 'question__answer-button'}>
                  <div className="question__answer-text">
                    {answer.answerText.toString()}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => { vote(selectedAnswer) }} className={firstAnswer || secondAnswer ? 'question__submit-button question__active-button' : 'question__submit-button'} disabled={!firstAnswer && !secondAnswer}>
              {Constants.CONFIRM_BUTTON}
            </button>  
          </div></>)
        )}
    </div>
  )
}

export default Question