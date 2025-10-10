import { create } from 'zustand';

interface SocketStore {
    webSocket: WebSocket | null;
    isConnected: boolean;
    streamUrl: string | null;

    connectToServer: () => void;
    sendMessage: (message: string) => void;

}

const useWebsocketStore = create<SocketStore>()((set, get) => ({
   webSocket: null,
   isConnected: false,
   streamUrl: null,
   
   connectToServer: () => {
    const { webSocket, isConnected } = get();
    if(isConnected || webSocket) {
        return;
    }

    var socket = new WebSocket("wss://www.garlicpos.com/cab1/client?passcode=cli1122!!@@");

    socket.onopen = () => { set({ isConnected: true }) };

    socket.onmessage = (event) => { console.log("Message received: ", event.data) };

    socket.onclose = (event) => {
        console.log("Connection closed. Code: ", event.code);
        console.log("Reason closed: ", event.reason);
        set({ webSocket: null, isConnected: false }) 
    };

    socket.onerror = (event) => { console.log("Error: ")};

    set({ webSocket: socket });
    
   },

   sendMessage: (message) => {
    const { webSocket, isConnected } = get();
    if(isConnected && webSocket) {
        webSocket.send(message);
        console.log("Message sent: ", message);
    }
   },

}));


export default useWebsocketStore;