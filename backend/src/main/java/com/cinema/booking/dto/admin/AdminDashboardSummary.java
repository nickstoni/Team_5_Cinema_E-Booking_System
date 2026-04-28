package com.cinema.booking.dto.admin;

public class AdminDashboardSummary {
    private final long totalUsers;
    private final long activeUsers;
    private final long inactiveUsers;
    private final long totalMovies;
    private final long totalShowtimes;
    private final long totalPromotions;

    public AdminDashboardSummary(long totalUsers, long activeUsers, long inactiveUsers,
            long totalMovies, long totalShowtimes, long totalPromotions) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
        this.totalMovies = totalMovies;
        this.totalShowtimes = totalShowtimes;
        this.totalPromotions = totalPromotions;
    }

    public long getTotalUsers() { return totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public long getInactiveUsers() { return inactiveUsers; }
    public long getTotalMovies() { return totalMovies; }
    public long getTotalShowtimes() { return totalShowtimes; }
    public long getTotalPromotions() { return totalPromotions; }
}