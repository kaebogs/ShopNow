import React from "react";
import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import { MDBDataTable } from "mdbreact";
import {
  useDeleteProductReviewMutation,
  useLazyGetProductReviewsQuery,
} from "../../redux/api/ProductAPI";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const Reviews = () => {
  const [productId, setProductId] = useState("");
  const [getProductReviews, { data, isLoading, error }] =
    useLazyGetProductReviewsQuery();
  console.log(data);

  const [
    deleteProductReview,
    { error: deleteError, isLoading: deleteLoading, isSuccess },
  ] = useDeleteProductReviewMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Review Deleted");
    }
  }, [error, deleteError, isSuccess]);

  const setReviews = () => {
    const reviews = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.reviews?.forEach((review) => {
      reviews.rows.push({
        id: review?._id,
        rating: review?.rating,
        comment: review?.comment,
        user: review?.user?.name,
        actions: (
          <>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteReview(review?._id)}
              disabled={deleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return reviews;
  };

  // handle find the review
  const reviewHandle = (e) => {
    e.preventDefault();
    getProductReviews(productId);
  };

  // handle delete review
  const deleteReview = (id) => {
    deleteProductReview({ productId, id });
  };

  return (
    <>
      <MetaData title={"View Reviews"} />
      <AdminLayout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <form
                onSubmit={reviewHandle}
                className="p-4 shadow rounded bg-white"
              >
                <h4 className="text-center mb-4">Search Product Reviews</h4>
                <div className="mb-3">
                  <label
                    htmlFor="productId_field"
                    className="form-label fw-semibold"
                  >
                    Enter Product ID
                  </label>
                  <input
                    type="text"
                    id="productId_field"
                    className="form-control"
                    placeholder="e.g. 653ff9ac..."
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                  />
                </div>
                <button
                  id="search_button"
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "SEARCH"}
                </button>
              </form>
            </div>
          </div>

          {data?.reviews?.length > 0 ? (
            <div className="overflow-x-auto mt-3">
              <MDBDataTable
                className="min-w-[600px] md:min-w-full px-3"
                data={setReviews()}
                striped
                bordered
                hover
              />
            </div>
          ) : (
            <p className="mt-5 fw-bold text-center text-muted">
              No reviews found
            </p>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default Reviews;
