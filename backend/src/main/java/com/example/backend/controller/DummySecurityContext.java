package com.example.backend.controller;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;

import java.util.Collections;

public class DummySecurityContext implements SecurityContext {

    private Authentication authentication;

    public DummySecurityContext(String email) {
        this.authentication = new UsernamePasswordAuthenticationToken(
                new User(email, "", Collections.emptyList()),
                null,
                Collections.emptyList()
        );
    }

    @Override
    public Authentication getAuthentication() {
        return authentication;
    }

    @Override
    public void setAuthentication(Authentication authentication) {
        this.authentication = authentication;
    }
}