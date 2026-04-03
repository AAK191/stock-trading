import React, { useEffect, useState } from "react";

import "../index.css";

import { Link } from "react-router-dom";

const Menu = () => {

    const [selectedMenu, setselectedMenu] = useState(0);
    const [isProfileDropdownOpen, setisProfileDropdownOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const handleMenuClick = (index) => {
        setselectedMenu(index);
    }



    const handleProfileClick = (index) => {
        setisProfileDropdownOpen(!isProfileDropdownOpen);
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");
        if (tokenFromUrl) {
            localStorage.setItem("accessToken", tokenFromUrl);
            window.history.replaceState({}, "", window.location.pathname);
        }

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("accessToken"); 

                if (!token) {
                    console.log("No token found, redirecting to login");
                    window.location.href = "http://localhost:3003/signup";
                    return;
                }

                const res = await fetch("http://localhost:3002/api/profile/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUsername(data.name);
                    setEmail(data.email);

                } else {
                    console.log(data.message);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => {
            setisProfileDropdownOpen(false);
        };

        if (isProfileDropdownOpen) {
            document.addEventListener("click", handleClickOutside);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleLogout = async () => {
        await fetch("http://localhost:3002/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        localStorage.removeItem("accessToken");
        window.location.href = "http://localhost:3003/signup";
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("accessToken");

        await fetch("http://localhost:3002/api/user/delete", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        localStorage.removeItem("accessToken");
        window.location.href = "http://localhost:3003/signup";
    };

    const menuClass = "menu";
    const activeMenuClass = "menu selected";

    return (
        <div className="menu-container">
            <img src="logo.png" style={{ width: "50px" }} />
            <div className="menus">
                <ul>
                    <li>
                        <Link
                            style={{ textDecoration: "none" }}
                            to="/"
                            onClick={() => handleMenuClick(0)}
                        >
                            <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>Dashboard</p>
                        </Link>
                    </li>

                    <li>
                        <Link
                            style={{ textDecoration: "none" }}
                            to="/orders"
                            onClick={() => handleMenuClick(1)}
                        >
                            <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>Orders</p>
                        </Link>
                    </li>

                    <li>
                        <Link
                            style={{ textDecoration: "none" }}
                            to="/Holdings"
                            onClick={() => handleMenuClick(2)}
                        >
                            <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>Holdings</p>
                        </Link>
                    </li>

                    <li>
                        <Link
                            style={{ textDecoration: "none" }}
                            to="/Positions"
                            onClick={() => handleMenuClick(3)}
                        >
                            <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>Positions</p>
                        </Link>
                    </li>

                    <li>
                        <Link
                            style={{ textDecoration: "none" }}
                            to="/Funds"
                            onClick={() => handleMenuClick(4)}
                        >
                            <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>Funds</p>
                        </Link>
                    </li>

                    <li>
                        <Link
                            style={{ textDecoration: "none" }}
                            to="/Apps"
                            onClick={() => handleMenuClick(5)}
                        >
                            <p className={selectedMenu === 5 ? activeMenuClass : menuClass}>Apps</p>
                        </Link>
                    </li>

                </ul>
                <hr /><div
                    className="profile"
                    onClick={(e) => {
                        e.stopPropagation();
                        setisProfileDropdownOpen(prev => !prev);
                    }}
                >
                    <div className="avatar">
                        {username ? username[0].toUpperCase() : "U"}
                    </div>

                    <p className="username">{username || "Loading..."}</p>
                </div>

                {/* DROPDOWN */}
                {isProfileDropdownOpen && (
                    <div className="profile-dropdown">

                        <div className="dropdown-user">
                            <div className="dropdown-avatar">
                                {username ? username[0].toUpperCase() : "U"}
                            </div>
                            <div>
                                <p className="dropdown-name">{username}</p>
                                <p className="dropdown-email">{email}</p>
                            </div>
                        </div>

                        <hr />

                        <p>Profile</p>
                        <p onClick={handleLogout}>Logout</p>
                        <p onClick={handleDelete}>Delete Account</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;