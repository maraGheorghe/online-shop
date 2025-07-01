package org.example.dto;

import org.example.model.Order;
import org.example.model.OrderStatus;
import org.example.model.Product;

import java.util.List;
import java.util.UUID;

public record OrderDto(UUID id, List<Product> products, OrderStatus status) {
    public static OrderDto fromEntity(Order order) {
        return new OrderDto(order.getId(), order.getProducts(), order.getStatus());
    }
}

