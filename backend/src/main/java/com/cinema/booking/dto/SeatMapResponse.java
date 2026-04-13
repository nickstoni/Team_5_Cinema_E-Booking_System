package com.cinema.booking.dto;

import java.util.List;

public class SeatMapResponse {
    private Integer showtimeId;
    private Integer showroomId;
    private String showroomName;
    private Integer totalSeats;
    private Long bookedSeats;
    private Long availableSeats;
    private List<SeatMapRowResponse> rows;

    public SeatMapResponse(Integer showtimeId, Integer showroomId, String showroomName, Integer totalSeats, Long bookedSeats, Long availableSeats, List<SeatMapRowResponse> rows) {
        this.showtimeId = showtimeId;
        this.showroomId = showroomId;
        this.showroomName = showroomName;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.availableSeats = availableSeats;
        this.rows = rows;
    }

    public Integer getShowtimeId() {
        return showtimeId;
    }

    public Integer getShowroomId() {
        return showroomId;
    }

    public String getShowroomName() {
        return showroomName;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public Long getBookedSeats() {
        return bookedSeats;
    }

    public Long getAvailableSeats() {
        return availableSeats;
    }

    public List<SeatMapRowResponse> getRows() {
        return rows;
    }
}
