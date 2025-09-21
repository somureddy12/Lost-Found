package com.example.Model;

import java.time.LocalDate;

public class ItemResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String location;
    private LocalDate dateReported;
    private String contactInfo;
    private String status;
    private String imageBase64; // <-- for frontend use
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
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public LocalDate getDateReported() {
        return dateReported;
    }
    public void setDateReported(LocalDate dateReported) {
        this.dateReported = dateReported;
    }
    public String getContactInfo() {
        return contactInfo;
    }
    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getImageBase64() {
        return imageBase64;
    }
    public void setImageBase64(String imageBase64) {
        this.imageBase64 = imageBase64;
    }

    
}
