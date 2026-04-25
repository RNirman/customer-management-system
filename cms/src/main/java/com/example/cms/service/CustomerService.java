package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Page<Customer> getCustomers(String search, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        if (search != null && !search.trim().isEmpty()) {
            return customerRepository.findByNameContainingIgnoreCaseOrNicContainingIgnoreCase(search.trim(), search.trim(), pageRequest);
        }
        return customerRepository.findAll(pageRequest);
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Transactional
    public Customer updateCustomer(Long id, Customer updatedData) {
        return customerRepository.findById(id).map(existingCustomer -> {
            existingCustomer.setName(updatedData.getName());
            existingCustomer.setDob(updatedData.getDob());
            existingCustomer.setNic(updatedData.getNic());

            existingCustomer.getMobileNumbers().clear();
            if (updatedData.getMobileNumbers() != null) {
                existingCustomer.getMobileNumbers().addAll(updatedData.getMobileNumbers());
            }

            existingCustomer.getAddresses().clear();
            if (updatedData.getAddresses() != null) {
                existingCustomer.getAddresses().addAll(updatedData.getAddresses());
            }

            existingCustomer.getFamilyMembers().clear();
            if (updatedData.getFamilyMembers() != null) {
                existingCustomer.getFamilyMembers().addAll(updatedData.getFamilyMembers());
            }

            return customerRepository.save(existingCustomer);
        }).orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}