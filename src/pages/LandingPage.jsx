import { useEffect, useState } from 'react'

function PedidosYaLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#FA002F" />
      <path d="M20 12h6c5.5 0 10 4.5 10 10s-4.5 10-10 10h-6V12zm6 16c3.3 0 6-2.7 6-6s-2.7-6-6-6h-2v12h2z" fill="white" />
    </svg>
  )
}

function RappiLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#FF4500" />
      <path d="M14 34V18l10-6 10 6v16l-10 6-10-6z" fill="white" opacity="0.9" />
      <path d="M24 12v22" stroke="#FF4500" strokeWidth="2" />
      <path d="M14 18l10 6 10-6" stroke="#FF4500" strokeWidth="2" fill="none" />
      <circle cx="24" cy="22" r="4" fill="#FF4500" />
    </svg>
  )
}

function MercadoPagoLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#009EE3" />
      <path d="M12 20h24v4H12v-4z" fill="white" opacity="0.3" />
      <path d="M14 24c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z" fill="white" />
      <path d="M24 24c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z" fill="#00A650" />
      <path d="M20 22l4 4 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function WhatsAppLogo({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#25D366" />
      <path d="M34.5 25.5c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3z" fill="white" />
      <path d="M24 12c-6.6 0-12 5.4-12 12 0 2.1.5 4.1 1.5 5.9L12 36l6.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12s-5.4-12-12-12z" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

const deliveryLinks = [
  {
    name: 'PEDIDOS YA',
    url: 'https://www.pedidosya.com.ar/cadenas/perez-h',
    Logo: PedidosYaLogo,
  },
  {
    name: 'RAPPI',
    url: 'https://www.rappi.com.ar/restaurantes/delivery/3451-perez-h',
    Logo: RappiLogo,
  },
  {
    name: 'MERCADO PAGO',
    url: 'https://www.mercadolibre.com.ar/landing/restaurantes#from=/pm-delivery-social-network',
    Logo: MercadoPagoLogo,
  },
]

const whatsappLinks = [
  {
    name: 'PALERMO',
    url: 'https://api.whatsapp.com/send/?phone=1136429912&text&type=phone_number&app_absent=0',
  },
  {
    name: 'MICROCENTRO',
    url: 'https://api.whatsapp.com/send/?phone=5491144221293&text&type=phone_number&app_absent=0',
  },
]

