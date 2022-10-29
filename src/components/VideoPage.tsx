import '../style/VideoPage.css';
import Constants from '../util/Constants';

const VideoPage = () => {
    return (
        <div className="video__container">
            <div className='video__header'>{Constants.WHAT_IS_TRIC}</div>
            <iframe width="70%" height="70%" src="https://www.youtube.com/embed/xNRJwmlRBNU" title="YouTube video player"
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
    )
}

export default VideoPage;