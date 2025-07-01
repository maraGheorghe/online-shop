import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client/dist/sockjs';

type Props = {
    onOrderReceived: () => void;
};

export default function OrderSocketListener({ onOrderReceived }: Props) {
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL;
        const socket = new SockJS(`${apiUrl}/ws/orders`);

        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected');
                stompClient.subscribe('/ws/orders', (message) => {
                    console.log('New order:', message.body);
                    toast.success('New order received!');
                    onOrderReceived();
                });
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [onOrderReceived]);

    return null;
}
