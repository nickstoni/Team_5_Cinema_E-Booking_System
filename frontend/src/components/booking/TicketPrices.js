import '../../styles/booking/TicketPrices.css';

function TicketPrices({ tickets, onTicketChange }) {
  const ticketTypes = [
    { type: 'adult', label: 'Adult', price: tickets.adult.price, quantity: tickets.adult.quantity },
    { type: 'child', label: 'Child', price: tickets.child.price, quantity: tickets.child.quantity },
    { type: 'senior', label: 'Senior', price: tickets.senior.price, quantity: tickets.senior.quantity }
  ];

  return (
    <section className="ticket-selection">
      <h2 className="section-heading">Select Tickets</h2>
      <div className="ticket-types">
        {ticketTypes.map(({ type, label, price, quantity }) => (
          <div key={type} className="ticket-type">
            <div className="ticket-info">
              <span className="ticket-label">{label}</span>
              <span className="ticket-price">${price.toFixed(2)}</span>
            </div>
            <div className="ticket-controls">
              <button 
                className="ticket-btn" 
                onClick={() => onTicketChange(type, -1)}
                disabled={quantity === 0}
              >
                −
              </button>
              <span className="ticket-quantity">{quantity}</span>
              <button 
                className="ticket-btn" 
                onClick={() => onTicketChange(type, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TicketPrices;
