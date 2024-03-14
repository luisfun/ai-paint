<script lang="ts">
  import NewTab from '$lib/svelte/NewTab.svelte'
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton'
</script>

<Accordion class="my-8">
  <AccordionItem class="variant-glass-surface rounded-container-token">
    <svelte:fragment slot="summary">Overview</svelte:fragment>
    <svelte:fragment slot="content">
      <p>
        We use cookies to enhance your experience and show personalized ads. Third-party vendors, including Google, may
        also use cookies for ad personalization. You can opt out of personalized ads by visiting <NewTab
          href="https://www.google.com/settings/ads"
          label="Ads Settings">Ads Settings</NewTab
        > or <NewTab href="http://www.aboutads.info/choices/" label="aboutads">www.aboutads.info</NewTab>.
      </p>
      <p>
        This site gives you tools without any promises about their quality or results. We’re not liable for any issues
        caused by using these. The site doesn’t back the ads you see here.
      </p>
    </svelte:fragment>
  </AccordionItem>
  <AccordionItem class="variant-glass-surface rounded-container-token">
    <svelte:fragment slot="summary">概要</svelte:fragment>
    <svelte:fragment slot="content">
      <p>
        私たちはあなたの体験を向上させ、パーソナライズされた広告を表示するためにクッキーを使用します。Googleを含む第三者のベンダーも広告のパーソナライズのためにクッキーを使用する場合があります。<NewTab
          href="https://www.google.com/settings/ads"
          label="広告設定">広告設定</NewTab
        >または<NewTab href="http://www.aboutads.info/choices/" label="aboutads">www.aboutads.info</NewTab
        >を訪れてパーソナライズされた広告を無効にすることができます。
      </p>
      <p>
        このサイトはツールを提供しますが、その品質や結果について保証はありません。それらを使用し問題が発生した場合、私たちは責任を負いません。このサイトは表示される広告ついて責任を負いません。
      </p>
    </svelte:fragment>
  </AccordionItem>
</Accordion>

<p>This policy is effective as of March 6, 2024.</p>

<h2>Privacy Policy</h2>
<p>
  Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect
  from you across our website.
</p>
<h3>Cookies</h3>
<p>
  We use "cookies" to collect information about you and your activity across our site. A cookie is a small piece of data
  that our website stores on your computer, and accesses each time you visit, so we can understand how you use our site.
  This helps us serve you content based on preferences you have specified.
</p>
<p>
  Third party vendors, including Google, also use cookies to serve ads based on your prior visits to our website or
  other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your
  visit to our sites and/or other sites on the Internet. You may opt out of personalized advertising by visiting <NewTab
    href="https://www.google.com/settings/ads"
    label="Ads Settings">Ads Settings</NewTab
  >. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <NewTab
    href="http://www.aboutads.info/choices/"
    label="aboutads">www.aboutads.info</NewTab
  >.
</p>
<h3>Third-Party Vendors and Ad Networks</h3>
<p>
  Please be aware that third-party vendors and ad networks are serving ads on our site. You may visit these websites to
  opt out of the use of cookies for personalized advertising (if the vendor or ad network offers this capability).
  Alternatively, you can opt out of some third-party vendors’ uses of cookies for personalized advertising by visiting
  <NewTab href="http://www.aboutads.info/choices/" label="aboutads">www.aboutads.info</NewTab>.
</p>
<h3>Changes to this policy</h3>
<p>
  At our discretion, we may change our privacy policy to reflect current acceptable practices. We will take reasonable
  steps to let users know about changes via our website. Your continued use of this site after any changes to this
  policy will be regarded as acceptance of our practices around privacy and personal information.
</p>
<h3>Your Rights and Responsibilities</h3>
<p>
  By using our website, you agree to our use of cookies, our collection of information, and our third-party vendors and
  ad networks serving ads on our site.
</p>

<h2>Disclaimer</h2>
<p>
  This website offers tools for your information. We don’t guarantee that they’re complete, accurate, reliable, or
  suitable for any specific purpose. If you use these tools, you’re doing so at your own risk.
</p>
<p>
  We won’t be responsible for any loss or damage you may experience, including any loss of data or profits, from using
  these tools.
</p>
<p>
  Please be aware that we don’t endorse the products or services advertised on this site. We’re not accountable for the
  content or accuracy of these advertisements.
</p>
