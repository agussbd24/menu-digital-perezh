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

const MODEL_CHAIN = [
  { id: 'black-forest-labs/flux-schnell', label: 'Flux Schnell', timeout: 45000 },
  { id: 'black-forest-labs/flux-1.1-pro', label: 'Flux 1.1 Pro', timeout: 60000 },
  { id: 'gpt-image-1-mini', label: 'GPT Image Mini', timeout: 60000 },
  { id: 'stabilityai/stable-diffusion-3-medium', label: 'Stable Diffusion 3', timeout: 60000 },
  { id: 'gpt-image-1', label: 'GPT Image', timeout: 60000 },
  { id: 'stabilityai/stable-diffusion-xl-base-1.0', label: 'Stable Diffusion XL', timeout: 60000 },
]

function ensurePuter() {
  return new Promise((resolve, reject) => {
    if (window.puter?.ai?.txt2img) {
      resolve()
      return
    }

    const existing = document.querySelector('script[src*="js.puter.com"]')
    if (existing) {
      const onLoad = () => { cleanup(); resolve() }
      const onError = () => { cleanup(); reject(new Error('No se pudo cargar Puter.js')) }
      const cleanup = () => {
        existing.removeEventListener('load', onLoad)
        existing.removeEventListener('error', onError)
      }
      existing.addEventListener('load', onLoad)
      existing.addEventListener('error', onError)
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

async function imgToBlob(img) {
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
      if (blob && blob.size > 1000) resolve(blob)
      else reject(new Error('Imagen generada demasiado pequeña o vacía'))
    }, 'image/png')
  })
}

export async function generateImage(productName, productDescription, style = 'professional', onModelChange) {
  await ensurePuter()

  const profile = STYLE_PROFILES[style] || STYLE_PROFILES.professional
  const prompt = profile.promptTemplate(productName, productDescription)

  const errors = []

  for (const model of MODEL_CHAIN) {
    if (onModelChange) onModelChange(model.label)

    try {
      const img = await withTimeout(
        puter.ai.txt2img(prompt, { model: model.id }),
        model.timeout,
        model.label
      )

      const blob = await imgToBlob(img)
      return blob
    } catch (err) {
      console.warn(`[AI] ${model.label} falló:`, err.message)
      errors.push(`${model.label}: ${err.message}`)
    }
  }

  throw new Error(`Todos los generadores fallaron:\n${errors.join('\n')}`)
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
