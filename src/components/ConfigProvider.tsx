import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import React from 'react'
import { loadConfigFromFile } from '../loadConfig'

export type ConfigType = any // todo: change that to generic type

type ConfigContextType = {
  config: ConfigType
  setConfig: React.Dispatch<React.SetStateAction<ConfigType>>
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)
ConfigContext.displayName = 'ConfigContext'

type ConfigProviderProps = {
  children: ReactNode
}

export const ConfigProvider: FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<ConfigType>({
    apiUrl: undefined,
    paymailDomain: undefined,
  })

  useEffect(() => {
    const fetchConfig = async () => {
      const mergedConfig = await loadConfigFromFile()
      setConfig(mergedConfig)
    }

    fetchConfig().catch(console.error)
  }, [])

  const value = { config, setConfig }

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export const useConfig = () => {
  const ctx = useContext(ConfigContext)
  if (!ctx) {
    throw new Error('useConfig must be use within ConfigProvider')
  }
  return ctx
}
