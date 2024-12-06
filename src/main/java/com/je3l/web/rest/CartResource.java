package com.je3l.web.rest;

import static org.apache.commons.lang3.ArrayUtils.remove;
import static org.apache.commons.lang3.ArrayUtils.removeElement;

import com.je3l.domain.Aliment;
import com.je3l.domain.Client;
import com.je3l.domain.ClientOrder;
import com.je3l.repository.AlimentRepository;
import com.je3l.service.ClientService;
import com.je3l.service.OrderService;
import com.je3l.service.dto.CartDTO;
import com.je3l.service.dto.CartItem;
import com.je3l.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.OptimisticLockException;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
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
    public Long validateCart(@Valid @RequestBody CartDTO cartDTO) throws BadRequestAlertException, Exception {
        CartItem[] cartItems = cartDTO.getCartItems();
        LocalDate deliveryDate = cartDTO.getDeliveryDate();
        if (!checkCart(cartItems)) {
            return -1L;
        }
        if (!checkDeliveryDate(deliveryDate)) {
            return -4L;
        }
        cartItems = fuseDouble(cartItems);

        Client c = clientService.getCurrentClient();

        try {
            ClientOrder order = orderService.addOrder(cartItems, c, deliveryDate);
            if (order != null) {
                // Si assez de stock
                return order.getId();
            }
            // Erreur pas assez de stock
            LOG.warn("Stock missing error");
            return -3L;
        } catch (OptimisticLockException e) {
            LOG.warn("OptimisticLockException occurred", e);
            return -2L;
        }
    }

    /*
    Check if the cart is valid.
     */
    private Boolean checkCart(CartItem[] cartItems) {
        for (CartItem item : cartItems) {
            if (item.getQt() <= 0) {
                return false;
            }
            Aliment a = alimentRepository.findById(item.getId()).orElse(null);
            if (a == null) {
                LOG.debug("Aliment id wasn't found " + item.getId());
                return false;
            }
        }
        return true;
    }

    /*
     * Fuse double items in the cart, so that the quantity is added up.
     */
    private CartItem[] fuseDouble(CartItem[] cartItems) {
        Map<Long, Integer> idToQtMap = new HashMap<>();

        for (CartItem item : cartItems) {
            Long id = item.getId();
            int qt = item.getQt();
            idToQtMap.put(id, idToQtMap.getOrDefault(id, 0) + qt);
        }

        CartItem[] fusedCartItems = new CartItem[idToQtMap.size()];
        int index = 0;
        for (Map.Entry<Long, Integer> entry : idToQtMap.entrySet()) {
            fusedCartItems[index++] = new CartItem(entry.getKey(), entry.getValue());
        }

        return fusedCartItems;
    }

    private boolean checkDeliveryDate(LocalDate date) {
        return LocalDate.now().isBefore(date);
    }
}
