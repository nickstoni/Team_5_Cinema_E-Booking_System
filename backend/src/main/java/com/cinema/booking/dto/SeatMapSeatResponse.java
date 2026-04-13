package com.cinema.booking.dto;

public class SeatMapSeatResponse {
    private Integer seatId;
    private String seatLabel;
    private Integer seatNumber;
    private String status;

    public SeatMapSeatResponse(Integer seatId, String seatLabel, Integer seatNumber, String status) {
        this.seatId = seatId;
        this.seatLabel = seatLabel;
        this.seatNumber = seatNumber;
        this.status = status;
    }

    public Integer getSeatId() {
        return seatId;
    }

    public String getSeatLabel() {
        return seatLabel;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public String getStatus() {
        return status;
    }
}
