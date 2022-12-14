import React, { ChangeEvent, useState } from 'react'
import { AiOutlineDelete, AiOutlineSave } from "react-icons/ai";
import AdminApi from '../../api/AdminApi';
import IQuestionData from '../../models/Question'
import { NotificationManager } from 'react-notifications';
import { useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import Constants from '../../util/Constants';

/**
 * Component for editing a question.
 * Question text, question theme, answer text, answer category can be edited using this component.
 *
 * @ author Natali Munk-Jakobsen
 */

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
        theme: question.theme,
        firstCategory: question.answers[0].firstCategory,
        secondCategory: question.answers[0].secondCategory
    });
    const { questionText, firstAnswer, secondAnswer, theme, firstCategory, secondCategory } = formValue;
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);
    const [dropdownCategories, setDropdownCategories] = useState(Constants.categories)
    const [disableDropdown, setDisableDropdown] = useState<boolean>(true)
    const [splicedQuestion, setSplicedQuestion] = useState(question.questionText.split(".").slice(-1)[0]?.trim())

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
        setSplicedQuestion(value.split(".").slice(-1)[0]?.trim());
    };

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

    const deleteQuestion = (questionId: any) => {
        AdminApi.deleteQuestion(questionId, accessToken)
            .then(() => {
                setQuestions(questions.filter(question => question.questionId !== questionId))
                NotificationManager.success('Question has been deleted', 'Success!', 2000);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
                console.log(e);
            });
    }

    const editQuestion = () => {
        if (questionText !== "" && firstAnswer !== "" && secondAnswer !== ""
            && (theme !== "" && theme !== 'Select theme') && (firstCategory !== "" && firstCategory !== 'Select category')
            && secondCategory !== "") {
            const questionToEdit: IQuestionData = {
                questionText: questionText,
                questionId: question.questionId,
                questionNumber: question.questionNumber,
                time: 10,
                theme: theme,
                answers: [{
                    answerId: question.answers[0].answerId,
                    answerText: firstAnswer,
                    firstCategory: firstCategory,
                    secondCategory: secondCategory
                }, {
                    answerId: question.answers[1].answerId,
                    answerText: secondAnswer,
                    firstCategory: getOppositeCategory(firstCategory),
                    secondCategory: getOppositeCategory(secondCategory)
                }],
            };

            AdminApi.editQuestion(questionToEdit, accessToken)
                .then(() => {
                    NotificationManager.success('Question has been edited', 'Success!', 2000);
                })
                .catch((e: Error) => {
                    NotificationManager.error(e.message, 'Error!', 5000);
                });
        } else {
            NotificationManager.warning('Please fill all required fields ', 'Warning!', 2000);
        }
    }

    const handleThemeSelect = (event: any) => {
        console.log(event.target.value)
        setFormValue((prevState) => {
            return {
                ...prevState,
                theme: event.target.value,
            };
        });
    }

    const setSecondDropdown = (selectedCategory: string) => {
        setDropdownCategories(Constants.categories.filter(c => (c.value !== selectedCategory
            && c.value !== getOppositeCategory(selectedCategory))))
        setDisableDropdown(false)
    }

    const handleFirstCategorySelect = (event: any) => {
        setSecondDropdown(event.target.value)
        setFormValue((prevState) => {
            return {
                ...prevState,
                firstCategory: event.target.value,
            };
        });

    }

    const handleSecondCategorySelect = (event: any) => {
        setFormValue((prevState) => {
            return {
                ...prevState,
                secondCategory: event.target.value
            };
        });
    }

    return (
        <div key={question.questionId} e2e-id={"questionNr" + question.questionNumber}>
            <div className="questions__box">
                <div className="questions__line">
                    <div className="questions__input">
                        <input type="text"
                            onChange={handleChange}
                            className='questions__text'
                            e2e-id={"question" + question.questionNumber + "EditText"}
                            defaultValue={question.questionText}
                            name="questionText"
                            maxLength={500} />
                    </div>
                </div>
                <div className="questions__line">
                    <div className="questions__input question__short-form">
                        <span>
                            {Constants.SHORT_FORM_QUESTION_FIELD}
                        </span>
                        <span className="question__short-form--text">{splicedQuestion}</span>
                    </div>
                </div>
                <div className="questions__line questions__text-thin question__select-line">
                    <select className="questions__dropdown questions_w100  questions__text-thin" value={theme} onChange={handleThemeSelect}>
                        {Constants.themes.map((option, index) => (
                            <option key={option.value + index} value={option.value} disabled={option.disabled}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="questions__line questions__text-thin">
                    <div className="questions__input-medium">
                        <input type="text"
                            onChange={handleChange}
                            className='questions__text questions__text-thin'
                            e2e-id={"question" + question.questionNumber + "EditAnswer1"}
                            defaultValue={question.answers[0].answerText}
                            name="firstAnswer"
                            maxLength={50} />
                    </div>
                </div>
                <div className="questions__line question__select-line">
                    <select className="questions__dropdown questions_w50 questions__text-thin" value={(firstCategory !== null || firstCategory !== "") ? firstCategory : "Select category"} onChange={handleFirstCategorySelect}>
                        {Constants.categories.map((option, index) => (
                            <option key={option.value + index} value={option.value} disabled={option.disabled}>{option.label}</option>
                        ))}
                    </select>
                    <select className="questions__dropdown questions_w50 questions__text-thin"
                        value={(secondCategory !== null || secondCategory !== "") ? secondCategory : "Select category"}
                        onChange={handleSecondCategorySelect}
                        disabled={disableDropdown}>
                        {dropdownCategories.map((option, index) => (
                            <option key={option.value + index} value={option.value} disabled={option.disabled}>{option.label}</option>
                        ))}
                    </select>
                </div>
                <div className="questions__line">
                    <div className="questions__input">
                        <input type="text"
                            className="questions__text  questions__text-thin"
                            onChange={handleChange}
                            e2e-id={"question" + question.questionNumber + "EditAnswer2"}
                            defaultValue={question.answers[1].answerText}
                            name="secondAnswer"
                            maxLength={50} />
                    </div>
                </div>
                <div className="questions__line question__select-line">
                    <select className="questions__dropdown questions_w50 questions__text-thin select__no-arrow " disabled={true}>
                        <option value={getOppositeCategory(formValue.firstCategory)}>{getOppositeCategory(formValue.firstCategory)}</option>
                    </select>
                    <select className="questions__dropdown questions_w50 questions__text-thin select__no-arrow " disabled={true}>
                        <option value={getOppositeCategory(formValue.secondCategory)}>{getOppositeCategory(formValue.secondCategory)}</option>
                    </select>
                    <div className="questions__icon" e2e-id={"question" + question.questionNumber + "EditSave"} onClick={() => editQuestion()} ><AiOutlineSave size={30} /><br></br><span className="questions__icon-hide">{Constants.SAVE_BUTTON.toUpperCase()}</span></div>
                    <div className="questions__icon" e2e-id={"question" + question.questionNumber + "EditDelete"} onClick={() => deleteQuestion(question.questionId)}><AiOutlineDelete size={30} /><br></br><span className="questions__icon-hide">{Constants.DELETE_BUTTON.toUpperCase()}</span></div>
                </div>
            </div>
        </div>
    )
}

export default EditQuestion