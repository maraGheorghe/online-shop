package org.example.model;

import java.io.Serializable;

public enum OrderStatus implements Serializable {
    PENDING,
    PROCESSING,
    IN_TRANSIT,
    DELIVERED
}
