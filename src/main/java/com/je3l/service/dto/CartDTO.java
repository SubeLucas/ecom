package com.je3l.service.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.MapSerializer;
import java.io.Serializable;

public class CartDTO implements Serializable {

    private CartItem[] cartItems;

    public CartItem[] getCartItems() {
        return this.cartItems;
    }

    public void setCartItems(CartItem[] cartItems) {
        this.cartItems = cartItems;
    }
}
