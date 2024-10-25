package com.je3l.service;

import com.je3l.domain.Client;
import com.je3l.domain.User;
import com.je3l.repository.ClientRepository;
import com.je3l.security.SecurityUtils;
import com.je3l.service.UserService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    private static final Logger LOG = LoggerFactory.getLogger(MailService.class);
    private final ClientRepository clientRepository;

    private final UserService userService;

    public ClientService(ClientRepository clr, UserService us) {
        this.clientRepository = clr;
        this.userService = us;
    }

    public Client getCurrentClient() throws Exception {
        LOG.debug("getCurrentClient !");
        Client c = clientRepository.findByUserIsCurrentUser().iterator().next();
        return c;
    }
}
