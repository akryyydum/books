import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import BookIcon from '@mui/icons-material/Book';
const Navbar = () => {
  return (
    <div className="sidebar">
      <nav>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
         <BookIcon/> Add Books
        </Link>
      </nav>
      
    </div>
  );
};

export default Navbar;
