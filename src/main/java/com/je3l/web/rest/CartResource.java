package com.je3l.web.rest;

import com.je3l.domain.Aliment;
import com.je3l.domain.User;
import com.je3l.repository.AlimentRepository;
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
    private Map<Aliment, Integer> items = new HashMap<>();
    private static final String ENTITY_NAME = "cart";

    @Autowired
    private UserService userService;

    @Autowired
    private AlimentRepository alimentRepository;

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
    public boolean validateCart() {
        Optional<User> opt_user = userService.getUserWithAuthorities();
        if (opt_user.isEmpty()) {
            return false;
        }
        User u = opt_user.get();
        // add with order service
        return true;
    }
}
