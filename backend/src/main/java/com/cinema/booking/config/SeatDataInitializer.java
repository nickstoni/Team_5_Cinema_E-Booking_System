package com.cinema.booking.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.cinema.booking.model.Seat;
import com.cinema.booking.model.Showroom;
import com.cinema.booking.repository.SeatRepository;
import com.cinema.booking.repository.ShowroomRepository;

@Component
public class SeatDataInitializer {

    private final ShowroomRepository showroomRepository;
    private final SeatRepository seatRepository;

    public SeatDataInitializer(ShowroomRepository showroomRepository, SeatRepository seatRepository) {
        this.showroomRepository = showroomRepository;
        this.seatRepository = seatRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initializeSeats() {
        if (seatRepository.count() > 0) {
            return;
        }

        List<Seat> seatsToSave = new ArrayList<>();
        for (Showroom showroom : showroomRepository.findAll()) {
            seatsToSave.addAll(generateSeatsForShowroom(showroom));
        }

        seatRepository.saveAll(seatsToSave);
    }

    private List<Seat> generateSeatsForShowroom(Showroom showroom) {
        List<Seat> seats = new ArrayList<>();
        int totalSeats = showroom.getTotalSeats() == null ? 0 : showroom.getTotalSeats();
        int seatsPerRow = 12;
        int rowCount = (int) Math.ceil(totalSeats / (double) seatsPerRow);

        int remaining = totalSeats;
        for (int rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            String rowLabel = String.valueOf((char) ('A' + rowIndex));
            int seatsInRow = Math.min(seatsPerRow, remaining);
            for (int seatNumber = 1; seatNumber <= seatsInRow; seatNumber++) {
                Seat seat = new Seat();
                seat.setShowroom(showroom);
                seat.setRowLabel(rowLabel);
                seat.setSeatNumber(seatNumber);
                seats.add(seat);
            }
            remaining -= seatsInRow;
        }

        return seats;
    }
}
