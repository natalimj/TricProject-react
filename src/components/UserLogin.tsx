import React, { useState, ChangeEvent } from 'react';
import '../style/UserLogin.css'
import UserApi from '../api/UserApi';
import Constants from '../util/Constants';
import IUserData from '../models/User';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import { addUser } from '../reducers/userSlice';
import { setUserSubmitted } from '../reducers/componentSlice';

const UserLoginPage = () => {
    const currentUser: IUserData = {
        userId: useAppSelector((state: RootState) => state.user.userId),
        username: useAppSelector((state: RootState) => state.user.username),
        imagePath: useAppSelector((state: RootState) => state.user.imagePath)
    }
    const [user, setUser] = useState<IUserData>(currentUser);
    const dispatch = useAppDispatch();
    const [currentListIndex, setCurrentListIndex] = useState<number>(0);
    const imageList = ['imageFemale1', 'imageFemale2', 'imageMale1', 'imageMale2', 'imageMale3', 'imageMale4'];

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const saveUser = () => {
        if (user.username !== '') {
            user.imagePath = imageList[currentListIndex];
            UserApi.createUser(user)
                .then((response: any) => {
                    dispatch(setUserSubmitted(true));  // hide user page - show waiting page
                    dispatch(addUser(response.data));
                })
                .catch((e: Error) => {
                    console.log(e);
                });
        }
    };

    const goLeft = () => {
        setCurrentListIndex(currentListIndex - 1);
    }

    const goRight = () => {
        setCurrentListIndex(currentListIndex + 1);
    }

    return (
        <div className="user-form">
            <div className="user-form__header">
                {currentUser.username === '' ? Constants.CREATE_USER_FIELD : Constants.LOGIN_USER_FIELD}
            </div>
            <div className="user-form__form-group">
                <div className="user-form__header user-form--username">
                    {Constants.USERNAME_FIELD}
                    <input
                        type="text"
                        className="user-form__form-control"
                        id="username"
                        required
                        value={user.username}
                        onChange={handleInputChange}
                        name="username"
                    />
                </div>
            </div>
            <div className="user-form__avatar-container">
                <div className='user-form_avatar-header'>
                    {Constants.AVATAR_FIELD}
                </div>
                <div className='user-form__avatar-selector'>
                    {(currentListIndex > 0) ?
                        (<div className='user-form__avatar-selector-item'>
                            <div className='user-form--user-arrow' onClick={goLeft}><FaArrowLeft size={30} /></div></div>)
                        : <div className='user-form__avatar-selector-item'></div>}

                    <div className='user-form__avatar-selector-item user-form--avatar-image'>
                        <img src={require('../util/icons/' + imageList[currentListIndex] + '.jpg')} alt="user icon" />
                    </div>

                    {(currentListIndex < (imageList.length - 1)) ?
                        (<div className='user-form__avatar-selector-item'>
                            <div className='user-form--user-arrow' onClick={goRight}><FaArrowRight size={30} /></div></div>)
                        : <div className='user-form__avatar-selector-item'></div>}
                </div>
            </div>
            <button onClick={saveUser} className="submit-button">
                {Constants.SUBMIT_BUTTON}
            </button>
        </div>
    )
}

export default UserLoginPage