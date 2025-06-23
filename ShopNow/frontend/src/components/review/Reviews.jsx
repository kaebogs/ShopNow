import React from 'react';
import img from "../../assets/default_avatar.jpg"
import StarRatings from 'react-star-ratings';

const Reviews = ({reviews}) => {
  return (
    <div className="reviews-container w-75 mx-auto mt-5">
      <h3 className="mb-3">Others' Reviews:</h3>
      <hr />
      {reviews.map((review) => (
        <div className="review-card py-3">
        <div className="row align-items-center">
          <div className="col-auto">
            <img
              src={review?.user?.avatar ? review?.user?.avatar?.url : img}
              alt="User Name"
              width="50"
              height="50"
              className="rounded-circle border"
            />
          </div>
          <div className="col">
          <StarRatings
                rating={review?.rating}
                starRatedColor="#ffc107"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
                name="rating"
              />
            <p className="mb-1 fw-semibold text-muted">by {review?.user?.name}</p>
            <p className="mb-0">{review?.comment}</p>
          </div>
        </div>
        <hr className="mt-4" />
      </div>
      ))}
      
    </div>
  );
};

export default Reviews;
