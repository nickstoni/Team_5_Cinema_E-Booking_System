package com.cinema.booking.dto;

import java.util.List;

public class SeatMapRowResponse {
    private String rowLabel;
    private List<SeatMapSeatResponse> seats;

    public SeatMapRowResponse(String rowLabel, List<SeatMapSeatResponse> seats) {
        this.rowLabel = rowLabel;
        this.seats = seats;
    }

    public String getRowLabel() {
        return rowLabel;
    }

    public List<SeatMapSeatResponse> getSeats() {
        return seats;
    }
}
