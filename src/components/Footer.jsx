import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp
} from "react-icons/fa";
import { Link } from "react-router-dom";


const shopLinks =[
  { name: "All Products", path: "/products" },
  { name: "Casual", path: "/products?category=casual" },
  { name: "Suits & Blazers", path: "/products?category=suits" },
  { name: "Essential Trousers", path: "/products?category=trousers" },
]





export function Footer (){

return(

    <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10 bg-[#171717] text-[#F7F5F0]">
        <div>
            <h2 className="text-2xl font-serif tracking-widest mb-4">
            SAUDI
            </h2>

            <p className="text-sm text-[#A39D94] leading-7 max-w-xs">
            Modern essentials for the modern man.
            </p>
        </div>


        <div>
            <h3 className="text-sm font-semibold tracking-widest mb-5">SHOP</h3>
            <ul className="space-y-3 flex flex-col text-sm text-[#A39D94]">

                {shopLinks.map(link => (
                  <Link 
                  to={link.path}
                  key={link.name}
                  className="hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    {link.name}
                  </Link>
                ))}
          
          
            </ul>
        </div>


        <div>
            <h3 className="text-sm font-semibold tracking-widest mb-5">CUSTOMER SERVICE</h3>
            <ul className="space-y-3 text-sm text-[#A39D94]">
                <li 
                className="hover:text-white transition-colors duration-300 cursor-pointer"
                >
                    Contact Us
                </li>
                <li 
                className="hover:text-white transition-colors duration-300 cursor-pointer"
                >
                    FAQs
                </li>
                <li
                 className="hover:text-white transition-colors duration-300 cursor-pointer"
                >
                    Shipping & Delivery
                </li>
                <li 
                className="hover:text-white transition-colors duration-300 cursor-pointer"
                >
                    Returns & Exchanges
                </li>
            </ul>
        </div>


        <div>
            <h3 className="text-sm font-semibold tracking-widest mb-5">FOLLOW US</h3>
            <div  className="flex items-center gap-5 mt-4">
                <FaFacebookF   className="text-lg text-[#A39D94] hover:text-white transition-colors duration-300 cursor-pointer"/>
                <FaInstagram   className="text-lg text-[#A39D94] hover:text-white transition-colors duration-300 cursor-pointer"/>
                <FaWhatsapp   className="text-lg text-[#A39D94] hover:text-white transition-colors duration-300 cursor-pointer"/>
            </div>
        </div>

        <div className="col-span-full border-t border-[#34312C] mt-8 pt-6">
        <p className="text-xs text-[#A39D94]">
            © 2026 SAUDI. All Rights Reserved.
        </p>
        </div>
    </footer>
)



}