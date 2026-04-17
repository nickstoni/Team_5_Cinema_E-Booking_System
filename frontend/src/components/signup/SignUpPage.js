import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/signup/SignUpPage.css';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import RequiredInfoSection from './RequiredInfoSection';
import AddressSection from './AddressSection';
import PaymentCardsSection from './PaymentCardsSection';
import {
  API_BASE_URL,
  MAX_PAYMENT_CARDS,
  EMPTY_FORM_DATA,
  ADDRESS_FIELDS,
  createEmptyCard,
  getExpiryYears
} from './SignupConstants';
import { hasAnyAddressValue, validateSignupForm } from './SignupValidation';

function SignUpPage() {
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [cards, setCards] = useState([]);
  const [hasAddress, setHasAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const expiryYears = getExpiryYears();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardChange = (index, field, value) => {
    setCards((prev) => {
      const nextCards = [...prev];
      nextCards[index] = {
        ...nextCards[index],
        [field]: value
      };
      return nextCards;
    });
  };

  const addCard = () => {
    if (cards.length < MAX_PAYMENT_CARDS) {
      setCards((prev) => [...prev, createEmptyCard()]);
    }
  };

  const removeCard = (index) => {
    setCards((prev) => prev.filter((_, cardIndex) => cardIndex !== index));
  };

  const addAddress = () => {
    setHasAddress(true);
  };

  const removeAddress = () => {
    setHasAddress(false);
    setFormData((prev) => {
      const nextData = { ...prev };
      ADDRESS_FIELDS.forEach((field) => {
        nextData[field] = '';
      });
      return nextData;
    });
  };

  const isAddressProvided = hasAnyAddressValue(formData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateSignupForm(formData, cards);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);

      const cardsToSubmit = cards
        .filter((card) => (
          card.cardType ||
          card.cardNumber ||
          card.cardHolderName ||
          card.expiryMonth ||
          card.expiryYear ||
          card.cvv
        ))
        .map((card) => ({
          cardType: card.cardType,
          cardNumber: card.cardNumber.replace(/\s/g, ''),
          cardHolderName: card.cardHolderName.trim(),
          expiryMonth: card.expiryMonth,
          expiryYear: card.expiryYear,
          cvv: card.cvv
        }));

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          promotionsEnabled: formData.promotionsEnabled,
          address: isAddressProvided
            ? {
                addressLine1: formData.addressLine1.trim(),
                addressLine2: formData.addressLine2.trim(),
                city: formData.city.trim(),
                state: formData.state,
                postalCode: formData.postalCode.trim(),
                country: formData.country
              }
            : null,
          paymentCards: cardsToSubmit
        })
      });

      const responseBody = await response.text();
      let data = {};

      if (responseBody) {
        try {
          data = JSON.parse(responseBody);
        } catch {
          data = { message: responseBody };
        }
      }

      if (response.ok && (data.success ?? true)) {
        navigate('/login', {
          state: { message: 'Account created successfully! Please sign in.' }
        });
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (submitError) {
      setError(
        submitError.message || 'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page page-bg">
      <Navbar onSearch={() => {}} onGenreChange={() => {}} />

      <main className="signup-main">
        <div className="auth-wrapper">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join Absolute Cinema today</p>
          </div>

          <div className="auth-card">
            {error ? <div className="auth-error">{error}</div> : null}

            <form className="signup-form" onSubmit={handleSubmit}>
              <RequiredInfoSection formData={formData} onInputChange={handleInputChange} />

              <AddressSection
                formData={formData}
                onInputChange={handleInputChange}
                hasAddress={hasAddress}
                onAddAddress={addAddress}
                onRemoveAddress={removeAddress}
              />

              <PaymentCardsSection
                cards={cards}
                onAddCard={addCard}
                onRemoveCard={removeCard}
                onCardChange={handleCardChange}
                maxCards={MAX_PAYMENT_CARDS}
                expiryYears={expiryYears}
              />

              <button type="submit" className="btn-primary full-width" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="centered-text">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-link">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="centered-text">
              <Link to="/" className="text-link">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SignUpPage;
