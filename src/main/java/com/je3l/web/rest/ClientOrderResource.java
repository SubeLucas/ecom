package com.je3l.web.rest;

import com.je3l.domain.ClientOrder;
import com.je3l.repository.ClientOrderRepository;
import com.je3l.service.OrderService;
import com.je3l.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.je3l.domain.ClientOrder}.
 */
@RestController
@RequestMapping("/api/client-orders")
@Transactional
public class ClientOrderResource {

    private static final Logger LOG = LoggerFactory.getLogger(ClientOrderResource.class);

    private static final String ENTITY_NAME = "clientOrder";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClientOrderRepository clientOrderRepository;

    private final OrderService orderService;

    public ClientOrderResource(ClientOrderRepository clientOrderRepository, OrderService orderService) {
        this.clientOrderRepository = clientOrderRepository;
        this.orderService = orderService;
    }

    /**
     * {@code POST  /client-orders} : Create a new clientOrder.
     *
     * @param clientOrder the clientOrder to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clientOrder, or with status {@code 400 (Bad Request)} if the clientOrder has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ClientOrder> createClientOrder(@Valid @RequestBody ClientOrder clientOrder) throws URISyntaxException {
        LOG.debug("REST request to save ClientOrder : {}", clientOrder);
        if (clientOrder.getId() != null) {
            throw new BadRequestAlertException("A new clientOrder cannot already have an ID", ENTITY_NAME, "idexists");
        }
        clientOrder = clientOrderRepository.save(clientOrder);
        return ResponseEntity.created(new URI("/api/client-orders/" + clientOrder.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, clientOrder.getId().toString()))
            .body(clientOrder);
    }

    /**
     * {@code PUT  /client-orders/:id} : Updates an existing clientOrder.
     *
     * @param id the id of the clientOrder to save.
     * @param clientOrder the clientOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientOrder,
     * or with status {@code 400 (Bad Request)} if the clientOrder is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clientOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ClientOrder> updateClientOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ClientOrder clientOrder
    ) throws URISyntaxException {
        LOG.debug("REST request to update ClientOrder : {}, {}", id, clientOrder);
        if (clientOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        clientOrder = clientOrderRepository.save(clientOrder);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clientOrder.getId().toString()))
            .body(clientOrder);
    }

    /**
     * {@code PATCH  /client-orders/:id} : Partial updates given fields of an existing clientOrder, field will ignore if it is null
     *
     * @param id the id of the clientOrder to save.
     * @param clientOrder the clientOrder to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clientOrder,
     * or with status {@code 400 (Bad Request)} if the clientOrder is not valid,
     * or with status {@code 404 (Not Found)} if the clientOrder is not found,
     * or with status {@code 500 (Internal Server Error)} if the clientOrder couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClientOrder> partialUpdateClientOrder(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ClientOrder clientOrder
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ClientOrder partially : {}, {}", id, clientOrder);
        if (clientOrder.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clientOrder.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientOrderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClientOrder> result = clientOrderRepository
            .findById(clientOrder.getId())
            .map(existingClientOrder -> {
                if (clientOrder.getOrderDate() != null) {
                    existingClientOrder.setOrderDate(clientOrder.getOrderDate());
                }
                if (clientOrder.getDeliveryDate() != null) {
                    existingClientOrder.setDeliveryDate(clientOrder.getDeliveryDate());
                }
                if (clientOrder.getDeliveryAddress() != null) {
                    existingClientOrder.setDeliveryAddress(clientOrder.getDeliveryAddress());
                }
                if (clientOrder.getStatus() != null) {
                    existingClientOrder.setStatus(clientOrder.getStatus());
                }
                if (clientOrder.getTotalPrice() != null) {
                    existingClientOrder.setTotalPrice(clientOrder.getTotalPrice());
                }

                return existingClientOrder;
            })
            .map(clientOrderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, clientOrder.getId().toString())
        );
    }

    /**
     * {@code GET  /client-orders} : get all the clientOrders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clientOrders in body.
     */
    @GetMapping("")
    public List<ClientOrder> getAllClientOrders() {
        LOG.debug("REST request to get all ClientOrders");
        return clientOrderRepository.findAll();
    }

    /**
     * {@code GET  /client-orders/:id} : get the "id" clientOrder.
     *
     * @param id the id of the clientOrder to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clientOrder, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClientOrder> getClientOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to get ClientOrder : {}", id);
        Optional<ClientOrder> clientOrder = clientOrderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(clientOrder);
    }

    /**
     * {@code DELETE  /client-orders/:id} : delete the "id" clientOrder.
     *
     * @param id the id of the clientOrder to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClientOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete ClientOrder : {}", id);
        clientOrderRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @PostMapping("/{id}/delete")
    public void cancelClientOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to cancel ClientOrder : {}", id);
        orderService.cancelOrder(id);
    }

    @GetMapping("/currentClient/")
    public List<ClientOrder> getClientOrderByCurrentClient() {
        LOG.debug("REST request to get all ClientOrders by current client");
        return clientOrderRepository.findClientHistory();
    }
}
