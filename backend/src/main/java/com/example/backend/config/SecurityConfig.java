package com.example.backend.config;

import com.example.backend.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(
            CorsConfigurationSource corsConfigurationSource,
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login").permitAll()
                .requestMatchers("/api/utilisateurs/login").permitAll() // utile si form pointe là-dessus
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginProcessingUrl("/login") // endpoint appelé par React en POST
                .successHandler(successHandler())
                .failureHandler(failureHandler())
                .permitAll()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Non authentifié\"}");
                })
            )
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder); // même si c’est NoOp, il faut le fournir
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    private AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"Connexion réussie\"}");
        };
    }

    private AuthenticationFailureHandler failureHandler() {
        return (request, response, exception) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Email ou mot de passe incorrect\"}");
        };
    }
}