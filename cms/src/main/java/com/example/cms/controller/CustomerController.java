package com.example.cms.controller;

import com.example.cms.entity.Customer;
import com.example.cms.service.BulkCustomerService;
import com.example.cms.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*") // Crucial for allowing your React app to connect
public class CustomerController {

    @Autowired
    private BulkCustomerService bulkCustomerService;

    @Autowired
    private CustomerService customerService;

    // ==========================================
    // 1. Bulk Upload Endpoint (Already completed)
    // ==========================================
    @PostMapping("/upload")
    public ResponseEntity<String> uploadBulkCustomers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a valid Excel file.");
        }
        try {
            bulkCustomerService.processBulkExcelUpload(file);
            return ResponseEntity.ok("Bulk upload processed successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing file: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. Standard CRUD Endpoints
    // ==========================================

    // Create a new customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.createCustomer(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    // View all customers (For the React table view)
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // View a specific customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update an existing customer
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerData) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customerData);
            return ResponseEntity.ok(updatedCustomer);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}