package com.richardmogou.dto;

import com.richardmogou.entity.Skill;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillDto {
    private Long id;
    private String name;

    public static SkillDto fromEntity(Skill skill) {
        return new SkillDto(skill.getId(), skill.getName());
    }
}