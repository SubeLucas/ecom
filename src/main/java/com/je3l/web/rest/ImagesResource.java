package com.je3l.web.rest;

import com.je3l.domain.Images;
import com.je3l.repository.ImagesRepository;
import com.je3l.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.io.File;
import java.io.FileOutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.zip.GZIPOutputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.je3l.domain.Images}.
 */
@RestController
@RequestMapping("/api/images")
@Transactional
public class ImagesResource {

    private static final Logger LOG = LoggerFactory.getLogger(ImagesResource.class);

    private static final String ENTITY_NAME = "images";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImagesRepository imagesRepository;

    public ImagesResource(ImagesRepository imagesRepository) {
        this.imagesRepository = imagesRepository;
    }

    /**
     * {@code POST  /images} : Create a new images.
     *
     * @param images the images to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new images, or with status {@code 400 (Bad Request)} if the images has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Images> createImages(@Valid @RequestBody Images images) throws URISyntaxException {
        LOG.debug("REST request to save Images : {}", images);
        if (images.getId() != null) {
            throw new BadRequestAlertException("A new images cannot already have an ID", ENTITY_NAME, "idexists");
        }
        images = imagesRepository.save(images);
        return ResponseEntity.created(new URI("/api/images/" + images.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, images.getId().toString()))
            .body(images);
    }

    @PostMapping("/upload")
    public boolean uploadImages(@RequestPart("file") MultipartFile image) {
        try {
            File inputFile = new File("/usr/share/nginx/img/" + image.getOriginalFilename() + ".gz");
            FileOutputStream fis = new FileOutputStream(inputFile);
            GZIPOutputStream gzipos = new GZIPOutputStream(fis);
            gzipos.write(image.getBytes(), 0, image.getBytes().length);
            gzipos.close();
            fis.close();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * {@code PUT  /images/:id} : Updates an existing IMAGEs.
     *
     * @param id the id of the images to save.
     * @param images the images to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated images,
     * or with status {@code 400 (Bad Request)} if the images is not valid,
     * or with status {@code 500 (Internal Server Error)} if the images couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Images> updateImages(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Images images
    ) throws URISyntaxException {
        LOG.debug("REST request to update Images : {}, {}", id, images);
        if (images.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, images.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        images = imagesRepository.save(images);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, images.getId().toString()))
            .body(images);
    }

    /**
     * {@code PATCH  /images/:id} : Partial updates given fields of an existing images, field will ignore if it is null
     *
     * @param id the id of the images to save.
     * @param images the images to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated images,
     * or with status {@code 400 (Bad Request)} if the images is not valid,
     * or with status {@code 404 (Not Found)} if the images is not found,
     * or with status {@code 500 (Internal Server Error)} if the images couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Images> partialUpdateImages(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Images images
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Images partially : {}, {}", id, images);
        if (images.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, images.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imagesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Images> result = imagesRepository
            .findById(images.getId())
            .map(existingImages -> {
                if (images.getUrl() != null) {
                    existingImages.setUrl(images.getUrl());
                }

                return existingImages;
            })
            .map(imagesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, images.getId().toString())
        );
    }

    /**
     * {@code GET  /images} : get all the images.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of images in body.
     */
    @GetMapping("")
    public List<Images> getAllImages() {
        LOG.debug("REST request to get all Images");
        return imagesRepository.findAll();
    }

    /**
     * {@code GET  /images/:id} : get the "id" images.
     *
     * @param id the id of the images to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the images, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Images> getImages(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Images : {}", id);
        Optional<Images> images = imagesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(images);
    }

    /**
     * {@code DELETE  /images/:id} : delete the "id" images.
     *
     * @param id the id of the images to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImages(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Images : {}", id);
        imagesRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/aliment/{id}")
    public ResponseEntity<Images> getImagesByAlimentId(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Images : {}", id);
        Optional<Images> images = imagesRepository.findByAlimentId(id);
        return ResponseUtil.wrapOrNotFound(images);
    }
}
