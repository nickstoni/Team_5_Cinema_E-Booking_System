import '../../styles/booking/SeatSelection.css';

function SeatSelection({ selectedSeats, occupiedSeats, onSeatClick }) {
    // May need to change values later depending on requirements
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;

    // function to check if a seat is available, selected, or occupied
    const getSeatStatus = (seatId) => {
        if (occupiedSeats.includes(seatId)) return 'occupied';
        if (selectedSeats.includes(seatId)) return 'selected';
        return 'available';
    };

    return (
        <section className="seating-section">
        <h2 className="section-heading">Select Seats</h2>
        
        <div className="screen-indicator">
            <div className="screen">SCREEN</div>
        </div>

        {/* Map out the seats per row (May need to change values later) */}
        <div className="seating-chart">
            {rows.map(row => (
            <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                    {Array.from({ length: seatsPerRow }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const status = getSeatStatus(seatId);
                    
                    return (
                        <button
                        key={seatId}
                        // Checks the status of the seat before rendering its css below
                        className={`seat ${status}`}
                        onClick={() => onSeatClick(seatId)}
                        // Disable the button if the seat has already been purchased
                        disabled={status === 'occupied'}
                        >
                        {i + 1}
                        </button>
                    );
                    })}
                <span className="row-label">{row}</span>
            </div>
            ))}
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
