import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem, deleteItem } from "../../redux/features/CartSlice.js";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData.jsx";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const decreaseQty = (item, quantity) => {
    const newQty = quantity - 1;

    // Prevents decreasing below 1 (ensures the quantity doesn't go below the minimum allowed value)
    if (newQty <= 0) return;

    handleQty(item, newQty);
  };

  const increaseQty = (item, quantity) => {
    const newQty = quantity + 1;

    // Prevents increasing the quantity beyond the available stock
    if (newQty >= item?.stock) return;

    handleQty(item, newQty);
  };

  // handle Quantity
  const handleQty = (item, newQty) => {
    const cartItem = {
      product: item?.product,
      name: item?.name,
      price: item?.price,
      image: item?.image,
      stock: item?.stock,
      quantity: newQty,
    };

    dispatch(setCartItem(cartItem));
  };

  //handle delete item
  const handleDeleteItem = (id) => {
    dispatch(deleteItem(id));
  };

  // Checkout
  const handleCheckOut = () => {
    navigate("/shipping");
  };

  return (
    <>
      <MetaData title={"Cart"} />
      {cartItems?.length === 0 ? (
        <h2 className="mt-5 text-center text-muted">Your Cart is Empty</h2>
      ) : (
        <>
          <h2 className="mt-5 mb-4 text-center text-md-start">
            🛒 Your Cart: <b>{cartItems.length} item(s)</b>
          </h2>

          <div className="row g-4">
            {/* Cart Items List */}
            <div className="col-12 col-lg-8">
              {cartItems?.map((item) => (
                <div
                  key={item?.product}
                  className="border rounded-3 shadow-sm p-3 mb-3 bg-white"
                >
                  <div className="row align-items-center gx-3 gy-2">
                    <div className="col-4 col-md-3 text-center">
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="rounded shadow-sm"
                        style={{
                          height: "90px",
                          width: "auto",
                          maxWidth: "100%",
                        }}
                      />
                    </div>

                    <div className="col-8 col-md-3 text-start">
                      <Link
                        to={`/product/${item?.product}`}
                        className="text-decoration-none fw-semibold"
                      >
                        {item?.name}
                      </Link>
                    </div>

                    <div className="col-6 col-md-2 text-start text-md-center">
                      <p className="mb-0 fw-bold text-primary">
                        ${item?.price}
                      </p>
                    </div>

                    <div className="col-6 col-md-3 text-start text-md-center">
                      <div className="d-inline-flex align-items-center">
                        <button
                          className="btn btn-outline-danger px-2"
                          onClick={() => decreaseQty(item, item.quantity)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="form-control mx-2 text-center"
                          value={item?.quantity}
                          readOnly
                          style={{ width: "60px" }}
                        />
                        <button
                          className="btn btn-outline-primary px-2"
                          onClick={() => increaseQty(item, item.quantity)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-12 col-md-1 text-end mt-4 mt-lg-2 mt-md-0">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteItem(item?.product)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-12 col-lg-4 z-0">
              <div
                className="border rounded-3 bg-light p-4 shadow-sm sticky-top"
                style={{ top: "90px" }}
              >
                <h4 className="fw-bold mb-3">🧾 Order Summary</h4>
                <ul className="list-unstyled">
                  <li className="mb-2 d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span className="fw-semibold">
                      {cartItems?.reduce(
                        (acc, item) => acc + item?.quantity,
                        0
                      )}{" "}
                      unit(s)
                    </span>
                  </li>
                  <li className="mb-3 d-flex justify-content-between">
                    <span>Est. Total</span>
                    <span className="fw-bold text-primary">
                      $
                      {cartItems
                        ?.reduce(
                          (acc, item) => acc + item?.quantity * item?.price,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </li>
                </ul>
                <button
                  id="checkout_btn"
                  className="btn btn-success w-100 py-2 fw-semibold"
                  onClick={handleCheckOut}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
