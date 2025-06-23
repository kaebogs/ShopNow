import React from "react";
import StarRatings from "react-star-ratings";
import { useState, useEffect } from "react";
import {
  useCanUserReviewQuery,
  useSubmitReviewMutation,
} from "../../redux/api/ProductAPI";
import toast from "react-hot-toast";

const New_Review = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const [submitReview, { isLoading, error, isSuccess }] =
    useSubmitReviewMutation();

  const { data } = useCanUserReviewQuery(productId);
  const canReview = data?.canReview;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
      console.log("error", error);
    }
    if (isSuccess) {
      toast.success("Review submitted!");
    }
  }, [error, isSuccess]);

  const handleSubmit = () => {
    const reviewData = { rating, comment: review, productId: productId };

    submitReview(reviewData);
  };

  return (
    <>
      <div>
        {canReview && (
          <button
            id="review_btn"
            type="button"
            className="btn btn-dark mt-4"
            data-bs-toggle="modal"
            data-bs-target="#ratingModal"
          >
            Submit Your Review
          </button>
        )}

        <div className="row mt-2 mb-5">
          <div className="rating w-50">
            <div
              className="modal fade"
              id="ratingModal"
              tabindex="-1"
              role="dialog"
              aria-labelledby="ratingModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="ratingModalLabel">
                      Submit Review
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <StarRatings
                      rating={rating}
                      starRatedColor="#ffc107"
                      numberOfStars={5}
                      name="rating"
                      changeRating={(e) => setRating(e)}
                    />

                    <textarea
                      name="review"
                      id="review"
                      className="form-control mt-4"
                      placeholder="Enter your comment"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>

                    <button
                      id="new_review_btn"
                      className="btn btn-success w-100 my-4 px-4"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default New_Review;
