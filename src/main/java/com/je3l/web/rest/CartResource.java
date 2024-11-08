package com.je3l.web.rest;

import com.je3l.domain.Aliment;
import com.je3l.domain.Client;
import com.je3l.repository.AlimentRepository;
import com.je3l.service.ClientService;
import com.je3l.service.OrderService;
import com.je3l.service.dto.CartDTO;
import com.je3l.service.dto.CartItem;
import com.je3l.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.OptimisticLockException;
import jakarta.validation.Valid;
import java.util.HashMap;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Transactional
public class CartResource {

    private static final Logger LOG = org.slf4j.LoggerFactory.getLogger(CartResource.class);
    private static final String ENTITY_NAME = "cart";

    @Autowired
    private AlimentRepository alimentRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ClientService clientService;

    @PostMapping("")
    public boolean validateCart(@Valid @RequestBody CartDTO cartDTO) throws BadRequestAlertException, Exception {
        HashMap<Aliment, Integer> order_cart = new HashMap<Aliment, Integer>();
        CartItem[] cartItems = cartDTO.getCartItems();
        for (int i = 0; i < cartItems.length; i++) {
            Long id = cartItems[i].getId();
            Integer qt = cartItems[i].getQt();

            if (qt <= 0) {
                return false;
            }
            Aliment a = alimentRepository.findById(id).orElse(null);
            if (a == null) {
                LOG.debug("Aliment id wasn't found " + id);
                return false;
            }
            if (a.getStockQuantity() < qt) {
                return false;
            }
            order_cart.put(a, qt);
        }

        Client c = clientService.getCurrentClient();

        try {
            orderService.addOrder(order_cart, c);
        } catch (OptimisticLockException e) {
            LOG.warn("OptimisticLockException occurred, retrying...", e);
            return false;
        }

        return true;
    }
}
