import React from "react";
import StarRatings from "react-star-ratings";
import defaultProduct from "../../assets/default_product.png";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import Reviews from "../Review/Reviews.jsx";

import { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../../redux/api/ProductAPI";
import { setCartItem } from "../../redux/features/CartSlice.js";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import New_Review from "../Review/New_Review.jsx";
import MetaData from "../layout/MetaData.jsx";

const ProductDetails = () => {
  // Extracting the product ID from the URL parameters
  const Params = useParams();
  const dispatch = useDispatch();

  // Fetching product details based on the extracted ID
  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    Params?.id
  );

  const { isAuthenticated } = useSelector((state) => state.auth);

  // Extracting the product data from the fetched response
  const product = data?.product;

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Setting the active image to the first product image or a default image if none exist
  useEffect(() => {
    setActiveImage(
      product?.images[0] ? product?.images[0]?.url : defaultProduct
    );
  }, [product]); // Runs whenever `product` changes

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]); // Runs whenever `isError` changes

  const decreaseQty = () => {
    const count = document.querySelector(".count");

    // Prevents decreasing below 1 (ensures the quantity doesn't go below the minimum allowed value)
    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;

    setQuantity(qty);
  };

  const increaseQty = () => {
    const count = document.querySelector(".count");

    // Prevents increasing the quantity beyond the available stock
    if (count.valueAsNumber >= product?.stock) return;

    const qty = count.valueAsNumber + 1;

    setQuantity(qty);
  };

  // Set cart item
  const handleAddToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };
    dispatch(setCartItem(cartItem));

    toast.success("Item added to Cart");
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Product"} />
      <div className="container mt-5">
        <div className="row justify-content-center">
          {/* Left Section - Product Image */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className="p-3 border rounded">
              <img
                className="img-fluid rounded"
                src={activeImage}
                alt={product?.name}
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>

            {/* Thumbnail Images */}
            <div className="row mt-3 justify-content-center">
              {product?.images?.map((img, index) => (
                <div key={index} className="col-3 col-md-2 p-1">
                  <img
                    className={`border rounded cursor-pointer img-fluid ${
                      img.url === activeImage ? "border-warning border-3" : ""
                    }`}
                    src={img.url}
                    alt={product?.name}
                    onClick={() => setActiveImage(img.url)}
                    style={{
                      height: "80px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Product Details */}
          <div className="col-12 col-md-6 col-lg-5">
            <h2 className="fw-bold">{product?.name}</h2>
            <p className="text-muted">Product ID: {product?._id}</p>

            <hr />

            {/* Star Ratings */}
            <div className="d-flex align-items-center">
              <StarRatings
                rating={product?.ratings}
                starRatedColor="#ffc107"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
                name="rating"
              />
              <span className="ps-2 text-muted">
                ({product?.numOfReviews} Reviews)
              </span>
            </div>

            <hr />

            {/* Price and Stock Status */}
            <h3 className="text-primary fw-bold">${product?.price}</h3>
            <span
              className={`fw-bold ${
                product?.stock > 0 ? "text-success" : "text-danger"
              }`}
            >
              Status: {product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>

            <hr />

            {/* Quantity Selector */}
            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-outline-danger fw-bold"
                onClick={decreaseQty}
              >
                -
              </button>
              <input
                type="number"
                className="form-control count mx-2 text-center"
                style={{ width: "60px" }}
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-success border-2"
                onClick={increaseQty}
              >
                +
              </button>
            </div>

            <button
              className="btn btn-dark w-100"
              disabled={product?.stock <= 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <hr />

            <h4>Description</h4>
            <p className="text-muted">{product?.description}</p>

            <hr />

            <p className="text-muted">
              <span className="fw-bold">Sold by:</span> {product?.seller}
            </p>

            {isAuthenticated ? (
              <New_Review productId={product?._id} />
            ) : (
              <div className="alert alert-danger mt-3">
                Login to post a review
              </div>
            )}
          </div>
        </div>
      </div>
      {product?.reviews?.length > 0 && <Reviews reviews={product?.reviews} />}
    </>
  );
};

export default ProductDetails;
