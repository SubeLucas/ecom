package com.je3l.repository;

import com.je3l.domain.Client;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Client entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    @Query("select client from Client client where client.user.login = ?#{authentication.name}")
    List<Client> findByUserIsCurrentUser();
}
