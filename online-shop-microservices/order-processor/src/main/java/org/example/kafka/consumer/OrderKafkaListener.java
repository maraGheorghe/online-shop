package org.example.kafka.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.OrderKafkaDto;
import org.example.model.Order;
import org.example.model.OrderStatus;
import org.example.model.Product;
import org.example.model.Customer;
import org.example.repository.CustomerRepository;
import org.example.repository.OrderRepository;
import org.example.repository.ProductRepository;
import org.example.service.OrderService;
import org.example.websocket.service.WebSocketOrderNotifier;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderKafkaListener {

    private final OrderService orderService;
    private final WebSocketOrderNotifier webSocketOrderNotifier;

    @KafkaListener(
            topics = "${topic.name.order-created}",
            groupId = "order-processor-group"
    )

    public void listen(OrderKafkaDto dto) {
        log.info("Received order from Kafka: {}", dto.id());

        Order order = Order.builder()
                .id(dto.id())
                .status(Enum.valueOf(OrderStatus.class, dto.status()))
                .customer(Customer.builder()
                        .id(dto.customer().id())
                        .email(dto.customer().email())
                        .firstName(dto.customer().firstName())
                        .lastName(dto.customer().lastName())
                        .address(dto.customer().address())
                        .build())
                .products(dto.products().stream().map(p -> Product.builder()
                        .id(p.id())
                        .name(p.name())
                        .price(p.price())
                        .build()).collect(Collectors.toList()))
                .build();

        orderService.create(order);
        webSocketOrderNotifier.sendOrderNotification();
    }
}

