import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp({ className = "bottom-6 right-6" }: { className?: string }) {
  return (
    <a
      href="https://wa.me/34687493545"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${className} z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-xl hover:bg-[#20bd5a] hover:scale-110 hover:shadow-2xl transition-all duration-300 flex items-center justify-center group`}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip flotante */}
      <span className="absolute right-full mr-4 bg-white text-gray-800 text-sm px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap font-medium border border-gray-100">
        ¿Te ayudamos?
      </span>
    </a>
  );
}
