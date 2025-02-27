import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/auth";
import Logo from "../../assets/postspherelogo.png";
import Brand from "../../assets/postspheretext.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { setSelectedMenu } from "../slices/menuSlice";
import {
  faFileAlt,
  faPenNib,
  faBookOpen,
  faStar,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import HeaderItem from "./HeaderItem";

export default function NavBar() {
  const { isLoggedIn, user: currentUser } = useSelector((state) => state.auth);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, buttonRef]);

  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevents the event from propagating to the global click listener
    setDropdown(!dropdown);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  const handleNavigation = (menuOption) => {
    if (menuOption === "Logout") {
      handleLogout();
    } else if (menuOption === "Forgot Password") {
      navigate("/forgot-password");
    } else if (menuOption === "Home") {
      navigate("/home");
    } else if (menuOption === "Account") {
      navigate("/account");
    }
  };

  const menus = ["Home", "Account", "Forgot Password", "Logout"];

  const options = [
    {
      name: "ARTICLES",
      icon: faFileAlt, // Document-like icon
    },
    {
      name: "BLOGS",
      icon: faPenNib, // Represents writing
    },
    {
      name: "STORIES",
      icon: faBookOpen, // Book-style icon for stories
    },
    {
      name: "REVIEWS",
      icon: faStar, // Star icon for reviews
    },
    {
      name: "EDITORIALS",
      icon: faNewspaper, // Newspaper icon for editorials
    },
  ];

  return (
    <div className="w-full fixed poppins z-50">
      <div className="h-14 bg-blue-600 shadow-sm">
        <div className="w-full h-full flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4 justify-start items-center">
            <div
              className="pl-3 flex flex-row gap-1 justify-center items-center cursor-pointer"
              onClick={() => navigate("/home")}
            >
              <img
                loading="lazy"
                src={Logo}
                alt="Logo"
                className="w-9 object-cover"
              />

              <img
                loading="lazy"
                src={Brand}
                alt="Brand"
                className="w-32 md:w-44 object-cover"
              />
            </div>
            <div className="hidden lg:flex gap-8">
              {options.map((item) => (
                <HeaderItem name={item.name} Icon={item.icon} />
              ))}
            </div>
          </div>

          <div className=" flex flex-row md:gap-2 items-center justify-center px-2 relative">
            <FontAwesomeIcon
              icon={faBell}
              className="text-xl mr-4 cursor-pointer"
            />

            <div
              ref={buttonRef}
              className="px-1 mx-1 h-10 w-10 rounded-full text-xl cursor-pointer flex justify-center items-center "
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon icon={faUser} />
              {dropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-[3.2rem] right-1 w-[8.4rem] border-2 border-dashed bg-gray-200 rounded-md shadow-lg z-20"
                >
                  {menus.map((menuOption, index) => (
                    <div
                      key={index}
                      className="py-2 px-3 text-black text-left font-medium text-sm cursor-pointer hover:bg-blue-500 hover:text-white"
                      onClick={() => handleNavigation(menuOption)}
                    >
                      {menuOption}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
