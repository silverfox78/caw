import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const MobileActionsContext = createContext(null)

export function MobileActionsProvider({ children }) {
  const [actions, setActions] = useState(null)

  const registerMobileActions = useCallback((next) => {
    setActions(next)
  }, [])

  const value = useMemo(
    () => ({
      actions,
      registerMobileActions,
    }),
    [actions, registerMobileActions],
  )

  return <MobileActionsContext.Provider value={value}>{children}</MobileActionsContext.Provider>
}

export function useMobileActions() {
  const context = useContext(MobileActionsContext)
  if (!context) {
    throw new Error('useMobileActions must be used within MobileActionsProvider')
  }
  return context
}

export function useRegisterMobileActions(effectActions) {
  const { registerMobileActions } = useMobileActions()

  useEffect(() => {
    registerMobileActions(effectActions)
    return () => registerMobileActions(null)
  }, [effectActions, registerMobileActions])
}
