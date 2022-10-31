import React, {useEffect} from 'react';
import '../style/InactiveHomepage.css';
import Constants from '../util/Constants';
import { useAppDispatch } from '../app/hooks';
import { setQuestionComponent, setUserJoined } from '../reducers/componentSlice';
import { removeUser } from "../reducers/userSlice";
import { removeUserResults } from "../reducers/userResultSlice";

const InactiveHomepage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUserJoined(false));
    dispatch(setQuestionComponent(false));
    dispatch(removeUser());
    dispatch(removeUserResults())
  }, [dispatch])

return (
  <div className='innactive-container'>
    <div className='innactive-container__text' e2e-id="inactive">
      {Constants.NO_ACTIVE_PLAY}
    </div>
    <div className='innactive-container__text'>
      {Constants.MORE_INFO_TEXT}
    </div>
    <div className='innactive-container__link'>
      <a href={Constants.MORE_INFO_LINK} target="_blank" rel="noreferrer" >{Constants.HUMANLAB}</a>
    </div>
  </div>
)
}

export default InactiveHomepage