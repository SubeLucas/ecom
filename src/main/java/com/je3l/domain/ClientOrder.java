package com.je3l.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.je3l.domain.enumeration.EnumStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ClientOrder.
 */
@Entity
@Table(name = "client_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "clientorder")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClientOrder implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", unique = true)
    private Long id;

    @NotNull
    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @NotNull
    @Column(name = "delivery_date", nullable = false)
    private LocalDate deliveryDate;

    @NotNull
    @Column(name = "delivery_address", nullable = false)
    @org.springframework.data.elasticsearch.annotations.Field(type = org.springframework.data.elasticsearch.annotations.FieldType.Text)
    private String deliveryAddress;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @org.springframework.data.elasticsearch.annotations.Field(type = org.springframework.data.elasticsearch.annotations.FieldType.Keyword)
    private EnumStatus status;

    @NotNull
    @Column(name = "total_price", precision = 21, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "clientOrder")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @org.springframework.data.annotation.Transient
    @JsonIgnoreProperties(value = { "clientOrder", "aliment" }, allowSetters = true)
    private Set<OrderLine> orderLines = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "orders", "user" }, allowSetters = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ClientOrder id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getOrderDate() {
        return this.orderDate;
    }

    public ClientOrder orderDate(LocalDate orderDate) {
        this.setOrderDate(orderDate);
        return this;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDate getDeliveryDate() {
        return this.deliveryDate;
    }

    public ClientOrder deliveryDate(LocalDate deliveryDate) {
        this.setDeliveryDate(deliveryDate);
        return this;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public ClientOrder deliveryAddress(String deliveryAddress) {
        this.setDeliveryAddress(deliveryAddress);
        return this;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public EnumStatus getStatus() {
        return this.status;
    }

    public ClientOrder status(EnumStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(EnumStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalPrice() {
        return this.totalPrice;
    }

    public ClientOrder totalPrice(BigDecimal totalPrice) {
        this.setTotalPrice(totalPrice);
        return this;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Set<OrderLine> getOrderLines() {
        return this.orderLines;
    }

    public void setOrderLines(Set<OrderLine> orderLines) {
        if (this.orderLines != null) {
            this.orderLines.forEach(i -> i.setClientOrder(null));
        }
        if (orderLines != null) {
            orderLines.forEach(i -> i.setClientOrder(this));
        }
        this.orderLines = orderLines;
    }

    public ClientOrder orderLines(Set<OrderLine> orderLines) {
        this.setOrderLines(orderLines);
        return this;
    }

    public ClientOrder addOrderLines(OrderLine orderLine) {
        this.orderLines.add(orderLine);
        orderLine.setClientOrder(this);
        return this;
    }

    public ClientOrder removeOrderLines(OrderLine orderLine) {
        this.orderLines.remove(orderLine);
        orderLine.setClientOrder(null);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public ClientOrder client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClientOrder)) {
            return false;
        }
        return getId() != null && getId().equals(((ClientOrder) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClientOrder{" +
            "id=" + getId() +
            ", orderDate='" + getOrderDate() + "'" +
            ", deliveryDate='" + getDeliveryDate() + "'" +
            ", deliveryAddress='" + getDeliveryAddress() + "'" +
            ", status='" + getStatus() + "'" +
            ", totalPrice=" + getTotalPrice() +
            "}";
    }
}
