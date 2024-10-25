package com.je3l.service.dto;

import com.je3l.domain.Aliment;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

public class CartDTO implements Serializable {

    //@NotBlank
    //private HashMap<Integer, Integer> cart;
    private Aliment aliment;
    private Integer quantity;

    public CartDTO(Aliment aliment, Integer quantity) {
        this.aliment = aliment;
        this.quantity = quantity;
    }

    public Aliment getAliment() {
        return aliment;
    }

    public void setAliment(Aliment aliment) {
        this.aliment = aliment;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
