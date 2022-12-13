import React from 'react';
import SockJsClient from 'react-stomp';
import Constants from "../util/Constants";

/**
 * Component for receving Websocket message from the server.
 * Topic name and url are given as props.
 *
 * @ author Natali Munk-Jakobsen 
 */
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