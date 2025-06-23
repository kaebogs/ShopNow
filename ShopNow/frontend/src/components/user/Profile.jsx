import React from "react";
import UserLayout from "../layout/UserLayout";
import { useSelector } from "react-redux";
import defaultUserImage from "../../assets/default_avatar.jpg";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <UserLayout>
      <div className="container py-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-4 d-flex justify-content-center mb-4 mb-md-0">
            <figure className="mb-0">
              <img
                src={user?.avatar ? user.avatar.url : defaultUserImage}
                alt={user?.name || "User"}
                className="rounded-circle shadow-lg border border-3 border-dark "
                style={{
                  width: "180px",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
            </figure>
          </div>

          <div className="col-12 col-md-7">
            <div className="p-4 rounded-4 bg-white shadow-sm border">
              <h3 className="fw-bold text-dark mb-4 text-center text-md-start">
                Profile Information
              </h3>

              <div className="mb-3">
                <h5 className="fw-semibold mb-1">Full Name</h5>
                <p className="text-muted mb-0">{user?.name || "N/A"}</p>
              </div>

              <div className="mb-3">
                <h5 className="fw-semibold mb-1">Email Address</h5>
                <p className="text-muted mb-0">{user?.email || "N/A"}</p>
              </div>

              <div>
                <h5 className="fw-semibold mb-1">Joined On</h5>
                <p className="text-muted mb-0">
                  {user?.createdAt ? user.createdAt.substring(0, 10) : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
