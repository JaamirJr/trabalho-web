import React from 'react';
import { Menu } from 'antd'
import { withRouter } from 'react-router-dom'
import { UserOutlined, BookOutlined } from '@ant-design/icons';

function NavigationMenu(props) {
    const {history, location} = props
    return (
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item active={location.pathname === "/"} key="1" onClick={() => { history.push("/") }} icon={<UserOutlined />}>
                Alunos
            </Menu.Item>
            <Menu.Item active={location.pathname === "/turmas"} key="2" onClick={() => { history.push("/turmas") }} icon={<BookOutlined />}>
                Turmas
            </Menu.Item>
        </Menu>
    )
}

export default withRouter(NavigationMenu)