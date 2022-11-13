import React, { useEffect, useState } from 'react';
import WebSocketComponent from '../WebSocketComponent';
import AdminApi from '../../api/AdminApi';
import IQuestionData from '../../models/Question';
import Constants from '../../util/Constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setStatus } from '../../reducers/statusSlice';
import { logoutAdmin } from '../../reducers/adminSlice';
import { addQuestion, clearQuestion } from '../../reducers/questionSlice';
import { setNumberOfQuestions, setNumberOfUsers, setShowQuestionButton, setQuestionTimer, clearPlayData, PlayData } from '../../reducers/playDataSlice';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import UserApi from '../../api/UserApi';
import { RootState } from '../../app/store';
import * as MailComposer from 'expo-mail-composer';

const AdminConsole = () => {

    const dispatch = useAppDispatch();
    const playData: PlayData = useAppSelector((state: RootState) => state.playData);
    const question: IQuestionData = useAppSelector((state: RootState) => state.question);
    const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);

    const [showedFinalResult, setShowedFinalResult] = useState<boolean>(false);
    const [questionOnScreen, setQuestionOnScreen] = useState<boolean>(true)
    const [timer, setTimer] = useState<number>(30);

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
        AdminApi.addQuestionTime(question.questionId, question.time ?? 10, accessToken)
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

    const displayQuestionForAdmin = () => {
        AdminApi.displayQuestionForAdmin(question.questionNumber, accessToken)
            .then((response: any) => {
                NotificationManager.info('Question ' + question.questionNumber + ' on admin screen', 'Info!', 2000);
                setQuestionOnScreen(false)
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

    const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        let time: number;
        if (e.currentTarget.value !== "") {
            time = parseInt(e.currentTarget.value)
            setTimer(time)
        } else {
            setTimer(0)
        }
    }

    const showResult = () => {
        UserApi.showResult(question.questionId)
            .then((response: any) => {
                dispatch(setQuestionTimer(-1));
                getQuestion(response.data.question.questionNumber + 1);
                setQuestionOnScreen(true)
                NotificationManager.info('Result ' + response.data.question.questionNumber + ' on screen', 'Info!', 2000);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    const showFinalResult = () => {
        UserApi.showResult(question.questionId)
            .then(() => AdminApi.showFinalResult(accessToken)
                .then(() => {
                    if (question.questionNumber !== 0) {
                        NotificationManager.info('Final Result on screen', 'Info!', 2000);
                        dispatch(setQuestionTimer(-1));
                        setShowedFinalResult(true);
                    }
                })
                .catch((e: Error) => {
                    NotificationManager.error(e.message, 'Error!', 5000);
                })
            ).catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    const startCountdown = () => {
        AdminApi.startCountdown(timer, accessToken)
            .then((response: any) => {
                NotificationManager.info('Countdown on screen', 'Info!', 2000);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });


    };

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
                dispatch(clearQuestion());
                dispatch(clearPlayData());
                setShowedFinalResult(false);
            })
            .catch((e: Error) => {
                NotificationManager.error(e.message, 'Error!', 5000);
            });
    };

    useEffect(() => {
        if (!playData.showQuestionButton && !showedFinalResult) {
            if (playData.questionTimer > 0) {
                setTimeout(() => {
                    dispatch(setQuestionTimer(playData.questionTimer - 1));
                }, 1000);
            } else if (playData.questionTimer === 0 && playData.numberOfQuestions !== 0) {
                question.questionNumber !== playData.numberOfQuestions ? showResult() : showFinalResult();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playData.questionTimer]);

    useEffect(() => {
        if (playData.numberOfQuestions === 0) {
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
    }, [playData.numberOfQuestions, accessToken])

    return (
        <>
            <WebSocketComponent topics={['/topic/message']} onMessage={(msg: number) => onMessageReceived(msg)} />
            {(question.questionNumber > 0) ? (
                <div className='admin-console__body admin-console__body--active' id={playData.showQuestionButton ? '' : 'admin-console__body--result'}>
                    <div className='admin-console__text'>
                        {Constants.ONLINE_USERS} {playData.numberOfUsers}
                        {question.questionNumber !== 1 && playData.showQuestionButton && questionOnScreen ? (
                            <div className='admin-console__text'>{Constants.RESULT_FIELD} {question.questionNumber - 1} {Constants.ON_SCREEN_FIELD}</div>
                        ) : null}
                    </div>
                    {playData.showQuestionButton ?
                        (
                            <>
                                <div className='admin-console__buttons'>
                                    <div className='admin-console__next-question-text'>
                                        <div className='admin-console__text admin-console__text--medium'>
                                            {Constants.NEXT_QUESTION_TEXT}
                                        </div>
                                        {question.questionNumber}. {question.questionText}
                                    </div>
                                    <div>
                                        <input type="text"
                                            pattern='[0-9]{2}'
                                            name="time"
                                            value={timer}
                                            e2e-id="playTimerField"
                                            onChange={(e) => handleTimerChange(e)}
                                            className="admin-console__input"
                                            maxLength={5} />
                                        <div>
                                            <button className='admin-console__submit-button--secondary' onClick={() => startCountdown()} e2e-id="startCountdown">
                                                {Constants.COUNTDOWN}
                                            </button>
                                        </div>
                                    </div>
                                    {questionOnScreen &&
                                        <button onClick={() => displayQuestionForAdmin()} className="admin-console__submit-button--secondary" e2e-id="showQuestionForAdmin">
                                            {Constants.DISPLAY_QUESTION}
                                        </button>
                                    }
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
                                {(playData.questionTimer > 0 && !showedFinalResult) ? (
                                    <>
                                        <div className='admin-console__text'>{Constants.QUESTION_FIELD} {question.questionNumber} {Constants.ON_SCREEN_FIELD}</div>
                                        <div className='admin-console__text'> {playData.questionTimer} {Constants.TIME_REMANING}</div>
                                    </>
                                ) : null}
                                {question.questionNumber < playData.numberOfQuestions ? (
                                    <button onClick={() => showResult()} className="admin-console__submit-button--secondary" e2e-id="showResults">
                                        {Constants.RESULT_BUTTON} {question.questionNumber}
                                    </button>
                                ) : (
                                    <>
                                        {(playData.questionTimer > 0 && !showedFinalResult) ? (
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