package com.richardmogou.dto;

import com.richardmogou.entity.Domain;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DomainDto {
    private Long id;
    private String name;

     public static DomainDto fromEntity(Domain domain) {
        return new DomainDto(domain.getId(), domain.getName());
    }
}