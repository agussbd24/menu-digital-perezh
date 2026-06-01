import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5491100000000?text=Hola!%20Quiero%20hacer%20un%20pedido%20%E2%80%A2%20P%C3%89REZ%20H"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 left-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] active:scale-95 sm:bottom-8 sm:left-8 animate-fade-in-up"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  )
}
