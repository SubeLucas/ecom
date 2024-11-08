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
    private final AlimentService alimentService;

    public OrderService(OrderLineRepository olr, ClientOrderRepository cor, AlimentService as) {
        this.orderLineRepository = olr;
        this.clientOrderRepository = cor;
        this.alimentService = as; // A remplacer par un référence au service d'aliment'
    }

    @Transactional
    public void addOrder(HashMap<Aliment, Integer> order, Client c) {
        BigDecimal totalPrice = BigDecimal.valueOf(0);
        ClientOrder co = new ClientOrder()
            .client(c)
            .status(EnumStatus.IN_PROGRESS)
            .orderDate(LocalDate.now())
            .deliveryDate(LocalDate.now().plusDays(3))
            .deliveryAddress(c.getAddress())
            .totalPrice(totalPrice);

        for (Map.Entry<Aliment, Integer> entry : order.entrySet()) {
            Aliment key = entry.getKey();
            Integer value = entry.getValue();
            OrderLine ol = new OrderLine()
                .aliment(key)
                .quantity(value)
                .purchasePrice(key.getPrice().multiply(BigDecimal.valueOf(value)))
                .clientOrder(co);
            if (!alimentService.decStock(key.getId(), value)) {
                throw new RuntimeException("Not enough stock for aliment: " + key.getName());
            }
            orderLineRepository.save(ol);
            totalPrice = totalPrice.add(key.getPrice().multiply(BigDecimal.valueOf(value)));
        }

        co.totalPrice(totalPrice);
        clientOrderRepository.save(co);
    }
}
