import React from 'react';
import SockJsClient from 'react-stomp';
import Constants from "../util/Constants";

type WebSocketProps = { topics: string[]; onMessage: any };
const WebSocketComponent = ({ topics, onMessage }: WebSocketProps) => {
  return (
    <div>
      <SockJsClient
        url={Constants.SOCKET_URL}
        topics={topics}
        onConnect={console.log("Connected!")}
        onDisconnect={console.log("Disconnected!")}
        onMessage={onMessage}
        debug={false}
      />
    </div>
  )
}

export default WebSocketComponent