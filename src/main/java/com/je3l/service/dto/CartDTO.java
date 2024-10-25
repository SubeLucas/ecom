package com.je3l.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.MapSerializer;
import com.je3l.domain.Aliment;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

public class CartDTO implements Serializable {

    @JsonSerialize(keyUsing = MapSerializer.class)
    private HashMap<Long, Integer> cart;

    public CartDTO() {}

    public CartDTO(HashMap<Long, Integer> full_cart) {
        this.cart = full_cart;
    }

    public HashMap<Long, Integer> getCart() {
        return this.cart;
    }

    public void setCart(HashMap<Long, Integer> cart) {
        this.cart = cart;
    }
}
