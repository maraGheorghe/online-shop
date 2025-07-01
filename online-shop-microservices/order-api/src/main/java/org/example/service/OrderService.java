package org.example.service;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.example.dto.OrderDto;
import org.example.dto.OrderKafkaDto;
import org.example.kafka.producer.OrderKafkaProducer;
import org.example.model.Customer;
import org.example.model.Order;
import org.example.model.OrderStatus;
import org.example.model.Product;
import org.example.repository.CustomerRepository;
import org.example.repository.OrderRepository;
import org.example.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderKafkaProducer orderKafkaProducer;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository, OrderKafkaProducer orderKafkaProducer, ProductRepository productRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.orderKafkaProducer = orderKafkaProducer;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Order create(Order order) {
        attachEntities(order);
        order.setStatus(OrderStatus.PENDING);
        Order saved = orderRepository.saveAndFlush(order);
        orderKafkaProducer.sendOrderCreatedEvent(OrderKafkaDto.fromEntity(saved));
        return saved;
    }

    public Optional<Order> getById(UUID id) {
        return orderRepository.findById(id);
    }

    public List<OrderDto> getAllForCustomerEmail(String customerEmail) {
        var orders = orderRepository.findAllByCustomerEmail(customerEmail);
        Collections.reverse(orders);
        return orders.stream()
                .map(OrderDto::fromEntity)
                .toList();
    }

    public Order updateOrderStatus(UUID id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order with id " + id + " was not found."));

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    private void attachEntities(Order order) {
        UUID customerId = order.getCustomer().getId();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        order.setCustomer(customer);
        List<UUID> originalProductIds = order.getProducts().stream()
                .map(Product::getId).toList();
        Map<UUID, Product> productMap = productRepository.findAllById(
                        originalProductIds.stream().distinct().toList()
                ).stream()
                .collect(Collectors.toMap(Product::getId, p -> p));
        if (productMap.size() != originalProductIds.stream().distinct().count()) {
            throw new IllegalArgumentException("One or more products not found");
        }
        List<Product> attachedProducts = originalProductIds.stream()
                .map(productMap::get)
                .toList();
        order.setProducts(attachedProducts);
    }

}