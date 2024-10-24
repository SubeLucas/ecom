package com.je3l.web.rest;

import static com.je3l.domain.OrderLineAsserts.*;
import static com.je3l.web.rest.TestUtil.createUpdateProxyForBean;
import static com.je3l.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.je3l.IntegrationTest;
import com.je3l.domain.OrderLine;
import com.je3l.repository.OrderLineRepository;
import com.je3l.repository.search.OrderLineSearchRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
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
 * Integration tests for the {@link OrderLineResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OrderLineResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final BigDecimal DEFAULT_PURCHASE_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_PURCHASE_PRICE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/order-lines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/order-lines/_search";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OrderLineRepository orderLineRepository;

    @Autowired
    private OrderLineSearchRepository orderLineSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderLineMockMvc;

    private OrderLine orderLine;

    private OrderLine insertedOrderLine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderLine createEntity() {
        return new OrderLine().quantity(DEFAULT_QUANTITY).purchasePrice(DEFAULT_PURCHASE_PRICE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OrderLine createUpdatedEntity() {
        return new OrderLine().quantity(UPDATED_QUANTITY).purchasePrice(UPDATED_PURCHASE_PRICE);
    }

    @BeforeEach
    public void initTest() {
        orderLine = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedOrderLine != null) {
            orderLineRepository.delete(insertedOrderLine);
            orderLineSearchRepository.delete(insertedOrderLine);
            insertedOrderLine = null;
        }
    }

    @Test
    @Transactional
    void createOrderLine() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        // Create the OrderLine
        var returnedOrderLine = om.readValue(
            restOrderLineMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderLine)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            OrderLine.class
        );

        // Validate the OrderLine in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertOrderLineUpdatableFieldsEquals(returnedOrderLine, getPersistedOrderLine(returnedOrderLine));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore + 1);
            });

        insertedOrderLine = returnedOrderLine;
    }

    @Test
    @Transactional
    void createOrderLineWithExistingId() throws Exception {
        // Create the OrderLine with an existing ID
        orderLine.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderLine)))
            .andExpect(status().isBadRequest());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkQuantityIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        // set the field null
        orderLine.setQuantity(null);

        // Create the OrderLine, which fails.

        restOrderLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderLine)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkPurchasePriceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        // set the field null
        orderLine.setPurchasePrice(null);

        // Create the OrderLine, which fails.

        restOrderLineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderLine)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void getAllOrderLines() throws Exception {
        // Initialize the database
        insertedOrderLine = orderLineRepository.saveAndFlush(orderLine);

        // Get all the orderLineList
        restOrderLineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderLine.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].purchasePrice").value(hasItem(sameNumber(DEFAULT_PURCHASE_PRICE))));
    }

    @Test
    @Transactional
    void getOrderLine() throws Exception {
        // Initialize the database
        insertedOrderLine = orderLineRepository.saveAndFlush(orderLine);

        // Get the orderLine
        restOrderLineMockMvc
            .perform(get(ENTITY_API_URL_ID, orderLine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(orderLine.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.purchasePrice").value(sameNumber(DEFAULT_PURCHASE_PRICE)));
    }

    @Test
    @Transactional
    void getNonExistingOrderLine() throws Exception {
        // Get the orderLine
        restOrderLineMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOrderLine() throws Exception {
        // Initialize the database
        insertedOrderLine = orderLineRepository.saveAndFlush(orderLine);

        long databaseSizeBeforeUpdate = getRepositoryCount();
        orderLineSearchRepository.save(orderLine);
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());

        // Update the orderLine
        OrderLine updatedOrderLine = orderLineRepository.findById(orderLine.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOrderLine are not directly saved in db
        em.detach(updatedOrderLine);
        updatedOrderLine.quantity(UPDATED_QUANTITY).purchasePrice(UPDATED_PURCHASE_PRICE);

        restOrderLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrderLine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedOrderLine))
            )
            .andExpect(status().isOk());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOrderLineToMatchAllProperties(updatedOrderLine);

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
                List<OrderLine> orderLineSearchList = Streamable.of(orderLineSearchRepository.findAll()).toList();
                OrderLine testOrderLineSearch = orderLineSearchList.get(searchDatabaseSizeAfter - 1);

                assertOrderLineAllPropertiesEquals(testOrderLineSearch, updatedOrderLine);
            });
    }

    @Test
    @Transactional
    void putNonExistingOrderLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        orderLine.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, orderLine.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrderLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        orderLine.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderLineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(orderLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrderLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        orderLine.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderLineMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(orderLine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void partialUpdateOrderLineWithPatch() throws Exception {
        // Initialize the database
        insertedOrderLine = orderLineRepository.saveAndFlush(orderLine);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderLine using partial update
        OrderLine partialUpdatedOrderLine = new OrderLine();
        partialUpdatedOrderLine.setId(orderLine.getId());

        restOrderLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrderLine))
            )
            .andExpect(status().isOk());

        // Validate the OrderLine in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrderLineUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedOrderLine, orderLine),
            getPersistedOrderLine(orderLine)
        );
    }

    @Test
    @Transactional
    void fullUpdateOrderLineWithPatch() throws Exception {
        // Initialize the database
        insertedOrderLine = orderLineRepository.saveAndFlush(orderLine);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the orderLine using partial update
        OrderLine partialUpdatedOrderLine = new OrderLine();
        partialUpdatedOrderLine.setId(orderLine.getId());

        partialUpdatedOrderLine.quantity(UPDATED_QUANTITY).purchasePrice(UPDATED_PURCHASE_PRICE);

        restOrderLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrderLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOrderLine))
            )
            .andExpect(status().isOk());

        // Validate the OrderLine in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOrderLineUpdatableFieldsEquals(partialUpdatedOrderLine, getPersistedOrderLine(partialUpdatedOrderLine));
    }

    @Test
    @Transactional
    void patchNonExistingOrderLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        orderLine.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, orderLine.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(orderLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrderLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        orderLine.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderLineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(orderLine))
            )
            .andExpect(status().isBadRequest());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrderLine() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        orderLine.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOrderLineMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(orderLine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the OrderLine in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void deleteOrderLine() throws Exception {
        // Initialize the database
        insertedOrderLine = orderLineRepository.saveAndFlush(orderLine);
        orderLineRepository.save(orderLine);
        orderLineSearchRepository.save(orderLine);

        long databaseSizeBeforeDelete = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeBefore).isEqualTo(databaseSizeBeforeDelete);

        // Delete the orderLine
        restOrderLineMockMvc
            .perform(delete(ENTITY_API_URL_ID, orderLine.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(orderLineSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore - 1);
    }

    @Test
    @Transactional
    void searchOrderLine() throws Exception {
        // Initialize the database
        insertedOrderLine = orderLineRepository.saveAndFlush(orderLine);
        orderLineSearchRepository.save(orderLine);

        // Search the orderLine
        restOrderLineMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + orderLine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(orderLine.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].purchasePrice").value(hasItem(sameNumber(DEFAULT_PURCHASE_PRICE))));
    }

    protected long getRepositoryCount() {
        return orderLineRepository.count();
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

    protected OrderLine getPersistedOrderLine(OrderLine orderLine) {
        return orderLineRepository.findById(orderLine.getId()).orElseThrow();
    }

    protected void assertPersistedOrderLineToMatchAllProperties(OrderLine expectedOrderLine) {
        assertOrderLineAllPropertiesEquals(expectedOrderLine, getPersistedOrderLine(expectedOrderLine));
    }

    protected void assertPersistedOrderLineToMatchUpdatableProperties(OrderLine expectedOrderLine) {
        assertOrderLineAllUpdatablePropertiesEquals(expectedOrderLine, getPersistedOrderLine(expectedOrderLine));
    }
}
