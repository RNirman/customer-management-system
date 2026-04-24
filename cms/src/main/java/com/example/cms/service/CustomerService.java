package com.example.cms.service;

import com.example.cms.entity.Customer;
import com.example.cms.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        // Fetches only the 100 newest records to prevent OutOfMemory crashes on large datasets
        return customerRepository.findTop100ByOrderByIdDesc();
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