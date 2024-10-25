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
    private HashMap<Aliment, Integer> items = new HashMap<>();
    private static final String ENTITY_NAME = "cart";

    @Autowired
    private UserService userService;

    @Autowired
    private AlimentRepository alimentRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private ClientRepository clientRepository;

    @PostMapping("/delete")
    public boolean removeItem(@Valid @RequestBody CartDTO cartDTO) throws BadRequestAlertException {
        Aliment aliment = cartDTO.getAliment();
        int quantity = cartDTO.getQuantity();

        Aliment existingAliment = alimentRepository.findById(aliment.getId()).orElse(null);

        if (existingAliment == null) {
            LOG.debug("Aliment nul :" + existingAliment);
            return false;
        }

        LOG.debug("DEBUG : " + aliment.toString() + " Supprimé du cart");
        items.remove(aliment);
        return true;
    }

    @PostMapping("/set")
    public boolean addItem(@Valid @RequestBody CartDTO cartDTO) throws BadRequestAlertException {
        Aliment aliment = cartDTO.getAliment();
        int quantity = cartDTO.getQuantity();

        Aliment existingAliment = alimentRepository.findById(aliment.getId()).orElse(null);

        if (existingAliment == null || existingAliment.getStockQuantity() < quantity) {
            LOG.debug("Quantité insuffisante ou aliment nul " + existingAliment + ", quantité : " + quantity);
            return false;
        }
        LOG.debug("DEBUG : " + aliment.toString() + " Ajouté au cart");
        items.put(aliment, quantity);
        return true;
    }

    @GetMapping("")
    public Map<Aliment, Integer> getItems() {
        return items;
    }

    @GetMapping("/validate")
    public boolean validateCart() throws Exception {
        Client c = clientService.getCurrentClient();

        if (items.isEmpty()) {
            System.err.println("Le panier est vide");
            return false;
        }
        orderService.addOrder(items, c);
        return true;
    }
}
