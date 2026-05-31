export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-black/20 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full overflow-hidden border border-perez-orange/20">
              <img src="/logo-perezh.png" alt="PÉREZ H" className="h-full w-full object-cover" />
            </span>
            <span className="text-sm font-bold text-neutral-400">
              PÉREZ H <span className="text-perez-gold/60">·</span> Menú Digital
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Pedí desde tu mesa · Experiencia premium sin esperas
          </p>
          <div className="flex items-center gap-1 text-xs text-neutral-600">
            <span>Hecho con</span>
            <span className="text-perez-orange animate-pulse-glow inline-block">♥</span>
            <span>para PÉREZ H</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
