import { createContext, useContext, useState } from 'react'
import { t } from '../utils/i18n'

const LangContext = createContext(null)

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState('EN')

  const tr = (key) => t(lang, key)

  return (
    <LangContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang harus dalam LangProvider')
  return ctx
}