export default function LandingPage() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-perez-navy-dark">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="h-full w-full object-cover opacity-20 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-perez-navy-dark/60 via-perez-navy-dark/80 to-perez-navy-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(216,102,10,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 flex w-full max-w-md flex-col items-center px-6 pb-16 pt-20 transition-all duration-1000 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Logo */}
        <div className="mb-8 relative">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-perez-orange/20 via-perez-gold/20 to-perez-orange/20 blur-xl animate-pulse" />
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/10 bg-perez-navy shadow-[0_0_60px_rgba(216,102,10,0.25)] sm:h-36 sm:w-36">
            <img
              src="/logo-perezh.png"
              alt="Perez H"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Nombre */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          <span className="text-gradient">@PerezH</span>
        </h1>
        <p className="mt-4 max-w-xs text-center text-base leading-relaxed text-perez-cream/60 sm:text-lg">
          La mejor hamburguesa en el país de la mejor carne.
        </p>

        {/* Redes sociales */}
        <div className="mt-6 flex gap-4">
          <a
            href="https://www.instagram.com/perez.hamburguesas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-perez-cream/50 backdrop-blur-sm transition-all duration-300 hover:border-perez-orange/40 hover:bg-perez-orange/10 hover:text-perez-orange hover:shadow-[0_0_20px_rgba(216,102,10,0.2)]"
          >
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 0 1 1.47.957c.453.453.736.864.957 1.47.164.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 0 1-.957 1.47 4.088 4.088 0 0 1-1.47.957c-.46.164-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 0 1-1.47-.957 4.088 4.088 0 0 1-.957-1.47c-.164-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.088 4.088 0 0 1 3.593 3.25a4.088 4.088 0 0 1 1.47-.957c.46-.164 1.26-.35 2.43-.403C8.759 1.832 9.139 1.82 12 1.82V2.163Zm0 1.802c-3.15 0-3.504.013-4.744.07-1.147.052-1.77.244-2.184.405-.55.214-.94.47-1.342.872-.402.402-.658.792-.872 1.342-.161.414-.353 1.037-.405 2.184-.057 1.24-.07 1.594-.07 4.744s.013 3.504.07 4.744c.052 1.147.244 1.77.405 2.184.214.55.47.94.872 1.342.402.402.792.658 1.342.872.414.161 1.037.353 2.184.405 1.24.057 1.594.07 4.744.07s3.504-.013 4.744-.07c1.147-.052 1.77-.244 2.184-.405.55-.214.94-.47 1.342-.872.402-.402.658-.792.872-1.342.161-.414.353-1.037.405-2.184.057-1.24.07-1.594.07-4.744s-.013-3.504-.07-4.744c-.052-1.147-.244-1.77-.405-2.184a3.635 3.635 0 0 0-.872-1.342 3.635 3.635 0 0 0-1.342-.872c-.414-.161-1.037-.353-2.184-.405-1.24-.057-1.594-.07-4.744-.07Zm0 3.07a4.965 4.965 0 1 1 0 9.93 4.965 4.965 0 0 1 0-9.93Zm0 1.802a3.163 3.163 0 1 0 0 6.326 3.163 3.163 0 0 0 0-6.326Zm5.221-.938a1.162 1.162 0 1 1-2.324 0 1.162 1.162 0 0 1 2.324 0Z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@perez.hamburguesas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-perez-cream/50 backdrop-blur-sm transition-all duration-300 hover:border-perez-orange/40 hover:bg-perez-orange/10 hover:text-perez-orange hover:shadow-[0_0_20px_rgba(216,102,10,0.2)]"
          >
            <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.03a6.35 6.35 0 0 0-1-.06A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.27a8.23 8.23 0 0 0 4.83 1.56V7.35a4.88 4.88 0 0 1-1.07-.66Z" />
            </svg>
          </a>
        </div>

        {/* Botón Comer en el local */}
        <a
          href="/menu"
          className="btn-ripple group relative mt-12 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-6 py-5 text-lg font-bold text-white shadow-[0_8px_40px_rgba(216,102,10,0.35)] transition-all duration-500 hover:shadow-[0_12px_50px_rgba(216,102,10,0.5)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
          <svg className="h-6 w-6 relative z-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V3h4v18M7 3h4v7H7M14 21V10m0 0l3-7m-3 7l3 7" />
          </svg>
          <span className="relative z-10 tracking-wide">COMER EN EL LOCAL</span>
        </a>

        {/* Divider */}
        <div className="mt-14 flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-perez-gold/30 to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-perez-gold/60">Delivery</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-perez-gold/30 to-transparent" />
        </div>

        {/* Sección Delivery */}
        <div className="mt-8 w-full">
          <div className="flex flex-col gap-3">
            {deliveryLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group card-hover glass btn-ripple flex w-full items-center gap-4 rounded-2xl border border-white/[0.06] px-5 py-4 text-base font-bold text-white/90 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] transition-all duration-300 group-hover:bg-white/[0.1] group-hover:scale-105">
                  <link.Logo className="h-8 w-8" />
                </div>
                <span className="flex-1 tracking-wide">{link.name}</span>
                <svg className="h-4 w-4 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-perez-gold/30 to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-perez-gold/60">WhatsApp</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-perez-gold/30 to-transparent" />
        </div>

        {/* Sección WhatsApp */}
        <div className="mt-8 w-full">
          <div className="flex flex-col gap-3">
            {whatsappLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group card-hover glass btn-ripple flex w-full items-center gap-4 rounded-2xl border border-white/[0.06] px-5 py-4 text-base font-bold text-white/90 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] transition-all duration-300 group-hover:bg-white/[0.1] group-hover:scale-105">
                  <WhatsAppLogo className="h-8 w-8" />
                </div>
                <span className="flex-1 tracking-wide">{link.name}</span>
                <svg className="h-4 w-4 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-16 text-center text-sm text-perez-cream/30">
          &copy; {new Date().getFullYear()} Pérez-H Hamburguesas
        </p>
      </div>
    </main>
  )
}
