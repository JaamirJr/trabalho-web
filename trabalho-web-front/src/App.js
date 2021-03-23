import React from 'react'
import { Layout } from 'antd';
import { useState } from 'react';
import './App.css';
import Routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import NavMenu from './components/NavMenu'

function App() {
  
  const { Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo" />
          <NavMenu />
        </Sider>
        <Routes />
      </Layout>
    </BrowserRouter>
  )

}

export default App;