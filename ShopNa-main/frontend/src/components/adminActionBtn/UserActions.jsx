import React from "react";
import { Link } from "react-router-dom";

const UserActions = ({ user, handleDeleteUser, deleteLoading }) => {
  return (
    <div className="dropdown d-block d-lg-none">
      <button
        className="btn btn-secondary dropdown-toggle w-100"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Actions
      </button>
      <ul className="dropdown-menu w-100">
        <li className="px-2">
          <Link
            to={`/admin/users/${user?._id}`}
            className="dropdown-item text-primary"
          >
            <i className="fa fa-pencil me-2"></i> Edit User
          </Link>
        </li>
        <li className="px-2">
          <button
            className="dropdown-item text-danger"
            onClick={() => handleDeleteUser(user?._id)}
            disabled={deleteLoading}
          >
            <i className="fa fa-trash me-2"></i> Delete User
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserActions;
