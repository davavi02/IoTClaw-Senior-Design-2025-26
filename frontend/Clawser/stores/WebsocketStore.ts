import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';


type BinaryMessage = ArrayBuffer | Uint8Array;

interface SocketStore {
    webSocket: WebSocket | null;
    isConnected: boolean;
    streamUrl: string | null;
    lastMessage: string | ArrayBuffer | null;
    lastError: string | null;

    connectToServer: (URL: string) => Promise<void>;
    disconnect: (code?: number, reason?: string) => void;

    sendTextMessage: (message: string) => void;
    sendBinaryMessage: (message: BinaryMessage) => void;
    sendBytes: (bytes: number[]) => void;
}


const useWebsocketStore = create<SocketStore>()((set, get) => ({
   webSocket: null,
   isConnected: false,
   streamUrl: null,
   lastMessage: null,
    lastError: null,
   
  connectToServer: async (URL: string) => {
    const { webSocket, isConnected } = get();

    if (isConnected || webSocket) {
      console.log('WebSocket already connected or connecting.');
      return;
    }

    try {
      const savedJwt = await SecureStore.getItemAsync('userJWT');
        console.log('connectting ws...');
      
      const socket = new (WebSocket as any)(URL, undefined, {
        headers: {
          'Authorization': `Bearer ${savedJwt}`,
        },
      });

      // This affects how binary messages RECEIVED from the server are exposed.
      // "arraybuffer" is usually easier to work with than "blob".
      socket.binaryType = 'arraybuffer';

      socket.onopen = () => {
        console.log('WebSocket connected');
        set({
          webSocket: socket,
          isConnected: true,
          lastError: null,
        });
      };

      socket.onmessage = (event) => {
        const data = event.data;

        if (typeof data === 'string') {
          console.log('Text message received:', data);
          set({ lastMessage: data });
          return;
        }

        if (data instanceof ArrayBuffer) {
          console.log('Binary message received (ArrayBuffer):', data.byteLength, 'bytes');
          set({ lastMessage: data });

          // Example: inspect received bytes
          const bytes = new Uint8Array(data);
          console.log('Received bytes:', bytes);
          return;
        }

        console.log('Unknown message type received:', data);
        set({ lastMessage: null });
      };

      socket.onerror = (event) => {
        console.log('WebSocket error:', event);
        set({ lastError: 'WebSocket error occurred' });
      };

      socket.onclose = (event) => {
        console.log('Connection closed. Code:', event.code);
        console.log('Reason closed:', event.reason);

        set({
          webSocket: null,
          isConnected: false,
          streamUrl: null,
        });
      };

      // Optional: set immediately so UI can know a socket exists while connecting.
      set({ webSocket: socket });
    }
    catch {
      console.log('errrrrrr');

      set({
        webSocket: null,
        isConnected: false,
        streamUrl: null,
      });
    }
  },
  

  disconnect: (code = 1000, reason = 'Client disconnect') => {
    const { webSocket } = get();

    if (webSocket) {
      webSocket.close(code, reason);
    }

    set({
      webSocket: null,
      isConnected: false,
    });
  },

  sendTextMessage: (message: string) => {
    const { webSocket, isConnected } = get();

    if (!isConnected || !webSocket || webSocket.readyState !== WebSocket.OPEN) {
      console.log('Cannot send text message: socket is not open.');
      return;
    }

    webSocket.send(message);
    console.log('Text message sent:', message);
  },

  sendBinaryMessage: (message: BinaryMessage) => {
    const { webSocket, isConnected } = get();

    if (!isConnected || !webSocket || webSocket.readyState !== WebSocket.OPEN) {
      console.log('Cannot send binary message: socket is not open.');
      return;
    }

    if (message instanceof Uint8Array) {
      webSocket.send(message.buffer);
      console.log('Binary message sent (Uint8Array):', message.byteLength, 'bytes');
      return;
    }

    webSocket.send(message);
    console.log('Binary message sent (ArrayBuffer):', message.byteLength, 'bytes');
  },

  sendBytes: (bytes: number[]) => {
    const uint8 = new Uint8Array(bytes);
    get().sendBinaryMessage(uint8);
  },
}));

export default useWebsocketStore;