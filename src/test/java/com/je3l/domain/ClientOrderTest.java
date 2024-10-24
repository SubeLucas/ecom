package com.je3l.domain;

import static com.je3l.domain.ClientOrderTestSamples.*;
import static com.je3l.domain.ClientTestSamples.*;
import static com.je3l.domain.OrderLineTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.je3l.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClientOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClientOrder.class);
        ClientOrder clientOrder1 = getClientOrderSample1();
        ClientOrder clientOrder2 = new ClientOrder();
        assertThat(clientOrder1).isNotEqualTo(clientOrder2);

        clientOrder2.setId(clientOrder1.getId());
        assertThat(clientOrder1).isEqualTo(clientOrder2);

        clientOrder2 = getClientOrderSample2();
        assertThat(clientOrder1).isNotEqualTo(clientOrder2);
    }

    @Test
    void orderLinesTest() {
        ClientOrder clientOrder = getClientOrderRandomSampleGenerator();
        OrderLine orderLineBack = getOrderLineRandomSampleGenerator();

        clientOrder.addOrderLines(orderLineBack);
        assertThat(clientOrder.getOrderLines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getClientOrder()).isEqualTo(clientOrder);

        clientOrder.removeOrderLines(orderLineBack);
        assertThat(clientOrder.getOrderLines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getClientOrder()).isNull();

        clientOrder.orderLines(new HashSet<>(Set.of(orderLineBack)));
        assertThat(clientOrder.getOrderLines()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getClientOrder()).isEqualTo(clientOrder);

        clientOrder.setOrderLines(new HashSet<>());
        assertThat(clientOrder.getOrderLines()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getClientOrder()).isNull();
    }

    @Test
    void clientTest() {
        ClientOrder clientOrder = getClientOrderRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        clientOrder.setClient(clientBack);
        assertThat(clientOrder.getClient()).isEqualTo(clientBack);

        clientOrder.client(null);
        assertThat(clientOrder.getClient()).isNull();
    }
}
