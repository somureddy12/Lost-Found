package com.example.Service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Model.Item;
import com.example.Repository.ItemRepository;
import com.example.specification.ItemSpecification;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Transactional
    public Item saveItem(Item item) {
        System.out.println("Saving item: " + item);
        Item savedItem = itemRepository.save(item);
        System.out.println("Item saved: " + savedItem);
        return savedItem;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public List<Item> getItemsByContact(String contactInfo) {
        return itemRepository.findByContactInfo(contactInfo);
    }

    public List<Item> searchItems(String status, String category, String location, String keyword) {
        ItemSpecification spec = new ItemSpecification(status, category, location, keyword);
        return itemRepository.findAll(spec);
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    @Transactional
    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }
}
