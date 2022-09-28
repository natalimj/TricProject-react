import React from 'react';
import { useState } from 'react'
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question';
import WebSocketComponent from './WebSocketComponent';

const Admin = () => {

  const initialQuestionState = {
    id: null,
    questionNumber: 0,
    questionText: "",
    answers: []
  };

  const [showQuestionNo, setShowQuestionNo] = useState<boolean>(false);
  const [showResultNo, setShowResultNo] = useState<boolean>(false);
  const [questionNo, setQuestionNo] = useState<number>(0);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
  const [question, setQuestion] = useState<IQuestionData>(initialQuestionState);

  const startSession = () => {
    AdminApi.getQuestionByNumber(1).then((response: any) => {
      console.log(response.data);
    })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const showNextQuestion = (questionNumber: number) => {
    setQuestionNo(questionNumber + 1);
    AdminApi.getQuestionByNumber(questionNo + 1)
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });
    setShowResultNo(false);
  };

  const showResult = (questionId: any) => {
    AdminApi.showResult(questionId)
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((e: Error) => {
        console.log(e);
      });

    setShowQuestionNo(false);
    setShowResultNo(true);
  };


  const endSession = () => {
    //delete all users and user answers

    AdminApi.endSession();
    /* .then((response: any) => {
 
         console.log(response.data);
       })
       .catch((e: Error) => {
         console.log(e);
       });
 
 */
    setShowResultNo(false);
  };

  let onQuestionReceived = (msg: IQuestionData) => {
    setQuestionNo(msg.questionId);
    setShowQuestionNo(true);
    setQuestion(msg);
  }

  let onMessageReceived = (msg: number) => {
    setNumberOfUsers(msg);
  }

  return (
    <div>Admin

      <button onClick={startSession} className="btn btn-success">
        Start
      </button>

      <div>
        <WebSocketComponent topics={['/topic/question']} onMessage={(msg: IQuestionData) => onQuestionReceived(msg)} />
        <WebSocketComponent topics={['/topic/message']} onMessage={(msg2: number) => onMessageReceived(msg2)} />
        <p>online users: {numberOfUsers}</p>

        {showQuestionNo && <div><p>Question {questionNo} is on screen....</p><button onClick={() => showResult(question.questionId)} className="btn btn-success">
          Show Result
        </button></div>}
        
        {showResultNo && <div><p>Result {questionNo} is on screen....</p><button onClick={() => showNextQuestion(questionNo)} className="btn btn-success">
          Next
        </button> </div>}

        <button onClick={endSession} className="btn btn-success">
          End Session
        </button>
      </div>
    </div>
  )
}

export default Admin