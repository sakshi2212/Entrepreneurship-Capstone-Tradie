import React from "react";
import { FaHome, FaSearch, FaUserCircle } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>tradie</h2>
      </div>
      <div className="menu">
        <div className="menu-item">
          <FaHome />
          <span>Dashboard</span>
        </div>
        <div className="menu-item">
          <FaSearch />
          <span>Discover</span>
        </div>
        <div className="menu-item">
          <FaUserCircle />
          <span>User</span>
        </div>
      </div>
      <div className="notifications">
        <IoMdNotificationsOutline className="notification-icon" />
        <span className="notification-dot"></span>
      </div>
    </div>
  );
};

export default Sidebar;
