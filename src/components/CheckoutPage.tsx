import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

const CheckoutPage = ({
  customerId,
  services,
  totalPrice,
  paymentMethod,
}: {
  customerId: number;
  services: any[];
  totalPrice: number;
  paymentMethod?: string;
}) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const router = useRouter();
  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();

  // Function to initialize payment
  const initializePayment = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/product/bookings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          services,
          totalPrice,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClientSecret(data.clientSecret); // Set clientSecret from API response
        setBookingId(data.bookingId);
      } else {
        setErrorMessage(data.error || "Failed to initialize payment.");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Call initializePayment on component mount
  useEffect(() => {
    if (clientSecret) return;
    initializePayment();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://www.localhost:3000/payment-success?amount=${totalPrice}`,
      },
      redirect: "if_required", // Prevent auto-redirect
    });

    const paymentStatus = error ? "failed" : "completed";

    // Call the backend API to update payment status
    try {
      const response = await fetch("/api/create-payment-intent/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookingId, // Replace with actual book_id value
          status: paymentStatus,
          payment_method: paymentIntent?.payment_method, // Pass the payment method
          amount: totalPrice, // Pass the amount
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update payment status.");
      }

      if (!error) {
        router.push(`/payment-success?amount=${totalPrice}`);
      }
    } catch (apiError) {
      console.error("API Error:", apiError);
      setErrorMessage("Failed to update payment status.");
    }

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {clientSecret && <PaymentElement />}
      {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
      <button
        disabled={loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50"
      >
        {!loading ? `Pay $${totalPrice}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
