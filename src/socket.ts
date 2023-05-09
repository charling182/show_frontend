import io from 'socket.io-client';

const socketUrl = 'http://127.0.0.1:7001';
const socket = io(socketUrl, {
    autoConnect: false, // 避免在导入时立即连接
    transports: ['websocket'],
});

export default socket;
