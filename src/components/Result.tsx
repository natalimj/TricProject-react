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
        <div className='result_container'>
            <div className="result_inner">
                <div className="image_box">
                    image here
                </div>
                <div className="username">{userName}</div>
                <div className="username">vote result</div>
                
                <div className="question">{result?.question.questionText}</div>
                <div className="result">
                    <div className="result_title">
                    <span className="answer">{result?.firstAnswer.answerText}</span>
                    <span className="answer">{result?.secondAnswer.answerText}</span>
                    </div>
                        <div className="result_slider">
                            <div className="first_answer" 
                            style={{"width" : `${result?.firstAnswerRate}%`}}>{result?.firstAnswerRate}%</div>
                            <div className="second_answer"
                            style={{"width" : `${result?.secondAnswerRate}%`}}>{result?.secondAnswerRate}%</div>      
                        </div>
                    
                    <div className="user_answer answer"><BsCircleFill/> Your response</div>
                </div>
                
            </div>
        </div>
    )
}

export default Result
