import SideMenu from "./SideMenu";
import MetaData from "../layout/MetaData";

const AdminLayout = ({ children }) => {
  const menuItems = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: "fas fa-tachometer-alt",
    },
    { name: "New Product", url: "/admin/new/product", icon: "fas fa-plus" },
    { name: "Products", url: "/admin/products", icon: "fab fa-product-hunt" },
    { name: "Orders", url: "/admin/orders", icon: "fas fa-receipt" },
    { name: "Users", url: "/admin/users", icon: "fas fa-user" },
    { name: "Reviews", url: "/admin/reviews", icon: "fas fa-star" },
  ];

  return (
    <>
      <div className="container-fluid overflow-y-auto">
        <div className="position-relative mt-2 mb-1 mb-lg-4 py-4 text-lg-center">
          <h2 className="fw-bold m-0">Admin Dashboard</h2>
          <button
            className="btn btn-dark d-lg-none position-absolute top-50 end-0 translate-middle-y"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            ☰
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
          <div className="col-12 col-lg-9 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
