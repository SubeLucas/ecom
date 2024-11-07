package com.je3l.service.dto;

public class CartItem {

    private Long id;
    private Integer qt;

    public Long getId() {
        return this.id;
    }

    public Integer getQt() {
        return this.qt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setQt(Integer qt) {
        this.qt = qt;
    }
}
