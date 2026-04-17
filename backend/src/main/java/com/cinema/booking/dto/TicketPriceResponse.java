package com.cinema.booking.dto;

import java.math.BigDecimal;

public class TicketPriceResponse {
    private BigDecimal adult;
    private BigDecimal child;
    private BigDecimal senior;

    public TicketPriceResponse() {
    }

    public TicketPriceResponse(BigDecimal adult, BigDecimal child, BigDecimal senior) {
        this.adult = adult;
        this.child = child;
        this.senior = senior;
    }

    public BigDecimal getAdult() {
        return adult;
    }

    public BigDecimal getChild() {
        return child;
    }

    public BigDecimal getSenior() {
        return senior;
    }
}
