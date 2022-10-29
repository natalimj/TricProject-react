import '../style/ManageQuestions.css';
import IQuestionData from '../models/Question';
import { useEffect, useState } from 'react';
import AdminApi from '../api/AdminApi';
import { BiDownArrow, BiUpArrow, BiLeftArrowAlt } from "react-icons/bi";
import EditQuestion from './EditQuestion';
import Constants from '../util/Constants';
import { NotificationManager } from 'react-notifications';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

const ManageQuestions = () => {
    const [questions, setQuestions] = useState<IQuestionData[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [firstAnswer, setFirstAnswer] = useState("");
    const [secondAnswer, setSecondAnswer] = useState("");
    const [showQuestions, setShowQuestions] = useState<boolean>(false);
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);

    useEffect(() => {
        AdminApi.getAllQuestions(accessToken)
            .then((response: any) => {
                setQuestions(response.data)
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    }, [accessToken])


    const addQuestion = () => {
        if (questionText !== "" && firstAnswer !== "" && secondAnswer !== "") {
            AdminApi.addQuestion(questionText, firstAnswer, secondAnswer, accessToken)
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
                                e2e-id="questionText"
                                onChange={(e) => setQuestionText(e.target.value)}
                                maxLength={75} />
                        </div>
                    </div>
                    <div className="questions__line">
                        <div className="questions__input">
                            <input type="text"
                                value={firstAnswer}
                                className="questions__text"
                                placeholder="Enter first answer"
                                e2e-id="questionAnswer1"
                                onChange={(e) => setFirstAnswer(e.target.value)}
                                maxLength={50} />
                        </div>
                    </div>
                    <div className="questions__line">
                        <div className="questions__input">
                            <input type="text"
                                value={secondAnswer}
                                className="questions__text"
                                placeholder="Enter second answer"
                                e2e-id="questionAnswer2"
                                onChange={(e) => setSecondAnswer(e.target.value)}
                                maxLength={50} />
                        </div>
                        <div className="questions__icon" e2e-id="questionSave"
                            onClick={addQuestion} >{Constants.SAVE_BUTTON.toUpperCase()}</div>
                    </div>
                </div>
            </div>
            <div className='questions__header questions__header--accordion' e2e-id="questionAccordion" onClick={() => showEditQuestions()}>
                {Constants.QUESTION_LIST_TITLE}
                <span> {showQuestions ? (<BiUpArrow size={30} />) : (<BiDownArrow size={30} />)}</span>
            </div>
            {showQuestions && <div>
                {questions && questions.map((question) => (
                    <EditQuestion key={question.questionId} question={question} questions={questions} setQuestions={setQuestions} />
                ))}
            </div>}
            <div className='questions__back-button' onClick={goToAdminPage} e2e-id="back">
                <BiLeftArrowAlt size={30} />
            </div>
        </div>
    )
}

export default ManageQuestions