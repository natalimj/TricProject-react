import React, {useEffect} from 'react';
import '../style/InactiveHomepage.css';
import Constants from '../util/Constants';
import { useAppDispatch } from '../app/hooks';
import { setQuestionComponent, setUserSubmitted } from '../reducers/componentSlice';
import { removeUser } from "../reducers/userSlice";

const InactiveHomepage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUserSubmitted(false));
    dispatch(setQuestionComponent(false));
    dispatch(removeUser());
  }, [dispatch])

return (
  <div className='innactive-container'>
    <div className='innactive-container__text'>
      {Constants.NO_ACTIVE_PLAY}
    </div>
    <div className='innactive-container__text'>
      {Constants.MORE_INFO_TEXT}
    </div>
    <div className='innactive-container__link'>
      <a href={Constants.MORE_INFO_LINK} target="_blank">{Constants.HUMANLAB}</a>
    </div>
  </div>
)
}

export default InactiveHomepage