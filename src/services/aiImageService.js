const STYLE_PROFILES = {
  professional: {
    promptTemplate: (name, description) =>
      `Professional food photography of a ${name}: ${description}. Styled on a premium dark plate with garnish, studio lighting, warm tones, shallow depth of field, dark moody background, editorial style, 8k photorealistic, high-end restaurant photography`,
  },
  casual: {
    promptTemplate: (name, description) =>
      `Vibrant Instagram food photo of a ${name}: ${description}. Colorful appetizing presentation, overhead shot, bright warm lighting, social media food porn aesthetic, vivid colors`,
  },
}

function ensurePuter() {
  return new Promise((resolve, reject) => {
    if (window.puter?.ai?.txt2img) {
      resolve()
      return
    }

    const existing = document.querySelector('script[src*="js.puter.com"]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('No se pudo cargar Puter.js')))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.puter.com/v2/'
    script.onload = () => {
      if (window.puter?.ai?.txt2img) {
        resolve()
      } else {
        reject(new Error('Puter.js no disponible'))
      }
    }
    script.onerror = () => reject(new Error('No se pudo cargar Puter.js'))
    document.head.appendChild(script)
  })
}

function withTimeout(promise, ms, label = 'Operación') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} tardó demasiado (>${ms / 1000}s)`)), ms)
    ),
  ])
}

export async function generateImage(productName, productDescription, style = 'professional') {
  await ensurePuter()

  const profile = STYLE_PROFILES[style] || STYLE_PROFILES.professional
  const prompt = profile.promptTemplate(productName, productDescription)

  const img = await withTimeout(
    puter.ai.txt2img(prompt, {
      model: 'black-forest-labs/flux-schnell',
    }),
    60000,
    'Generación de imagen'
  )

  if (img.src && img.src.startsWith('data:')) {
    const res = await fetch(img.src)
    return await res.blob()
  }

  const canvas = document.createElement('canvas')
  canvas.width = img.naturalWidth || img.width
  canvas.height = img.naturalHeight || img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('No se pudo convertir la imagen'))
    }, 'image/png')
  })
}

export function generateInstagramCopy(productName, productDescription, productPrice, style = 'professional') {
  const formatPrice = (p) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(p)

  if (style === 'professional') {
    return `${productName} 📸

${productDescription}

Disponibilalo en nuestro menú digital 👇
🔗 Link en bio

#PérezH #Hamburguesas #Foodie #BurgersArgentina #ComidaPremium #PérezHHamburguesas`
  }

  return `¡${productName}! 🔥

${productDescription}

¿Ya la probaste? Contanos en los comments 👇

#PérezH #Burgers #HamburguesasArgentinas #FoodPorn #SmashBurger #PérezHHamburguesas`
}
