import React from "react";

const Checkout_Steps = ({ shipping, confirm_order, payment }) => {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5 row">
      {shipping ? (
        <a
          href="/shipping"
          className="mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
        >
          <div className="triangle2-active"></div>
          <div className="step active-step">Shipping</div>
          <div className="triangle-active"></div>
        </a>
      ) : (
        <a
          href="#!"
          className="mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
          disabled
        >
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete shadow-lg">Shipping</div>
          <div className="triangle-incomplete"></div>
        </a>
      )}

      {confirm_order ? (
        <a
          href="/confirm_order"
          className="mt-2 mt-md-0 col-12 col-md-4 col-lg-2"
        >
          <div className="triangle2-active"></div>
          <div className="step active-step shadow-lg">Confirm Order</div>
          <div className="triangle-active"></div>
        </a>
      ) : (
        <a
          href="#!"
          className="mt-2 mt-md-0 col-12 col-md-4 col-lg-2"
          disabled
        >
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete shadow-lg">Confirm Order</div>
          <div className="triangle-incomplete"></div>
        </a>
      )}

      {payment ? (
        <a
          href="/payment_method"
          className="mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
        >
          <div className="triangle2-active"></div>
          <div className="step active-step shadow-lg">Payment</div>
          <div className="triangle-active"></div>
        </a>
      ) : (
        <a
          href="#!"
          className="mt-2 mt-md-0 col-12 col-md-3 col-lg-2"
          disabled
        >
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete shadow-lg">Payment</div>
          <div className="triangle-incomplete"></div>
        </a>
      )}
    </div>
  );
};

export default Checkout_Steps;
