import React from "react";
import { Link } from "react-router-dom";

const MyOrderActions = ({order}) => {
  return (
    <>
      <div className="dropdown d-block d-lg-none">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          id={`dropdownMenuButton-${order?._id}`}
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Actions
        </button>
        <ul
          className="dropdown-menu"
          aria-labelledby={`dropdownMenuButton-${order?._id}`}
        >
          <li>
            <Link
              to={`/me/order/${order?._id}`}
              className="btn btn-primary text-primary dropdown-item"
            >
              <i className="fa-solid fa-eye me-2"></i> Details
            </Link>
          </li>
          <li>
            <Link
              to={`/invoice/order/${order?._id}`}
              className="btn btn-success dropdown-item text-success"
            >
              <i className="fa-solid fa-print me-2"></i> Invoice
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MyOrderActions;
