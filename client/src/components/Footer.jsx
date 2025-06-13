import React from "react";
import { Link } from "react-router-dom";
import { footerLogo } from "../assets/images";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-8 py-10 font-poppins text-sm">
      {/* Top Footer Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        {/* About Section */}
        <div>
          <h5 className="text-white font-bold mb-3">ABOUT</h5>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/contact-us" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/about-us" className="hover:text-white">About Us</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/stories" className="hover:text-white">LyrosMart Stories</Link></li>
            <li><Link to="/press" className="hover:text-white">Press</Link></li>
            <li><Link to="/corporate-info" className="hover:text-white">Corporate Information</Link></li>
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h5 className="text-white font-bold mb-3">HELP</h5>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/payments" className="hover:text-white">Payments</Link></li>
            <li><Link to="/shipping" className="hover:text-white">Shipping</Link></li>
            <li><Link to="/cancellation" className="hover:text-white">Cancellation & Returns</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        {/* Consumer Policy */}
        <div>
          <h5 className="text-white font-bold mb-3">CONSUMER POLICY</h5>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/returns-policy" className="hover:text-white">Cancellation & Returns</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms Of Use</Link></li>
            <li><Link to="/security" className="hover:text-white">Security</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link to="/sitemap" className="hover:text-white">Sitemap</Link></li>
            <li><Link to="/grievance" className="hover:text-white">Grievance Redressal</Link></li>
            <li><Link to="/epr" className="hover:text-white">EPR Compliance</Link></li>
          </ul>
        </div>

        {/* Address Info */}
        <div className="text-gray-400">
          <h5 className="text-white font-bold mb-3">Registered Office Address:</h5>
          <p>
            LyrosMart Internet Private Limited, Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village, Bengaluru, 560103, Karnataka, India
          </p>
          <p className="mt-2">CIN: U51109KA2012PTC066107</p>
          <p className="mt-1">
            Telephone: <a href="tel:04445614700" className="text-blue-400">044-45614700 / 044-67415800</a>
          </p>
        </div>
      </div>

      {/* Logo & Additional Office */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-8 text-gray-400">
        <div className="flex flex-col items-start">
          <img src={footerLogo} alt="Logo" className="mb-3 w-[140px]" />
          <address className="not-italic">
            Q-4, A2, 10th Floor, Cyber Towers, <br />
            Hitech City, Hyderabad, Telangana, India - 500081
          </address>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          <Link to="/seller" className="flex items-center gap-1 hover:text-white">
            <img
              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/sell-image-9de8ef.svg"
              alt="Sell"
              className="h-4 w-4"
            />
            Become a Seller
          </Link>
          <Link to="/advertise" className="flex items-center gap-1 hover:text-white">
            <img
              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/advertise-image-866c0b.svg"
              alt="Advertise"
              className="h-4 w-4"
            />
            Advertise
          </Link>
          <Link to="/gift-cards" className="flex items-center gap-1 hover:text-white">
            <img
              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/gift-cards-image-d7ff24.svg"
              alt="Gift Cards"
              className="h-4 w-4"
            />
            Gift Cards
          </Link>
          <Link to="/help-center" className="flex items-center gap-1 hover:text-white">
            <img
              src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/help-centre-image-c4ace8.svg"
              alt="Help Center"
              className="h-4 w-4"
            />
            Help Center
          </Link>
        </div>

        <div className="text-center md:text-left">
          © 2007–2025 LyrosMart.com
        </div>

        <div className="w-full md:w-auto text-center">
          <img
            src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg"
            alt="Payment Methods"
            className="h-6 md:h-6"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
