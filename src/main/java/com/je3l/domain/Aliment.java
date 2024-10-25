package com.je3l.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.je3l.domain.enumeration.EnumColor;
import com.je3l.domain.enumeration.EnumOrigin;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Aliment.
 */
@Entity
@Table(name = "aliment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Aliment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", unique = true)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "origin", nullable = false)
    private EnumOrigin origin;

    @NotNull
    @Column(name = "season", nullable = false)
    private Integer season;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "color", nullable = false)
    private EnumColor color;

    @NotNull
    @Column(name = "weight", precision = 21, scale = 2, nullable = false)
    private BigDecimal weight;

    @NotNull
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @NotNull
    @Column(name = "price", precision = 21, scale = 2, nullable = false)
    private BigDecimal price;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "aliment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "clientOrder", "aliment" }, allowSetters = true)
    private Set<OrderLine> clientOrders = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "aliment")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "aliment" }, allowSetters = true)
    private Set<Images> images = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Aliment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Aliment name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public EnumOrigin getOrigin() {
        return this.origin;
    }

    public Aliment origin(EnumOrigin origin) {
        this.setOrigin(origin);
        return this;
    }

    public void setOrigin(EnumOrigin origin) {
        this.origin = origin;
    }

    public Integer getSeason() {
        return this.season;
    }

    public Aliment season(Integer season) {
        this.setSeason(season);
        return this;
    }

    public void setSeason(Integer season) {
        this.season = season;
    }

    public EnumColor getColor() {
        return this.color;
    }

    public Aliment color(EnumColor color) {
        this.setColor(color);
        return this;
    }

    public void setColor(EnumColor color) {
        this.color = color;
    }

    public BigDecimal getWeight() {
        return this.weight;
    }

    public Aliment weight(BigDecimal weight) {
        this.setWeight(weight);
        return this;
    }

    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    public Integer getStockQuantity() {
        return this.stockQuantity;
    }

    public Aliment stockQuantity(Integer stockQuantity) {
        this.setStockQuantity(stockQuantity);
        return this;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Aliment price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Set<OrderLine> getClientOrders() {
        return this.clientOrders;
    }

    public void setClientOrders(Set<OrderLine> orderLines) {
        if (this.clientOrders != null) {
            this.clientOrders.forEach(i -> i.setAliment(null));
        }
        if (orderLines != null) {
            orderLines.forEach(i -> i.setAliment(this));
        }
        this.clientOrders = orderLines;
    }

    public Aliment clientOrders(Set<OrderLine> orderLines) {
        this.setClientOrders(orderLines);
        return this;
    }

    public Aliment addClientOrders(OrderLine orderLine) {
        this.clientOrders.add(orderLine);
        orderLine.setAliment(this);
        return this;
    }

    public Aliment removeClientOrders(OrderLine orderLine) {
        this.clientOrders.remove(orderLine);
        orderLine.setAliment(null);
        return this;
    }

    public Set<Images> getImages() {
        return this.images;
    }

    public void setImages(Set<Images> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setAliment(null));
        }
        if (images != null) {
            images.forEach(i -> i.setAliment(this));
        }
        this.images = images;
    }

    public Aliment images(Set<Images> images) {
        this.setImages(images);
        return this;
    }

    public Aliment addImages(Images images) {
        this.images.add(images);
        images.setAliment(this);
        return this;
    }

    public Aliment removeImages(Images images) {
        this.images.remove(images);
        images.setAliment(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Aliment)) {
            return false;
        }
        return getId() != null && getId().equals(((Aliment) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Aliment{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", origin='" + getOrigin() + "'" +
            ", season=" + getSeason() +
            ", color='" + getColor() + "'" +
            ", weight=" + getWeight() +
            ", stockQuantity=" + getStockQuantity() +
            ", price=" + getPrice() +
            "}";
    }
}
