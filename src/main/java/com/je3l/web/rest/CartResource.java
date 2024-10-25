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

    @PostMapping("")
    public void addItem(@Valid @RequestBody CartDTO cartDTO) throws BadRequestAlertException {
        Aliment aliment = cartDTO.getAliment();
        int quantity = cartDTO.getQuantity();

        Aliment existingAliment = alimentRepository.findById(aliment.getId()).orElse(null);

        if (existingAliment == null || existingAliment.getStockQuantity() < quantity) {
            System.err.println("Pas assez de stock :" + aliment.toString() + " quantity" + quantity);
            throw new BadRequestAlertException("Not enough", ENTITY_NAME, "quantity" + quantity + " requested");
        }

        LOG.debug("DEBUG : " + aliment.toString() + "Ajouté au cart");

        items.put(aliment, quantity);
    }

    @GetMapping("")
    public Map<Aliment, Integer> getItems() {
        return items;
    }

    @GetMapping("/validate")
    public boolean validateCart() throws Exception {
        /*
        Optional<User> opt_user = userService.getUserWithAuthorities();
        if (opt_user.isEmpty()) {
            return false;
        }
        User u = opt_user.get();
        */
        Client c = clientService.getCurrentClient();

        if (items.isEmpty()) {
            System.err.println("Le panier est vide");
            return false;
        }

        orderService.addOrder(items, c);

        /*for (Map.Entry<Aliment, Integer> alimentIntegerEntry : items.entrySet()) {
            Map.Entry orderLine = (Map.Entry) alimentIntegerEntry;
            Aliment aliment = (Aliment) orderLine.getKey();
            int quantity = (int) orderLine.getValue();
            System.out.println("Add " + aliment.toString() + " " + quantity);
            //orderService.addOrder(aliment)
        }*/

        return true;
    }
}
