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
import { setUserVoted } from '../reducers/componentSlice';
import { setUserResults} from '../reducers/userResultSlice';
import { NotificationManager } from 'react-notifications';
import IPlayInfoData from '../models/PlayInfo';

import React from 'react';
import Modal from 'react-modal';

const Question = () => {
  const dispatch = useAppDispatch();
  const voted: number = useAppSelector((state: RootState) => state.component.userVotedValue);
  const userId: any = useAppSelector((state: RootState) => state.user.userId);
  const currentQuestion: IQuestionData = {
    questionId: useAppSelector((state: RootState) => state.question.questionId),
    questionNumber: useAppSelector((state: RootState) => state.question.questionNumber),
    questionText: useAppSelector((state: RootState) => state.question.questionText),
    answers: useAppSelector((state: RootState) => [...state.question.answers]),
    time: useAppSelector((state: RootState) => state.question.time),
    theme: useAppSelector((state: RootState) => state.question.theme),
  }
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswerData>({ answerText: '' , category:''});
  const [firstAnswer, setFirstAnswer] = useState<boolean>(false);
  const [secondAnswer, setSecondAnswer] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(currentQuestion.time);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [PlayInfo, setPlayInfo] = useState<IPlayInfoData>();

  const vote = (answer: IAnswerData) => {
    const voteData = {
      userId: userId,
      questionId: currentQuestion.questionId,
      answerId: answer.answerId
    }

    UserApi.saveVote(voteData)
      .then(() => {
        dispatch(addAnswer(answer));
        dispatch(setUserVoted(voteData.questionId));
        dispatch(setUserResults( {
        question: currentQuestion,
        answer :answer
        }))
      })
      .catch((e: Error) => {
        console.log(e);
      });
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

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer => timer - 1)
      }, 1000);
    }
  }, [timer]);

  useEffect(() => {
    if (timer === 0 && !voted) {
      vote(currentQuestion.answers[0]);
      setTimer(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion.answers]);

  useEffect(() => {
    UserApi.getPlayInfo()
      .then((response: any) => {
        setPlayInfo(response.data)
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  }, [])


  return (
    <div className='question-container'>
      {(voted === currentQuestion.questionId) ? ((<WaitingPage startScreen={false} />))
        : (
          <>
            <div className='question'>
              <div className='question__timer-text'> <span className='question__timer-text--seconds'>{timer}</span> seconds remaining</div>
              <div className='question__timer'>
                <div className='question__inner-timer' style={{ "width": `${(100 * timer) / (currentQuestion.time)}%` }}></div>
              </div>
              <div className='question__header' e2e-id="questionHeader">
                {Constants.QUESTION_FIELD} {currentQuestion.questionNumber}
              </div>
              <div className='question__header question__header--text' e2e-id="questionText">
                {currentQuestion.questionText}
              </div>
              <div className='question__answer-group'>
                {currentQuestion.answers && currentQuestion.answers.map((answer, index) => (
                  <button onClick={() => chooseAnswer(answer, index)} className={(firstAnswer && index === 0) || (secondAnswer && index === 1) ? 'question__answer-button question__active-button' : 'question__answer-button'} e2e-id={"questionAnswer"+index}>
                    <div className="question__answer-text">
                      {answer.answerText.toString()}
                    </div>
                  </button>
                ))}
              </div>
              {(currentQuestion.questionNumber !== 5) ? ((
              <>
              <button onClick={() => { vote(selectedAnswer) }} className={firstAnswer || secondAnswer ? 'question__submit-button question__active-button' : 'question__submit-button'} disabled={!firstAnswer && !secondAnswer} e2e-id="questionConfirm">
                {Constants.CONFIRM_BUTTON}
              </button>
              </>)) : (
                <>
               <button onClick={() => { setIsOpen(true) }} className={firstAnswer || secondAnswer ? 'question__submit-button question__active-button' : 'question__submit-button'} disabled={!firstAnswer && !secondAnswer} e2e-id="questionConfirm">
                {Constants.CONFIRM_BUTTON}
              </button>
                    <Modal 
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
                    }}isOpen={isOpen}>
                    <span className='question__header'>
                    {
                      PlayInfo?.finalResultText // TODO: ADD PREDICTED ANSWER
                    }
                    </span>
                    <button className={'question__submit-button question__active-button'} onClick={() => {setIsOpen(false) 
                    vote(selectedAnswer)}  //TODO: CHANGE TO PREDICTED ANSWER
                  }>Continue</button>
                  </Modal>
                </>
              )}
            </div>
          </>
        )}
    </div>
  )
}

export default Question