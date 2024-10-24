package com.je3l.web.rest;

import static com.je3l.domain.ImagesAsserts.*;
import static com.je3l.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.je3l.IntegrationTest;
import com.je3l.domain.Images;
import com.je3l.repository.ImagesRepository;
import com.je3l.repository.search.ImagesSearchRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.assertj.core.util.IterableUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.util.Streamable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ImagesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ImagesResourceIT {

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/images";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/images/_search";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ImagesRepository imagesRepository;

    @Autowired
    private ImagesSearchRepository imagesSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restImagesMockMvc;

    private Images images;

    private Images insertedImages;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Images createEntity() {
        return new Images().url(DEFAULT_URL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Images createUpdatedEntity() {
        return new Images().url(UPDATED_URL);
    }

    @BeforeEach
    public void initTest() {
        images = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedImages != null) {
            imagesRepository.delete(insertedImages);
            imagesSearchRepository.delete(insertedImages);
            insertedImages = null;
        }
    }

    @Test
    @Transactional
    void createImages() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        // Create the Images
        var returnedImages = om.readValue(
            restImagesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(images)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Images.class
        );

        // Validate the Images in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertImagesUpdatableFieldsEquals(returnedImages, getPersistedImages(returnedImages));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore + 1);
            });

        insertedImages = returnedImages;
    }

    @Test
    @Transactional
    void createImagesWithExistingId() throws Exception {
        // Create the Images with an existing ID
        images.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());

        // An entity with an existing ID cannot be created, so this API call must fail
        restImagesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(images)))
            .andExpect(status().isBadRequest());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkUrlIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        // set the field null
        images.setUrl(null);

        // Create the Images, which fails.

        restImagesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(images)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void getAllImages() throws Exception {
        // Initialize the database
        insertedImages = imagesRepository.saveAndFlush(images);

        // Get all the imagesList
        restImagesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(images.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)));
    }

    @Test
    @Transactional
    void getImages() throws Exception {
        // Initialize the database
        insertedImages = imagesRepository.saveAndFlush(images);

        // Get the images
        restImagesMockMvc
            .perform(get(ENTITY_API_URL_ID, images.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(images.getId().intValue()))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL));
    }

    @Test
    @Transactional
    void getNonExistingImages() throws Exception {
        // Get the images
        restImagesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingImages() throws Exception {
        // Initialize the database
        insertedImages = imagesRepository.saveAndFlush(images);

        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagesSearchRepository.save(images);
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());

        // Update the images
        Images updatedImages = imagesRepository.findById(images.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedImages are not directly saved in db
        em.detach(updatedImages);
        updatedImages.url(UPDATED_URL);

        restImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedImages.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedImages))
            )
            .andExpect(status().isOk());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedImagesToMatchAllProperties(updatedImages);

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
                List<Images> imagesSearchList = Streamable.of(imagesSearchRepository.findAll()).toList();
                Images testImagesSearch = imagesSearchList.get(searchDatabaseSizeAfter - 1);

                assertImagesAllPropertiesEquals(testImagesSearch, updatedImages);
            });
    }

    @Test
    @Transactional
    void putNonExistingImages() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        images.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImagesMockMvc
            .perform(put(ENTITY_API_URL_ID, images.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(images)))
            .andExpect(status().isBadRequest());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithIdMismatchImages() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        images.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(images))
            )
            .andExpect(status().isBadRequest());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamImages() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        images.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(images)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void partialUpdateImagesWithPatch() throws Exception {
        // Initialize the database
        insertedImages = imagesRepository.saveAndFlush(images);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the images using partial update
        Images partialUpdatedImages = new Images();
        partialUpdatedImages.setId(images.getId());

        partialUpdatedImages.url(UPDATED_URL);

        restImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImages.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImages))
            )
            .andExpect(status().isOk());

        // Validate the Images in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImagesUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedImages, images), getPersistedImages(images));
    }

    @Test
    @Transactional
    void fullUpdateImagesWithPatch() throws Exception {
        // Initialize the database
        insertedImages = imagesRepository.saveAndFlush(images);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the images using partial update
        Images partialUpdatedImages = new Images();
        partialUpdatedImages.setId(images.getId());

        partialUpdatedImages.url(UPDATED_URL);

        restImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImages.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImages))
            )
            .andExpect(status().isOk());

        // Validate the Images in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImagesUpdatableFieldsEquals(partialUpdatedImages, getPersistedImages(partialUpdatedImages));
    }

    @Test
    @Transactional
    void patchNonExistingImages() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        images.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, images.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(images))
            )
            .andExpect(status().isBadRequest());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithIdMismatchImages() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        images.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(images))
            )
            .andExpect(status().isBadRequest());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamImages() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        images.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(images)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Images in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void deleteImages() throws Exception {
        // Initialize the database
        insertedImages = imagesRepository.saveAndFlush(images);
        imagesRepository.save(images);
        imagesSearchRepository.save(images);

        long databaseSizeBeforeDelete = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeBefore).isEqualTo(databaseSizeBeforeDelete);

        // Delete the images
        restImagesMockMvc
            .perform(delete(ENTITY_API_URL_ID, images.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(imagesSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore - 1);
    }

    @Test
    @Transactional
    void searchImages() throws Exception {
        // Initialize the database
        insertedImages = imagesRepository.saveAndFlush(images);
        imagesSearchRepository.save(images);

        // Search the images
        restImagesMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + images.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(images.getId().intValue())))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)));
    }

    protected long getRepositoryCount() {
        return imagesRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Images getPersistedImages(Images images) {
        return imagesRepository.findById(images.getId()).orElseThrow();
    }

    protected void assertPersistedImagesToMatchAllProperties(Images expectedImages) {
        assertImagesAllPropertiesEquals(expectedImages, getPersistedImages(expectedImages));
    }

    protected void assertPersistedImagesToMatchUpdatableProperties(Images expectedImages) {
        assertImagesAllUpdatablePropertiesEquals(expectedImages, getPersistedImages(expectedImages));
    }
}
