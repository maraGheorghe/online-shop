package org.example.websocket.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketOrderNotifier {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketOrderNotifier(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendOrderNotification() {
        messagingTemplate.convertAndSend("/ws/orders", Boolean.TRUE);
    }
}

