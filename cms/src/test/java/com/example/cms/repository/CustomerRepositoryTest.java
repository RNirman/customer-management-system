package com.example.cms.repository;

import com.example.cms.entity.Customer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class CustomerRepositoryTest {

    @Autowired
    private CustomerRepository customerRepository;

    @Test
    void testSaveCustomer_Success() {
        Customer customer = new Customer();
        customer.setName("Test User");
        customer.setDob(LocalDate.of(1990, 1, 1));
        customer.setNic("123456789V");

        Customer savedCustomer = customerRepository.save(customer);

        assertNotNull(savedCustomer.getId(), "Database should generate and assign an ID");
    }

    @Test
    void testSaveCustomer_DuplicateNic_ThrowsException() {
        Customer customer1 = new Customer();
        customer1.setName("User One");
        customer1.setDob(LocalDate.of(1990, 1, 1));
        customer1.setNic("DUPLICATE_NIC_99");

        // saveAndFlush forces Hibernate to send the insert to the database immediately
        customerRepository.saveAndFlush(customer1);

        Customer customer2 = new Customer();
        customer2.setName("User Two");
        customer2.setDob(LocalDate.of(1995, 5, 5));
        customer2.setNic("DUPLICATE_NIC_99");

        // Assert: Expect the database to block it and throw a DataIntegrityViolationException
        assertThrows(DataIntegrityViolationException.class, () -> {
            customerRepository.saveAndFlush(customer2);
        }, "Should throw an exception when trying to save a duplicate NIC");
    }
}