import type { RequestHandler } from './$types'
import { Ai } from '@cloudflare/ai'

export const POST = (async ({ request, platform }) => {
  // shared auth
  const { shared_auth_key } = cookie(request)
  let xAuth = 'false'
  if (shared_auth_key) {
    const kvKey = await platform?.env?.AuthKV.get('key')
    if (shared_auth_key === kvKey) xAuth = 'true'
  }
  // main
  const data = await request.formData()
  const model = data.get('model')?.toString() || 'dreamshaper-8-lcm'
  const prompt = data.get('prompt')?.toString() || ''
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
}) satisfies RequestHandler

export const fallback = (async ({ request }) => {
  return new Response(`I caught your ${request.method} request.`, { status: 501 })
}) satisfies RequestHandler

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
