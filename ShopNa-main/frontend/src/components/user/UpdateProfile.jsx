import React, { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "../../redux/api/UserAPI";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import UserLayout from "../layout/UserLayout";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [updateProfile, { isSuccess, error, isLoading }] =
    useUpdateProfileMutation();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setName(user?.name || "");
      setEmail(user?.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (error && error.data?.message) {
      toast.error(error.data.message);
    }
    if (isSuccess) {
      toast.success("Profile updated successfully.");
    }
  }, [error, isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page reload

    const userData = { name, email };
    updateProfile(userData);
  };

  return (
   <UserLayout>
  <div className="row justify-content-center align-items-center bg-light py-2">
    <div className="col-12 col-md-8 col-lg-6">
      <form
        className="shadow-lg rounded-3  p-lg-4 p-4 bg-white"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="mb-4 text-center fw-bold text-dark">Update Profile</h2>

        <div className="mb-4">
          <label htmlFor="name_field" className="form-label fw-semibold">
            Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="name_field"
            className="form-control form-control-lg"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            aria-describedby="nameHelp"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email_field" className="form-label fw-semibold">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id="email_field"
            className="form-control form-control-lg"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            aria-describedby="emailHelp"
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
            "Update"
          )}
        </button>
      </form>
    </div>
  </div>
</UserLayout>

  );
};

export default UpdateProfile;
