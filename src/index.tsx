import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'

import IndexPage from './page';
import DashboardPage from './page/dashboard';
import AuthPage from './page/auth';

import Themehandler from '@global/ThemeHandler'

import { defaultUser, IUser } from '@interface/database';
import userContext from '@context/AuthContext';

import Cookies from 'js-cookie';
import RestHelper from '@global/RestHelper';

import './scss/index.scss'
import 'react-notifications-component/dist/scss/notification.scss'

Themehandler.Themes.push({
  name: "dark",
  surface: "#171717",
  boxShadow: "#101010",
  background: "#1a1a1a",
  font: "#fff",
  highlight: "#896ac8",
  border: '#896ac8'
})

Themehandler.SetTheme("dark");

const App = () => {
  const [ user, setUser ] = useState<IUser>(defaultUser)
  const [ token, setToken ] = useState<string>("")

  useEffect(() => {
    var auth = Cookies.get('auth')
    setToken(auth ? auth : "")
  }, [])

  useEffect(() => {
    if (token && token != "")
      RestHelper.GetItems({
        target: "user/token",
        arguments: { token: token },
        onSuccess: (Data) => {
          if (Data.data)
            setUser(Data.data)
        },
        onError: () => {}
      })
  }, [token])

  return (
    <>
      <ReactNotification />
      <userContext.Provider value={{user, setUser, token, setToken}} >
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<IndexPage />}/>
            <Route path="/dashboard/*" element={<DashboardPage />}/>
            <Route path="/auth/*" element={<AuthPage />}/>
          </Routes>
        </BrowserRouter>
      </userContext.Provider>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);