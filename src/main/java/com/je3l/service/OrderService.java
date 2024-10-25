package com.je3l.service;

import com.je3l.domain.Aliment;
import com.je3l.domain.Client;
import com.je3l.domain.ClientOrder;
import com.je3l.domain.OrderLine;
import com.je3l.domain.User;
import com.je3l.domain.enumeration.EnumStatus;
import com.je3l.repository.ClientOrderRepository;
import com.je3l.repository.OrderLineRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import tech.jhipster.config.JHipsterProperties;

@Service
public class OrderService {

    private static final Logger LOG = LoggerFactory.getLogger(MailService.class);
    private final OrderLineRepository orderLineRepository;
    private final ClientOrderRepository clientOrderRepository;

    public OrderService(OrderLineRepository olr, ClientOrderRepository cor) {
        this.orderLineRepository = olr;
        this.clientOrderRepository = cor;
    }

    @Transactional
    public void addOrder(HashMap<Aliment, Integer> order, Client c) {
        BigDecimal totalPrice = BigDecimal.valueOf(-1);

        ClientOrder co = new ClientOrder()
            .client(c)
            .status(EnumStatus.IN_PROGRESS)
            .orderDate(LocalDate.now())
            .deliveryDate(LocalDate.now().plusDays(7))
            .deliveryAddress(c.getAddress()) // Faire un getter dans client qui va chercher dans le bon type de client
            .totalPrice(totalPrice);

        for (Map.Entry<Aliment, Integer> entry : order.entrySet()) {
            Aliment key = entry.getKey();
            Integer value = entry.getValue();
            OrderLine ol = new OrderLine()
                .aliment(key)
                .quantity(value)
                .purchasePrice(key.getPrice().multiply(BigDecimal.valueOf(value)))
                .clientOrder(co);
            orderLineRepository.save(ol);
            totalPrice = totalPrice.add(key.getPrice().multiply(BigDecimal.valueOf(value)));
        }

        co.totalPrice(totalPrice);
        clientOrderRepository.save(co);
    }
}
