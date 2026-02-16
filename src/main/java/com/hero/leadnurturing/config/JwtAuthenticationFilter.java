package com.hero.leadnurturing.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hero.leadnurturing.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * JWT Authentication Filter
 * 
 * This filter runs on EVERY request to check if the user has a valid JWT token.
 * If valid, it authenticates the user automatically.
 * 
 * Flow:
 * 1. Extract token from request header
 * 2. Validate the token
 * 3. Load user details from database
 * 4. Set user as authenticated in Spring Security
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    /**
     * This method runs for EVERY incoming request
     */
    @Override
    public void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws IOException, ServletException {

        // STEP 1: Get the Authorization header from request
        // Example: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        String authorizationHeader = request.getHeader("Authorization");

        // STEP 2: Check if header exists and starts with "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {

            // STEP 3: Extract the actual token (remove "Bearer " prefix)
            // "Bearer eyJhbG..." becomes "eyJhbG..."
            String jwtToken = authorizationHeader.substring(7);
            
            // STEP 4: Validate if token is correct and not expired
            if (jwtUtil.validateToken(jwtToken)) {

                // STEP 5: Extract username from the token
                String username = jwtUtil.extractUsername(jwtToken);
                
                // STEP 6: Load full user details from database using username
                var userDetails = userDetailsService.loadUserByUsername(username);

                // STEP 7: Create Spring Security authentication object
                // This tells Spring Security: "This user is authenticated"
                var authentication = new UsernamePasswordAuthenticationToken(
                        userDetails,                    // Who is the user?
                        null,                           // Password (not needed, already validated)
                        userDetails.getAuthorities()    // What roles does user have?
                );

                // STEP 8: Add request details (IP address, session, etc.)
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // STEP 9: Tell Spring Security this user is now authenticated
                // Now @PreAuthorize, @Secured annotations will work
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // STEP 10: Continue to next filter or controller
        // IMPORTANT: Always call this, even if no token found
        filterChain.doFilter(request, response);
    }
}