import '../../styles/booking/SeatSelection.css';

function SeatSelection({ seatRows = [], selectedSeats, occupiedSeats, onSeatClick }) {
    // Fallback for older responses / empty backend data
    const fallbackRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;
    const seatNumbers = Array.from({ length: seatsPerRow }, (_, i) => i + 1);

    // function to check if a seat is available, selected, or occupied
    const getSeatStatus = (seatId) => {
        if (occupiedSeats.includes(seatId)) return 'occupied';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    const hasSeatRows = Array.isArray(seatRows) && seatRows.length > 0;

    return (
        <section className="seating-section">
        <h2 className="section-heading">Select Seats</h2>
        
        <div className="screen-indicator">
            <div className="screen">SCREEN</div>
        </div>

        {/* Map out the seats per row (May need to change values later) */}
        <div className="seating-chart">
            {hasSeatRows ? (
                <>
                    <div className="seat-number-row" aria-hidden="true">
                        <span className="row-label"></span>
                        {seatNumbers.map((number) => (
                          <span key={`header-${number}`} className="seat-number-label">{number}</span>
                        ))}
                        <span className="row-label"></span>
                    </div>
                    {seatRows.map(row => (
                        <div key={row.rowLabel} className="seat-row">
                            <span className="row-label">{row.rowLabel}</span>
                            {(row.seats || []).map((seat) => {
                                const status = seat.status === 'selected' || selectedSeats.includes(seat.seatLabel)
                                    ? 'selected'
                                    : seat.status === 'occupied' || seat.status === 'reserved'
                                        ? 'occupied'
                                        : 'available';

                                return (
                                    <button
                                        key={seat.seatId}
                                        className={`seat ${status}`}
                                        onClick={() => onSeatClick(seat.seatLabel)}
                                        disabled={status === 'occupied'}
                                    >
                                        {seat.seatNumber}
                                    </button>
                                );
                            })}
                            <span className="row-label">{row.rowLabel}</span>
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <div className="seat-number-row" aria-hidden="true">
                        <span className="row-label"></span>
                        {seatNumbers.map((number) => (
                          <span key={`header-${number}`} className="seat-number-label">{number}</span>
                        ))}
                        <span className="row-label"></span>
                    </div>
                    {fallbackRows.map(row => (
                    <div key={row} className="seat-row">
                        <span className="row-label">{row}</span>
                            {Array.from({ length: seatsPerRow }, (_, i) => {
                            const seatId = `${row}${i + 1}`;
                            const status = getSeatStatus(seatId);
                            
                            return (
                                <button
                                key={seatId}
                                className={`seat ${status}`}
                                onClick={() => onSeatClick(seatId)}
                                disabled={status === 'occupied'}
                                >
                                {i + 1}
                                </button>
                            );
                            })}
                        <span className="row-label">{row}</span>
                    </div>
                    ))}
                </>
            )}
        </div>

        <div className="seat-legend">
            <div className="legend-item">
            <div className="seat available legend-seat"></div>
            <span>Available</span>
            </div>
            <div className="legend-item">
            <div className="seat selected legend-seat"></div>
            <span>Selected</span>
            </div>
            <div className="legend-item">
            <div className="seat occupied legend-seat"></div>
            <span>Occupied</span>
            </div>
        </div>
        </section>
    );
    }

    export default SeatSelection;
