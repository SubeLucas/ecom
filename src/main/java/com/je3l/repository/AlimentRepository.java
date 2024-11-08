package com.je3l.repository;

import com.je3l.domain.Aliment;
import com.je3l.domain.enumeration.EnumColor;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Aliment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlimentRepository extends JpaRepository<Aliment, Long> {
    @Query("select aliment from Aliment aliment where aliment.id % 2 = 1")
    List<Aliment> findFruits();

    @Query("select aliment from Aliment aliment where aliment.id % 2 = 0")
    List<Aliment> findVegetable();

    @Query("select aliment from Aliment aliment where aliment.color = ?1")
    List<Aliment> findColor(EnumColor color);
}
