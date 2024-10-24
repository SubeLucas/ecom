package com.je3l.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ImagesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Images getImagesSample1() {
        return new Images().id(1L).url("url1");
    }

    public static Images getImagesSample2() {
        return new Images().id(2L).url("url2");
    }

    public static Images getImagesRandomSampleGenerator() {
        return new Images().id(longCount.incrementAndGet()).url(UUID.randomUUID().toString());
    }
}
