function PaymentCardsSection({
  cards = [],
  onAddCard,
  onRemoveCard,
  onCardChange,
  maxCards = 3,
  expiryYears = []
}) {
  return (
    <section className="signup-section">
      <div className="section-header-row">
        <h2>Optional Payment Cards (Up To 3)</h2>
        <button
          type="button"
          className="secondary-btn"
          onClick={onAddCard}
          disabled={cards.length >= maxCards}
        >
          Add Card ({cards.length}/{maxCards})
        </button>
      </div>

      {cards.length >= maxCards && (
        <p className="muted-text">You cannot store more than {maxCards} payment cards.</p>
      )}

      {cards.length === 0 ? (
        <p className="muted-text">No cards added yet.</p>
      ) : (
        cards.map((card, index) => (
          <div key={`card-${index}`} className="card-box">
            <div className="section-header-row compact">
              <h3>Card {index + 1}</h3>
              <button
                type="button"
                className="danger-link"
                onClick={() => onRemoveCard(index)}
              >
                Remove
              </button>
            </div>

            <div className="signup-grid two-columns">
              <label className="form-row">
                <span className="form-label">Card Type</span>
                {card.cardId ? (
                  <input
                    type="text"
                    className="form-input"
                    value={card.cardType || ""}
                    disabled={true}
                    readOnly={true}
                  />
                ) : (
                  <select
                    className="form-input"
                    value={card.cardType || ""}
                    onChange={(event) => onCardChange(index, "cardType", event.target.value)}
                  >
                    <option value="" disabled>Select Card Type</option>
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="Amex">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                )}
              </label>

              <label className="form-row">
                <span className="form-label">Card Number</span>
                {card.cardId ? (
                  <input
                    type="text"
                    className="form-input"
                    value={`•••• •••• •••• ${card.lastFour || "••••"}`}
                    disabled={true}
                    readOnly={true}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    value={card.cardNumber || ""}
                    onChange={(event) => onCardChange(index, "cardNumber", event.target.value.replace(/\D/g, '').slice(0, 19))}
                    inputMode="numeric"
                    placeholder="1234123412341234"
                  />
                )}
              </label>

              <label className="form-row full-span">
                <span className="form-label">Card Holder Name</span>
                <input
                  type="text"
                  className="form-input"
                  value={card.cardHolderName || ""}
                  onChange={(event) => onCardChange(index, "cardHolderName", event.target.value)}
                  placeholder="Your Name"
                  disabled={card.cardId ? true : false}
                  readOnly={card.cardId ? true : false}
                />
              </label>

              <label className="form-row">
                <span className="form-label">Expiry Month</span>
                {card.cardId ? (
                  <input
                    type="text"
                    className="form-input"
                    value={card.expiryMonth || ""}
                    disabled={true}
                    readOnly={true}
                  />
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    value={card.expiryMonth || ""}
                    maxLength={2}
                    placeholder="MM"
                    onChange={(event) => onCardChange(index, "expiryMonth", event.target.value.replace(/\D/g, '').slice(0, 2))}
                  />
                )}
              </label>

              <label className="form-row">
                <span className="form-label">Expiry Year</span>
                {card.cardId ? (
                  <input
                    type="text"
                    className="form-input"
                    value={card.expiryYear || ""}
                    disabled={true}
                    readOnly={true}
                  />
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    value={card.expiryYear || ""}
                    maxLength={4}
                    placeholder="YYYY"
                    onChange={(event) => onCardChange(index, "expiryYear", event.target.value.replace(/\D/g, '').slice(0, 4))}
                  />
                )}
              </label>

              <label className="form-row">
                <span className="form-label">CVV</span>
                <input
                  type="password"
                  className="form-input"
                  value={card.cvv || ""}
                  onChange={(event) => onCardChange(index, "cvv", event.target.value.replace(/\D/g, '').slice(0, 4))}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="123"
                  disabled={card.cardId ? true : false}
                  readOnly={card.cardId ? true : false}
                />
              </label>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default PaymentCardsSection;