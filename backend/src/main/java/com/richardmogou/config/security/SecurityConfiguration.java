package com.richardmogou.config.security;

import com.richardmogou.entity.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true) // Enable method-level security
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService; // Spring injects UserDetailsServiceImpl

    // Define public endpoints that don't require authentication
    private static final String[] PUBLIC_MATCHERS = {
            "/api/auth/**", // Registration, Login
            "/v3/api-docs/**", // Swagger/OpenAPI docs
            "/swagger-ui/**", // Swagger UI
            "/swagger-ui.html",
            "/webjars/**",
            "/error",
            "/ws/**" // Allow WebSocket connections (further security might be needed at connect time)
            // Add other public endpoints like GET /api/offers (if public listing is allowed)
    };

     private static final String[] PUBLIC_GET_MATCHERS = {
            "/api/offers", // Allow public listing of open offers
            "/api/offers/{offerId:\\d+}", // Allow public viewing of specific offer details
            "/api/skills", // Public access to skills list
            "/api/domains", // Public access to domains list
            "/api/sectors" // Public access to sectors list
     };


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Apply CORS configuration
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless APIs
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_MATCHERS).permitAll() // Permit all access to public matchers
                        .requestMatchers(HttpMethod.GET, PUBLIC_GET_MATCHERS).permitAll() // Permit GET requests to specific public endpoints

                        // Role-based restrictions (examples, adjust based on final API design)
                        .requestMatchers("/api/admin/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/api/offers").hasRole(Role.COMPANY.name())
                        .requestMatchers(HttpMethod.PUT, "/api/offers/{offerId:\\d+}/**").hasRole(Role.COMPANY.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/offers/{offerId:\\d+}").hasRole(Role.COMPANY.name())
                        .requestMatchers("/api/companies/me/**").hasRole(Role.COMPANY.name())
                        .requestMatchers(HttpMethod.POST, "/api/offers/{offerId:\\d+}/apply").hasRole(Role.STUDENT.name())
                        .requestMatchers("/api/students/me/**").hasRole(Role.STUDENT.name())
                        .requestMatchers("/api/faculty/me/**").hasRole(Role.FACULTY.name())
                        .requestMatchers(HttpMethod.PUT, "/api/agreements/{agreementId:\\d+}/validate").hasRole(Role.FACULTY.name())
                        .requestMatchers(HttpMethod.PUT, "/api/agreements/{agreementId:\\d+}/approve").hasRole(Role.ADMIN.name())

                        // Default: Any other request must be authenticated
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Use stateless sessions
                .authenticationProvider(authenticationProvider()) // Set the custom authentication provider
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter before the standard auth filter

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Set the custom UserDetailsService
        authProvider.setPasswordEncoder(passwordEncoder()); // Set the password encoder
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager(); // Get the default AuthenticationManager
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from your frontend origin (e.g., http://localhost:4200 for Angular dev)
        // Use "*" for development only, be more specific in production!
        configuration.setAllowedOrigins(List.of("http://localhost:4200", "http://127.0.0.1:4200")); // Add other origins if needed
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setAllowCredentials(true); // Important for cookies/auth headers
        configuration.setMaxAge(3600L); // How long the results of a preflight request can be cached

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration); // Apply CORS to /api/** paths
        source.registerCorsConfiguration("/ws/**", configuration); // Apply CORS to WebSocket path as well
        return source;
    }
}