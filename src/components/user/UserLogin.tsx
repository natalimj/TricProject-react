import React, { useState, ChangeEvent, useEffect } from 'react';
import '../style/UserLogin.css'
import UserApi from '../../api/UserApi';
import Constants from '../../util/Constants';
import IUserData from '../../models/User';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import { loginUser } from '../../reducers/userSlice';
import { setUserJoined } from '../../reducers/componentSlice';

const UserLoginPage = () => {
    const dispatch = useAppDispatch();
    const currentUser: IUserData = useAppSelector((state: RootState) => state.user);
    const [user, setUser] = useState<IUserData>(currentUser);
    const [currentListIndex, setCurrentListIndex] = useState<number>(0);
    const imageList = ['imageFemale1', 'imageFemale2', 'imageFemale3', 'imageMale2', 'imageMale3', 'imageMale4'];
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const cacheImages = async (srcArray) => {
        const promises = await srcArray.map((src) => {
            return new Promise(function (resolve, reject) {
                const img = new Image();
                img.src = src;

            });
        });
        await Promise.all(promises);
        setIsLoading(false);
    };


    useEffect(() => {
        const imgs = [
            '../../util/icons/imageFemale1.png',
            '../../util/icons/imageFemale2.png',
            '../../util/icons/imageFemale3.png',
            '../../util/icons/imageMale2.png',
            '../../util/icons/imageMale3.png',
            '../../util/icons/imageMale4.png'
        ]

        cacheImages(imgs);
    }, []);


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value });
    };

    const saveUser = () => {
        if (user.username !== '') {
            user.imagePath = imageList[currentListIndex];
            UserApi.createUser(user)
                .then((response: any) => {
                    dispatch(setUserJoined(true));  // hide user page - show waiting page
                    dispatch(loginUser(response.data));
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
                        e2e-id="usernameUser"
                        required
                        value={user.username}
                        onChange={handleInputChange}
                        name="username"
                        maxLength={25}
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
                    {!isLoading ?
                        (<div className='user-form__avatar-selector-item user-form--avatar-image'>
                            <img src={require('../../util/icons/' + imageList[currentListIndex] + '.png')} alt="user icon" />
                        </div>) : (
                            <></>
                        )
                    }

                    {(currentListIndex < (imageList.length - 1)) ?
                        (<div className='user-form__avatar-selector-item'>
                            <div className='user-form--user-arrow' onClick={goRight}><FaArrowRight size={30} /></div></div>)
                        : <div className='user-form__avatar-selector-item'></div>}
                </div>
            </div>
            <button onClick={saveUser} className="submit-button" e2e-id="create">
                {Constants.SUBMIT_BUTTON}
            </button>
        </div>
    )
}

export default UserLoginPage