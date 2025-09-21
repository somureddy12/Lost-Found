package com.example.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String location;

    @Column(name = "date_reported", nullable = false)
    private LocalDate dateReported;

    @Column(nullable = false)
    private String status; // "lost" or "found"

    @Column(name = "contact_info", nullable = false)
    private String contactInfo;

    @Column(name = "image_url",columnDefinition = "LONGBLOB")
    @Lob
    private byte[] imageData;





    public LocalDate getDateReported() {
        return dateReported;
    }

    public void setDateReported(LocalDate dateReported) {
        this.dateReported = dateReported;
    }


    public void setImageUrl(byte[] imageUrl) {
        this.imageData = imageUrl;
    }

    public byte[] getImageUrl() {
        return imageData;
    }

}
