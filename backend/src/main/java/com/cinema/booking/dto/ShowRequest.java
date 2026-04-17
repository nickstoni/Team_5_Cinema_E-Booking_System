package com.cinema.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ShowRequest {
    public int movieId;
    public int showroomId;
    public LocalDate showDate;
    public LocalTime startTime;
}