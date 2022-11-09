import '../../style/ManageQuestions.css';
import IQuestionData from '../../models/Question';
import { useEffect, useState } from 'react';
import AdminApi from '../../api/AdminApi';
import { BiDownArrow, BiUpArrow, BiLeftArrowAlt } from "react-icons/bi";
import EditQuestion from './EditQuestion';
import Constants from '../../util/Constants';
import { NotificationManager } from 'react-notifications';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { AiOutlineSave } from 'react-icons/ai';

const ManageQuestions = () => {
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);
    const [questions, setQuestions] = useState<IQuestionData[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [firstAnswer, setFirstAnswer] = useState("");
    const [secondAnswer, setSecondAnswer] = useState("");
    const [theme, setTheme] = useState("Select theme");
    const [firstCategory, setFirstCategory] = useState("Select category");
    const [secondCategory, setSecondCategory] = useState("Select category");
    const [showQuestions, setShowQuestions] = useState<boolean>(false);
    const [dropdownCategories, setDropdownCategories] = useState(Constants.categories)
    const [disableDropdown, setDisableDropdown] = useState<boolean>(true)

    useEffect(() => {
        AdminApi.getAllQuestions(accessToken)
            .then((response: any) => {
                setQuestions(response.data)
                console.log(response.data)
            })
            .catch((e: Error) => {
                console.log(e)
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    }, [accessToken])


    const getOppositeCategory = (category: string) => {
        switch (category) {
            case Constants.CATEGORY1:
                return Constants.CATEGORY2
            case Constants.CATEGORY2:
                return Constants.CATEGORY1
            case Constants.CATEGORY3:
                return Constants.CATEGORY4
            case Constants.CATEGORY4:
                return Constants.CATEGORY3
            default:
                return ""
        }
    }

    const addQuestion = () => {
        if (questionText !== "" && firstAnswer !== "" && secondAnswer !== ""
            && (theme !== "" && theme !== 'Select theme') && (firstCategory !== "" && firstCategory !== 'Select category')
            && secondCategory !== "") {
            const questionToCreate: IQuestionData = {
                questionText: questionText,
                questionNumber: -1,
                time: 10,
                theme: theme,
                answers: [{
                    answerText: firstAnswer,
                    firstCategory: firstCategory,
                    secondCategory: secondCategory
                }, {
                    answerText: secondAnswer,
                    firstCategory: getOppositeCategory(firstCategory),
                    secondCategory: getOppositeCategory(secondCategory)
                }],
            };

            AdminApi.addQuestion(questionToCreate, accessToken)
                .then((response: any) => {
                    setQuestions([...questions, response.data])
                    setQuestionText("")
                    setFirstAnswer("")
                    setSecondAnswer("")
                    setTheme("Select theme")
                    setFirstCategory("Select category")
                    setSecondCategory("Select category")
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

    const handleThemeSelect = (event: any) => {
        setTheme(event.target.value);
    };

    const setSecondDropdown = (selectedCategory: string) => {
        setDropdownCategories(Constants.categories.filter(c => (c.value !== selectedCategory
            && c.value !== getOppositeCategory(selectedCategory))))
        setDisableDropdown(false)
    }
    const handleFirstCategorySelect = (event: any) => {
        setSecondDropdown(event.target.value)
        setFirstCategory(event.target.value)
        setSecondCategory("Select category")

    };

    const handleSecondCategorySelect = (event: any) => {
        setSecondCategory(event.target.value)
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
                                maxLength={500} />
                        </div>
                    </div>

                    <div className="questions__line question__select-line">
                        <select className="questions__dropdown questions_w100" value={theme} onChange={handleThemeSelect}>
                            {Constants.themes.map((option, index) => (
                                <option key={option.value + index} value={option.value} disabled={option.disabled}>{option.label}</option>
                            ))}
                        </select>
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

                    <div className="questions__line question__select-line">
                        <select className="questions__dropdown questions_w50" value={firstCategory} onChange={handleFirstCategorySelect}>
                            {Constants.categories.map((option, index) => (
                                <option key={option.value + index} value={option.value} disabled={option.disabled}>{option.label}</option>
                            ))}
                        </select>
                        <select className="questions__dropdown questions_w50" value={secondCategory} onChange={handleSecondCategorySelect}
                            disabled={disableDropdown}>
                            {dropdownCategories.map((option, index) => (
                                <option key={option.value + index} value={option.value} disabled={option.disabled}>{option.label}</option>
                            ))}
                        </select>
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
                            onClick={addQuestion} >
                            <AiOutlineSave size={30} /><br></br>
                            {Constants.SAVE_BUTTON.toUpperCase()}</div>
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