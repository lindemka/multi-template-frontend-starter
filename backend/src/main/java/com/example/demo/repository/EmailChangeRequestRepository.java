package com.example.demo.repository;

import com.example.demo.entity.EmailChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailChangeRequestRepository extends JpaRepository<EmailChangeRequest, Long> {
    Optional<EmailChangeRequest> findByToken(String token);
}


