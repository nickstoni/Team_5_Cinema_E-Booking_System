import { useCallback, useEffect, useState } from "react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import RequiredInfoSection from "../signup/RequiredInfoSection";
import AddressSection from "../signup/AddressSection";
import PaymentCardsSection from "../signup/PaymentCardsSection";
import ChangePasswordSection from "./ChangePasswordSection";
import MovieCard from "../home/MovieCard";
import { createEmptyCard } from "../signup/SignupConstants";
import { API_BASE_URL } from '../../config/api';
import { validateProfileUserForm } from '../../utils/authValidation';
import { hasAnyAddressValue } from '../../utils/addressValidation';
import { hasAnyCardValue, normalizeCardDigits, validatePaymentCard } from '../../utils/paymentCardValidation';
import "../../styles/profile/EditProfilePage.css";

const EMPTY_ADDRESS = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: ""
};

function EditProfilePage() {
  const userId = localStorage.getItem("userId");

  const currentYear = new Date().getFullYear();
  const expiryYears = Array.from({ length: 10 }, (_, i) => String(currentYear + i));

  const emptyCard = createEmptyCard();

  const [profile, setProfile] = useState({
    user: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      promotionsEnabled: false
    },
    address: EMPTY_ADDRESS,
    cards: [],
    favoriteMovies: []
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [addressFormOpen, setAddressFormOpen] = useState(false);

  const showErrorMessage = (text) => {
    setMessageType("error");
    setMessage(text);
  };

  const showSuccessMessage = (text) => {
    setMessageType("success");
    setMessage(text);
  };

  const loadProfile = useCallback(() => {
    fetch(`${API_BASE_URL}/api/profile/${userId}`)
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
          address: data.address || EMPTY_ADDRESS,
          cards: data.cards || [],
          favoriteMovies: data.favoriteMovies || []
        });
        // If there's an address from the server, keep the form open
        setAddressFormOpen(hasAnyAddressValue(data.address || EMPTY_ADDRESS));
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        showErrorMessage("Failed to load profile");
      });
  }, [userId]);

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
  }, [loadProfile]);

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
    const validationError = validateProfileUserForm(profile.user);
    if (validationError) {
      showErrorMessage(validationError);
      return;
    }

    try {
      // Only include address if it has data
      const addressToSave = hasAnyAddressValue(profile.address) ? profile.address : EMPTY_ADDRESS;

      const res = await fetch(`${API_BASE_URL}/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: profile.user,
          address: addressToSave
        })
      });

      const text = await res.text();
      if (res.ok) {
        showSuccessMessage(text || "Profile updated successfully");
      } else {
        showErrorMessage(text || "Failed to update profile");
      }
      loadProfile();
    } catch (err) {
      console.error(err);
      showErrorMessage("Error updating profile");
    }
  };

  const handleAddAddress = () => {
    setProfile((prev) => ({
      ...prev,
      address: EMPTY_ADDRESS
    }));
    setAddressFormOpen(true);
  };

  const handleRemoveAddress = () => {
    setProfile((prev) => ({
      ...prev,
      address: EMPTY_ADDRESS
    }));
    setAddressFormOpen(false);
  };

  const handleAddCard = () => {
    if (profile.cards.length >= 3) {
      showErrorMessage("You cannot store more than 3 payment cards.");
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
          `${API_BASE_URL}/api/profile/${userId}/cards/${card.cardId}`,
          {
            method: "DELETE"
          }
        );

        const text = await res.text();
        if (res.ok) {
          showSuccessMessage(text || "Card deleted successfully");
        } else {
          showErrorMessage(text || "Failed to delete card");
          return;
        }
        loadProfile();
      } catch (err) {
        console.error(err);
        showErrorMessage("Failed to delete card");
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
      const cardsToSave = unsavedCards.filter((card) => hasAnyCardValue(card));

      if (unsavedCards.length === 0) {
        showErrorMessage("There are no new cards to save.");
        return;
      }

      if (cardsToSave.length === 0) {
        showErrorMessage("Please fill out the new card details or remove the empty card before saving.");
        return;
      }

      for (let index = 0; index < cardsToSave.length; index += 1) {
        const card = cardsToSave[index];
        const cardDisplayIndex = profile.cards.findIndex((existingCard) => existingCard === card) + 1;

        const validationError = validatePaymentCard({
          ...card,
          cardNumber: normalizeCardDigits(card.cardNumber),
          cvv: normalizeCardDigits(card.cvv)
        }, { requireCardType: true });

        if (validationError) {
          showErrorMessage(`Card ${cardDisplayIndex || index + 1}: ${validationError}`);
          return;
        }
      }

      let savedCount = 0;

      for (const card of cardsToSave) {

        const res = await fetch(`${API_BASE_URL}/api/profile/${userId}/cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...card,
            cardNumber: normalizeCardDigits(card.cardNumber),
            cvv: normalizeCardDigits(card.cvv)
          })
        });

        if (!res.ok) {
          const text = await res.text();
          showErrorMessage(text || "Failed to save cards");
          return;
        }

        savedCount += 1;
      }

      showSuccessMessage(savedCount === 1 ? "Card saved successfully" : `${savedCount} cards saved successfully`);
      loadProfile();
    } catch (err) {
      console.error(err);
      showErrorMessage("Failed to save cards");
    }
  };

  const hasAddress = addressFormOpen || hasAnyAddressValue(profile.address);

  return (
    <div className="profile-page page-bg">
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

        {message && <div className={`alert ${messageType === "error" ? "alert-error" : "alert-success"}`}>{message}</div>}

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

        <ChangePasswordSection userId={userId} onSuccess={() => showSuccessMessage("Password changed successfully!")} />

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