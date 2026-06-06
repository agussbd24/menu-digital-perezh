import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Printer, RefreshCw } from 'lucide-react'

export default function QRGenerator() {
  const qrRef = useRef(null)
  const [menuUrl, setMenuUrl] = useState('https://menu-digital-perezh.pages.dev/menu')
  const [fgColor, setFgColor] = useState('#D66A0A')
  const [size, setSize] = useState(300)

  function downloadQR() {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = size * 2
    canvas.height = size * 2
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const link = document.createElement('a')
      link.download = `qr-menu-perezh.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  function printQR() {
    const printWindow = window.open('', '_blank', 'width=600,height=700')
    if (!printWindow) return

    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Menú Pérez H</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; font-family: system-ui, sans-serif; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            p { color: #666; margin-bottom: 24px; }
            svg { width: ${size}px; height: ${size}px; }
            @media print { body { padding: 40px; } }
          </style>
        </head>
        <body>
          <h1>Escaneá para ver el menú</h1>
          <p>Pérez H Hamburguesas</p>
          ${svgData}
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          <\/script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Generador de QR</h2>
        <p className="mt-1 text-sm text-neutral-400">Generá un código QR para el menú digital y descargalo o mandalo a imprimir</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
        {/* QR Preview */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10">
          <div ref={qrRef} className="rounded-2xl bg-white p-6 shadow-2xl">
            <QRCodeSVG
              value={menuUrl}
              size={size}
              fgColor={fgColor}
              bgColor="#FFFFFF"
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="mt-6 text-center text-sm text-neutral-400">
            Escaneá para ver el menú digital
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={downloadQR}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-perez-orange to-perez-orange-dark px-5 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download size={16} />
              Descargar PNG
            </button>
            <button
              onClick={printQR}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-neutral-300 transition-all hover:bg-white/[0.1] hover:text-white cursor-pointer"
            >
              <Printer size={16} />
              Imprimir
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <h3 className="text-lg font-bold text-white">Configuración</h3>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">URL del Menú</label>
            <input
              type="text"
              value={menuUrl}
              onChange={(e) => setMenuUrl(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white text-sm outline-none focus:border-perez-orange/40 focus:ring-2 focus:ring-perez-orange/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Color del QR</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Naranja', color: '#D66A0A' },
                { label: 'Dorado', color: '#D4A017' },
                { label: 'Azul', color: '#1B2C58' },
                { label: 'Negro', color: '#000000' },
                { label: 'Rojo', color: '#DC2626' },
                { label: 'Verde', color: '#16A34A' },
                { label: 'Morado', color: '#7C3AED' },
                { label: 'Rosa', color: '#EC4899' },
              ].map((preset) => (
                <button
                  key={preset.color}
                  onClick={() => setFgColor(preset.color)}
                  className={`group relative h-10 w-10 cursor-pointer rounded-xl border-2 transition-all hover:scale-110 ${
                    fgColor === preset.color
                      ? 'border-white shadow-[0_0_12px_rgba(255,255,255,0.2)] scale-110'
                      : 'border-transparent hover:border-white/30'
                  }`}
                  style={{ backgroundColor: preset.color }}
                  title={preset.label}
                >
                  {fgColor === preset.color && (
                    <span className="absolute inset-0 grid place-items-center text-white text-xs font-bold">✓</span>
                  )}
                </button>
              ))}
              <label
                className="group relative h-10 w-10 cursor-pointer rounded-xl border-2 border-dashed border-white/20 transition-all hover:border-white/40 hover:scale-110"
                title="Color personalizado"
              >
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <span className="absolute inset-0 grid place-items-center text-neutral-500 group-hover:text-white text-lg transition-colors">
                  +
                </span>
              </label>
            </div>
            <p className="mt-2 text-xs text-neutral-500">Seleccioná un color o hacé click en + para uno personalizado</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-400">Tamaño: {size}px</label>
            <input
              type="range"
              min={150}
              max={500}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-perez-orange"
            />
          </div>

          <div className="rounded-xl border border-perez-gold/20 bg-perez-gold/5 p-4">
            <p className="text-xs font-bold text-perez-gold/80">💡 Tip</p>
            <p className="mt-1 text-xs text-neutral-400">
              Imprimí el QR y pegalo en las mesas. Los clientes escanean y acceden directo al menú digital.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
