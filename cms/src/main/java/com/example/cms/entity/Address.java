package com.example.cms.entity;

import javax.persistence.*;

@Entity
@Table(name = "customer_address")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "address_line_1")
    private String addressLine1; // [cite: 20]

    @Column(name = "address_line_2")
    private String addressLine2; // [cite: 21]

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city; // Links to the master data table

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }
    public String getAddressLine2() { return addressLine2; }
    public void setAddressLine2(String addressLine2) { this.addressLine2 = addressLine2; }
    public City getCity() { return city; }
    public void setCity(City city) { this.city = city; }
}