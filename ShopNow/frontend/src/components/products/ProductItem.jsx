import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import defaultProduct from "../../assets/default_product.png";

const ProductItem = ({ product, columnSize }) => {
  return (
    <div className={`col-6 col-sm-6 col-md-4 col-lg-${columnSize} mb-4`}>
      <div className="card border-1 rounded-3 h-100 d-flex flex-column overflow-hidden">
        <div
          className="position-relative d-flex justify-content-center align-items-center p-3  h-20vh h-lg-30vh"
          style={{ maxHeight: "250px", minHeight: "150px" }}
        >
          <img
            src={product?.images[0] ? product?.images[0]?.url : defaultProduct}
            className="img-fluid"
            alt={product?.name}
            style={{
              objectFit: "contain",
              maxHeight: "100%",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className="card-body border-top text-center d-flex flex-column flex-grow-1">
          <Link
            to={`/product/${product._id}`}
            className="card-title fw-bold flex-grow-1  text-dark text-decoration-none mb-0 mb-lg-2"
            style={{
              fontSize: "1.05rem",
              minHeight: "48px",
              lineHeight: "1.3",
            }}
          >
            <span className="d-inline d-lg-none">
              {product?.name.substring(0, 20)}...
            </span>
            <span className="d-none d-lg-inline">{product?.name}</span>
          </Link>

          <div className="rating d-none d-lg-flex d-flex justify-content-center align-items-center mt-2">
            <StarRatings
              rating={product?.ratings}
              starRatedColor="#ffc107"
              numberOfStars={5}
              starDimension="22px"
              starSpacing="2px"
              name="rating"
            />
            <span className="ps-2 text-dark" style={{ fontSize: "0.9rem" }}>
              ({product?.numOfReviews})
            </span>
          </div>

          <p
            className="card-text text-mute fw-bold mt-0 mt-lg-2"
            style={{ fontSize: "1.2rem" }}
          >
            ${product?.price}
          </p>

          <Link
            to={`/product/${product._id}`}
            className="btn btn-outline-dark p-1 p-lg-2 rounded-1 fw-bold "
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
