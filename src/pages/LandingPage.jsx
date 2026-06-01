import { useEffect, useState } from 'react'

function PedidosYaIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-8h2v8zm-6-8V7h8v2h-8z" />
    </svg>
  )
}

function RappiIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  )
}

function MercadoPagoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const deliveryLinks = [
  {
    name: 'PEDIDOS YA',
    url: 'https://www.pedidosya.com.ar/cadenas/perez-h',
    icon: PedidosYaIcon,
    color: 'text-[#EE3B3B]',
    hoverColor: 'hover:text-[#d63030]',
  },
  {
    name: 'RAPPI',
    url: 'https://www.rappi.com.ar/restaurantes/delivery/3451-perez-h',
    icon: RappiIcon,
    color: 'text-[#FF6B00]',
    hoverColor: 'hover:text-[#e55e00]',
  },
  {
    name: 'MERCADO PAGO',
    url: 'https://www.mercadolibre.com.ar/landing/restaurantes#from=/pm-delivery-social-network',
    icon: MercadoPagoIcon,
    color: 'text-[#009EE3]',
    hoverColor: 'hover:text-[#0088cc]',
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
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div
        className={`flex w-full max-w-md flex-col items-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-perez-orange/30 bg-perez-navy-dark shadow-glow sm:h-32 sm:w-32">
            <img
              src="/logo-perezh.png"
              alt="Perez H"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Nombre */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          @PerezH
        </h1>
        <p className="mt-3 text-center text-base text-perez-cream/80 sm:text-lg">
          La mejor hamburguesa en el país de la mejor carne.
        </p>

        {/* Redes sociales */}
        <div className="mt-5 flex gap-5">
          <a
            href="https://www.instagram.com/perez.hamburguesas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-perez-cream/60 transition-colors hover:text-perez-orange"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 0 1 1.47.957c.453.453.736.864.957 1.47.164.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 0 1-.957 1.47 4.088 4.088 0 0 1-1.47.957c-.46.164-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 0 1-1.47-.957 4.088 4.088 0 0 1-.957-1.47c-.164-.46-.35-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.088 4.088 0 0 1 3.593 3.25a4.088 4.088 0 0 1 1.47-.957c.46-.164 1.26-.35 2.43-.403C8.759 1.832 9.139 1.82 12 1.82V2.163Zm0 1.802c-3.15 0-3.504.013-4.744.07-1.147.052-1.77.244-2.184.405-.55.214-.94.47-1.342.872-.402.402-.658.792-.872 1.342-.161.414-.353 1.037-.405 2.184-.057 1.24-.07 1.594-.07 4.744s.013 3.504.07 4.744c.052 1.147.244 1.77.405 2.184.214.55.47.94.872 1.342.402.402.792.658 1.342.872.414.161 1.037.353 2.184.405 1.24.057 1.594.07 4.744.07s3.504-.013 4.744-.07c1.147-.052 1.77-.244 2.184-.405.55-.214.94-.47 1.342-.872.402-.402.658-.792.872-1.342.161-.414.353-1.037.405-2.184.057-1.24.07-1.594.07-4.744s-.013-3.504-.07-4.744c-.052-1.147-.244-1.77-.405-2.184a3.635 3.635 0 0 0-.872-1.342 3.635 3.635 0 0 0-1.342-.872c-.414-.161-1.037-.353-2.184-.405-1.24-.057-1.594-.07-4.744-.07Zm0 3.07a4.965 4.965 0 1 1 0 9.93 4.965 4.965 0 0 1 0-9.93Zm0 1.802a3.163 3.163 0 1 0 0 6.326 3.163 3.163 0 0 0 0-6.326Zm5.221-.938a1.162 1.162 0 1 1-2.324 0 1.162 1.162 0 0 1 2.324 0Z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com/@perez.hamburguesas"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-perez-cream/60 transition-colors hover:text-perez-orange"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.03a6.35 6.35 0 0 0-1-.06A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.27a8.23 8.23 0 0 0 4.83 1.56V7.35a4.88 4.88 0 0 1-1.07-.66Z" />
            </svg>
          </a>
        </div>

        {/* Botón Comer en el local */}
        <a
          href="/menu"
          className="btn-ripple mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-perez-orange px-6 py-5 text-lg font-bold text-white shadow-glow transition-all duration-300 hover:bg-perez-orange-dark hover:scale-[1.02] hover:shadow-floating active:scale-[0.98]"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V3h4v18M7 3h4v7H7M14 21V10m0 0l3-7m-3 7l3 7" />
          </svg>
          COMER EN EL LOCAL
        </a>

        {/* Sección Delivery */}
        <div className="mt-12 w-full text-center">
          <h2 className="mb-5 text-xl font-bold tracking-wide text-perez-gold">Delivery</h2>
          <div className="flex flex-col gap-3">
            {deliveryLinks.map((link, i) => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`card-hover glass btn-ripple flex w-full items-center justify-center gap-3 rounded-2xl border border-perez-orange/20 px-6 py-4 text-base font-bold text-white transition-all duration-300 hover:border-perez-orange/50 hover:bg-perez-orange/10 hover:shadow-glow animate-fade-in-up stagger-${i + 1}`}
                >
                  <Icon className={`h-6 w-6 ${link.color} ${link.hoverColor}`} />
                  {link.name}
                </a>
              )
            })}
          </div>
        </div>

        {/* Sección WhatsApp */}
        <div className="mt-12 w-full text-center">
          <h2 className="mb-5 text-xl font-bold tracking-wide text-perez-gold">WhatsApp</h2>
          <div className="flex flex-col gap-3">
            {whatsappLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`card-hover glass btn-ripple flex w-full items-center justify-center gap-3 rounded-2xl border border-perez-orange/20 px-6 py-4 text-base font-bold text-white transition-all duration-300 hover:border-perez-orange/50 hover:bg-perez-orange/10 hover:shadow-glow animate-fade-in-up stagger-${i + 1}`}
              >
                <WhatsAppIcon className="h-6 w-6 text-[#25D366] hover:text-[#1da851]" />
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-14 text-center text-sm text-perez-cream/40">
          &copy; {new Date().getFullYear()} Pérez-H Hamburguesas
        </p>
      </div>
    </main>
  )
}
