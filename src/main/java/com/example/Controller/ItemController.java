package com.example.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.Model.Item;
import com.example.Model.ItemResponseDTO;
import com.example.Service.ItemService;
import java.util.Base64;

import java.io.IOException;

import java.util.List;


@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    // private final String uploadDir = "uploads/";

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Controller is working..");
    }


    @PostMapping("/report")
    public ResponseEntity<Item> reportItem(
            @RequestPart("item") Item item,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        // System.out.println("📦 Received item: " + item);
        if (image != null && !image.isEmpty()) {
            // System.out.println("📸 Received image: " + image.getOriginalFilename() + " (" + image.getSize() + " bytes)");
            item.setImageData(image.getBytes()); // save Base64/byte[] in DB
        }

        Item savedItem = itemService.saveItem(item);
        return ResponseEntity.ok(savedItem);
    }



    @GetMapping("/getAllItems")
    public ResponseEntity<List<ItemResponseDTO>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        List<ItemResponseDTO> response = items.stream()
                                            .map(this::convertToDTO)
                                            .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{contact}")
    public ResponseEntity<List<ItemResponseDTO>> getItemsByContact(@PathVariable String contact) {

        List<Item> items = itemService.getItemsByContact(contact);
         List<ItemResponseDTO> response = items.stream()
                                            .map(this::convertToDTO)
                                            .toList();
        System.out.println("Found " + items.size() + " items for " + contact);
        return ResponseEntity.ok(response);

    }


    @GetMapping("/search")
    public ResponseEntity<List<ItemResponseDTO>> searchItems(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "dateReported") String sort) {

        List<Item> items = itemService.searchItems(status, category, location, keyword);
        List<ItemResponseDTO> response = items.stream()
                                            .map(this::convertToDTO)
                                            .toList();
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long id) {
        return itemService.getItemById(id)
                .map(item -> ResponseEntity.ok(convertToDTO(item)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    private ItemResponseDTO convertToDTO(Item item) {
        ItemResponseDTO dto = new ItemResponseDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setDescription(item.getDescription());
        dto.setCategory(item.getCategory());
        dto.setLocation(item.getLocation());
        dto.setDateReported(item.getDateReported());
        dto.setContactInfo(item.getContactInfo());
        dto.setStatus(item.getStatus());

        if (item.getImageData() != null) {
            dto.setImageBase64(Base64.getEncoder().encodeToString(item.getImageData()));
        }
        return dto;
    }

    
    
}
