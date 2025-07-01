import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import SockJS from 'sockjs-client/dist/sockjs';

type Props = {
    onOrderUpdated?: (userEmail: string) => void;
    userEmail?: string;
};

export default function OrderSocketListener({ onOrderUpdated = () => {}, userEmail = "" }: Props) {
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const socket = new SockJS(`${apiUrl}/ws/orders`);

        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected');
                stompClient.subscribe('/ws/orders', (message) => {
                    console.log('Order status updated:', message.body);
                    toast.success('Order status updated!');
                    onOrderUpdated(userEmail);
                });
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [onOrderUpdated]);

    return null;
}
