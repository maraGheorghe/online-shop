package org.example.dto;

import org.example.model.Order;
import org.example.model.OrderStatus;

import java.util.UUID;

public record OrderUpdatedKafkaDto(UUID id, OrderStatus newStatus) {
    public static OrderUpdatedKafkaDto fromEntity(Order order) {
        return new OrderUpdatedKafkaDto(
                order.getId(),
                order.getStatus()
        );
    }
}
