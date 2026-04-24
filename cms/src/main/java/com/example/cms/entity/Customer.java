package com.example.cms.entity;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // [cite: 14]

    @Column(nullable = false)
    private LocalDate dob; // [cite: 15]

    @Column(nullable = false, unique = true)
    private String nic; // [cite: 16]

    @ElementCollection
    @CollectionTable(name = "customer_mobile", joinColumns = @JoinColumn(name = "customer_id"))
    @Column(name = "mobile_number")
    private List<String> mobileNumbers; // [cite: 17]

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "customer_id")
    private List<Address> addresses; // [cite: 19]

    @ManyToMany
    @JoinTable(
            name = "customer_family",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "family_member_id")
    )
    @JsonIgnoreProperties("familyMembers") // Stops the infinite JSON loop
    private Set<Customer> familyMembers;

    // Getters and Setters...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public List<String> getMobileNumbers() {
        return mobileNumbers;
    }

    public void setMobileNumbers(List<String> mobileNumbers) {
        this.mobileNumbers = mobileNumbers;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

    public Set<Customer> getFamilyMembers() {
        return familyMembers;
    }

    public void setFamilyMembers(Set<Customer> familyMembers) {
        this.familyMembers = familyMembers;
    }
}