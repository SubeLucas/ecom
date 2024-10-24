package com.je3l.web.rest;

import com.je3l.domain.Client;
import com.je3l.repository.ClientRepository;
import com.je3l.repository.search.ClientSearchRepository;
import com.je3l.web.rest.errors.BadRequestAlertException;
import com.je3l.web.rest.errors.ElasticsearchExceptionMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.je3l.domain.Client}.
 */
@RestController
@RequestMapping("/api/clients")
@Transactional
public class ClientResource {

    private static final Logger LOG = LoggerFactory.getLogger(ClientResource.class);

    private static final String ENTITY_NAME = "client";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClientRepository clientRepository;

    private final ClientSearchRepository clientSearchRepository;

    public ClientResource(ClientRepository clientRepository, ClientSearchRepository clientSearchRepository) {
        this.clientRepository = clientRepository;
        this.clientSearchRepository = clientSearchRepository;
    }

    /**
     * {@code POST  /clients} : Create a new client.
     *
     * @param client the client to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new client, or with status {@code 400 (Bad Request)} if the client has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Client> createClient(@Valid @RequestBody Client client) throws URISyntaxException {
        LOG.debug("REST request to save Client : {}", client);
        if (client.getId() != null) {
            throw new BadRequestAlertException("A new client cannot already have an ID", ENTITY_NAME, "idexists");
        }
        client = clientRepository.save(client);
        clientSearchRepository.index(client);
        return ResponseEntity.created(new URI("/api/clients/" + client.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, client.getId().toString()))
            .body(client);
    }

    /**
     * {@code PUT  /clients/:id} : Updates an existing client.
     *
     * @param id the id of the client to save.
     * @param client the client to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated client,
     * or with status {@code 400 (Bad Request)} if the client is not valid,
     * or with status {@code 500 (Internal Server Error)} if the client couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Client client
    ) throws URISyntaxException {
        LOG.debug("REST request to update Client : {}, {}", id, client);
        if (client.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, client.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        client = clientRepository.save(client);
        clientSearchRepository.index(client);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, client.getId().toString()))
            .body(client);
    }

    /**
     * {@code PATCH  /clients/:id} : Partial updates given fields of an existing client, field will ignore if it is null
     *
     * @param id the id of the client to save.
     * @param client the client to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated client,
     * or with status {@code 400 (Bad Request)} if the client is not valid,
     * or with status {@code 404 (Not Found)} if the client is not found,
     * or with status {@code 500 (Internal Server Error)} if the client couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Client> partialUpdateClient(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Client client
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Client partially : {}, {}", id, client);
        if (client.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, client.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Client> result = clientRepository
            .findById(client.getId())
            .map(existingClient -> {
                if (client.getPreferedDay() != null) {
                    existingClient.setPreferedDay(client.getPreferedDay());
                }
                if (client.getAddress() != null) {
                    existingClient.setAddress(client.getAddress());
                }

                return existingClient;
            })
            .map(clientRepository::save)
            .map(savedClient -> {
                clientSearchRepository.index(savedClient);
                return savedClient;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, client.getId().toString())
        );
    }

    /**
     * {@code GET  /clients} : get all the clients.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clients in body.
     */
    @GetMapping("")
    public List<Client> getAllClients() {
        LOG.debug("REST request to get all Clients");
        return clientRepository.findAll();
    }

    /**
     * {@code GET  /clients/:id} : get the "id" client.
     *
     * @param id the id of the client to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the client, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Client : {}", id);
        Optional<Client> client = clientRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(client);
    }

    /**
     * {@code DELETE  /clients/:id} : delete the "id" client.
     *
     * @param id the id of the client to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Client : {}", id);
        clientRepository.deleteById(id);
        clientSearchRepository.deleteFromIndexById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /clients/_search?query=:query} : search for the client corresponding
     * to the query.
     *
     * @param query the query of the client search.
     * @return the result of the search.
     */
    @GetMapping("/_search")
    public List<Client> searchClients(@RequestParam("query") String query) {
        LOG.debug("REST request to search Clients for query {}", query);
        try {
            return StreamSupport.stream(clientSearchRepository.search(query).spliterator(), false).toList();
        } catch (RuntimeException e) {
            throw ElasticsearchExceptionMapper.mapException(e);
        }
    }
}
