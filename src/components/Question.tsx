import { useState } from 'react'
import UserApi from '../api/UserApi';
import IQuestionData from '../models/Question';
import WaitingPage from './WaitingPage';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import IAnswerData from '../models/Answer';
import {
  addAnswer
} from '../reducers/answerSlice';

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
    <div>
      <p><b>QuestionPage {currentQuestion.questionId}</b></p>
      {submitted ? (
        (<WaitingPage />)
      ) : (
        <div>
          <div>
            <p>Question : {currentQuestion.questionText}</p>
            {currentQuestion.answers && currentQuestion.answers.map((answer) => (
              <button onClick={() => vote(answer)} className="btn btn-success">
                <p>{answer.answerText.toString()}</p>
              </button>
            ))}
          </div>
        </div>)}
    </div>
  )
}

export default Question