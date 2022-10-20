import React, { ChangeEvent, useState } from 'react'
import { AiOutlineDelete, AiOutlineSave } from "react-icons/ai";
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question'
import { NotificationManager } from 'react-notifications';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

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
    const { questionText, firstAnswer, secondAnswer } = formValue;
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value === "") {
            event.target.style.border = "4px solid var(--color-pink)";
        } else {
            event.target.style.border = "none"
        }
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const deleteQuestion = (questionId: any) => {
        AdminApi.deleteQuestion(questionId, accessToken)
            .then((response: any) => {
                setQuestions(questions.filter(question => question.questionId !== questionId))
                NotificationManager.success('Question has been deleted', 'Success!', 2000);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    }

    const editQuestion = (questionId: any) => {
        if (questionText !== "" && firstAnswer !== "" && secondAnswer !== "") {
            AdminApi.editQuestion(questionText, firstAnswer, secondAnswer, questionId, accessToken)
                .then((response: any) => {
                    NotificationManager.success('Question has been edited', 'Success!', 2000);
                })
                .catch((e: Error) => {
                    NotificationManager.error(e.message, 'Error!', 5000);
                });
        } else {
            NotificationManager.warning('Please fill all required fields ', 'Warning!', 2000);
        }
    }

    return (
        <div key={question.questionId} e2e-id={"questionNr"+questions.indexOf(question)}>
            <div className="questions__box">
                <div className="questions__line">
                    <div className="questions__input">
                        <input type="text"
                            onChange={handleChange}
                            className='questions__text'
                            e2e-id={"question"+questions.indexOf(question)+"EditText"}
                            defaultValue={question.questionText}
                            name="questionText"
                            maxLength={75} />
                    </div>
                </div>
                <div className="questions__line">
                    <div className="questions__input">
                        <input type="text"
                            onChange={handleChange}
                            className='questions__text'
                            e2e-id={"question"+questions.indexOf(question)+"EditAnswer1"}
                            defaultValue={question.answers[0].answerText}
                            name="firstAnswer"
                            maxLength={50} />
                    </div>
                    <div className="questions__icon" e2e-id={"question"+questions.indexOf(question)+"EditSave"} onClick={() => editQuestion(question.questionId)} ><AiOutlineSave size={30} /></div>
                </div>
                <div className="questions__line">
                    <div className="questions__input">
                        <input type="text"
                            className="questions__text"
                            onChange={handleChange}
                            e2e-id={"question"+questions.indexOf(question)+"EditAnswer2"}
                            defaultValue={question.answers[1].answerText}
                            name="secondAnswer"
                            maxLength={50} />
                    </div>
                    <div className="questions__icon" e2e-id={"question"+questions.indexOf(question)+"EditDelete"} onClick={() => deleteQuestion(question.questionId)}><AiOutlineDelete size={30} /></div>
                </div>
            </div>
        </div>
    )
}

export default EditQuestion