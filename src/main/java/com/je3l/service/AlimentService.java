package com.je3l.service;

import static jakarta.transaction.Transactional.TxType.NOT_SUPPORTED;
import static jakarta.transaction.Transactional.TxType.REQUIRED;

import com.je3l.domain.Aliment;
import com.je3l.repository.AlimentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.OptimisticLockException;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlimentService {

    private static final Logger LOG = LoggerFactory.getLogger(MailService.class);
    private AlimentRepository alimentRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public AlimentService(AlimentRepository ar) {
        this.alimentRepository = ar;
    }

    /**
     *
     * @param id : id of the aliment
     * @param n : quantity to remove
     * @return -1L if not enouth stock, -2L if the aliment doesn't exist, 0L if the aliment is removed from stock'
     */
    @Transactional
    public Long removeFromStock(Long id, int n) {
        Aliment a = entityManager.find(Aliment.class, id, LockModeType.OPTIMISTIC);
        if (a == null) {
            return -2L;
        }
        if (a.getStockQuantity() - n < 0) {
            return -1L;
        }
        a.setStockQuantity(a.getStockQuantity() - n);
        alimentRepository.save(a);
        //LOG.debug("Aliment (",a.getName(),") version : " + a.getVersion());
        return 0L;
    }

    /**
     * Try to get the write lock for the given aliment to decrease the stock quantity.
     * @param alimentId : id of the aliment
     * @param nbProduct : quantity to remove
     * @return -1L if not enouth stock, -2L if the aliment doesn't exist,-3L if can't get the lock,0L if the aliment is removed from stock
     */
    @Transactional
    public Long decStock(Long alimentId, int nbProduct) {
        int attempt = 0;
        while (attempt < 3) {
            try {
                return removeFromStock(alimentId, nbProduct);
            } catch (OptimisticLockException e) {
                // On recommence la transaction
                LOG.warn("decStock : OptimisticLockException occurred, retrying...", e);
                attempt++;
            }
        }
        // Trop d’essais, on abandonne
        return -3L;
    }

    @Transactional
    public boolean incStock(Long alimentId, int nbProduct) {
        int attempt = 0;
        while (attempt < 3) {
            try {
                return addToStock(alimentId, nbProduct);
            } catch (OptimisticLockException e) {
                // On recommence la transaction
                LOG.warn("incStock : OptimisticLockException occurred, retrying...", e);
                attempt++;
            }
        }
        // Trop d’essais, on abandonne
        return false;
    }

    @Transactional
    public boolean addToStock(Long id, int n) {
        Aliment a = entityManager.find(Aliment.class, id, LockModeType.WRITE);
        if (a == null) {
            return false;
        }
        a.setStockQuantity(a.getStockQuantity() + n);
        alimentRepository.save(a);
        return true;
    }
}
