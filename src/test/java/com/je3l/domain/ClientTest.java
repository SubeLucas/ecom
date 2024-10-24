package com.je3l.domain;

import static com.je3l.domain.ClientOrderTestSamples.*;
import static com.je3l.domain.ClientTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.je3l.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ClientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Client.class);
        Client client1 = getClientSample1();
        Client client2 = new Client();
        assertThat(client1).isNotEqualTo(client2);

        client2.setId(client1.getId());
        assertThat(client1).isEqualTo(client2);

        client2 = getClientSample2();
        assertThat(client1).isNotEqualTo(client2);
    }

    @Test
    void ordersTest() {
        Client client = getClientRandomSampleGenerator();
        ClientOrder clientOrderBack = getClientOrderRandomSampleGenerator();

        client.addOrders(clientOrderBack);
        assertThat(client.getOrders()).containsOnly(clientOrderBack);
        assertThat(clientOrderBack.getClient()).isEqualTo(client);

        client.removeOrders(clientOrderBack);
        assertThat(client.getOrders()).doesNotContain(clientOrderBack);
        assertThat(clientOrderBack.getClient()).isNull();

        client.orders(new HashSet<>(Set.of(clientOrderBack)));
        assertThat(client.getOrders()).containsOnly(clientOrderBack);
        assertThat(clientOrderBack.getClient()).isEqualTo(client);

        client.setOrders(new HashSet<>());
        assertThat(client.getOrders()).doesNotContain(clientOrderBack);
        assertThat(clientOrderBack.getClient()).isNull();
    }
}
