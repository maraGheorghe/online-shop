package org.example.dto;

import org.example.model.Product;

import java.util.UUID;

public record ProductKafkaDto(UUID id, String name, Double price) {
    public static ProductKafkaDto fromEntity(Product product) {
        return new ProductKafkaDto(product.getId(), product.getName(), product.getPrice());
    }
}
