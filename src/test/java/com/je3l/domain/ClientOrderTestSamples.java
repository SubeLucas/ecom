package com.je3l.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ClientOrderTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ClientOrder getClientOrderSample1() {
        return new ClientOrder().id(1L).deliveryAddress("deliveryAddress1");
    }

    public static ClientOrder getClientOrderSample2() {
        return new ClientOrder().id(2L).deliveryAddress("deliveryAddress2");
    }

    public static ClientOrder getClientOrderRandomSampleGenerator() {
        return new ClientOrder().id(longCount.incrementAndGet()).deliveryAddress(UUID.randomUUID().toString());
    }
}
