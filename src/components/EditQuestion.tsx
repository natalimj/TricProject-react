import React, { ChangeEvent, useState } from 'react'
import { AiOutlineDelete, AiOutlineSave } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question'


type Props = {
    question: IQuestionData
    questions: IQuestionData[]
    setQuestions: React.Dispatch<React.SetStateAction<IQuestionData[]>>
}

const EditQuestion = ({ question, questions, setQuestions }: Props) => {
    const [formValue, setFormValue] = useState({
        questionText: question.questionText,
        firstAnswer: question.answers[0].answerText,
        secondAnswer: question.answers[1].answerText,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if(value === ""){
            event.target.style.border= "4px solid var(--color-pink)";
        } else {
            event.target.style.border ="none"
        }
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const { questionText, firstAnswer, secondAnswer } = formValue;

    function deleteQuestion(questionId: any) {
        AdminApi.deleteQuestion(questionId)
            .then((response: any) => {
                setQuestions(questions.filter(question => question.questionId !== questionId))
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    function editQuestion(questionId: any) {
        if (questionText !== "" && firstAnswer !== "" && secondAnswer !== "") {
            AdminApi.editQuestion(questionText, firstAnswer, secondAnswer, questionId)
                .then((response: any) => {
                    console.log(response.data);
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        } else {
            console.log("empty field alert")
            
        }
    }

    return (
        <div key={question.questionId}>
            <div className="questions_box">
                <div className="questions_line">
                    <div className="questions_input">
                        <input type="text"
                            onChange={handleChange}
                            className='questions_text'
                            defaultValue={question.questionText}
                            name="questionText" />
                    </div>
                    <div className="questions_icon"><BiTimeFive size={30} /></div>
                </div>
                <div className="questions_line">
                    <div className="questions_input">
                        <input type="text"
                            onChange={handleChange}
                            className='questions_text'
                            defaultValue={question.answers[0].answerText}
                            name="firstAnswer" />
                    </div>
                    <div className="questions_icon" onClick={() => editQuestion(question.questionId)} ><AiOutlineSave size={30} /></div>
                </div>
                    <div className="questions_line"><div className="questions_input">
                    <input type="text"
                        className="questions_text"
                        onChange={handleChange}
                        defaultValue={question.answers[1].answerText}
                        name="secondAnswer" />
                    </div>
                    <div className="questions_icon" onClick={() => deleteQuestion(question.questionId)}><AiOutlineDelete size={30} /></div>
                </div>
            </div>
        </div>
        
    )
}

export default EditQuestion