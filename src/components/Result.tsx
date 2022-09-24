import { useEffect, useState } from 'react'
import IResultData from '../models/Result';
import AdminApi from '../api/AdminApi';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';
import '../style/result.css';
import { BsCircleFill } from "react-icons/bs";

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

    useEffect(() => {
        getResult(questionId);
    }, [questionId]);

    const getResult = (id: string) => {
        AdminApi.showResult(id)
            .then((response: any) => {
                setResult(response.data);
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    return (
        <div className='result__container'>
            <div className="result__inner-container">
                <div className="result__avatar-container">
                    image here
                </div>
                <div className="result__text">{userName}</div>
                <div className="result__text">vote result</div>
                
                <div className="result__question-text">{result?.question.questionText}</div>
                <div className="result__box">
                    <div className="result__title">
                    <span className="result__answer-text">{result?.firstAnswer.answerText}</span>
                    <span className="result__answer-text">{result?.secondAnswer.answerText}</span>
                    </div>
                        <div className="result__slider">
                            <div className="result__first-answer" 
                            style={{"width" : `${result?.firstAnswerRate}%`}}>{result?.firstAnswerRate}%</div>
                            <div className="result__second-answer"
                            style={{"width" : `${result?.secondAnswerRate}%`}}>{result?.secondAnswerRate}%</div>      
                        </div>
                    <div className="result__user-answer result__answer-text"><BsCircleFill/> Your response</div>
                </div>
                
            </div>
        </div>
    )
}

export default Result
