import React, {useEffect} from 'react';
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
    <div>
      {Constants.NO_ACTIVE_PLAY}
    </div>
    <div>
      {Constants.MORE_INFO_TEXT}
    </div>
    <div>
      <a href={Constants.MORE_INFO_LINK}>About HumanLab</a>
    </div>
  </div>
)
}

export default InactiveHomepage