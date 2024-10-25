package com.je3l.web.rest;

import com.je3l.domain.Aliment;
import com.je3l.domain.Client;
import com.je3l.domain.User;
import com.je3l.repository.AlimentRepository;
import com.je3l.repository.ClientRepository;
import com.je3l.service.ClientService;
import com.je3l.service.OrderService;
import com.je3l.service.UserService;
import com.je3l.service.dto.CartDTO;
import com.je3l.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
        HashMap<Long, Integer> cart = cartDTO.getCart();
        HashMap<Aliment, Integer> order_cart = new HashMap<Aliment, Integer>();

        for (Map.Entry<Long, Integer> entry : cart.entrySet()) {
            Long k = entry.getKey();
            Integer v = entry.getValue();

            if (v <= 0) {
                return false;
            }
            Aliment a = alimentRepository.findById(k).orElse(null);
            if (a == null) {
                LOG.debug("Aliment id wasn't found " + k);
                return false;
            }
            if (a.getStockQuantity() < v) {
                return false;
            }
            order_cart.put(a, v);
        }

        Client c = clientService.getCurrentClient();
        orderService.addOrder(order_cart, c);
        return true;
    }
}
