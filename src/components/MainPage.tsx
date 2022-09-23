import { useState } from "react";
import WebSocketComponent from "./WebSocketComponent";
import Question from "./Question";
import Result from "./Result";

const MainPage = () => {

  const [showResult, setShowResult] = useState<boolean>(false);

  return (
    <div>
      <WebSocketComponent topics={['/topic/question']} onMessage={()=>setShowResult(false)} />
      <WebSocketComponent topics={['/topic/result']} onMessage={()=>setShowResult(true)} />
      {showResult ? (<Result />) : (<Question />)}
    </div>
  );
}

export default MainPage