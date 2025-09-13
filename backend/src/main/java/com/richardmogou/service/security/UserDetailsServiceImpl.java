package com.richardmogou.service.security;

import com.richardmogou.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true) // Good practice for read operations
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // In our case, username is the email
        com.richardmogou.entity.User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        if (!user.isEnabled()) {
            throw new UsernameNotFoundException("User account is disabled: " + username);
            // Or handle disabled accounts differently, e.g., throw a DisabledException
        }

        // Convert our User entity's role to Spring Security's GrantedAuthority
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name()); // Prefix with ROLE_ is standard

        return new User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
                // You can add more flags here if needed (e.g., account non-expired, credentials non-expired, account non-locked)
                // based on your User entity fields if you add them.
                // user.isEnabled(), true, true, true, Collections.singletonList(authority)
        );
    }
}