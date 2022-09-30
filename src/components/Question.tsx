import { useState } from 'react'
import './Question.css';
import Constants from '../util/Constants';
import UserApi from '../api/UserApi';
import IQuestionData from '../models/Question';
import WaitingPage from './WaitingPage';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import IAnswerData from '../models/Answer';
import {
  addAnswer
} from '../reducers/answerSlice';
import React from 'react';

const Question = () => {

  const dispatch = useAppDispatch();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const userId = useAppSelector((state: RootState) => state.user.userId);
  const currentQuestion: IQuestionData = {
    questionId: useAppSelector((state: RootState) => state.question.questionId),
    questionNumber: useAppSelector((state: RootState) => state.question.questionNumber),
    questionText: useAppSelector((state: RootState) => state.question.questionText),
    answers: useAppSelector((state: RootState) => [...state.question.answers])
  }

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


  return (
    <div className='question-container'>
      {submitted ? (
        (<WaitingPage />)
      ) : (
        <div className='question'>
          <div className='question__header'>
            {Constants.QUESTION_FIELD} {currentQuestion.questionId}
          </div>
          <div className='question__header question__header--text'>
            {currentQuestion.questionText}
          </div>
          <div className='question__answer-group'>
            {currentQuestion.answers && currentQuestion.answers.map((answer) => (
              <button onClick={() => vote(answer)} className="question__answer-button">
                <div className="question__answer-text">
                  {answer.answerText.toString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Question