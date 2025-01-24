import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";

const stripePromise = loadStripe(import.meta.env.VITE_pk_stripe);

const Membership = () => {
  const [clientSecret, setClientSecret] = useState("");
  const API = useContext(LocationContext);

  useEffect(() => {
    fetch(`${API}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 2500 }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
  }, [API]);


  return (
    <div className="min-h-screen md:px-[5%] px-4 md:py-10 py-5">
      {clientSecret && (
        <Elements
          options={{ clientSecret }}
          stripe={stripePromise}
        >
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
};

export default Membership;
