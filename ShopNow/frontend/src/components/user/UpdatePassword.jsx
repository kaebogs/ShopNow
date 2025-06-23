import React from "react";
import UserLayout from "../layout/UserLayout";
import { useEffect, useState } from "react";
import { useUpdatePasswordMutation } from "../../redux/api/UserAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  
 const [oldPassword, setOldPassword] = useState("")
 const [password, setPassword] = useState("");

 const navigate = useNavigate();

 const[updatePassword, {error, isLoading, isSuccess}] = useUpdatePasswordMutation(); 

 useEffect(() => {
    if(error){
        toast.error(error?.data?.message)
    }

    if(isSuccess){
        toast.success("Password updated!")
        navigate("/user/profile")
    }
 }, [error, isSuccess])

 const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
        oldPassword,
        password
    }
    updatePassword(userData);
 }


  return (
    <UserLayout>
  <div className="row d-flex align-items-center justify-content-center bg-light py-2">
    <div className="col-12 col-md-8 col-lg-6">
      <form className="shadow-lg rounded-3bg-white p-lg-4 p-4" onSubmit={handleSubmit}>
        <h2 className="mb-5 text-center fw-bold text-dark">Update Password</h2>

        <div className="mb-4">
          <label htmlFor="old_password_field" className="form-label fw-semibold">
            Old Password
          </label>
          <input
            type="password"
            id="old_password_field"
            className="form-control form-control-lg p-3 fs-6"
            placeholder="Enter old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="new_password_field" className="form-label fw-semibold">
            New Password
          </label>
          <input
            type="password"
            id="new_password_field"
            className="form-control form-control-lg p-3 fs-6"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-dark w-100 py-2 fw-semibold fs-6"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  </div>
</UserLayout>

  );
};

export default UpdatePassword;
