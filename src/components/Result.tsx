import React from 'react';
import { useEffect, useState } from 'react'
import '../style/Result.css';
import IResultData from '../models/Result';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import { BsFillSquareFill } from "react-icons/bs";
import Constants from "../util/Constants";
import FinalResult from './FinalResult';

type Props = {
    finalResult: boolean;
    result: IResultData;
}

const Result = ({ finalResult, result }: Props) => {
    const userName = useAppSelector((state: RootState) => state.user.username);
    const userIcon = useAppSelector((state: RootState) => state.user.imagePath);
    const userAnswer = useAppSelector((state: RootState) => state.answer);
    const [showFinalResult, setShowFinalResult] = useState<boolean>(false);
    const [votedFirstResponse, setVotedFirstResponse] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const cacheImages = async (srcArray) => {
        const promises = await srcArray.map((src) => {
            return new Promise(function (resolve, reject) {
                const img = new Image();
                img.src = src;

            });
        });
        await Promise.all(promises);
        setIsLoading(false);
    };

    useEffect(() => {
        const imgs = [
            '../util/icons/' + userIcon + '.png'
        ]

        cacheImages(imgs);
    }, [userIcon]);

    useEffect(() => {
        if (userAnswer.answerText === result.firstAnswer.answerText) {
            setVotedFirstResponse(true);
        } else if (userAnswer.answerText === result.secondAnswer.answerText) {
            setVotedFirstResponse(false);
        }
    }, [userAnswer.answerText, result]);

    return (
        <>
            {(!showFinalResult) ? (
                <div className='result'>
                    <div className="result__inner-container">
                        <div className="result__avatar-container">
                            {!isLoading ? (<img src={require('../util/icons/' + userIcon + '.png')} alt="user icon" />)
                                : (<></>)}
                        </div>
                        <div className="result__text result__text--username" e2e-id="resultUsername">{userName}</div>
                        <div className="result__text">{finalResult ? Constants.FINAL_VOTE_RESULT_FIELD : Constants.VOTE_RESULT_FIELD}</div>
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
                        {finalResult ?
                            (<button onClick={() => setShowFinalResult(true)} className="result__final-profile-button">
                                {Constants.FINAL_RESULT_PROFILE_BUTTON}
                            </button>) : null}
                    </div>
                </div>
            ) : <FinalResult />}
        </>
    )
}

export default Result
