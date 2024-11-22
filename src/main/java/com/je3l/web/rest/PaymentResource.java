package com.je3l.web.rest;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentResource {

    @PostMapping("")
    public boolean getAllPublicUsers(@Valid @RequestBody String cardNumber) throws URISyntaxException {
        return true;
    }
}
