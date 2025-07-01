package org.example.dto;

import java.util.UUID;

public record ProductDto(UUID id, String name, Double price) {}