package com.je3l.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * ConnectedClient heritage of Client
 */
@Schema(description = "ConnectedClient heritage of Client")
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "prefered_day", nullable = false)
    private String preferedDay;

    @NotNull
    @Column(name = "address", nullable = false)
    private String address;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "orderLines", "client" }, allowSetters = true)
    private Set<ClientOrder> orders = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPreferedDay() {
        return this.preferedDay;
    }

    public Client preferedDay(String preferedDay) {
        this.setPreferedDay(preferedDay);
        return this;
    }

    public void setPreferedDay(String preferedDay) {
        this.preferedDay = preferedDay;
    }

    public String getAddress() {
        return this.address;
    }

    public Client address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Set<ClientOrder> getOrders() {
        return this.orders;
    }

    public void setOrders(Set<ClientOrder> clientOrders) {
        if (this.orders != null) {
            this.orders.forEach(i -> i.setClient(null));
        }
        if (clientOrders != null) {
            clientOrders.forEach(i -> i.setClient(this));
        }
        this.orders = clientOrders;
    }

    public Client orders(Set<ClientOrder> clientOrders) {
        this.setOrders(clientOrders);
        return this;
    }

    public Client addOrders(ClientOrder clientOrder) {
        this.orders.add(clientOrder);
        clientOrder.setClient(this);
        return this;
    }

    public Client removeOrders(ClientOrder clientOrder) {
        this.orders.remove(clientOrder);
        clientOrder.setClient(null);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Client user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return getId() != null && getId().equals(((Client) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", preferedDay='" + getPreferedDay() + "'" +
            ", address='" + getAddress() + "'" +
            "}";
    }
}
