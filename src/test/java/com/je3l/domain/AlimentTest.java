package com.je3l.domain;

import static com.je3l.domain.AlimentTestSamples.*;
import static com.je3l.domain.ImagesTestSamples.*;
import static com.je3l.domain.OrderLineTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.je3l.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AlimentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Aliment.class);
        Aliment aliment1 = getAlimentSample1();
        Aliment aliment2 = new Aliment();
        assertThat(aliment1).isNotEqualTo(aliment2);

        aliment2.setId(aliment1.getId());
        assertThat(aliment1).isEqualTo(aliment2);

        aliment2 = getAlimentSample2();
        assertThat(aliment1).isNotEqualTo(aliment2);
    }

    @Test
    void clientOrdersTest() {
        Aliment aliment = getAlimentRandomSampleGenerator();
        OrderLine orderLineBack = getOrderLineRandomSampleGenerator();

        aliment.addClientOrders(orderLineBack);
        assertThat(aliment.getClientOrders()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getAliment()).isEqualTo(aliment);

        aliment.removeClientOrders(orderLineBack);
        assertThat(aliment.getClientOrders()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getAliment()).isNull();

        aliment.clientOrders(new HashSet<>(Set.of(orderLineBack)));
        assertThat(aliment.getClientOrders()).containsOnly(orderLineBack);
        assertThat(orderLineBack.getAliment()).isEqualTo(aliment);

        aliment.setClientOrders(new HashSet<>());
        assertThat(aliment.getClientOrders()).doesNotContain(orderLineBack);
        assertThat(orderLineBack.getAliment()).isNull();
    }

    @Test
    void imagesTest() {
        Aliment aliment = getAlimentRandomSampleGenerator();
        Images imagesBack = getImagesRandomSampleGenerator();

        aliment.addImages(imagesBack);
        assertThat(aliment.getImages()).containsOnly(imagesBack);
        assertThat(imagesBack.getAliment()).isEqualTo(aliment);

        aliment.removeImages(imagesBack);
        assertThat(aliment.getImages()).doesNotContain(imagesBack);
        assertThat(imagesBack.getAliment()).isNull();

        aliment.images(new HashSet<>(Set.of(imagesBack)));
        assertThat(aliment.getImages()).containsOnly(imagesBack);
        assertThat(imagesBack.getAliment()).isEqualTo(aliment);

        aliment.setImages(new HashSet<>());
        assertThat(aliment.getImages()).doesNotContain(imagesBack);
        assertThat(imagesBack.getAliment()).isNull();
    }
}
