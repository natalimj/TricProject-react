import React, { useEffect, useState } from 'react';
import WebSocketComponent from './WebSocketComponent';
import AdminApi from '../api/AdminApi';
import IQuestionData from '../models/Question';
import Constants from '../util/Constants';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setStatus } from '../reducers/statusSlice';
import { logoutAdmin } from '../reducers/adminSlice';
import { addQuestion, emptyQuestion } from '../reducers/questionSlice';
import { setNumberOfQuestions, setNumberOfUsers, setShowQuestionButton, setQuestionTimer } from '../reducers/playDataSlice';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import UserApi from '../api/UserApi';
import { RootState } from '../app/store';
import * as MailComposer from 'expo-mail-composer';

const AdminConsole = () => {

    const dispatch = useAppDispatch();
    const numberOfUsers: number = useAppSelector((state: RootState) => state.playData.numberOfUsers);
    const numberOfQuestions: number = useAppSelector((state: RootState) => state.playData.numberOfQuestions);
    const question: IQuestionData = useAppSelector((state: RootState) => state.question);
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);
    const showQuestionButton = useAppSelector((state: RootState) => state.playData.showQuestionButton);
    const questionTimer = useAppSelector((state: RootState) => state.playData.questionTimer);

    const [showedFinalResult, setShowedFinalResult] = useState<boolean>(false);
    const maxTimeValue: number = 1800;
    const minTimeValue: number = 1;

    const getQuestion = (questionNo: number) => {
        AdminApi.getQuestionByNumber(questionNo, accessToken)
            .then((response: any) => {
                dispatch(addQuestion(response.data));
                dispatch(setShowQuestionButton(true));
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    const onMessageReceived = (msg: number) => {
        dispatch(setNumberOfUsers(msg));
    }

    const showQuestion = () => {
        AdminApi.addQuestionTime(question.questionId, question.time ?? 30, accessToken)
            .then((response: any) => {
                dispatch(addQuestion(response.data));
            })
            .then(() => {
                AdminApi.showQuestion(question.questionNumber, accessToken)
                    .then(() => {
                        dispatch(setQuestionTimer(question.time));
                        dispatch(setShowQuestionButton(false));
                        NotificationManager.info('Question ' + question.questionNumber + ' on screen', 'Info!', 2000);
                    })
                    .catch((e: Error) => {
                        NotificationManager.error(e.message, 'Error!', 5000);
                    });
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    }

    const handleTimeChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault()
        let time: number;
        if (e.currentTarget.value !== "") {
            time = parseInt(e.currentTarget.value)
            if (time) {
                if (time > maxTimeValue) {
                    time = maxTimeValue;
                }
                if (time < minTimeValue) {
                    time = minTimeValue;
                }
                dispatch(addQuestion({ ...question, time: time }));
            } else {
                dispatch(addQuestion({ ...question, time: NaN }));
            }
        } else {
            dispatch(addQuestion({ ...question, time: NaN }));
        }
    }

    const endSession = () => {
        AdminApi.endSession(accessToken)
            .then((response: any) => {
                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                    JSON.stringify(response.data)
                )}`;
                const link = document.createElement("a");
                link.href = jsonString;
                link.download = "ResultData.json";
                link.click();
                MailComposer.composeAsync({
                    subject: "Play Vote Data",
                    body: "Please attach the downloaded data called ResultData.json",
                    recipients: ["lorem_ipsum@gmail.com"]
                })
                NotificationManager.info('User data has been deleted', 'Info!', 2000);
            }).then(() => {
                dispatch(setStatus(false));
                dispatch(logoutAdmin());
                dispatch(emptyQuestion());
                dispatch(setNumberOfQuestions(0));
                dispatch(setNumberOfUsers(0));
                dispatch(setQuestionTimer(-1));
                setShowedFinalResult(false);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    const showResult = () => {
        UserApi.showResult(question.questionId)
            .then((response: any) => {
                dispatch(setQuestionTimer(-1));
                getQuestion(response.data.question.questionNumber + 1);
                NotificationManager.info('Result ' + response.data.question.questionNumber + ' on screen', 'Info!', 2000);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    const showFinalResult = () => {
        AdminApi.showFinalResult(accessToken)
            .then(() => {
                if (question.questionNumber !== 0) {
                    NotificationManager.info('Final Result on screen', 'Info!', 2000);
                    dispatch(setQuestionTimer(-1));
                    setShowedFinalResult(true);
                }
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    useEffect(() => {
        if (!showQuestionButton && !showedFinalResult) {
            if (questionTimer > 0) {
                setTimeout(() => {
                    dispatch(setQuestionTimer(questionTimer - 1));
                }, 1000);
            } else if (questionTimer === 0 && numberOfQuestions !== 0) {
                question.questionNumber !== numberOfQuestions ? showResult() : showFinalResult();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionTimer]);

    useEffect(() => {
        if (numberOfQuestions === 0) {
            AdminApi.getNumberOfQuestions(accessToken)
                .then((response: any) => {
                    dispatch(setNumberOfQuestions(response.data));
                    getQuestion(1);
                })
                .catch((e: Error) => {
                    NotificationManager.error(e.message, 'Error!', 5000);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberOfQuestions, accessToken])

    return (
        <>
            <WebSocketComponent topics={['/topic/message']} onMessage={(msg: number) => onMessageReceived(msg)} />
            {(question.questionNumber > 0) ? (
                <div className='admin-console__body admin-console__body--active' id={showQuestionButton ? '' : 'admin-console__body--result'}>
                    <div className='admin-console__text'>
                        {Constants.ONLINE_USERS} {numberOfUsers}
                        {question.questionNumber !== 1 && showQuestionButton ? (
                            <div className='admin-console__text'>{Constants.RESULT_FIELD} {question.questionNumber - 1} {Constants.ON_SCREEN_FIELD}</div>
                        ) : null}
                    </div>
                    {showQuestionButton ?
                        (
                            <>
                                <div className='admin-console__buttons'>
                                    <div className='admin-console__next-question-text'>
                                        <div className='admin-console__text admin-console__text--medium'>
                                            {Constants.NEXT_QUESTION_TEXT}
                                        </div>
                                        {question.questionNumber}. {question.questionText}
                                    </div>
                                    <div className='admin-console__edit-time'>
                                        <div className='admin-console__text admin-console__text--medium'>
                                            {Constants.TIME_FOR} {question.questionNumber}:
                                        </div>
                                        <input type="text"
                                            pattern='[0-9]{2}'
                                            name="time"
                                            value={question.time || ''}
                                            e2e-id="timerField"
                                            onChange={(e) => handleTimeChange(e)}
                                            className="admin-console__input"
                                            maxLength={5} />
                                    </div>
                                    <button onClick={() => showQuestion()} className="admin-console__submit-button--secondary" e2e-id="showQuestion">
                                        {Constants.QUESTION_BUTTON} {question.questionNumber}
                                    </button>
                                </div>
                                <div className='admin-console__text admin-console__text--helper'>
                                    {Constants.SET_TIME_INFO}
                                    <div>
                                        {Constants.TIME_LENGTH_INFO}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='admin-console__buttons admin-console__buttons--result'>
                                {(questionTimer > 0 && !showedFinalResult) ? (
                                    <>
                                        <div className='admin-console__text'>{Constants.QUESTION_FIELD} {question.questionNumber} {Constants.ON_SCREEN_FIELD}</div>
                                        <div className='admin-console__text'> {questionTimer} {Constants.TIME_REMANING}</div>
                                    </>
                                ) : null}
                                {question.questionNumber < numberOfQuestions ? (
                                    <button onClick={() => showResult()} className="admin-console__submit-button--secondary" e2e-id="showResults">
                                        {Constants.RESULT_BUTTON} {question.questionNumber}
                                    </button>
                                ) : (
                                    <>
                                        {(questionTimer > 0 && !showedFinalResult) ? (
                                            <button onClick={showFinalResult} className="admin-console__submit-button--secondary" e2e-id="showFinalResult">
                                                {Constants.FINAL_RESULT_BUTTON}
                                            </button>
                                        ) : (
                                            <>
                                                <div className='admin-console__text'>{Constants.FINAL_VOTE_RESULT_FIELD} {Constants.ON_SCREEN_FIELD}</div>
                                                <button onClick={endSession} className="admin-console__submit-button" e2e-id="endSession">
                                                    {Constants.END_BUTTON}
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )
                    }
                </div>
            ) : null}
        </>
    )
}
export default AdminConsole;