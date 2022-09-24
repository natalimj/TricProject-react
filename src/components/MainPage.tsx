import WebSocketComponent from "./WebSocketComponent";
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
    <div>
      <WebSocketComponent topics={['/topic/result']} onMessage={() => onMessageReceived()} />
      {showQuestion ? (
        <div><Question /></div>
      ) : (
        <div><Result /></div>
      )
      }
    </div>
  );
}

export default MainPage