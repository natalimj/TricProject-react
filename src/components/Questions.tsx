import '../style/questions.css';
import IQuestionData from '../models/Question';
import { useEffect, useState } from 'react';
import AdminApi from '../api/AdminApi';
import {BiDownArrow,BiUpArrow} from "react-icons/bi";
import React from 'react';
import EditQuestion from './EditQuestion';

const Questions = () => {



    const [questions, setQuestions] = useState<IQuestionData[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [firstAnswer, setFirstAnswer] = useState("");
    const [secondAnswer, setSecondAnswer] = useState("");
    const [showQuestions, setShowQuestions] = useState<boolean>(false)

    useEffect(() => {
        AdminApi.getAllQuestions()
            .then((response: any) => {
                setQuestions(response.data)
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }, [])


    function addQuestion() {
        if (questionText !== "" && firstAnswer !== "" && secondAnswer !== "") {
            AdminApi.addQuestion(questionText, firstAnswer, secondAnswer)
            .then((response: any) => {
                setQuestions([...questions, response.data])
                setQuestionText("")
                setFirstAnswer("")
                setSecondAnswer("")
            })
            .catch((e: Error) => {
                console.log(e);
            });
        } else {
            console.log("empty field alert")
        }
    }
    function showEditQuestions(){
        setShowQuestions(!showQuestions)
    }

    return (

        <div className='questions'>
            <div className='questions__header'>
                New Question
            </div>
            <div>
                <div className="questions_box">
                    <div className="questions_line"><div className="questions_input">
                        <input type="text"
                            value={questionText}
                            className="questions_text"
                            placeholder="Enter question"
                            onChange={(e) => setQuestionText(e.target.value)} /></div></div>

                    <div className="questions_line"><div className="questions_input">
                        <input type="text"
                            value={firstAnswer}
                            className="questions_text"
                            placeholder="Enter first answer"
                            onChange={(e) => setFirstAnswer(e.target.value)} /></div></div>

                    <div className="questions_line"><div className="questions_input">
                        <input type="text"
                            value={secondAnswer}
                            className="questions_text"
                            placeholder="Enter second answer"
                            onChange={(e) => setSecondAnswer(e.target.value)} /></div></div>
                </div>

                <button className="questions__save-button" onClick={addQuestion}>
                    Save
                </button>
            </div>

            <div className='questions__header' onClick={()=>showEditQuestions()}>
                Questions
                <span> {showQuestions ? (<BiUpArrow size={30} />) : (<BiDownArrow size={30} /> )}</span>
            </div>
            {showQuestions && <div>
            { questions && questions.map((question) => (
                 <EditQuestion key={question.questionId} question={question} questions={questions} setQuestions={setQuestions}/> 
            ))}
            </div>}
        </div>

    )
}

export default Questions