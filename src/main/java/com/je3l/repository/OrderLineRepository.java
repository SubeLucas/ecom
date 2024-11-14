package com.je3l.repository;

import com.je3l.domain.OrderLine;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderLine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderLineRepository extends JpaRepository<OrderLine, Long> {
    @Query("SELECT ol FROM OrderLine ol WHERE ol.clientOrder.id = ?1")
    List<OrderLine> findByClientOrderId(Long clientOrderId);
}
