package com.je3l.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.MapSerializer;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

public class CartDTO implements Serializable {

    private CartItem[] cartItems;
    private int[] deliveryDate;

    public CartItem[] getCartItems() {
        return this.cartItems;
    }

    public void setCartItems(CartItem[] cartItems) {
        this.cartItems = cartItems;
    }

    public LocalDate getDeliveryDate() {
        return LocalDate.of(deliveryDate[0], deliveryDate[1], deliveryDate[2]);
    }

    public void setDeliveryDate(int[] date) {
        deliveryDate = date;
    }
}
