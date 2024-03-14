import { Ai } from '@cloudflare/ai'
import { verify } from "$lib/ts/verify"

export const prerender = false

export const actions = {
  default: async ({ request, url, platform }) => {
    // turnstile
    const data = await request.formData();
    const token = data.get('cf-turnstile-response')?.toString()
    const SECRET_KEY = platform?.env?.TURNSTILE_SECRET
    const { success, error } = await verify(token, SECRET_KEY);
    if (!success) return { error: error || 'Invalid CAPTCHA' };
    // shared auth
    const { shared_auth_key } = cookie(request)
    let xAuth = 'false'
    if (shared_auth_key) {
      const kvKey = await platform?.env?.AuthKV.get('key')
      if (shared_auth_key === kvKey) xAuth = 'true'
    }
    // main
    const model = url.searchParams.get('model') || 'stable-diffusion-xl-lightning'
    const prompt = url.searchParams.get('prompt') || ''
    try {
      const image = await t2i(platform?.env?.AI, model, prompt)
      return new Response(image, {
        headers: {
          'content-type': 'image/png',
          'X-Auth': xAuth,
        },
      })
    } catch (e) {
      return new Response(e as string, {
        status: 599,
        headers: {
          'X-Auth': xAuth,
        },
      })
    }
  }
}

const t2i = async (envAi: any, model: string, prompt: string) => {
  if (!envAi) throw new Error('There is no env.AI')
  const ai = new Ai(envAi)
  // prettier-ignore
  const modelName =
    model === 'dreamshaper-8-lcm' ? '@cf/lykon/dreamshaper-8-lcm' :
    model === 'stable-diffusion-xl-lightning' ? '@cf/bytedance/stable-diffusion-xl-lightning' :
    '@cf/stabilityai/stable-diffusion-xl-base-1.0'
  // prettier-ignore
  const num_steps =
    model === 'dreamshaper-8-lcm' ? 8 :
    model === 'stable-diffusion-xl-lightning' ? 1 :
    20
  return (await ai.run(modelName, { prompt, num_steps })) as ArrayBuffer
}

const cookie = (request: Request) =>
  (request.headers.get('Cookie') || '').split('; ').reduce((res: Record<string, string>, item) => {
    const data = item.split('=')
    res[data[0]] = data[1]
    return res
  }, {})
