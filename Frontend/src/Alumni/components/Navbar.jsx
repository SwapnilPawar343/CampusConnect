import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const alumni = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("alumni") || "{}");
    } catch (error) {
      console.error("Failed to parse alumni data:", error);
      return {};
    }
  }, []);

  const mainMenu = [
    { title: "Dashboard", link: "/alumni-dashboard" },
    { title: "Questions", link: "/questions" },
    { title: "My Answers", link: "/my-answers" },
    { title: "Resources", link: "/alumni-resource" },
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
        <h1 className="text-2xl font-bold tracking-wide">
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

          {/* Profile */}
          <div className="relative ml-4">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#CCFBF1]"
            >
              <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-semibold">
                {alumni.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <span className="hidden lg:block">Account</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl overflow-hidden">
                <p
                  className="px-4 py-3 cursor-pointer hover:bg-[#F0FDFA]"
                  onClick={() => navigate("/alumni/profile")}
                >
                  Profile
                </p>
                <p
                  className="px-4 py-3 cursor-pointer hover:bg-[#FEE2E2] text-[#DC2626]"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </ul>

        {/* Mobile Button */}
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
                navigate("/alumni/profile");
                setMobileOpen(false);
              }}
            >
              Profile
            </p>
            <p
              className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#FEE2E2] text-[#DC2626]"
              onClick={handleLogout}
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
