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

    // 5155 1234 5678 9108 mastercard valid
    // 5155 1233 5678 9108 mastercard invalid
    @PostMapping("")
    public boolean verifyCreditCard(@Valid @RequestBody String cardNumber) throws URISyntaxException {
        if (cardNumber.length() != 16) {
            return false;
        }
        int sum = 0;
        int parity = cardNumber.length() % 2;
        int last_digit = cardNumber.charAt(cardNumber.length() - 1) - '0';
        if (last_digit > 9 || last_digit < 0) {
            return false;
        }
        for (int i = 0; i < cardNumber.length() - 1; i++) {
            int digit = cardNumber.charAt(i) - '0';
            if (digit > 9 || digit < 0) {
                return false;
            }
            if (i % 2 != parity) {
                sum += digit;
            } else if (digit > 4) {
                sum += 2 * digit - 9;
            } else {
                sum += 2 * digit;
            }
        }
        return last_digit == ((10 - (sum % 10)) % 10);
    }
}
