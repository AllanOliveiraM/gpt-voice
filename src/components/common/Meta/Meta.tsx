import NextHead from 'next/head'

import { META_TAGS_IDENTIFIER_KEYS } from 'constants/meta'

const Meta = () => (
  <NextHead>
    <title key={META_TAGS_IDENTIFIER_KEYS.TITLE}>Nexpy Chat</title>

    <meta name='viewport' content='width=device-width' />
    <meta property='og:type' content='company' />
    <meta name='robots' content='index,follow' />
    <meta charSet='utf-8' />
    <meta name='apple-mobile-web-app-capable' content='yes' />
    <meta name='apple-mobile-web-app-status-bar-style' content='default' />
    <meta name='format-detection' content='telephone=no' />
    <meta name='mobile-web-app-capable' content='yes' />
    <meta name='author' content='Nexpy <https://www.nexpy.com.br>' />

    <link key={META_TAGS_IDENTIFIER_KEYS.FAVICON} rel='icon' href='/favicon.ico' />
    <link key={META_TAGS_IDENTIFIER_KEYS.MANIFEST} rel='manifest' href='/manifest.json' />
    <link
      key={META_TAGS_IDENTIFIER_KEYS.APPLE_TOUCH_ICON}
      rel='apple-touch-icon'
      href='/images/icons/icon-192x192.png'
    />

    <meta
      key={META_TAGS_IDENTIFIER_KEYS.APPLICATION_NAME}
      name='application-name'
      content='Nexpy'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.APPLE_MOBILE_WEB_APP_TITLE}
      name='apple-mobile-web-app-title'
      content='Nexpy'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.DESCRIPTION}
      name='description'
      content='Assistente virtual de teste baseado no ChatGPT.'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.THEME_COLOR}
      name='theme-color'
      content='#732fe0'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.OG_DESCRIPTION}
      property='og:description'
      content='Assistente virtual de teste baseado no ChatGPT.'
    />
    <meta key={META_TAGS_IDENTIFIER_KEYS.OG_TITLE} property='og:title' content='Nexpy' />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.OG_IMAGE}
      property='og:image'
      content='/images/icons/icon-512x512.png'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.SITE_NAME}
      property='og:site_name'
      content='Nexpy'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.TWITTER_TITLE}
      name='twitter:title'
      content='Nexpy'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.TWITTER_DESCRIPTION}
      name='twitter:description'
      content='Assistente virtual de teste baseado no ChatGPT.'
    />
    <meta
      key={META_TAGS_IDENTIFIER_KEYS.TWITTER_IMAGE}
      property='twitter:image'
      content='/images/icons/icon-512x512.png'
    />
  </NextHead>
)

export default Meta
