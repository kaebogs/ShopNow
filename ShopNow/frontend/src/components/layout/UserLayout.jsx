import React from 'react'
import SideMenu from './SideMenu'

const UserLayout = ({children}) => {
    //menu items with name, URL, and corresponding icons
  const menuItems = [
    {
      name: "Profile",
      url: "/user/profile",
      icon: "fas fa-user",
    },
    {
      name: "Update Profile",
      url: "/user/update_profile",
      icon: "fas fa-user",
    },
    {
      name: "Upload Avatar",
      url: "/user/upload_Avatar",
      icon: "fas fa-user-circle",
    },
    {
      name: "Update Password",
      url: "/user/update_password",
      icon: "fas fa-lock",
    },
  ];

  return (
    <div className="container-fluid overflow-y-auto">
         <div className="position-relative mt-2 mb-1 mb-lg-4 py-4 text-lg-center">         
          <h2 className="fw-bold m-0">User Setting</h2>
          <button
            className="btn btn-dark d-lg-none position-absolute top-50 end-0 translate-middle-y"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <i class="fa-solid fa-filter d-lg-none"></i>
          </button>
        </div>
         <div className="row">
          {/* Static sidebar for large screens */}
          <div className="col-lg-3 d-none d-lg-block">
            <SideMenu menuItems={menuItems} variant="static" />
          </div>

          {/* Offcanvas sidebar for small screens */}
          <div
            className="offcanvas w-75 offcanvas-end d-lg-none"
            tabIndex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div className="offcanvas-header">
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <SideMenu menuItems={menuItems} variant="offcanvas" />
          </div>
          <div className="col-12 col-lg-9">{children}</div>
        </div>
    </div>
  )
}

export default UserLayout