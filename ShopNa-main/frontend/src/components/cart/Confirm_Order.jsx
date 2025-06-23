import React from "react";
import { useSelector } from "react-redux";
import { calculateOrderCost } from "../../helpers/helpers";
import { Link } from "react-router-dom";
import Checkout_Steps from "./Checkout_Steps";
import MetaData from "../layout/MetaData";

const Confirm_Order = () => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const { itemsPrice, shippingFee, taxPrice, totalPrice } =
    calculateOrderCost(cartItems);

  return (
    <>
      <MetaData title={"Confirm Order"} />
      <Checkout_Steps shipping confirm_order />
      <div className="container mt-5">
        <div className="row justify-content-between">
          {/* Shipping Info and Cart Items */}
          <div className="col-12 col-lg-8 order-confirm">
            <section className="mb-4">
              <h4 className="mb-3 fw-bold">Shipping Info</h4>
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Phone:</strong> {shippingInfo.phoneNo}
              </p>
              <p className="mb-4">
                <strong>Address:</strong> {shippingInfo.address}
              </p>
            </section>

            <hr />

            <section>
              <h4 className="mb-3">Your Cart Items:</h4>
              {cartItems.map((item) => (
                <div
                  key={item?.product}
                  className="cart-item my-3 p-3 border rounded"
                >
                  <div className="row align-items-center">
                    <div className="col-4 col-lg-2">
                      <img
                        src={item?.image}
                        alt="Laptop"
                        className="img-fluid rounded"
                        height="45"
                        width="65"
                      />
                    </div>

                    <div className="col-8 col-lg-6">
                      <a
                        href={`product/${item?.product}`}
                        className="text-decoration-none"
                      >
                        {item?.name}
                      </a>
                    </div>

                    <div className="col-12 col-lg-4 mt-2 mt-lg-0">
                      <p className="mb-0">
                        {item?.quantity} x ${item?.price} ={" "}
                        <strong>${item?.quantity * item?.price}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Order Summary */}
          <div className="col-12 col-lg-3 my-4">
            <section
              id="order_summary"
              className="p-4 border rounded shadow-sm"
            >
              <h4 className="mb-4">Order Summary</h4>
              <div className="mb-2">
                <span>Subtotal:</span>
                <span className="float-end order-summary-values">
                  {itemsPrice}
                </span>
              </div>
              <div className="mb-2">
                <span>Shipping:</span>
                <span className="float-end order-summary-values">
                  {shippingFee}
                </span>
              </div>
              <div className="mb-3">
                <span>Tax:</span>
                <span className="float-end order-summary-values">
                  {taxPrice}
                </span>
              </div>

              <hr />

              <div className="mb-3">
                <strong>Total:</strong>
                <span className="float-end order-summary-values">
                  <strong>$ {totalPrice}</strong>
                </span>
              </div>

              <Link
                to="/payment_method"
                id="checkout_btn"
                className="btn btn-primary w-100 mt-3"
              >
                Proceed to Payment
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Confirm_Order;
