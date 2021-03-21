import React from 'react'
import { Layout, Menu } from 'antd';
import { UserOutlined, BookOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './App.css';
import Routes from './routes'
import { BrowserRouter, useHistory, Link } from 'react-router-dom'

function App() {
  
  const { Sider } = Layout;
  const [collapsed, setCollapsed] = useState(false);

  console.log(BrowserRouter)

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Link key="1" onClick={() => {  }} icon={<UserOutlined />} to="/">
              Alunos
            </Link>
            <Menu.Item key="2" onClick={() => {  }}  icon={<BookOutlined />} to="/Turmas">
              Turmas
            </Menu.Item>
          </Menu>
        </Sider>
        <Routes />
      </Layout>
    </BrowserRouter>
  )

}

export default App;