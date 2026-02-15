package com.cinema.booking.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    
    @GetMapping("/hello")
    public String hello() {
        return "Backend is working!";
    }
}
