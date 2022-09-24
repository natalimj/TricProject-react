import WebSocketComponent from "./WebSocketComponent";
import './MainPage.css';
import Question from "./Question";
import Result from "./Result";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { RootState } from '../app/store';
import {
  setComponent
} from '../reducers/componentSlice';

const MainPage = () => {

  const dispatch = useAppDispatch();
  const showQuestion: boolean = useAppSelector((state: RootState) => state.component.value);

  const onMessageReceived = () => {
    dispatch(setComponent(false))
  }

  return (
    <div className="main-page">
      <WebSocketComponent topics={['/topic/result']} onMessage={() => onMessageReceived()} />
      {showQuestion ? (
        <div className="main-page-question"><Question /></div>
      ) : (
        <div className="main-page-result"><Result /></div>
      )
      }
    </div>
  );
}

export default MainPage