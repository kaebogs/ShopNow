import React from "react";
import { Link } from "react-router-dom";

const ProductActions = ({product, handleDeleteProduct, deleteLoading}) => {
  return (
    <>
      <div className="dropdown d-block d-lg-none">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          Actions
        </button>
        <ul className="dropdown-menu">
          <li>
            <Link
              className="dropdown-item"
              to={`/admin/product/${product?._id}`}
            >
              <i className="fa fa-pencil me-1"></i> Edit
            </Link>
          </li>
          <li>
            <Link
              className="dropdown-item"
              to={`/admin/product/${product?._id}/upload_images`}
            >
              <i className="fa fa-image me-1"></i> Images
            </Link>
          </li>
          <li>
            <button
              className="dropdown-item text-danger"
              onClick={() => handleDeleteProduct(product?._id)}
              disabled={deleteLoading}
            >
              <i className="fa fa-trash me-1"></i> Delete
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProductActions;
