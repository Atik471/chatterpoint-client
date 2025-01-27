import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useContext, useEffect, useState } from "react";
import { LocationContext } from "../contexts/LocationProvider";

const stripePromise = loadStripe(import.meta.env.VITE_pk_stripe);

const Membership = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const API = useContext(LocationContext);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 2500 }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .finally(() => setLoading(false))
  }, [API]);

  if(loading) return <div className="min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen flex flex-col items-center bg-primary py-10 px-4 md:px-10">
      <div className="max-w-4xl w-full bg-secondary shadow-lg rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-tertiary text-center mb-6">Become a Member</h1>
        <p className="text-gray-100 text-center mb-8">
          Post more than 5 post
        </p>
        {clientSecret ? (
          <Elements
            options={{ clientSecret }}
            stripe={stripePromise}
          >
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        ) : (
          <div className="text-center text-red-500 font-semibold">
            Unable to load payment details. Please try again later.
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;
