package com.je3l.domain;

import static com.je3l.domain.AlimentTestSamples.*;
import static com.je3l.domain.ClientOrderTestSamples.*;
import static com.je3l.domain.OrderLineTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.je3l.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OrderLineTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OrderLine.class);
        OrderLine orderLine1 = getOrderLineSample1();
        OrderLine orderLine2 = new OrderLine();
        assertThat(orderLine1).isNotEqualTo(orderLine2);

        orderLine2.setId(orderLine1.getId());
        assertThat(orderLine1).isEqualTo(orderLine2);

        orderLine2 = getOrderLineSample2();
        assertThat(orderLine1).isNotEqualTo(orderLine2);
    }

    @Test
    void clientOrderTest() {
        OrderLine orderLine = getOrderLineRandomSampleGenerator();
        ClientOrder clientOrderBack = getClientOrderRandomSampleGenerator();

        orderLine.setClientOrder(clientOrderBack);
        assertThat(orderLine.getClientOrder()).isEqualTo(clientOrderBack);

        orderLine.clientOrder(null);
        assertThat(orderLine.getClientOrder()).isNull();
    }

    @Test
    void alimentTest() {
        OrderLine orderLine = getOrderLineRandomSampleGenerator();
        Aliment alimentBack = getAlimentRandomSampleGenerator();

        orderLine.setAliment(alimentBack);
        assertThat(orderLine.getAliment()).isEqualTo(alimentBack);

        orderLine.aliment(null);
        assertThat(orderLine.getAliment()).isNull();
    }
}
