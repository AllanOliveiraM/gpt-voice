import '@nexpy/design-system/dist/preflight.css'

import { AppProps } from 'next/app'

import { ThemeProvider } from '@nexpy/design-system'

import Meta from 'components/common/Meta'

import { customTheme } from 'theme/settings'

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={customTheme} defaultStyleMode='minimalist'>
    <Meta />

    <Component {...pageProps} />
  </ThemeProvider>
)

export default App
