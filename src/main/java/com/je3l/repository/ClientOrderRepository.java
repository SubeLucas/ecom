package com.je3l.repository;

import com.je3l.domain.ClientOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ClientOrder entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClientOrderRepository extends JpaRepository<ClientOrder, Long> {}
