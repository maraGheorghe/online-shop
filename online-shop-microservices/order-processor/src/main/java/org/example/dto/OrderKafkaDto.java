package org.example.dto;

import java.util.List;
import java.util.UUID;

public record OrderKafkaDto(UUID id, List<ProductDto> products, String status, CustomerDto customer) {}