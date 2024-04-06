# AI Paint [![license](https://img.shields.io/github/license/luisfun/ai-paint)](https://github.com/LuisFun/ai-paint/blob/main/LICENSE)

[👉 Demo](https://ai-paint.luis.fun)

## Fork, Clone, Install, Dev

[Fork and Clone](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)

```sh
cd ai-paint
npm i
npm run dev
```

> [!IMPORTANT]
> Edit the following file: `src\lib\config.ts`

## Create Pages

[Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/git-integration/)

Binding to Functions, etc.  
`Cloudflare Dashboard` > `Workers & Pages` > `ai-paint` > `Settings` > `Functions`

## Setup Turnstile

[Key issuance and WAF setup](https://blog.cloudflare.com/integrating-turnstile-with-the-cloudflare-waf-to-challenge-fetch-requests)

Use the Access policy to restrict access to development previews.  
`Cloudflare Dashboard` > `Workers & Pages` > `ai-paint` > `Manage` > `Access policy` > `Enable access policy`

Redirect access to ai-paint.pages.dev using Bulk Redirects.  
`Bulk Redirects` > ...
