package com.je3l.web.rest;

import static com.je3l.domain.AlimentAsserts.*;
import static com.je3l.web.rest.TestUtil.createUpdateProxyForBean;
import static com.je3l.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.je3l.IntegrationTest;
import com.je3l.domain.Aliment;
import com.je3l.domain.enumeration.EnumColor;
import com.je3l.domain.enumeration.EnumOrigin;
import com.je3l.repository.AlimentRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AlimentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AlimentResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final EnumOrigin DEFAULT_ORIGIN = EnumOrigin.FRANCE;
    private static final EnumOrigin UPDATED_ORIGIN = EnumOrigin.ESPAGNE;

    private static final Integer DEFAULT_SEASON = 1;
    private static final Integer UPDATED_SEASON = 2;

    private static final EnumColor DEFAULT_COLOR = EnumColor.RED;
    private static final EnumColor UPDATED_COLOR = EnumColor.ORANGE;

    private static final BigDecimal DEFAULT_WEIGHT = new BigDecimal(1);
    private static final BigDecimal UPDATED_WEIGHT = new BigDecimal(2);

    private static final Integer DEFAULT_STOCK_QUANTITY = 1;
    private static final Integer UPDATED_STOCK_QUANTITY = 2;

    private static final BigDecimal DEFAULT_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRICE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/aliments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private AlimentRepository alimentRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAlimentMockMvc;

    private Aliment aliment;

    private Aliment insertedAliment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aliment createEntity() {
        return new Aliment()
            .name(DEFAULT_NAME)
            .origin(DEFAULT_ORIGIN)
            .season(DEFAULT_SEASON)
            .color(DEFAULT_COLOR)
            .weight(DEFAULT_WEIGHT)
            .stockQuantity(DEFAULT_STOCK_QUANTITY)
            .price(DEFAULT_PRICE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aliment createUpdatedEntity() {
        return new Aliment()
            .name(UPDATED_NAME)
            .origin(UPDATED_ORIGIN)
            .season(UPDATED_SEASON)
            .color(UPDATED_COLOR)
            .weight(UPDATED_WEIGHT)
            .stockQuantity(UPDATED_STOCK_QUANTITY)
            .price(UPDATED_PRICE);
    }

    @BeforeEach
    public void initTest() {
        aliment = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedAliment != null) {
            alimentRepository.delete(insertedAliment);
            insertedAliment = null;
        }
    }

    @Test
    @Transactional
    void createAliment() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Aliment
        var returnedAliment = om.readValue(
            restAlimentMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Aliment.class
        );

        // Validate the Aliment in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertAlimentUpdatableFieldsEquals(returnedAliment, getPersistedAliment(returnedAliment));

        insertedAliment = returnedAliment;
    }

    @Test
    @Transactional
    void createAlimentWithExistingId() throws Exception {
        // Create the Aliment with an existing ID
        aliment.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aliment.setName(null);

        // Create the Aliment, which fails.

        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkOriginIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aliment.setOrigin(null);

        // Create the Aliment, which fails.

        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSeasonIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aliment.setSeason(null);

        // Create the Aliment, which fails.

        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkColorIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aliment.setColor(null);

        // Create the Aliment, which fails.

        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkWeightIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aliment.setWeight(null);

        // Create the Aliment, which fails.

        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStockQuantityIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aliment.setStockQuantity(null);

        // Create the Aliment, which fails.

        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPriceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        aliment.setPrice(null);

        // Create the Aliment, which fails.

        restAlimentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAliments() throws Exception {
        // Initialize the database
        insertedAliment = alimentRepository.saveAndFlush(aliment);

        // Get all the alimentList
        restAlimentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(aliment.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].origin").value(hasItem(DEFAULT_ORIGIN.toString())))
            .andExpect(jsonPath("$.[*].season").value(hasItem(DEFAULT_SEASON)))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())))
            .andExpect(jsonPath("$.[*].weight").value(hasItem(sameNumber(DEFAULT_WEIGHT))))
            .andExpect(jsonPath("$.[*].stockQuantity").value(hasItem(DEFAULT_STOCK_QUANTITY)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(sameNumber(DEFAULT_PRICE))));
    }

    @Test
    @Transactional
    void getAliment() throws Exception {
        // Initialize the database
        insertedAliment = alimentRepository.saveAndFlush(aliment);

        // Get the aliment
        restAlimentMockMvc
            .perform(get(ENTITY_API_URL_ID, aliment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(aliment.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.origin").value(DEFAULT_ORIGIN.toString()))
            .andExpect(jsonPath("$.season").value(DEFAULT_SEASON))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR.toString()))
            .andExpect(jsonPath("$.weight").value(sameNumber(DEFAULT_WEIGHT)))
            .andExpect(jsonPath("$.stockQuantity").value(DEFAULT_STOCK_QUANTITY))
            .andExpect(jsonPath("$.price").value(sameNumber(DEFAULT_PRICE)));
    }

    @Test
    @Transactional
    void getNonExistingAliment() throws Exception {
        // Get the aliment
        restAlimentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAliment() throws Exception {
        // Initialize the database
        insertedAliment = alimentRepository.saveAndFlush(aliment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the aliment
        Aliment updatedAliment = alimentRepository.findById(aliment.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAliment are not directly saved in db
        em.detach(updatedAliment);
        updatedAliment
            .name(UPDATED_NAME)
            .origin(UPDATED_ORIGIN)
            .season(UPDATED_SEASON)
            .color(UPDATED_COLOR)
            .weight(UPDATED_WEIGHT)
            .stockQuantity(UPDATED_STOCK_QUANTITY)
            .price(UPDATED_PRICE);

        restAlimentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAliment.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedAliment))
            )
            .andExpect(status().isOk());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedAlimentToMatchAllProperties(updatedAliment);
    }

    @Test
    @Transactional
    void putNonExistingAliment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aliment.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlimentMockMvc
            .perform(put(ENTITY_API_URL_ID, aliment.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isBadRequest());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAliment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aliment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlimentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(aliment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAliment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aliment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlimentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAlimentWithPatch() throws Exception {
        // Initialize the database
        insertedAliment = alimentRepository.saveAndFlush(aliment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the aliment using partial update
        Aliment partialUpdatedAliment = new Aliment();
        partialUpdatedAliment.setId(aliment.getId());

        partialUpdatedAliment.season(UPDATED_SEASON).color(UPDATED_COLOR).price(UPDATED_PRICE);

        restAlimentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAliment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAliment))
            )
            .andExpect(status().isOk());

        // Validate the Aliment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAlimentUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedAliment, aliment), getPersistedAliment(aliment));
    }

    @Test
    @Transactional
    void fullUpdateAlimentWithPatch() throws Exception {
        // Initialize the database
        insertedAliment = alimentRepository.saveAndFlush(aliment);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the aliment using partial update
        Aliment partialUpdatedAliment = new Aliment();
        partialUpdatedAliment.setId(aliment.getId());

        partialUpdatedAliment
            .name(UPDATED_NAME)
            .origin(UPDATED_ORIGIN)
            .season(UPDATED_SEASON)
            .color(UPDATED_COLOR)
            .weight(UPDATED_WEIGHT)
            .stockQuantity(UPDATED_STOCK_QUANTITY)
            .price(UPDATED_PRICE);

        restAlimentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAliment.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedAliment))
            )
            .andExpect(status().isOk());

        // Validate the Aliment in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertAlimentUpdatableFieldsEquals(partialUpdatedAliment, getPersistedAliment(partialUpdatedAliment));
    }

    @Test
    @Transactional
    void patchNonExistingAliment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aliment.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlimentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, aliment.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(aliment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAliment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aliment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlimentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(aliment))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAliment() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        aliment.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAlimentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(aliment)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aliment in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAliment() throws Exception {
        // Initialize the database
        insertedAliment = alimentRepository.saveAndFlush(aliment);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the aliment
        restAlimentMockMvc
            .perform(delete(ENTITY_API_URL_ID, aliment.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return alimentRepository.count();
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

    protected Aliment getPersistedAliment(Aliment aliment) {
        return alimentRepository.findById(aliment.getId()).orElseThrow();
    }

    protected void assertPersistedAlimentToMatchAllProperties(Aliment expectedAliment) {
        assertAlimentAllPropertiesEquals(expectedAliment, getPersistedAliment(expectedAliment));
    }

    protected void assertPersistedAlimentToMatchUpdatableProperties(Aliment expectedAliment) {
        assertAlimentAllUpdatablePropertiesEquals(expectedAliment, getPersistedAliment(expectedAliment));
    }
}
