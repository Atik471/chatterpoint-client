import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import PropTypes from "prop-types";
import axios from "axios";
import { LocationContext } from "../contexts/LocationProvider";

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const API = useContext(LocationContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }

    try {
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              email: user?.email,
              name: user?.displayName,
            },
          },
        });

      if (confirmError) {
        console.log("Payment confirmation failed:", confirmError);
      } else {
        console.log("Payment successful:", paymentIntent);
        axios.put(`${API}/update-badges`, {
            userId: user.objectId,
          })
          .then(res => console.log(res))
          .catch(e => console.log(e))
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      ></CardElement>
      <button type="submit" disabled={!stripe} className="py-1 mt-4 px-4 rounded-lg bg-tertiary font-bold transition-all duration-300 hover:bg-white hover:text-primary">
        Pay
      </button>
    </form>
  );
};

CheckoutForm.propTypes = {
  clientSecret: PropTypes.string,
};

export default CheckoutForm;
