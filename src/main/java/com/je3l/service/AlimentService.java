package com.je3l.service;

import com.je3l.domain.Aliment;
import com.je3l.repository.AlimentRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AlimentService {

    private static final Logger LOG = LoggerFactory.getLogger(MailService.class);
    private AlimentRepository alimentRepository;

    public AlimentService(AlimentRepository ar) {
        this.alimentRepository = ar;
    }

    @Transactional
    public boolean removeFromStock(Aliment a, int n) {
        if (a.getStockQuantity() - n < 0) {
            return false;
        }
        a.setStockQuantity(a.getStockQuantity() - n);
        alimentRepository.save(a);
        return true;
    }
}
