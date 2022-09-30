import { useEffect, useState } from 'react'
import IResultData from '../models/Result';
import AdminApi from '../api/AdminApi';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import '../style/result.css';
import { BsCircleFill } from "react-icons/bs";
import Constants from "../util/Constants";
import React from 'react';

const Result = () => {
    const initialResultState = {
        question: {
            questionNumber: 0,
            questionText: '',
            answers: [],
        },
        firstAnswerRate: 0.0,
        secondAnswerRate: 0.0,
        firstAnswer: {
            answerText:""
        },
        secondAnswer: {
            answerText:""
        }
    };

    const questionId = useAppSelector((state: RootState) => state.question.questionId);
    const [result, setResult] = useState<IResultData>(initialResultState);
    const userName = useAppSelector((state: RootState) => state.user.username);
    const userAnswer = useAppSelector((state: RootState) => state.answer);
    const [response,setResponse] =useState<boolean>(false);

    useEffect(() => {
        AdminApi.showResult(questionId)
            .then((response: any) => {
                setResult(response.data);
            if (userAnswer.answerText === response.data.firstAnswer.answerText) {
                setResponse(true);
            } else if (userAnswer.answerText === response.data.secondAnswer.answerText) {
                setResponse(false);
            }
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }, [questionId, userAnswer.answerText]);

    return (
        <div className='result'>
            <div className="result__inner-container">
                <div className="result__avatar-container">
                    image here
                </div>
                <div className="result__text">{userName}</div>
                <div className="result__text">{Constants.RESULT_FIELD}</div>
                
                <div className="result__question-text">{result?.question.questionText}</div>
                <div className="result__box">
                    <div className="result__title">
                    <span className="result__answer-text">{result?.firstAnswer.answerText}</span>
                    <span className="result__answer-text">{result?.secondAnswer.answerText}</span>
                    </div>
                        <div className="result__slider">
                            <div className="result__first-answer" 
                            style={{"width" : `${result?.firstAnswerRate}%`}}>{result.firstAnswer.answerText ===userAnswer.answerText && `${result?.firstAnswerRate}%`}</div>
                            <div className="result__second-answer"
                            style={{"width" : `${result?.secondAnswerRate}%`}}>{result.secondAnswer.answerText ===userAnswer.answerText && `${result?.secondAnswerRate}%`}</div>      
                        </div>
                    <div style={response ? {color:"#FFADCB"} :{color:"#E1E1DA"}}className="result__user-answer"><BsCircleFill/>Your response</div>
                </div>           
            </div>
        </div>
    )
}

export default Result
