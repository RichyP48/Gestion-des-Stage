package com.richardmogou.dto;

import com.richardmogou.entity.Sector;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectorDto {
    private Long id;
    private String name;

     public static SectorDto fromEntity(Sector sector) {
        return new SectorDto(sector.getId(), sector.getName());
    }
}