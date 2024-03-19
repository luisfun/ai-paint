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
  const body = await request.formData()
  const file = body.get('file') as File | Blob | null
  const mask = body.get('mask') as Blob | null
  const prompt = (body.get('prompt') as string | null) || ''
  try {
    const image = await generate(
      platform?.env?.AI,
      prompt,
      file ? [...new Uint8Array(await file.arrayBuffer())] : undefined,
      mask ? [...new Uint8Array(await mask.arrayBuffer())] : undefined,
    )
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

export const fallback = (({ request }) => {
  return new Response(`I caught your ${request.method} request.`, { status: 405 })
}) satisfies RequestHandler

const generate = (envAi: any, prompt: string, image?: number[], mask?: number[]) => {
  if (!envAi) throw new Error('There is no env.AI')
  const ai = new Ai(envAi)
  // prettier-ignore
  const model =
    !image ? '@cf/lykon/dreamshaper-8-lcm' :
     image && !mask ? '@cf/runwayml/stable-diffusion-v1-5-img2img' :
     image &&  mask ? '@cf/runwayml/stable-diffusion-v1-5-inpainting' :
    '@cf/stabilityai/stable-diffusion-xl-base-1.0'
  const num_steps = model === '@cf/lykon/dreamshaper-8-lcm' ? 8 : 20
  return ai.run(model, { prompt, num_steps, image, mask })
}

const cookie = (request: Request) =>
  (request.headers.get('Cookie') || '').split('; ').reduce((res: Record<string, string>, item) => {
    const data = item.split('=')
    res[data[0]] = data[1]
    return res
  }, {})
