import React, { ChangeEvent, useEffect, useState } from 'react'
import UserApi from '../api/UserApi';
import IContributorData from '../models/Contributor';
import { NotificationManager } from 'react-notifications';
import Constants from '../util/Constants';
import EditContributor from './EditContributor';
import AdminApi from '../api/AdminApi';
import IPlayInfoData from '../models/PlayInfo';
import { BiLeftArrowAlt } from 'react-icons/bi';

const PlayInfo = () => {
  const initialContributor = {
    name: "",
    description: "",
    type: "Cast"
  };

  const initialPlayInfo = {
    playInfoId: 1,
    playInfoText: ""
  };

  const [contributors, setContributors] = useState<IContributorData[]>([]);
  const [contributor, setContributor] = useState(initialContributor);
  const [playInfo, setPlayInfo] = useState<IPlayInfoData>(initialPlayInfo);

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

  const handlePlayInfoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPlayInfo({
      ...playInfo,
      [event.target.name]: value
    });
  }

  const editPlayInfo = () => {
    AdminApi.editPlayInfo(playInfo)
      .then((response: any) => {
        NotificationManager.success('Play Info has been saved', 'Success!', 2000);
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  };

  const goToAdminPage = () => {
    window.location.href = "/admin";
  };



  const addContributor = () => {
    if (contributor.name !== "" && contributor.description !== "") {
      AdminApi.addContributor(contributor)
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
      <div className="questions__box">
        <div className="questions__line">
          <div className="questions__input">
            <input type="text"
              value={playInfo.playInfoText}
              className="questions__text"
              name="playInfoText"
              placeholder="Enter play Info"
              maxLength={500}
              onChange={handlePlayInfoChange} />
          </div>
          <div className="questions__icon"
            onClick={() => editPlayInfo()} >{Constants.SAVE_BUTTON.toUpperCase()}</div>
        </div>
      </div>
      <div className='questions__header'>
        {Constants.NEW_CAST_TITLE}
      </div>
      <div className="questions__box">
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
          <div className="questions__icon"
            onClick={addContributor} >{Constants.SAVE_BUTTON.toUpperCase()}</div>
        </div>
      </div>
      <div className='questions__header'>
        {Constants.CAST_LIST_TITLE}    
      </div>
      {contributors && contributors.map((contr) => (
        <EditContributor key={contr.contributorId}
          contributorToEdit={contr} contributors={contributors} setContributors={setContributors} />
      ))}
      <div className='questions__back-button' onClick={goToAdminPage}>
        <BiLeftArrowAlt size={30} />
      </div>

    </div>
  )
}

export default PlayInfo