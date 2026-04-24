package com.example.cms.controller;

import com.example.cms.entity.Customer;
import com.example.cms.service.BulkCustomerService;
import com.example.cms.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerService customerService;

    @MockBean
    private BulkCustomerService bulkCustomerService;

    @Test
    void testGetAllCustomers_Returns200AndJsonArray() throws Exception {
        Customer c1 = new Customer();
        c1.setId(1L);
        c1.setName("Alice Fernando");

        Customer c2 = new Customer();
        c2.setId(2L);
        c2.setName("Bob Silva");

        Mockito.when(customerService.getAllCustomers()).thenReturn(Arrays.asList(c1, c2));

        // Act & Assert: Fire a GET request and verify the JSON response
        mockMvc.perform(get("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // Expect HTTP 200 OK
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].name").value("Alice Fernando"))
                .andExpect(jsonPath("$[1].name").value("Bob Silva"));
    }

    @Test
    void testGetCustomerById_WhenCustomerDoesNotExist_Returns404() throws Exception {
        // Arrange: Tell Mockito to return an empty Optional when ID 99 is requested
        Mockito.when(customerService.getCustomerById(99L)).thenReturn(Optional.empty());

        // Act & Assert: Fire a GET request and expect it to fail gracefully
        mockMvc.perform(get("/api/customers/99")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // Expect HTTP 404 Not Found
    }
}