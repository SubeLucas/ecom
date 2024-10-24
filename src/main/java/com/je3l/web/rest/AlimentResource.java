package com.je3l.web.rest;

import com.je3l.domain.Aliment;
import com.je3l.repository.AlimentRepository;
import com.je3l.repository.search.AlimentSearchRepository;
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
 * REST controller for managing {@link com.je3l.domain.Aliment}.
 */
@RestController
@RequestMapping("/api/aliments")
@Transactional
public class AlimentResource {

    private static final Logger LOG = LoggerFactory.getLogger(AlimentResource.class);

    private static final String ENTITY_NAME = "aliment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AlimentRepository alimentRepository;

    private final AlimentSearchRepository alimentSearchRepository;

    public AlimentResource(AlimentRepository alimentRepository, AlimentSearchRepository alimentSearchRepository) {
        this.alimentRepository = alimentRepository;
        this.alimentSearchRepository = alimentSearchRepository;
    }

    /**
     * {@code POST  /aliments} : Create a new aliment.
     *
     * @param aliment the aliment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new aliment, or with status {@code 400 (Bad Request)} if the aliment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Aliment> createAliment(@Valid @RequestBody Aliment aliment) throws URISyntaxException {
        LOG.debug("REST request to save Aliment : {}", aliment);
        if (aliment.getId() != null) {
            throw new BadRequestAlertException("A new aliment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        aliment = alimentRepository.save(aliment);
        alimentSearchRepository.index(aliment);
        return ResponseEntity.created(new URI("/api/aliments/" + aliment.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, aliment.getId().toString()))
            .body(aliment);
    }

    /**
     * {@code PUT  /aliments/:id} : Updates an existing aliment.
     *
     * @param id the id of the aliment to save.
     * @param aliment the aliment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aliment,
     * or with status {@code 400 (Bad Request)} if the aliment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the aliment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Aliment> updateAliment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Aliment aliment
    ) throws URISyntaxException {
        LOG.debug("REST request to update Aliment : {}, {}", id, aliment);
        if (aliment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aliment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!alimentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        aliment = alimentRepository.save(aliment);
        alimentSearchRepository.index(aliment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aliment.getId().toString()))
            .body(aliment);
    }

    /**
     * {@code PATCH  /aliments/:id} : Partial updates given fields of an existing aliment, field will ignore if it is null
     *
     * @param id the id of the aliment to save.
     * @param aliment the aliment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aliment,
     * or with status {@code 400 (Bad Request)} if the aliment is not valid,
     * or with status {@code 404 (Not Found)} if the aliment is not found,
     * or with status {@code 500 (Internal Server Error)} if the aliment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Aliment> partialUpdateAliment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Aliment aliment
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Aliment partially : {}, {}", id, aliment);
        if (aliment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aliment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!alimentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Aliment> result = alimentRepository
            .findById(aliment.getId())
            .map(existingAliment -> {
                if (aliment.getName() != null) {
                    existingAliment.setName(aliment.getName());
                }
                if (aliment.getOrigin() != null) {
                    existingAliment.setOrigin(aliment.getOrigin());
                }
                if (aliment.getSeason() != null) {
                    existingAliment.setSeason(aliment.getSeason());
                }
                if (aliment.getColor() != null) {
                    existingAliment.setColor(aliment.getColor());
                }
                if (aliment.getWeight() != null) {
                    existingAliment.setWeight(aliment.getWeight());
                }
                if (aliment.getStockQuantity() != null) {
                    existingAliment.setStockQuantity(aliment.getStockQuantity());
                }
                if (aliment.getPrice() != null) {
                    existingAliment.setPrice(aliment.getPrice());
                }

                return existingAliment;
            })
            .map(alimentRepository::save)
            .map(savedAliment -> {
                alimentSearchRepository.index(savedAliment);
                return savedAliment;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aliment.getId().toString())
        );
    }

    /**
     * {@code GET  /aliments} : get all the aliments.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of aliments in body.
     */
    @GetMapping("")
    public List<Aliment> getAllAliments() {
        LOG.debug("REST request to get all Aliments");
        return alimentRepository.findAll();
    }

    /**
     * {@code GET  /aliments/:id} : get the "id" aliment.
     *
     * @param id the id of the aliment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the aliment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Aliment> getAliment(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Aliment : {}", id);
        Optional<Aliment> aliment = alimentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(aliment);
    }

    /**
     * {@code DELETE  /aliments/:id} : delete the "id" aliment.
     *
     * @param id the id of the aliment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAliment(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Aliment : {}", id);
        alimentRepository.deleteById(id);
        alimentSearchRepository.deleteFromIndexById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /aliments/_search?query=:query} : search for the aliment corresponding
     * to the query.
     *
     * @param query the query of the aliment search.
     * @return the result of the search.
     */
    @GetMapping("/_search")
    public List<Aliment> searchAliments(@RequestParam("query") String query) {
        LOG.debug("REST request to search Aliments for query {}", query);
        try {
            return StreamSupport.stream(alimentSearchRepository.search(query).spliterator(), false).toList();
        } catch (RuntimeException e) {
            throw ElasticsearchExceptionMapper.mapException(e);
        }
    }
}
