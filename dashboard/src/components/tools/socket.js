// socket.js

import { io } from 'socket.io-client';
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
    "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
    "transports" : ["websocket"]
};

const ENDPOINT = 'http://localhost:5000'; // Replace with your backend URL
const socket = io(ENDPOINT,connectionOptions);

export default socket;
