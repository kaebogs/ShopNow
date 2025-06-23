import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SideMenu = ({ menuItems, variant }) => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(location.pathname);

  useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location.pathname]);

  return (
    <div
      className={`list-group mt-3 ${
        variant === "static" ? "ps-3" : "offcanvas-body ps-3"
      }`}
    >
      {menuItems.map((menuItem, index) => (
        <Link
          key={index}
          to={menuItem.url}
          className={`list-group-item list-group-item-action border-0 rounded-2 mb-2 px-4 py-3 fw-semibold d-flex align-items-center shadow-sm ${
            activeMenuItem.includes(menuItem.url)
              ? "active bg-dark text-white"
              : "bg-light text-dark"
          }`}
          aria-current={
            activeMenuItem.includes(menuItem.url) ? "true" : "false"
          }
          onClick={
            variant === "offcanvas"
              ? () =>
                  setTimeout(
                    () =>
                      document
                        .querySelector(".offcanvas.show")
                        ?.classList.remove("show"),
                    300
                  )
              : undefined
          }
          style={{
            transition: "all 0.2s ease-in-out",
          }}
        >
          <i className={`${menuItem.icon} fa-fw me-3 fs-5`}></i>
          {menuItem.name}
        </Link>
      ))}
    </div>
  );
};

export default SideMenu;
