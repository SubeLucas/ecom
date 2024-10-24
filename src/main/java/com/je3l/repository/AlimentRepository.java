package com.je3l.repository;

import com.je3l.domain.Aliment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Aliment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlimentRepository extends JpaRepository<Aliment, Long> {}
