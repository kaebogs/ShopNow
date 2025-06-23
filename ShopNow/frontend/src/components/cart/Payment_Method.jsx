import React, { useEffect } from "react";
import Checkout_Steps from "./Checkout_Steps";
import { useState } from "react";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/helpers";
import {
  useCreateNewOrderMutation,
  useStripeCheckoutSessionMutation,
} from "../../redux/api/OrderAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";

const Payment_Method = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);

  const [createNewOrder, { error, isSuccess }] = useCreateNewOrderMutation();

  const [
    stripeCheckoutSession,
    { data: checkoutData, error: checkoutError, isLoading },
  ] = useStripeCheckoutSessionMutation();

  // for checkout data and go to stripe url
  useEffect(() => {
    if (checkoutData) {
      window.location.href = checkoutData?.url;
      console.log("Checkout:", checkoutData);
    }
    if (checkoutError) {
      toast.error(checkoutError?.data?.message);
    }
  }, [checkoutData, checkoutError]);

  // for handling error, success order and to clear cart items
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Order successfully");
      navigate("/me/order?order_success=true");
    }
  }, [error, isSuccess]);

  //handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const { itemsPrice, shippingFee, taxPrice, totalPrice } =
      calculateOrderCost(cartItems); // calculate cost breakdown

    if (method === "COD") {
      const orderData = {
        shippingInfo,
        shippingAmount: shippingFee,
        orderItems: cartItems,
        itemsPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "NOT PAID",
        },
        paymentMethod: "COD",
      };

      createNewOrder(orderData);
    }

    if (method === "Card") {
      const orderData = {
        shippingInfo,
        shippingAmount: shippingFee,
        orderItems: cartItems,
        itemsPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
      };

      stripeCheckoutSession(orderData);
    }
  };

  return (
    <>
      <MetaData title={"Payment Method"} />
      <Checkout_Steps shipping confirm_order payment />
      <div className="row justify-content-center align-items-center mt-5">
        <div className="col-12 col-md-8 col-lg-5">
          <form
            className="shadow rounded-4 bg-white p-lg-5 p-2"
            onSubmit={handleSubmit}
          >
            <h2 className="mb-5 text-center fw-bold text-primary">
              💳 Select Payment Method
            </h2>

            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod("COD")}
              />
              <label
                className="form-check-label fs-5 d-flex align-items-center gap-2"
                htmlFor="codradio"
              >
                🚚 Cash on Delivery
              </label>
            </div>

            <div className="form-check mb-5">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={(e) => setMethod("Card")}
              />
              <label
                className="form-check-label fs-5 d-flex align-items-center gap-2"
                htmlFor="cardradio"
              >
                💳 Card - VISA, MasterCard
              </label>
            </div>

            <button
              id="shipping_btn"
              type="submit"
              className="btn btn-gradient w-100 py-3 fw-semibold text-light"
              disabled={isLoading}
              style={{
                background: "linear-gradient(135deg,rgb(85, 68, 104), #2575FC)",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
              }}
            >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Payment_Method;
