import React, { useEffect, useState } from 'react'
import '../../style/Question.css';
import '../../style/Modal.css';
import Constants from '../../util/Constants';
import UserApi from '../../api/UserApi';
import IQuestionData from '../../models/Question';
import WaitingPage from '../WaitingPage';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import IAnswerData from '../../models/Answer';
import { addAnswer } from '../../reducers/answerSlice';
import { setUserVoted } from '../../reducers/componentSlice';
import { NotificationManager } from 'react-notifications';
import IPlayInfoData from '../../models/PlayInfo';
import Modal from 'react-modal';

/**
 * Component for displaying the question, two answers
 * and a countdown timer to show voting time.
 * The user can vote for one of the answers.
 *
 * @ author Daria-Maria Popa 
 */
const Question = () => {
  const dispatch = useAppDispatch();
  const voted: number = useAppSelector((state: RootState) => state.component.userVotedValue);
  const userId: any = useAppSelector((state: RootState) => state.user.userId);
  const currentQuestion: IQuestionData = useAppSelector((state: RootState) => state.question);
  const [selectedAnswer, setSelectedAnswer] = useState<IAnswerData>({ answerText: '', firstCategory: '', secondCategory: '' });
  const [predictedAnswer, setPredictedAnswer] = useState<IAnswerData>({ answerText: '', firstCategory: '', secondCategory: '' });
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);
  const [firstAnswer, setFirstAnswer] = useState<boolean>(false);
  const [secondAnswer, setSecondAnswer] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(currentQuestion.time);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [PlayInfo, setPlayInfo] = useState<IPlayInfoData>();
  const [shortText, setShortText] = useState(currentQuestion.questionText.split(".").slice(-1)[0]?.trim());

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
      currentQuestion.questionNumber === numberOfQuestions ? vote(predictedAnswer) : vote(currentQuestion.answers[0]);
      setTimer(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion.answers]);

  useEffect(() => {
    UserApi.getNumberOfQuestions()
      .then((response: any) => {
        setNumberOfQuestions(response.data);
      }).then(() => {
        if (currentQuestion.questionNumber === numberOfQuestions) {
          UserApi.getPlayInfo()
            .then((response: any) => {
              setPlayInfo(response.data)
            }).catch((e: Error) => {
              NotificationManager.error(e.message, 'Error!', 5000);
            });

          UserApi.getPredictedAnswer(userId)
            .then((response: any) => {
              dispatch(addAnswer(currentQuestion.answers[response.data]));
              setPredictedAnswer(currentQuestion.answers[response.data]);
            }).then(() => {
              setTimeout(() => {
                setIsOpen(true)
              }, 5000)
            })
            .catch((e: Error) => {
              NotificationManager.error(e.message, 'Error!', 5000);
            });
        }
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
      setShortText(currentQuestion.questionText.split(".").slice(-1)[0]?.trim());
  }, [currentQuestion.answers, currentQuestion.questionNumber, dispatch, numberOfQuestions, userId,currentQuestion.questionText])

  return (
    <div className='question-container'>
      {(voted === currentQuestion.questionId) ? ((<WaitingPage message={Constants.WAITING_PROMPT_RESULT} onAdmin={false} />))
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
                {shortText}
              </div>
              <div className='question__answer-group'>
                {currentQuestion.answers && currentQuestion.answers.map((answer, index) => (
                  <button key={index} onClick={() => chooseAnswer(answer, index)} className={(firstAnswer && index === 0) || (secondAnswer && index === 1) ? 'question__answer-button question__active-button' : 'question__answer-button'} e2e-id={"questionAnswer" + index}>
                    <div className="question__answer-text">
                      {answer.answerText.toString()}
                    </div>
                  </button>
                ))}
              </div>
              {(currentQuestion.questionNumber !== numberOfQuestions) ? (
                <button onClick={() => { vote(selectedAnswer) }} className={firstAnswer || secondAnswer ? 'question__submit-button question__active-button' : 'question__submit-button'} disabled={!firstAnswer && !secondAnswer} e2e-id="questionConfirm">
                  {Constants.CONFIRM_BUTTON}
                </button>
              ) : (
                <>
                  <button onClick={() => { setIsOpen(true) }} className={firstAnswer || secondAnswer ? 'question__submit-button question__active-button' : 'question__submit-button'} disabled={!firstAnswer && !secondAnswer} e2e-id="questionConfirm">
                    {Constants.CONFIRM_BUTTON}
                  </button>
                  <Modal isOpen={isOpen} className='modal__content' overlayClassName='modal__overlay modal__overlay--invert'>
                    <div className='modal__text'>{PlayInfo?.finalResultText}</div>
                    <div className='modal__text'>{Constants.WE_CHOSE_TEXT} <span className='modal__text--selection'>{predictedAnswer.answerText}</span></div>
                    <button className={'modal__button'} onClick={() => {
                      setIsOpen(false)
                      vote(predictedAnswer)
                    }}>{Constants.CONFIRM_BUTTON}
                    </button>
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