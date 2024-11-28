package com.je3l.service;

import com.je3l.domain.Aliment;
import com.je3l.domain.Client;
import com.je3l.domain.ClientOrder;
import com.je3l.domain.OrderLine;
import com.je3l.domain.enumeration.EnumStatus;
import com.je3l.repository.AlimentRepository;
import com.je3l.repository.ClientOrderRepository;
import com.je3l.repository.OrderLineRepository;
import com.je3l.service.dto.CartItem;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private static final Logger LOG = LoggerFactory.getLogger(MailService.class);
    private final OrderLineRepository orderLineRepository;
    private final ClientOrderRepository clientOrderRepository;
    private final AlimentService alimentService;
    private final AlimentRepository alimentRepository;

    public OrderService(OrderLineRepository olr, ClientOrderRepository cor, AlimentService as, AlimentRepository ar) {
        this.orderLineRepository = olr;
        this.clientOrderRepository = cor;
        this.alimentService = as;
        this.alimentRepository = ar;
    }

    @Transactional
    public ClientOrder addOrder(CartItem[] order, Client c) {
        BigDecimal totalPrice = BigDecimal.valueOf(0);
        ClientOrder co = new ClientOrder()
            .client(c)
            .status(EnumStatus.IN_PROGRESS)
            .orderDate(LocalDate.now())
            .deliveryDate(LocalDate.now().plusDays(3))
            .deliveryAddress(c.getAddress())
            .totalPrice(totalPrice);

        for (int i = 0; i < order.length; i++) {
            Optional<Aliment> al = alimentRepository.findById(order[i].getId());
            int finalI = i;
            Aliment aliment = al.orElseThrow(() -> new RuntimeException("Aliment not found: " + order[finalI].getId()));
            Integer qt = order[i].getQt();
            OrderLine ol = new OrderLine()
                .aliment(aliment)
                .quantity(qt)
                .purchasePrice(aliment.getPrice().multiply(BigDecimal.valueOf(qt)))
                .clientOrder(co);
            if (!alimentService.decStock(aliment.getId(), qt)) {
                throw new RuntimeException("Not enough stock for aliment: " + aliment.getName());
            }
            orderLineRepository.save(ol);
            totalPrice = totalPrice.add(aliment.getPrice().multiply(BigDecimal.valueOf(qt)));
        }

        co.totalPrice(totalPrice);
        return clientOrderRepository.save(co);
    }

    @Transactional
    public void cancelOrder(Long orderId) {
        Optional<ClientOrder> co = clientOrderRepository.findById(orderId);
        ClientOrder order = co.orElseThrow(() -> new RuntimeException("cancelOrder : Order not found: " + orderId));
        order.setStatus(EnumStatus.CANCELLED);
        for (OrderLine ol : order.getOrderLines()) {
            alimentService.incStock(ol.getAliment().getId(), ol.getQuantity());
        }
        clientOrderRepository.save(order);
    }

    public List<ClientOrder> getClientHistory() {
        return clientOrderRepository.findClientHistory();
    }
}
