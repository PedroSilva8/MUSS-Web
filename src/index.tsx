import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'

import IndexPage from './page';
import DashboardPage from './page/dashboard';

import Themehandler from '@global/ThemeHandler'

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

ReactDOM.render(
  <React.StrictMode>
    <ReactNotification />
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<IndexPage />}/>
        <Route path="/dashboard/*" element={<DashboardPage />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);