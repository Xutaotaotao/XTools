import { HashRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import { ConfigProvider as SemiConfigProvider } from '@douyinfe/semi-ui';
import { useEffect, useState } from "react";
import Router from './routes';
import GlobalContext from "./context/global";
import { getStore, setStore } from "./bridge";

function App() {
  const [themeData, setThemeData] = useState('')

  const changeTheme = (val: 'darkAlgorithm' | 'defaultAlgorithm') => {
    setThemeData(val)
    setStore('theme', val)
    const body = document.body;
    if (val === 'darkAlgorithm') {
      body.setAttribute('theme-mode', 'dark');
    } else {
      body.removeAttribute('theme-mode');
    }
  }

  useEffect(() => {
    const initData = async () => {
      try {
        const theme = await getStore('theme')
        if (theme) {
          changeTheme(theme as "defaultAlgorithm" | "darkAlgorithm")
        } else {
          changeTheme('defaultAlgorithm')
        }
      } catch (error) {
        console.error(error)
        changeTheme('defaultAlgorithm')
      }
    }
    initData()
  }, [])

  return themeData ? <ConfigProvider theme={{ algorithm: themeData === 'darkAlgorithm' ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
    <SemiConfigProvider>
      <GlobalContext.Provider value={{
        changeTheme,
        themeData
      }}>
        <HashRouter>
          <Router />
        </HashRouter>
      </GlobalContext.Provider>
    </SemiConfigProvider>

  </ConfigProvider> : null
}

export default App;
