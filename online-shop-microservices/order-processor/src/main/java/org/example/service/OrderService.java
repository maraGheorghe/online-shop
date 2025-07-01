package org.example.service;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.example.dto.OrderUpdatedKafkaDto;
import org.example.kafka.producer.OrderKafkaProducer;
import org.example.model.Order;
import org.example.model.OrderStatus;
import org.example.model.Product;
import org.example.repository.CustomerRepository;
import org.example.repository.OrderRepository;
import org.example.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderKafkaProducer orderKafkaProducer;

    public Order create(Order order) {
        if (!customerRepository.existsById(order.getCustomer().getId())) {
            customerRepository.save(order.getCustomer());
        }

        List<Product> newProducts = order.getProducts().stream()
                .filter(product -> !productRepository.existsById(product.getId()))
                .collect(Collectors.toList());

        if (!newProducts.isEmpty()) {
            productRepository.saveAll(newProducts);
        }

        order.setProducts(order.getProducts().stream()
                .map(product -> {
                    if (newProducts.contains(product)) {
                        return product;
                    }
                    return productRepository.findById(product.getId()).orElseThrow(() -> new RuntimeException("Product not found"));
                })
                .collect(Collectors.toList()));
        return orderRepository.save(order);
    }

    public Optional<Order> getById(UUID id) {
        return orderRepository.findById(id);
    }

    public List<Order> getAll() {
        List<Order> orders = orderRepository.findAll();
        Collections.reverse(orders);
        return orders;
    }

    public Order updateOrderStatus(UUID id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order with id " + id + " was not found."));

        order.setStatus(newStatus);
        var updatedOrder = orderRepository.save(order);
        orderKafkaProducer.sendOrderUpdatedEvent(OrderUpdatedKafkaDto.fromEntity(updatedOrder));
        return updatedOrder;
    }
}