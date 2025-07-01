package org.example.dto;

import org.example.model.Customer;

import java.util.UUID;

public record CustomerKafkaDto(UUID id, String email, String firstName, String lastName, String address) {
    public static CustomerKafkaDto fromEntity(Customer customer) {
        return new CustomerKafkaDto(customer.getId(), customer.getEmail(), customer.getFirstName(), customer.getLastName(), customer.getAddress());
    }
}
