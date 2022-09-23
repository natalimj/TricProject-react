import { useEffect, useState } from 'react'
import IResultData from '../models/Result';
import AdminApi from '../api/AdminApi';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

const Result = () => {
    const initialResultState = {
        questionNumber: 1,
        firstAnswerRate: 0.0,
        secondAnswerRate: 0.0,
        firstAnswerText: "",
        secondAnswerText: ""
    };

    const questionId = useAppSelector((state: RootState) => state.question.questionId);
    const answerId = useAppSelector((state: RootState) => state.answer.answerId);
    const [result, setResult] = useState<IResultData>(initialResultState);

    useEffect(() => {
        getResult(questionId);
    }, []);

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
            <p>Question : {result.questionNumber}</p>
            <p>Your answer : {answerId}</p>
            <p>Answer 1: %{result.firstAnswerRate}</p>
            <p>Answer2: %{result.secondAnswerRate}</p>
        </div>
    )
}

export default Result
