package com.example.cms.repository;

import com.example.cms.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Spring Boot automatically provides findAll(), findById(), save(), etc.
}