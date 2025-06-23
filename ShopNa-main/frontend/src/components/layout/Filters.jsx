import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQuery } from "../../helpers/helpers";
import { PRODUCT_CATEGORY } from "../../constants/constants";
import StarRatings from "react-star-ratings";

const Filters = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    searchParams.has("min") && setMin(searchParams.get("min")); // Set min value from URL if it exists
    searchParams.has("max") && setMax(searchParams.get("max")); // Set max value from URL if it exists
  }, []);

  //handle the price filter
  const handleSubmit = (e) => {
    e.preventDefault();

    searchParams = getPriceQuery(searchParams, "min", min);
    searchParams = getPriceQuery(searchParams, "max", max);

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  //handle category & rating filter
  const handleClickFilter = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      //delete filter from the query
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        //move to updated path
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      // set a new filter or update a filter
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value); //if category is there, it will update the value
      } else {
        searchParams.append(checkbox.name, checkbox.value); // if categorty is not there, it will append the value
      }

      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  };

  //check if there are value in checkbox and in params
  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);

    if (checkboxValue === value) return true;

    return false;
  };

  return (
    <>
      <div
        className="p-4 bg-gradient overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          maxWidth: "320px",
        }}
      >
        <h3 className="mb-4 fw-bold text-primary">Filters</h3>

        <section className="mb-4">
          <h5 className="mb-3 text-secondary">Price Range</h5>
          <form id="filter_form" onSubmit={handleSubmit}>
            <div className="d-flex gap-2 mb-3">
              <input
                type="number"
                min="0"
                step="any"
                className="form-control rounded-pill"
                placeholder="Min ($)"
                name="min"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                aria-label="Minimum price"
                style={{ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)" }}
              />
              <input
                type="number"
                min="0"
                step="any"
                className="form-control rounded-pill"
                placeholder="Max ($)"
                name="max"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                aria-label="Maximum price"
                style={{ boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)" }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary rounded-pill w-100 fw-semibold"
              style={{ letterSpacing: "0.05em" }}
            >
              APPLY
            </button>
          </form>
        </section>

        <section className="mb-4">
          <h5 className="mb-3 text-secondary">Categories</h5>
          <div className="d-flex flex-column gap-2">
            {PRODUCT_CATEGORY?.map((category, idx) => (
              <div className="form-check form-switch" key={category}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="category"
                  id={`categorySwitch${idx}`}
                  value={category}
                  onClick={(e) => handleClickFilter(e.target)}
                  defaultChecked={defaultCheckHandler("category", category)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`categorySwitch${idx}`}
                  style={{ cursor: "pointer", fontWeight: "500" }}
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h5 className="mb-3 text-secondary">Ratings</h5>
          <div className="d-flex flex-column gap-3">
            {[5, 4, 3, 2, 1].map((rating, idx) => (
              <label
                key={rating}
                className="d-flex align-items-center gap-3"
                htmlFor={`ratingsCheck${idx}`}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="ratings"
                  id={`ratingsCheck${idx}`}
                  value={rating}
                  onClick={(e) => handleClickFilter(e.target)}
                  defaultChecked={defaultCheckHandler(
                    "ratings",
                    rating.toString()
                  )}
                  style={{ flexShrink: 0 }}
                />
                <StarRatings
                  rating={rating}
                  starRatedColor="#fbc02d"
                  numberOfStars={5}
                  starDimension="24px"
                  starSpacing="2px"
                  name="rating"
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Filters;
