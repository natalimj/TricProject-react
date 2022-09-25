import { useEffect, useState } from 'react'
import IResultData from '../models/Result';
import AdminApi from '../api/AdminApi';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

const Result = () => {
    const initialResultState = {
        question: {
            questionNumber: 0,
            questionText: '',
            answers: [],
        },
        firstAnswerRate: 0.0,
        secondAnswerRate: 0.0,
        firstAnswerText: "",
        secondAnswerText: ""
    };

    const questionId = useAppSelector((state: RootState) => state.question.questionId);
    const answerId = useAppSelector((state: RootState) => state.answer.answerId);
    const answerText = useAppSelector((state: RootState) => state.answer.answerText);
    const [result, setResult] = useState<IResultData>(initialResultState);

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
        <div>
            <p>Question : {result.question.questionNumber}</p>
            <p>Your answer : {answerId} - {answerText}</p>
            <p>Answer 1: %{result.firstAnswerRate}</p>
            <p>Answer2: %{result.secondAnswerRate}</p>
        </div>
    )
}

export default Result
