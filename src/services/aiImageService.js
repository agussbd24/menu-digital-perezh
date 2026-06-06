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

export async function generateImage(productName, productDescription, style = 'professional') {
  await ensurePuter()

  const profile = STYLE_PROFILES[style] || STYLE_PROFILES.professional
  const prompt = profile.promptTemplate(productName, productDescription)

  const blob = await puter.ai.txt2img(prompt, {
    model: 'flux',
    size: '1024x1024',
  })

  return blob
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
