package com.je3l.web.rest;

import static com.je3l.domain.ClientOrderAsserts.*;
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
import com.je3l.domain.ClientOrder;
import com.je3l.domain.enumeration.EnumStatus;
import com.je3l.repository.ClientOrderRepository;
import com.je3l.repository.search.ClientOrderSearchRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link ClientOrderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClientOrderResourceIT {

    private static final LocalDate DEFAULT_ORDER_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ORDER_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DELIVERY_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DELIVERY_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_DELIVERY_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_DELIVERY_ADDRESS = "BBBBBBBBBB";

    private static final EnumStatus DEFAULT_STATUS = EnumStatus.IN_PROGRESS;
    private static final EnumStatus UPDATED_STATUS = EnumStatus.SHIPPED;

    private static final BigDecimal DEFAULT_TOTAL_PRICE = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_PRICE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/client-orders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";
    private static final String ENTITY_SEARCH_API_URL = "/api/client-orders/_search";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ClientOrderRepository clientOrderRepository;

    @Autowired
    private ClientOrderSearchRepository clientOrderSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClientOrderMockMvc;

    private ClientOrder clientOrder;

    private ClientOrder insertedClientOrder;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientOrder createEntity() {
        return new ClientOrder()
            .orderDate(DEFAULT_ORDER_DATE)
            .deliveryDate(DEFAULT_DELIVERY_DATE)
            .deliveryAddress(DEFAULT_DELIVERY_ADDRESS)
            .status(DEFAULT_STATUS)
            .totalPrice(DEFAULT_TOTAL_PRICE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClientOrder createUpdatedEntity() {
        return new ClientOrder()
            .orderDate(UPDATED_ORDER_DATE)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .status(UPDATED_STATUS)
            .totalPrice(UPDATED_TOTAL_PRICE);
    }

    @BeforeEach
    public void initTest() {
        clientOrder = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedClientOrder != null) {
            clientOrderRepository.delete(insertedClientOrder);
            clientOrderSearchRepository.delete(insertedClientOrder);
            insertedClientOrder = null;
        }
    }

    @Test
    @Transactional
    void createClientOrder() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        // Create the ClientOrder
        var returnedClientOrder = om.readValue(
            restClientOrderMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ClientOrder.class
        );

        // Validate the ClientOrder in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertClientOrderUpdatableFieldsEquals(returnedClientOrder, getPersistedClientOrder(returnedClientOrder));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore + 1);
            });

        insertedClientOrder = returnedClientOrder;
    }

    @Test
    @Transactional
    void createClientOrderWithExistingId() throws Exception {
        // Create the ClientOrder with an existing ID
        clientOrder.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());

        // An entity with an existing ID cannot be created, so this API call must fail
        restClientOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isBadRequest());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkOrderDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        // set the field null
        clientOrder.setOrderDate(null);

        // Create the ClientOrder, which fails.

        restClientOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkDeliveryDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        // set the field null
        clientOrder.setDeliveryDate(null);

        // Create the ClientOrder, which fails.

        restClientOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkDeliveryAddressIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        // set the field null
        clientOrder.setDeliveryAddress(null);

        // Create the ClientOrder, which fails.

        restClientOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        // set the field null
        clientOrder.setStatus(null);

        // Create the ClientOrder, which fails.

        restClientOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void checkTotalPriceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        // set the field null
        clientOrder.setTotalPrice(null);

        // Create the ClientOrder, which fails.

        restClientOrderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);

        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void getAllClientOrders() throws Exception {
        // Initialize the database
        insertedClientOrder = clientOrderRepository.saveAndFlush(clientOrder);

        // Get all the clientOrderList
        restClientOrderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clientOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].orderDate").value(hasItem(DEFAULT_ORDER_DATE.toString())))
            .andExpect(jsonPath("$.[*].deliveryDate").value(hasItem(DEFAULT_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].deliveryAddress").value(hasItem(DEFAULT_DELIVERY_ADDRESS)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].totalPrice").value(hasItem(sameNumber(DEFAULT_TOTAL_PRICE))));
    }

    @Test
    @Transactional
    void getClientOrder() throws Exception {
        // Initialize the database
        insertedClientOrder = clientOrderRepository.saveAndFlush(clientOrder);

        // Get the clientOrder
        restClientOrderMockMvc
            .perform(get(ENTITY_API_URL_ID, clientOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clientOrder.getId().intValue()))
            .andExpect(jsonPath("$.orderDate").value(DEFAULT_ORDER_DATE.toString()))
            .andExpect(jsonPath("$.deliveryDate").value(DEFAULT_DELIVERY_DATE.toString()))
            .andExpect(jsonPath("$.deliveryAddress").value(DEFAULT_DELIVERY_ADDRESS))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.totalPrice").value(sameNumber(DEFAULT_TOTAL_PRICE)));
    }

    @Test
    @Transactional
    void getNonExistingClientOrder() throws Exception {
        // Get the clientOrder
        restClientOrderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClientOrder() throws Exception {
        // Initialize the database
        insertedClientOrder = clientOrderRepository.saveAndFlush(clientOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();
        clientOrderSearchRepository.save(clientOrder);
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());

        // Update the clientOrder
        ClientOrder updatedClientOrder = clientOrderRepository.findById(clientOrder.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedClientOrder are not directly saved in db
        em.detach(updatedClientOrder);
        updatedClientOrder
            .orderDate(UPDATED_ORDER_DATE)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .status(UPDATED_STATUS)
            .totalPrice(UPDATED_TOTAL_PRICE);

        restClientOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClientOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedClientOrder))
            )
            .andExpect(status().isOk());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedClientOrderToMatchAllProperties(updatedClientOrder);

        await()
            .atMost(5, TimeUnit.SECONDS)
            .untilAsserted(() -> {
                int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
                assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
                List<ClientOrder> clientOrderSearchList = Streamable.of(clientOrderSearchRepository.findAll()).toList();
                ClientOrder testClientOrderSearch = clientOrderSearchList.get(searchDatabaseSizeAfter - 1);

                assertClientOrderAllPropertiesEquals(testClientOrderSearch, updatedClientOrder);
            });
    }

    @Test
    @Transactional
    void putNonExistingClientOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        clientOrder.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clientOrder.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(clientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithIdMismatchClientOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        clientOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(clientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClientOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        clientOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void partialUpdateClientOrderWithPatch() throws Exception {
        // Initialize the database
        insertedClientOrder = clientOrderRepository.saveAndFlush(clientOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clientOrder using partial update
        ClientOrder partialUpdatedClientOrder = new ClientOrder();
        partialUpdatedClientOrder.setId(clientOrder.getId());

        partialUpdatedClientOrder.orderDate(UPDATED_ORDER_DATE).deliveryDate(UPDATED_DELIVERY_DATE).totalPrice(UPDATED_TOTAL_PRICE);

        restClientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClientOrder))
            )
            .andExpect(status().isOk());

        // Validate the ClientOrder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClientOrderUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedClientOrder, clientOrder),
            getPersistedClientOrder(clientOrder)
        );
    }

    @Test
    @Transactional
    void fullUpdateClientOrderWithPatch() throws Exception {
        // Initialize the database
        insertedClientOrder = clientOrderRepository.saveAndFlush(clientOrder);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the clientOrder using partial update
        ClientOrder partialUpdatedClientOrder = new ClientOrder();
        partialUpdatedClientOrder.setId(clientOrder.getId());

        partialUpdatedClientOrder
            .orderDate(UPDATED_ORDER_DATE)
            .deliveryDate(UPDATED_DELIVERY_DATE)
            .deliveryAddress(UPDATED_DELIVERY_ADDRESS)
            .status(UPDATED_STATUS)
            .totalPrice(UPDATED_TOTAL_PRICE);

        restClientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClientOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClientOrder))
            )
            .andExpect(status().isOk());

        // Validate the ClientOrder in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClientOrderUpdatableFieldsEquals(partialUpdatedClientOrder, getPersistedClientOrder(partialUpdatedClientOrder));
    }

    @Test
    @Transactional
    void patchNonExistingClientOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        clientOrder.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clientOrder.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(clientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClientOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        clientOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(clientOrder))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClientOrder() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        clientOrder.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClientOrderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(clientOrder)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClientOrder in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore);
    }

    @Test
    @Transactional
    void deleteClientOrder() throws Exception {
        // Initialize the database
        insertedClientOrder = clientOrderRepository.saveAndFlush(clientOrder);
        clientOrderRepository.save(clientOrder);
        clientOrderSearchRepository.save(clientOrder);

        long databaseSizeBeforeDelete = getRepositoryCount();
        int searchDatabaseSizeBefore = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeBefore).isEqualTo(databaseSizeBeforeDelete);

        // Delete the clientOrder
        restClientOrderMockMvc
            .perform(delete(ENTITY_API_URL_ID, clientOrder.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
        int searchDatabaseSizeAfter = IterableUtil.sizeOf(clientOrderSearchRepository.findAll());
        assertThat(searchDatabaseSizeAfter).isEqualTo(searchDatabaseSizeBefore - 1);
    }

    @Test
    @Transactional
    void searchClientOrder() throws Exception {
        // Initialize the database
        insertedClientOrder = clientOrderRepository.saveAndFlush(clientOrder);
        clientOrderSearchRepository.save(clientOrder);

        // Search the clientOrder
        restClientOrderMockMvc
            .perform(get(ENTITY_SEARCH_API_URL + "?query=id:" + clientOrder.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clientOrder.getId().intValue())))
            .andExpect(jsonPath("$.[*].orderDate").value(hasItem(DEFAULT_ORDER_DATE.toString())))
            .andExpect(jsonPath("$.[*].deliveryDate").value(hasItem(DEFAULT_DELIVERY_DATE.toString())))
            .andExpect(jsonPath("$.[*].deliveryAddress").value(hasItem(DEFAULT_DELIVERY_ADDRESS)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].totalPrice").value(hasItem(sameNumber(DEFAULT_TOTAL_PRICE))));
    }

    protected long getRepositoryCount() {
        return clientOrderRepository.count();
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

    protected ClientOrder getPersistedClientOrder(ClientOrder clientOrder) {
        return clientOrderRepository.findById(clientOrder.getId()).orElseThrow();
    }

    protected void assertPersistedClientOrderToMatchAllProperties(ClientOrder expectedClientOrder) {
        assertClientOrderAllPropertiesEquals(expectedClientOrder, getPersistedClientOrder(expectedClientOrder));
    }

    protected void assertPersistedClientOrderToMatchUpdatableProperties(ClientOrder expectedClientOrder) {
        assertClientOrderAllUpdatablePropertiesEquals(expectedClientOrder, getPersistedClientOrder(expectedClientOrder));
    }
}
