package com.richardmogou.service.specification;

import com.richardmogou.entity.InternshipOffer;
import com.richardmogou.entity.enums.InternshipOfferStatus;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class InternshipOfferSpecification {

    public static Specification<InternshipOffer> filterBy(Map<String, String> filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Ensure fetches are efficient if not already handled by default EAGER/LAZY settings
            // query.distinct(true); // Use if joins cause duplicates
            // root.fetch("company", JoinType.LEFT); // Example fetch

            // Filter by Domain
            if (StringUtils.hasText(filters.get("domain"))) {
                predicates.add(criteriaBuilder.equal(root.get("domain"), filters.get("domain")));
            }

            // Filter by Location (Case-insensitive partial match)
            if (StringUtils.hasText(filters.get("location"))) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("location")),
                        "%" + filters.get("location").toLowerCase() + "%"));
            }

            // Filter by Duration (Exact match for simplicity)
            if (StringUtils.hasText(filters.get("duration"))) {
                predicates.add(criteriaBuilder.equal(root.get("duration"), filters.get("duration")));
            }

            // Filter by Status
            if (StringUtils.hasText(filters.get("status"))) {
                try {
                    InternshipOfferStatus status = InternshipOfferStatus.valueOf(filters.get("status").toUpperCase());
                    predicates.add(criteriaBuilder.equal(root.get("status"), status));
                } catch (IllegalArgumentException e) {
                    System.err.println("Warning: Invalid status filter value provided: " + filters.get("status"));
                }
            }

            // Filter by Company ID (Requires joining the Company entity)
             if (StringUtils.hasText(filters.get("companyId"))) {
                 try {
                    Long companyId = Long.parseLong(filters.get("companyId"));
                    // Join 'company' attribute of InternshipOffer and filter by 'id' attribute of Company
                    predicates.add(criteriaBuilder.equal(root.join("company", JoinType.INNER).get("id"), companyId));
                 } catch (NumberFormatException e) {
                     System.err.println("Warning: Invalid companyId filter value provided: " + filters.get("companyId"));
                 }
            }

            // Filter by Required Skills (Simple 'contains' check)
            if (StringUtils.hasText(filters.get("skill"))) {
                 predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("requiredSkills")),
                        "%" + filters.get("skill").toLowerCase() + "%"));
            }

            // General Search (checks title and description)
            if (StringUtils.hasText(filters.get("search"))) {
                String searchTerm = "%" + filters.get("search").toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchTerm);
                Predicate descriptionMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), searchTerm);
                predicates.add(criteriaBuilder.or(titleMatch, descriptionMatch));
            }


            // Combine all predicates with AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}