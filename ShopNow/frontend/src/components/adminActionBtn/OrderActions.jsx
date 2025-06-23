import React from "react";
import { Link } from "react-router-dom";

const OrderActions = ({ order, handleDeleteOrder, deleteLoading }) => {
  return (
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
            to={`/admin/orders/${order?._id}`}
            className="dropdown-item d-flex align-items-center"
          >
            <i className="fa fa-pencil me-2"></i> Edit
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="dropdown-item d-flex align-items-center text-danger"
            onClick={() => handleDeleteOrder(order?._id)}
            disabled={deleteLoading}
          >
            <i className="fa fa-trash me-2"></i> Delete
          </button>
        </li>
      </ul>
    </div>
  );
};

export default OrderActions;
