package com.je3l.repository;

import com.je3l.domain.Images;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Images entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
    @Query("SELECT images FROM Images images WHERE images.aliment.id = ?1")
    Optional<Images> findByAlimentId(Long alimentId);
}
