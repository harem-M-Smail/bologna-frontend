import React from 'react';
import { Button, Layout, Menu, theme } from 'antd';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const NavLinks = () => {
    const nav = useNavigate()
    return (
        <>
            <Button onClick={() => nav('/')}>Home</Button>
            <Button onClick={() => nav('/results')}>Results</Button>

        </>
    )
}

const Root: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navLinks = [{ name: 'Home', path: '/', key: 1 },
    { name: 'Results', path: '/Results', key: 2 },
    { name: 'Modules', path: '/Modules', key: 3 },
    { name: 'Module Results', path: '/Module-Results', key: 4 },]
    const items: any = navLinks.map(navLInk => ({
        label: <NavLink to={navLInk.path} key={navLInk.key}>{navLInk.name}</NavLink>
    }))
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default Root;