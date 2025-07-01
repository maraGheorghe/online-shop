package org.example.dto;

import java.util.UUID;

public record CustomerDto(UUID id, String email, String firstName, String lastName, String address) {}