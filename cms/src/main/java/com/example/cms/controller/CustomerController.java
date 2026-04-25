package com.example.cms.controller;

import com.example.cms.entity.Customer;
import com.example.cms.service.BulkCustomerService;
import com.example.cms.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
import com.example.cms.dto.UploadProgress;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private BulkCustomerService bulkCustomerService;

    @Autowired
    private CustomerService customerService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadBulkCustomers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a valid Excel file.");
        }
        try {
            String jobId = UUID.randomUUID().toString();
            
            java.io.File tempFile = java.io.File.createTempFile("bulk-upload-", ".xlsx");
            file.transferTo(tempFile);
            
            bulkCustomerService.processBulkExcelUpload(tempFile, jobId);
            
            Map<String, String> response = new HashMap<>();
            response.put("jobId", jobId);
            response.put("message", "Bulk upload started.");
            
            return ResponseEntity.accepted().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error starting file processing: " + e.getMessage());
        }
    }

    @GetMapping("/upload/status/{jobId}")
    public ResponseEntity<?> getUploadStatus(@PathVariable String jobId) {
        UploadProgress progress = bulkCustomerService.getJobStatus(jobId);
        if (progress == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(progress);
    }

    // Create a new customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.createCustomer(customer);
        return ResponseEntity.ok(savedCustomer);
    }

    // View all customers
    @GetMapping
    public ResponseEntity<Page<Customer>> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<Customer> customers = customerService.getCustomers(search, page, size);
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