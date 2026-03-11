import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const mainMenu = [
    { title: "Dashboard", link: "/student-dashboard" },
    { title: "Career Prediction", link: "/career-prediction" },
    { title: "Mentor Recommendation", link: "/mentor-recommendation" },
    { title: "Ask Question", link: "/qna" },
    { title: "My Questions", link: "/my-questions" },
    { title: "Resources", link: "/resources" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    localStorage.removeItem("alumni");

    navigate("/login");
  };

  return (
    <nav className="bg-[#F0FDFA] text-[#0F766E] shadow-lg">
      <div className="px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide cursor-pointer"
            onClick={() => navigate("/student-dashboard")}
        >
          Campus<span className="text-[#6366F1]">Connect</span>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-3">

          {mainMenu.map((item) => (
            <li
              key={item.link}
              onClick={() => navigate(item.link)}
              className="cursor-pointer px-4 py-2 rounded-full hover:bg-[#CCFBF1] transition text-lg"
            >
              {item.title}
            </li>
          ))}

          {/* Profile Dropdown */}
          <div className="relative ml-4">

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#CCFBF1]"
            >
              <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-semibold">
                S
              </div>

              <span className="hidden lg:block">Account</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl overflow-hidden">

                <p
                  className="px-4 py-3 cursor-pointer hover:bg-[#F0FDFA]"
                  onClick={() => {
                    navigate("/student/profile");
                    setProfileOpen(false);
                  }}
                >
                  Profile
                </p>

                {/* <p
                  className="px-4 py-3 cursor-pointer hover:bg-[#F0FDFA]"
                  onClick={() => {
                    navigate("/settings");
                    setProfileOpen(false);
                  }}
                >
                  Settings
                </p> */}

                <p
                  className="px-4 py-3 cursor-pointer hover:bg-[#FEE2E2] text-[#DC2626]"
                  onClick={() => {
                    handleLogout();
                    setProfileOpen(false);
                  }}
                >
                  Logout
                </p>

              </div>
            )}
          </div>

        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#ECFEFF] px-6 py-4 space-y-3">

          {mainMenu.map((item) => (
            <p
              key={item.link}
              className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#CCFBF1]"
              onClick={() => {
                navigate(item.link);
                setMobileOpen(false);
              }}
            >
              {item.title}
            </p>
          ))}

          <div className="border-t border-[#99F6E4] pt-3">

            <p
              className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#CCFBF1]"
              onClick={() => {
                navigate("/student/profile");
                setMobileOpen(false);
              }}
            >
              Profile
            </p>

            {/* <p
              className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#CCFBF1]"
              onClick={() => {
                navigate("/settings");
                setMobileOpen(false);
              }}
            >
              Settings
            </p> */}

            <p
              className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#FEE2E2] text-[#DC2626]"
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
            >
              Logout
            </p>

          </div>

        </div>
      )}

    </nav>
  );
};

export default Navbar;