import '../style/ManageQuestions.css';
import IQuestionData from '../models/Question';
import { useEffect, useState } from 'react';
import AdminApi from '../api/AdminApi';
import { BiDownArrow, BiUpArrow, BiLeftArrowAlt } from "react-icons/bi";
import EditQuestion from './EditQuestion';
import Constants from '../util/Constants';
import { NotificationManager } from 'react-notifications';

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
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    }, [])


    const addQuestion = () => {
        if (questionText !== "" && firstAnswer !== "" && secondAnswer !== "") {
            AdminApi.addQuestion(questionText, firstAnswer, secondAnswer)
                .then((response: any) => {
                    setQuestions([...questions, response.data])
                    setQuestionText("")
                    setFirstAnswer("")
                    setSecondAnswer("")
                    NotificationManager.success('A new question has been added', 'Success!', 2000);
                })
                .catch((e: Error) => {
                    NotificationManager.error(e.message, 'Error!', 5000);
                });
        } else {
            NotificationManager.warning('Please fill all required fields ', 'Warning!', 2000);
        }
    }

    const showEditQuestions = () => {
        setShowQuestions(!showQuestions)
    }

    const goToAdminPage = () => {
        window.location.href = "/admin";
      };

    return (
        <div className='questions'>
            <div className='questions__header'>
                {Constants.NEW_QUESTION_TITLE}
            </div>
            <div>
                <div className="questions__box">
                    <div className="questions__line">
                        <div className="questions__input">
                            <input type="text"
                                value={questionText}
                                className="questions__text"
                                placeholder="Enter question"
                                onChange={(e) => setQuestionText(e.target.value)} 
                                maxLength={150} />
                        </div>
                    </div>
                    <div className="questions__line">
                        <div className="questions__input">
                            <input type="text"
                                value={firstAnswer}
                                className="questions__text"
                                placeholder="Enter first answer"
                                onChange={(e) => setFirstAnswer(e.target.value)}
                                maxLength={150} />
                        </div>
                    </div>
                    <div className="questions__line">
                        <div className="questions__input">
                            <input type="text"
                                value={secondAnswer}
                                className="questions__text"
                                placeholder="Enter second answer"
                                onChange={(e) => setSecondAnswer(e.target.value)}
                                maxLength={150} />
                        </div>
                    </div>
                </div>
                <button className="questions__save-button" onClick={addQuestion}>
                    {Constants.SAVE_BUTTON}
                </button>
            </div>
            <div className='questions__header questions__header--accordion' onClick={() => showEditQuestions()}>
                {Constants.QUESTION_LIST_TITLE}
                <span> {showQuestions ? (<BiUpArrow size={30} />) : (<BiDownArrow size={30} />)}</span>
            </div>
            {showQuestions && <div>
                {questions && questions.map((question) => (
                    <EditQuestion key={question.questionId} question={question} questions={questions} setQuestions={setQuestions} />
                ))}
            </div>}
            <div className='questions__back-button' onClick={goToAdminPage}>
                <BiLeftArrowAlt size={30} />
            </div>
        </div>
    )
}

export default Questions