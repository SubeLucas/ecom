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
        ClientOrder co = new ClientOrder()
            .client(c)
            .status(EnumStatus.IN_PROGRESS)
            .orderDate(LocalDate.now())
            .deliveryDate(LocalDate.now().plusDays(7))
            .deliveryAddress("TEMP ADDRESS") // Faire un getter dans client qui va chercher dans le bon type de client
            //.deliveryAddress(c.getAddress())
            .totalPrice(BigDecimal.ZERO);

        clientOrderRepository.save(co);
        order.forEach((key, value) -> {
            OrderLine ol = new OrderLine().aliment(key).quantity(value).purchasePrice(BigDecimal.ZERO).clientOrder(co);
            orderLineRepository.save(ol);
        });
    }
}