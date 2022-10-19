import React, { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { NotificationManager } from 'react-notifications';
import UserApi from '../api/UserApi';
import IContributorData from '../models/Contributor';
import IPlayInfoData from '../models/PlayInfo';
import '../style/PlayInfo.css';
import Constants from '../util/Constants';
import FinalResult from './FinalResult';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../app/store';

const PlayInfo = () => {

  const [cast, setCast] = useState<IContributorData[]>([]);
  const [developers, setDevelopers] = useState<IContributorData[]>([]);
  const [playInfo, setPlayInfo] = useState<IPlayInfoData>();
  const [showFirstPage, setShowFirstPage] = useState<boolean>(true);
  const [showPlayInfo, setShowPlayInfo] = useState<boolean>(true);
  const accessToken = useAppSelector((state: RootState) => state.admin.accessToken);

  useEffect(() => {
    UserApi.getCast()
      .then((response: any) => {
        setCast(response.data)
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
    UserApi.getDevTeam()
      .then((response: any) => {
        setDevelopers(response.data)
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
    UserApi.getPlayInfo(accessToken)
      .then((response: any) => {
        setPlayInfo(response.data)
      }).catch((e: Error) => {
        NotificationManager.error(e.message, 'Error!', 5000);
      });
  }, [accessToken])

  return (
    <>
      {showPlayInfo && <div className="play-info">
        <div className='play-info_close-icon'>
        <AiOutlineCloseCircle size={30} onClick={() => { setShowPlayInfo(false) }} />
        </div>
        <div className="play-info__inner-container">
          {showFirstPage &&
            <div className='play-info__page'>
              <div className="play-info__header">{Constants.CAST_LIST_TITLE.toUpperCase()}
              </div>
              {cast && cast.map((c) => (
                <div key={c.contributorId}>
                <div className={cast.length>7 ? 'play-info__name-smaller-text' : 'play-info_name'}>{c.name}</div>
                <div className='play-info_description'>{c.description}</div>
                </div>
             ))}
              <BsArrowRightCircle size={30} className= 'play-info_arrow-icon' onClick={() => { setShowFirstPage(false) }} />
            </div>}

          {!showFirstPage &&
            <div className='play-info__page'>
              <div className="play-info__header">{Constants.PLAY_INFO_TITLE.toUpperCase()}</div>
              <div className='play-info_text'>{playInfo?.playInfoText}</div>
              <div className="play-info__header">{Constants.DEVELOPERS_TITLE.toUpperCase()}</div>
              {developers && developers.map((c) => (
                <div key={c.contributorId} className='play-info_description'>{c.name}</div>))}
              <BsArrowLeftCircle className= 'play-info_arrow-icon' size={30} onClick={() => { setShowFirstPage(true) }} />
            </div>}
        </div>
      </div>
      }
      {!showPlayInfo && <FinalResult />}
    </>

  )
}

export default PlayInfo