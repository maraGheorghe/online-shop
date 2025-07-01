package org.example.controller;

import org.example.dto.OrderDto;
import org.example.model.Order;
import org.example.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> create(@RequestBody Order order) {
        Order createdOrder = orderService.create(order);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/customer/{customerEmail}")
    public ResponseEntity<List<OrderDto>> getAllForCustomer(@PathVariable("customerEmail") String customerEmail) {
        List<OrderDto> orders = orderService.getAllForCustomerEmail(customerEmail);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable("id") UUID id) {
        Optional<Order> order = orderService.getById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
