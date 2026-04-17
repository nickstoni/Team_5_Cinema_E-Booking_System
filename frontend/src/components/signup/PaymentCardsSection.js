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
                    <option value="">Select Card Type</option>
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">Mastercard</option>
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
                    onChange={(event) => onCardChange(index, "cardNumber", event.target.value)}
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
                  <select
                    className="form-input"
                    value={card.expiryMonth || ""}
                    onChange={(event) => onCardChange(index, "expiryMonth", event.target.value)}
                  >
                    <option value="">MM</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
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
                  <select
                    className="form-input"
                    value={card.expiryYear || ""}
                    onChange={(event) => onCardChange(index, "expiryYear", event.target.value)}
                  >
                    <option value="">YYYY</option>
                    {expiryYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              <label className="form-row">
                <span className="form-label">CVV</span>
                <input
                  type="password"
                  className="form-input"
                  value={card.cvv || ""}
                  onChange={(event) => onCardChange(index, "cvv", event.target.value)}
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