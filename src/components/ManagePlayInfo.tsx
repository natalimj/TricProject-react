import React, { ChangeEvent, useEffect, useState } from 'react'
import UserApi from '../api/UserApi';
import IContributorData from '../models/Contributor';
import { NotificationManager } from 'react-notifications';
import Constants from '../util/Constants';
import EditContributor from './EditContributor';
import AdminApi from '../api/AdminApi';
import IPlayInfoData from '../models/PlayInfo';
import { BiDownArrow, BiLeftArrowAlt, BiUpArrow } from 'react-icons/bi';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

const PlayInfo = () => {
  const initialContributor = {
    name: "",
    description: "",
    type: "Cast"
  };

  const initialPlayInfo = {
    playInfoId: 1,
    playInfoText: "",
    finalResultText :"",
  };

  const [contributors, setContributors] = useState<IContributorData[]>([]);
  const [contributor, setContributor] = useState(initialContributor);
  const [playInfo, setPlayInfo] = useState<IPlayInfoData>(initialPlayInfo);
  const [showCast, setShowCast] = useState<boolean>(false);
  const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);

  useEffect(() => {
    UserApi.getCast()
      .then((response: any) => {
        setContributors(response.data)
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
    UserApi.getPlayInfo()
      .then((response: any) => {
        setPlayInfo(response.data)
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  }, [])


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      event.target.style.border = "4px solid var(--color-pink)";
    } else {
      event.target.style.border = "none"
    }
    setContributor({
      ...contributor,
      [event.target.name]: value
    });
  }

  const handlePlayInfoChange = (event: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPlayInfo({
      ...playInfo,
      [name]: value
    });
  }

  const editPlayInfo = () => {
    AdminApi.editPlayInfo(playInfo, accessToken)
      .then((response: any) => {
        NotificationManager.success('Play Info has been saved', 'Success!', 2000);
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  };

  const goToAdminPage = () => {
    window.location.href = "/admin";
  };

  const showEditCast = () => {
    setShowCast(!showCast)
}


  const addContributor = () => {
    if (contributor.name !== "" && contributor.description !== "") {
      AdminApi.addContributor(contributor, accessToken)
        .then((response: any) => {
          setContributors([...contributors, response.data])
          setContributor(initialContributor)
          NotificationManager.success('A new contributor has been added', 'Success!', 2000);
        }).catch((e: Error) => {
          NotificationManager.error(e.message, 'Error!', 5000);
        });
    } else {
      NotificationManager.warning('Please fill all required fields ', 'Warning!', 2000);
    }
  };

  return (
    <div className='questions'>
      <div className='questions__header'>
        {Constants.PLAY_INFO_TITLE}
      </div>
      <div className="questions__box-small">
        <div className="questions__line">
          <div className="questions__textarea">
            <textarea
              value={playInfo.playInfoText}
              className="questions__text scroll"
              name="playInfoText"
              placeholder="Enter play Info"
              maxLength={700}
              onChange={handlePlayInfoChange} />
          </div>
          <div className="questions__icon-textarea questions__icon question__save-button"
            onClick={() => editPlayInfo()} >{Constants.SAVE_BUTTON.toUpperCase()}</div>
        </div>
      </div>

      <div className='questions__header'>
        {Constants.FINAL_RESULT_TEXT}
      </div>
      <div className="questions__box-small">
        <div className="questions__line">
          <div className="questions__input">
          <input type="text"
              value={playInfo.finalResultText}
              className="questions__text"
              name="finalResultText"
              maxLength={500}
              onChange={handlePlayInfoChange} />
          </div>
          <div className="questions__icon question__save-button"
            onClick={() => editPlayInfo()} >{Constants.SAVE_BUTTON.toUpperCase()}</div>
        </div>
      </div>


      <div className='questions__header'>
        {Constants.NEW_CAST_TITLE}
      </div>
      <div className="questions__box-small">
        <div className="questions__line">
          <div className="questions__input">
            <input type="text"
              value={contributor.name}
              className="questions__text"
              name="name"
              placeholder="Enter name"
              maxLength={30}
              onChange={handleChange} />
          </div>
        </div>
        <div className="questions__line">
          <div className="questions__input">
            <input type="text"
              value={contributor.description}
              className="questions__text"
              name="description"
              placeholder="Enter description"
              maxLength={40}
              onChange={handleChange} />
          </div>
          <div className="questions__icon question__save-button"
            onClick={addContributor} >{Constants.SAVE_BUTTON.toUpperCase()}</div>
        </div>
      </div>
      <div className='questions__header questions__header--accordion' onClick={() => showEditCast()}>
        {Constants.CAST_LIST_TITLE}
        <span> {showCast ? (<BiUpArrow size={30} />) : (<BiDownArrow size={30} />)}</span>
      </div>
      {showCast && <div>
        {contributors && contributors.map((contr) => (
          <EditContributor key={contr.contributorId}
            contributorToEdit={contr} contributors={contributors} setContributors={setContributors} />
        ))}
      </div>}
      <div className='questions__back-button' onClick={goToAdminPage}>
        <BiLeftArrowAlt size={30} />
      </div>

    </div>
  )
}

export default PlayInfo