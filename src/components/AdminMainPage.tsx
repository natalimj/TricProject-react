import React, {useEffect} from 'react';
import '../style/AdminMainPage.css';
import AdminApi from '../api/AdminApi';
import Constants from '../util/Constants';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setStatus } from '../reducers/statusSlice';
import { RootState } from '../app/store';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import AdminConsole from './AdminConsole';
import UserApi from '../api/UserApi';

const Admin = () => {
  const isActive = useAppSelector((state: RootState) => state.status.isActive);
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);

  const activateApp = () => {
    AdminApi.activateApp(accessToken)
      .then(() => {
        dispatch(setStatus({ isActive: true }))
      })
      .catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  };

  const editQuestions = () => {
    window.location.href = "/admin/questions";
  };

  const editContributors = () => {
    window.location.href = "/admin/playInfo";
  };

  useEffect(() => {
    UserApi.getAppStatus()
      .then((response: any) => {
        dispatch(setStatus({ isActive: response.data }))
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }, [dispatch])

  return (
    <>
      <div className='admin-console'>
        <div className='admin-console__header'>
          {Constants.ADMIN_TITLE}
        </div>
        {!isActive ?
          (
            <div className='admin-console__body'>
              <div className='admin-console__logo'></div>
              <div className='admin-console__buttons'>
                <button onClick={editContributors} className="admin-console__submit-button--secondary">
                  {Constants.EDIT_CONTRIBUTORS}
                </button>
                <button onClick={editQuestions} className="admin-console__submit-button--secondary">
                  {Constants.EDIT_QUESTIONS}
                </button>
                <button onClick={activateApp} className="admin-console__submit-button" e2e-id="start">
                  {Constants.START_BUTTON}
                </button>
              </div>
            </div>
          ) : (
            <AdminConsole />
          )
        }
      </div >
    </>
  )
}

export default Admin