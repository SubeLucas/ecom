package com.je3l.domain;

import static com.je3l.domain.AlimentTestSamples.*;
import static com.je3l.domain.ImagesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.je3l.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ImagesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Images.class);
        Images images1 = getImagesSample1();
        Images images2 = new Images();
        assertThat(images1).isNotEqualTo(images2);

        images2.setId(images1.getId());
        assertThat(images1).isEqualTo(images2);

        images2 = getImagesSample2();
        assertThat(images1).isNotEqualTo(images2);
    }

    @Test
    void alimentTest() {
        Images images = getImagesRandomSampleGenerator();
        Aliment alimentBack = getAlimentRandomSampleGenerator();

        images.setAliment(alimentBack);
        assertThat(images.getAliment()).isEqualTo(alimentBack);

        images.aliment(null);
        assertThat(images.getAliment()).isNull();
    }
}
