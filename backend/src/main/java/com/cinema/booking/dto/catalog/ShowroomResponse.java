package com.cinema.booking.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowroomResponse {
        private Integer roomId;
        private String roomName;
        private Integer totalSeats;
}
