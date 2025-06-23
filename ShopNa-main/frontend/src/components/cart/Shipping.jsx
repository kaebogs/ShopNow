import React, { useEffect, useState } from "react";
import { countries } from "countries-list";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../redux/features/CartSlice";
import { Link, useNavigate } from "react-router-dom";
import Checkout_Steps from "./Checkout_Steps";
import MetaData from "../layout/MetaData";

const Shipping = () => {
  const countriesList = Object.values(countries);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const { shippingInfo } = useSelector((state) => state.cart);

  useEffect(() => {
    if (shippingInfo) {
      setAddress(shippingInfo?.address);
      setCity(shippingInfo?.city);
      setPhoneNo(shippingInfo?.phoneNo);
      setPostalCode(shippingInfo?.postalCode);
      setCountry(shippingInfo?.country);
    }
  }, [shippingInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const shippingData = { address, city, phoneNo, postalCode, country };
    console.log("Shipping Info Submitted:", shippingData);

    dispatch(saveShippingInfo(shippingData));
    navigate("/confirm_order");
  };

  return (
    <>
      <MetaData title={"Shipping Info"} />
      <Checkout_Steps shipping />
      <div className="d-flex justify-content-center align-items-center mt-4 px-3">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
          <div className="shadow-lg rounded-4 p-4 bg-white">
            <h2 className="text-center mb-4 fw-bold">Shipping Info</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="address_field"
                  className="form-label fw-semibold"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address_field"
                  className="form-control shadow-sm"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Enter your address"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="city_field" className="form-label fw-semibold">
                  City
                </label>
                <input
                  type="text"
                  id="city_field"
                  className="form-control shadow-sm"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder="Enter your city"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone_field" className="form-label fw-semibold">
                  Phone No
                </label>
                <input
                  type="tel"
                  id="phone_field"
                  className="form-control shadow-sm"
                  name="phoneNo"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="postal_code_field"
                  className="form-label fw-semibold"
                >
                  Postal Code
                </label>
                <input
                  type="number"
                  id="postal_code_field"
                  className="form-control shadow-sm"
                  name="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  placeholder="Enter postal code"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="country_field"
                  className="form-label fw-semibold"
                >
                  Country
                </label>
                <select
                  id="country_field"
                  className="form-select shadow-sm"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  <option value="">Select Country</option>
                  {countriesList.map((country) => (
                    <option key={country?.name} value={country?.name}>
                      {country?.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="shipping_btn"
                type="submit"
                onClick={handleSubmit}
                className="btn w-100 py-2 text-white fw-semibold"
                style={{
                  background: "linear-gradient(135deg, #6A11CB, #2575FC)",
                  border: "none",
                  borderRadius: "8px",
                  letterSpacing: "0.05em",
                }}
              >
                CONTINUE
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;
