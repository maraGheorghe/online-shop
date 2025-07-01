package org.example.dto;

import org.example.model.Order;
import org.example.model.OrderStatus;

import java.util.List;
import java.util.UUID;

public record OrderKafkaDto(UUID id, List<ProductKafkaDto> products, OrderStatus status, CustomerKafkaDto customer) {
    public static OrderKafkaDto fromEntity(Order order) {
        return new OrderKafkaDto(
                order.getId(),
                order.getProducts().stream().map(ProductKafkaDto::fromEntity).toList(),
                order.getStatus(),
                CustomerKafkaDto.fromEntity(order.getCustomer())
        );
    }
}
