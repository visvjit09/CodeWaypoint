import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo/CodeWaypoint.png";
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { Icon: FaFacebook, url: "https://www.facebook.com/", label: "Facebook" },
    { Icon: FaGoogle, url: "https://www.google.com/", label: "Google" },
    { Icon: FaTwitter, url: "https://twitter.com/", label: "Twitter" },
    { Icon: FaYoutube, url: "https://www.youtube.com/", label: "YouTube" },
  ];

  const companyLinks = [
    { title: "About", path: "/about" },
    { title: "Careers", path: "/careers" },
    { title: "Affiliates", path: "/affiliates" },
  ];

  const footerGroups = [
    {
      title: "Resources",
      links: ["Articles", "Blog", "Chart Sheet", "Code challenges", "Docs", "Projects", "Videos", "Workspaces"],
    },
    {
      title: "Plans",
      links: ["Paid memberships", "For students", "Business solutions"],
    },
    {
      title: "Community",
      links: ["Forums", "Chapters", "Events"],
    },
  ];

  const legalLinks = [
    { title: "Privacy Policy", path: "/privacy-policy" },
    { title: "Cookie Policy", path: "/cookie-policy" },
    { title: "Terms", path: "/terms" },
  ];

  const slug = (text) =>
    "/" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <footer className="bg-richblack-800">
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto relative py-14">
        <div className="w-full flex flex-col lg:flex-row pb-5 border-b border-richblack-700">
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 pl-3 lg:pr-5 gap-3">
            <div className="w-[48%] lg:w-[30%] mb-7">
              <Link to="/" aria-label="CodeWaypoint home">
                <img src={Logo} alt="CodeWaypoint" className="object-contain mb-3" />
              </Link>

              <h2 className="text-richblack-50 font-semibold text-[16px]">Company</h2>
              <div className="flex flex-col gap-2 mt-2">
                {companyLinks.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="text-[14px] hover:text-richblack-50 transition-all duration-200"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              <div className="flex gap-3 text-lg mt-4">
                {socialLinks.map(({ Icon, url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="hover:text-richblack-50 transition-all duration-200"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title} className="w-[48%] lg:w-[30%] mb-7">
                <h2 className="text-richblack-50 font-semibold text-[16px]">
                  {group.title}
                </h2>
                <div className="flex flex-col gap-2 mt-2">
                  {group.links.map((item) => (
                    <Link
                      key={item}
                      to={slug(item)}
                      className="text-[14px] hover:text-richblack-50 transition-all duration-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>

                {group.title === "Resources" && (
                  <>
                    <h2 className="text-richblack-50 font-semibold text-[16px] mt-7">
                      Support
                    </h2>
                    <Link
                      to="/help-center"
                      className="block text-[14px] mt-2 hover:text-richblack-50 transition-all duration-200"
                    >
                      Help Center
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((group) => (
              <div key={group.title} className="w-[48%] lg:w-[30%] mb-7">
                <h2 className="text-richblack-50 font-semibold text-[16px]">
                  {group.title}
                </h2>
                <div className="flex flex-col gap-2 mt-2">
                  {group.links.map((item, index) => (
                    <Link
                      key={`${group.title}-${index}`}
                      to={item.link || "/"}
                      className="text-[14px] hover:text-richblack-50 transition-all duration-200"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto pb-10 text-sm">
        <div className="flex justify-between items-center flex-col lg:flex-row gap-4 w-full">
          <div className="flex flex-wrap justify-center">
            {legalLinks.map((item, index) => (
              <Link
                key={item.title}
                to={item.path}
                className={`px-3 hover:text-richblack-50 transition-all duration-200 ${
                  index !== legalLinks.length - 1
                    ? "border-r border-richblack-700"
                    : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="text-center">
            © {new Date().getFullYear()} CodeWaypoint. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;