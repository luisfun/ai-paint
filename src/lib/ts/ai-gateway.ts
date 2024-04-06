import { modelMappings } from '@cloudflare/ai'

// @cloudflare/ai https://www.npmjs.com/package/@cloudflare/ai
type ModelMappings = typeof modelMappings
// prettier-ignore
type GetModelName<T> = {
  [K in keyof T]: T[K] extends {
    models: readonly (infer U)[]
  } ? U : never
}[keyof T]
type ModelName = GetModelName<ModelMappings>
// prettier-ignore
type GetModelClass<M extends ModelName, T> = {
  [K in keyof T]: T[K] extends {
    models: readonly string[]
    class: infer C
  } ? M extends T[K]['models'][number] ? C : never : never
}[keyof T]
type ConstructorParametersForModel<M extends ModelName> = ConstructorParameters<GetModelClass<M, ModelMappings>>[0]
type GetModelClassType<M extends ModelName> = {
  [K in keyof ModelMappings]: M extends ModelMappings[K]['models'][number] ? ModelMappings[K]['class'] : never
}[keyof ModelMappings]
type GetModelInstanceType<M extends ModelName> = InstanceType<GetModelClassType<M>>
type GetPostProcessedOutputsType<M extends ModelName> = GetModelInstanceType<M>['postProcessedOutputs']

type CacheHeaders = {
  'cf-skip-cache'?: boolean
  'cf-cache-ttl'?: number
}

const getModelKey = <M extends ModelName>(model: M) => {
  const modelKeys = Object.keys(modelMappings) as (keyof ModelMappings)[]
  for (const key of modelKeys) {
    // @ts-expect-error
    if (modelMappings[key].models.includes(model)) return key
  }
  return undefined
}

export class Gateway {
  protected endpoint = ''
  protected token = ''
  constructor(endpoint?: string, token?: string) {
    if (!endpoint || !token) throw new Error('No endpoint or token has been set.')
    this.endpoint = endpoint
    this.token = token
  }

  async run<M extends ModelName>(
    model: M,
    inputs: ConstructorParametersForModel<M>,
    headers?: HeadersInit | CacheHeaders,
  ) {
    const response = await fetch(`${this.endpoint}/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...headers,
      } as HeadersInit,
      body: JSON.stringify(inputs),
    })
    switch (getModelKey(model)) {
      case 'translation':
        return { response, outputs: (await response.json()).result as GetPostProcessedOutputsType<M> }
      case 'text-to-image':
        return { response, outputs: (await response.arrayBuffer()) as GetPostProcessedOutputsType<M> }
      default:
        return { response, outputs: (await response.json()) as GetPostProcessedOutputsType<M> }
    }
  }
}
