package org.example.kafka.producer;

import org.example.dto.OrderKafkaDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderKafkaProducer {

    private static final Logger logger = LoggerFactory.getLogger(OrderKafkaProducer.class);

    private final KafkaTemplate<String, OrderKafkaDto> kafkaTemplate;

    @Value("${topic.name.order-created}")
    private String topicName;

    public OrderKafkaProducer(KafkaTemplate<String, OrderKafkaDto> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderCreatedEvent(OrderKafkaDto order) {
        kafkaTemplate.send(topicName, order.id().toString(), order)
                .thenAccept(result -> logger.info("Sent order [{}] to Kafka", order.id()))
                .exceptionally(e -> {
                    logger.error("Failed to send order to Kafka", e);
                    return null;
                });
    }

    //kafka-topics --bootstrap-server localhost:9092 --list
    //kafka-console-consumer --bootstrap-server localhost:9092 --topic order_created_topic --from-beginning
}