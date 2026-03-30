import React, { useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import RequiredInfoSection from "../signup/RequiredInfoSection";
import AddressSection from "../signup/AddressSection";
import PaymentCardsSection from "../signup/PaymentCardsSection";
import ChangePasswordSection from "./ChangePasswordSection";
import MovieCard from "../home/MovieCard";
import "../../styles/profile/EditProfilePage.css";

function EditProfilePage() {
  const userId = localStorage.getItem("userId");

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
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      promotionsEnabled: false
    },
    address: emptyAddress,
    cards: [],
    favoriteMovies: []
  });

  const [message, setMessage] = useState("");
  const [addressFormOpen, setAddressFormOpen] = useState(false);

  const loadProfile = () => {
    fetch(`http://localhost:8080/api/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          user: data.user || {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            promotionsEnabled: false
          },
          address: data.address || emptyAddress,
          cards: data.cards || [],
          favoriteMovies: data.favoriteMovies || []
        });
        // If there's an address from the server, keep the form open
        setAddressFormOpen(Boolean(
          data.address && (
            data.address.addressLine1 ||
            data.address.addressLine2 ||
            data.address.city ||
            data.address.state ||
            data.address.postalCode ||
            data.address.country
          )
        ));
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setMessage("Failed to load profile");
      });
  };

  useEffect(() => {
    loadProfile();

    // Refresh favorites when page becomes visible (user returns from other pages)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProfile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleUserInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setProfile((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: inputValue
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
      // Only include address if it has data
      const addressToSave = (
        profile.address.addressLine1 ||
        profile.address.addressLine2 ||
        profile.address.city ||
        profile.address.state ||
        profile.address.postalCode ||
        profile.address.country
      ) ? profile.address : emptyAddress;

      const res = await fetch(`http://localhost:8080/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: profile.user,
          address: addressToSave
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
    setAddressFormOpen(true);
  };

  const handleRemoveAddress = () => {
    setProfile((prev) => ({
      ...prev,
      address: emptyAddress
    }));
    setAddressFormOpen(false);
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

  const hasAddress = addressFormOpen || Boolean(
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
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-main">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="user-info-summary">
            <div className="user-greeting">
              <p>Welcome, <span className="user-name">{profile.user.firstName} {profile.user.lastName}</span></p>
              <p className="user-email">{profile.user.email}</p>
            </div>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}

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

        <div className="save-cards-section">
          <button className="btn-secondary" onClick={handleSaveNewCards}>Save Cards</button>
        </div>

        <ChangePasswordSection userId={userId} onSuccess={() => setMessage("Password changed successfully!")} />

        <section className="favorites-section">
          <h2>Favorite Movies</h2>
          {profile.favoriteMovies && profile.favoriteMovies.length > 0 ? (
            <div className="favorites-grid">
              {profile.favoriteMovies.map((movie) => (
                <MovieCard
                  key={movie.movieId}
                  movie={movie}
                  favoriteMovies={profile.favoriteMovies}
                  refreshFavorites={loadProfile}
                />
              ))}
            </div>
          ) : (
            <p className="no-favorites">No favorite movies yet.</p>
          )}
        </section>

        <div className="save-section">
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default EditProfilePage;