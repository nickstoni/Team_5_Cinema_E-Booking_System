package com.cinema.booking.controller.recommendation;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.catalog.MovieResponse;
import com.cinema.booking.service.recommendation.RecommendationFacade;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationController {

    private final RecommendationFacade recommendationFacade;

    public RecommendationController(RecommendationFacade recommendationFacade) {
        this.recommendationFacade = recommendationFacade;
    }

    @GetMapping("/{userId}")
    public List<MovieResponse> getRecommendations(
            @PathVariable Integer userId,
            @RequestParam(name = "limit", required = false, defaultValue = "50") Integer limit) {
        return recommendationFacade.recommendForUser(userId, Math.max(1, Math.min(500, limit)));
    }
}
