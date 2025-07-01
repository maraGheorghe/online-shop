package org.example.kafka.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.OrderKafkaDto;
import org.example.dto.OrderUpdatedKafkaDto;
import org.example.model.Customer;
import org.example.model.Order;
import org.example.model.OrderStatus;
import org.example.model.Product;
import org.example.service.OrderService;
import org.example.websocket.service.WebSocketOrderNotifier;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderKafkaListener {

    private final OrderService orderService;
    private final WebSocketOrderNotifier webSocketOrderNotifier;

    @KafkaListener(
            topics = "${topic.name.order-updated}",
            groupId = "order-api-group"
    )
    public void listen(OrderUpdatedKafkaDto dto) {
        log.info("Received order from Kafka: {}", dto.id());
        orderService.updateOrderStatus(dto.id(), dto.newStatus());
        webSocketOrderNotifier.sendOrderNotification();
    }
}

