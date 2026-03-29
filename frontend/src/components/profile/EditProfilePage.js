import React, { useEffect, useState } from "react";
import RequiredInfoSection from "../signup/RequiredInfoSection";
import AddressSection from "../signup/AddressSection";
import PaymentCardsSection from "../signup/PaymentCardsSection";

function EditProfilePage() {
  const userId = 2;

  const currentYear = new Date().getFullYear();
  const expiryYears = Array.from({ length: 10 }, (_, i) => String(currentYear + i));

  const emptyAddress = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  };

  const emptyCard = {
    cardType: "",
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  };

  const [profile, setProfile] = useState({
    user: {
      fullName: "",
      email: "",
      phoneNumber: "",
      promotionsEnabled: false
    },
    address: emptyAddress,
    cards: [],
    favoriteMovies: []
  });

  const [message, setMessage] = useState("");

  const loadProfile = () => {
    fetch(`http://localhost:8080/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          user: data.user || {
            fullName: "",
            email: "",
            phoneNumber: "",
            promotionsEnabled: false
          },
          address: data.address || emptyAddress,
          cards: data.cards || [],
          favoriteMovies: data.favoriteMovies || []
        });
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setMessage("Failed to load profile");
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value
      }
    }));
  };

  const handleAddressInputChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: profile.user,
          address: profile.address
        })
      });

      const text = await res.text();
      setMessage(text);
      loadProfile();
    } catch (err) {
      console.error(err);
      setMessage("Error updating profile");
    }
  };

  const handleAddAddress = () => {
    setProfile((prev) => ({
      ...prev,
      address: emptyAddress
    }));
  };

  const handleRemoveAddress = () => {
    setProfile((prev) => ({
      ...prev,
      address: emptyAddress
    }));
  };

  const handleAddCard = () => {
    if (profile.cards.length >= 3) {
      setMessage("You cannot store more than 3 payment cards.");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      cards: [...prev.cards, { ...emptyCard }]
    }));
  };

  const handleRemoveCard = async (index) => {
    const card = profile.cards[index];

    if (card.cardId) {
      try {
        const res = await fetch(
          `http://localhost:8080/api/profile/${userId}/cards/${card.cardId}`,
          {
            method: "DELETE"
          }
        );

        const text = await res.text();
        setMessage(text);
        loadProfile();
      } catch (err) {
        console.error(err);
        setMessage("Failed to delete card");
      }
    } else {
      setProfile((prev) => ({
        ...prev,
        cards: prev.cards.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCardChange = (index, field, value) => {
    setProfile((prev) => {
      const updatedCards = [...prev.cards];
      updatedCards[index] = {
        ...updatedCards[index],
        [field]: value
      };
      return {
        ...prev,
        cards: updatedCards
      };
    });
  };

  const handleSaveNewCards = async () => {
    try {
      const unsavedCards = profile.cards.filter((card) => !card.cardId);

      for (const card of unsavedCards) {
        const res = await fetch(`http://localhost:8080/api/profile/${userId}/cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(card)
        });

        if (!res.ok) {
          const text = await res.text();
          setMessage(text);
          return;
        }
      }

      setMessage("Cards saved successfully");
      loadProfile();
    } catch (err) {
      console.error(err);
      setMessage("Failed to save cards");
    }
  };

  const hasAddress = Boolean(
    profile.address &&
      (
        profile.address.addressLine1 ||
        profile.address.addressLine2 ||
        profile.address.city ||
        profile.address.state ||
        profile.address.postalCode ||
        profile.address.country
      )
  );

  return (
    <div style={{ padding: "20px", color: "white", background: "black", minHeight: "100vh" }}>
      <h1>Edit Profile</h1>

      {message && <p>{message}</p>}

      <RequiredInfoSection
        formData={profile.user}
        onInputChange={handleUserInputChange}
        isEditMode={true}
      />

      <AddressSection
        formData={profile.address}
        onInputChange={handleAddressInputChange}
        hasAddress={hasAddress}
        onAddAddress={handleAddAddress}
        onRemoveAddress={handleRemoveAddress}
      />

      <PaymentCardsSection
        cards={profile.cards}
        onAddCard={handleAddCard}
        onRemoveCard={handleRemoveCard}
        onCardChange={handleCardChange}
        maxCards={3}
        expiryYears={expiryYears}
      />

      <div style={{ marginTop: "12px", marginBottom: "24px" }}>
        <button onClick={handleSaveNewCards}>Save Cards</button>
      </div>

      <h2>Favorite Movies</h2>
      {profile.favoriteMovies && profile.favoriteMovies.length > 0 ? (
        profile.favoriteMovies.map((movie) => (
          <div key={movie.movieId} style={{ marginBottom: "10px" }}>
            <p>{movie.title}</p>
          </div>
        ))
      ) : (
        <p>No favorite movies yet.</p>
      )}

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default EditProfilePage;