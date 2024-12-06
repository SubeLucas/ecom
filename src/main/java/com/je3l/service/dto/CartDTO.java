package com.je3l.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.MapSerializer;
import java.io.Serializable;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.Date;

public class CartDTO implements Serializable {

    @JsonProperty("cartItems")
    private CartItem[] cartItems;

    @JsonProperty("deliveryDate")
    private int[] deliveryDate;

    public CartDTO(Cart cart, int[] deliveryDate) {
        this.cartItems = cart.cartItems;
        this.deliveryDate = deliveryDate;
    }

    public CartItem[] getCartItems() {
        return this.cartItems;
    }

    public void setCartItems(CartItem[] cartItems) {
        this.cartItems = cartItems;
    }

    public LocalDate getDeliveryDate() throws DateTimeException {
        return LocalDate.of(deliveryDate[0], deliveryDate[1], deliveryDate[2]);
    }

    public void setDeliveryDate(int[] date) {
        this.deliveryDate = date;
    }

    public static class Cart {

        @JsonProperty("cartItems")
        private CartItem[] cartItems;

        public CartItem[] getCartItems() {
            return cartItems;
        }

        public void setCartItems(CartItem[] cartItems) {
            this.cartItems = cartItems;
        }
    }
}
