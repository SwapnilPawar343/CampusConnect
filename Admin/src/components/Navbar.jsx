import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const mainMenu = [
    "Dashboard",
    "Career Prediction",
    "Mentor Recommendation",
    "Ask Question",
    "My Questions",
    "Resources",
  ];

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
              key={item}
              className="cursor-pointer px-4 py-2 rounded-full hover:bg-[#CCFBF1] transition text-lg"
            >
              {item}
            </li>
          ))}

          {/* Profile */}
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
                <p className="px-4 py-3 cursor-pointer hover:bg-[#F0FDFA]">
                  Profile
                </p>
                <p className="px-4 py-3 cursor-pointer hover:bg-[#F0FDFA]">
                  Settings
                </p>
                <p className="px-4 py-3 cursor-pointer hover:bg-[#FEE2E2] text-[#DC2626]">
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
              key={item}
              className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#CCFBF1]"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </p>
          ))}

          <div className="border-t border-[#99F6E4] pt-3">
            <p className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#CCFBF1]">
              Profile
            </p>
            <p className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#CCFBF1]">
              Settings
            </p>
            <p className="cursor-pointer px-4 py-2 rounded-lg hover:bg-[#FEE2E2] text-[#DC2626]">
              Logout
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
