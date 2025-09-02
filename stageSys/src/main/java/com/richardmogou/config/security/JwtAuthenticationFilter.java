package com.richardmogou.config.security;

import com.richardmogou.service.security.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // Spring injects our UserDetailsServiceImpl here

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Check if Authorization header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Continue to the next filter
            return;
        }

        // 2. Extract the token (remove "Bearer ")
        jwt = authHeader.substring(7);

        try {
            // 3. Extract user email from token
            userEmail = jwtService.extractUsername(jwt);

            // 4. Check if email exists and user is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 5. Load user details from the database
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // 6. Validate the token against user details
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // 7. Create authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // Credentials are null for JWT-based auth
                            userDetails.getAuthorities()
                    );
                    // 8. Set details (IP address, session ID, etc.)
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    // 9. Update SecurityContextHolder
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            filterChain.doFilter(request, response); // Continue chain regardless of auth success here
        } catch (Exception e) {
            // Handle potential exceptions during token parsing/validation (e.g., ExpiredJwtException)
            // You might want to send a specific error response back
            logger.error("Cannot set user authentication: {}", e);
            // For simplicity now, just continue the filter chain, access will be denied later if needed
            // Or send an error response: response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token"); return;
            filterChain.doFilter(request, response);
        }
    }
}