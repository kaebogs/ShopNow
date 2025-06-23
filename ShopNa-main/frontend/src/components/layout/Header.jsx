import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import Search from "./Search";
import { useGetUserQuery } from "../../redux/api/UserAPI";
import { useSelector } from "react-redux";
import defaultUserImage from "../../assets/default_avatar.jpg";
import { useLazyLogoutQuery } from "../../redux/api/AuthAPI";
import { clearUser } from "../../redux/features/UserSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isLoading } = useGetUserQuery();
  const navigate = useNavigate();
  const [logout] = useLazyLogoutQuery();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    logout();
    dispatch(clearUser());
    navigate(0);
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm">
      <div className="container">
        <div className="d-flex align-items-center">
          <Link to="/" className="navbar-brand fs-3 fw-bold">
            <h2 className="fw-bold logo">ShopNa</h2>
          </Link>
          <Search className="d-none d-lg-flex" />
        </div>

        <div className="d-flex align-items-center gap-3">
          <Link
            to="/cart"
            className="d-flex align-items-center text-decoration-none"
          >
            <i className="bi bi-cart-fill fs-5 me-lg-2 text-dark "></i>
            <Link
              to="/cart"
              id="cart"
              className="d-none text-dark fw-bold d-lg-flex fs-6 text-decoration-none"
            >
              Cart
            </Link>
            <span
              id="cart_item"
              className=" bg-dark badge mb-3 mb-lg-0 ms-1 ms-lg-2"
            >
              {cartItems?.length}
            </span>
          </Link>

          {!isLoading &&
            (user ? (
              <div className="btn-group z-3">
                <button
                  type="button"
                  className="btn p-0 dropdown-toggle text-secondary d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={user?.avatar ? user.avatar.url : defaultUserImage}
                    alt={user?.name}
                    className="rounded-circle"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="d-none d-lg-flex ms-lg-2 text-dark ">
                    {user?.name}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end z-3">
                  {user?.role === "admin" && (
                    <li>
                      <Link className="dropdown-item" to="/admin/dashboard">
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item" to="/user/profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/me/order">
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                id="login_btn"
                className="btn btn-outline-success px-3"
              >
                Login
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
