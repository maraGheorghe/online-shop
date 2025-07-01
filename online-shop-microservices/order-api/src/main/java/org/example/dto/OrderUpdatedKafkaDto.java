package org.example.dto;

import org.example.model.OrderStatus;

import java.util.UUID;

public record OrderUpdatedKafkaDto(UUID id, OrderStatus newStatus) {}
