const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt'

const STYLE_PROFILES = {
  professional: {
    suffix: ', professional food photography, studio lighting, warm tones, shallow depth of field, dark moody background, premium plating, editorial style, 8k quality, photorealistic, high-end restaurant photography',
    promptTemplate: (name, description) =>
      `Professional food photography of ${name}, ${description}, styled on a premium dark plate with garnish`,
  },
  casual: {
    suffix: ', vibrant food photography, colorful presentation, overhead shot, Instagram aesthetic, bright warm lighting, appetizing, social media style, food porn',
    promptTemplate: (name, description) =>
      `Vibrant Instagram food photo of ${name}, ${description}, colorful and appetizing presentation`,
  },
}

function encodePrompt(prompt) {
  return encodeURIComponent(prompt)
}

export function generateImageUrl(productName, productDescription, style = 'professional', seed) {
  const profile = STYLE_PROFILES[style] || STYLE_PROFILES.professional
  const prompt = profile.promptTemplate(productName, productDescription) + profile.suffix
  const randomSeed = seed || Math.floor(Math.random() * 999999)
  return `${POLLINATIONS_BASE}/${encodePrompt(prompt)}?model=flux&width=1080&height=1080&nologo=true&seed=${randomSeed}`
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

export async function fetchGeneratedImage(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Error generando imagen')
  return response.blob()
}
