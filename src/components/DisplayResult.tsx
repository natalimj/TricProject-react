import React, { useEffect, useState } from 'react'
import '../style/Result.css';
import AdminApi from '../api/AdminApi';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import IResultData from '../models/Result';
import Constants from '../util/Constants';
import WebSocketComponent from './WebSocketComponent';

const DisplayResult = () => {

    const initialResultState = {
        question: {
            questionNumber: 0,
            questionText: '',
            answers: [],
            time: 0,
            theme:""
        },
        firstAnswerRate: 0.0,
        secondAnswerRate: 0.0,
        firstAnswer: {
            answerText: "",
            category:""
        },
        secondAnswer: {
            answerText: "",
            category:""
        }
    };

    const [result, setResult] = useState<IResultData>(initialResultState);
    const [showResult, setShowResult] = useState<boolean>(false);
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0);

    const onMessageReceived = (msg: IResultData) => {
        setResult(msg)
        setShowResult(true)
    }
    const onQuestionMessageReceived = () => {
        setShowResult(false)
    }

    useEffect(() => {
        AdminApi.getNumberOfQuestions(accessToken)
            .then((response: any) => {
                setNumberOfQuestions(response.data);
            })
            .catch((e: Error) => {
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfQuestions, accessToken])

    return (<>
        <WebSocketComponent topics={['/topic/result']} onMessage={(msg: IResultData) => onMessageReceived(msg)} />
        <WebSocketComponent topics={['/topic/question']} onMessage={() => onQuestionMessageReceived()} />
        {showResult && result.question.questionNumber !== numberOfQuestions &&
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