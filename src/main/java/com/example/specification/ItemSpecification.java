package com.example.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.Model.Item;

import jakarta.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class ItemSpecification implements Specification<Item> {

    private final String status;
    private final String category;
    private final String location;
    private final String keyword;

    public ItemSpecification(String status, String category, String location, String keyword) {
        this.status = status;
        this.category = category;
        this.location = location;
        this.keyword = keyword;
    }

    @Override
    public Predicate toPredicate(Root<Item> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();

        if (status != null && !status.isEmpty()) {
            predicates.add(cb.equal(root.get("status"), status));
        }
        if (category != null && !category.isEmpty()) {
            predicates.add(cb.equal(root.get("category"), category));
        }
        if (location != null && !location.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
        }
        if (keyword != null && !keyword.isEmpty()) {
            Predicate namePredicate = cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
            Predicate descPredicate = cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%");
            predicates.add(cb.or(namePredicate, descPredicate));
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
