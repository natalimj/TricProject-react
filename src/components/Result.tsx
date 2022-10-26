import React from 'react';
import { useEffect, useState } from 'react'
import '../style/Result.css';
import IResultData from '../models/Result';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { BsFillSquareFill } from "react-icons/bs";
import Constants from "../util/Constants";
import UserApi from '../api/UserApi';

const Result = () => {
    const initialResultState = {
        question: {
            questionNumber: 0,
            questionText: '',
            answers: [],
            time: 0
        },
        firstAnswerRate: 0.0,
        secondAnswerRate: 0.0,
        firstAnswer: {
            answerText: ""
        },
        secondAnswer: {
            answerText: ""
        }
    };
    const questionId = useAppSelector((state: RootState) => state.question.questionId);
    const [result, setResult] = useState<IResultData>(initialResultState);
    const userName = useAppSelector((state: RootState) => state.user.username);
    const userIcon = useAppSelector((state: RootState) => state.user.imagePath);
    const userAnswer = useAppSelector((state: RootState) => state.answer);
    const [votedFirstResponse, setVotedFirstResponse] = useState<boolean>(false);

    useEffect(() => {
        UserApi.showResult(questionId)
            .then((response: any) => {
                setResult(response.data);
                if (userAnswer.answerText === response.data.firstAnswer.answerText) {
                    setVotedFirstResponse(true);
                } else if (userAnswer.answerText === response.data.secondAnswer.answerText) {
                    setVotedFirstResponse(false);
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
                    {userIcon !== '' ? (<img src={require('../util/icons/' + userIcon + '.png')} alt="user icon" />)
                        : (<img src={require('../util/icons/imageMale1.png')} alt="user icon" />)}
                </div>
                <div className="result__text result__text--username" e2e-id="resultUsername">{userName}</div>
                <div className="result__text">{Constants.VOTE_RESULT_FIELD}</div>
                <div className="result__question-text" e2e-id="resultQuestionText">{result?.question.questionText}</div>
                <div className="result__box">
                    <div className="result__title">
                        <span className="result__answer-text" e2e-id="resultQuestionAnswer0">{result.firstAnswer.answerText}</span>
                        <span className="result__answer-text result__answer-text--right" e2e-id="resultQuestionAnswer1">{result.secondAnswer.answerText}</span>
                    </div>
                    <div className="result__slider">
                        <div className="result__answer-bar result__answer-bar--left"
                            style={{ "width": `${result.firstAnswerRate}%` }} e2e-id="resultBar0">{result.firstAnswer.answerText === userAnswer.answerText && `${result.firstAnswerRate}%`}</div>
                        <div className="result__answer-bar result__answer-bar--right"
                            style={{ "width": `${result.secondAnswerRate}%` }} e2e-id="resultBar1">{result.secondAnswer.answerText === userAnswer.answerText && `${result.secondAnswerRate}%`}</div>
                    </div>
                    <div style={votedFirstResponse ? { color: "#FFADCB" } : { color: "#E1E1DA" }} className="result__user-answer">
                        <BsFillSquareFill /> 
                        <div className='result__user-answer--text'>- {Constants.USER_RESPONSE}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Result
