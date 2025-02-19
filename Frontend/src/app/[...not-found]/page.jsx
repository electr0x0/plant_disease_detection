// Component Imports
import Providers from '@components/Providers'
import { getServerMode, getSystemMode } from '@core/utils/serverHelpers'
import BlankLayout from '@layouts/BlankLayout'
import NotFound from '@views/NotFound'

// Util Imports

const NotFoundPage = () => {
  // Vars
  const direction = 'ltr'
  const mode = getServerMode()
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  )
}

export default NotFoundPage
