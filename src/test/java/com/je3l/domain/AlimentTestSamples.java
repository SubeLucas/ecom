package com.je3l.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AlimentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Aliment getAlimentSample1() {
        return new Aliment().id(1L).name("name1").season(1).stockQuantity(1);
    }

    public static Aliment getAlimentSample2() {
        return new Aliment().id(2L).name("name2").season(2).stockQuantity(2);
    }

    public static Aliment getAlimentRandomSampleGenerator() {
        return new Aliment()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .season(intCount.incrementAndGet())
            .stockQuantity(intCount.incrementAndGet());
    }
}
