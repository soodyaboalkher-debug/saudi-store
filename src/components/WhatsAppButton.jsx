
import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {
  const phone = "201000000000";

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 
      items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
    >
      <span className="whatsapp-pulse absolute inset-0 rounded-full bg-[#25D366]" />

      <FaWhatsapp size={34} className="relative z-10" />
    </a>
  );
}

export default WhatsAppButton;
