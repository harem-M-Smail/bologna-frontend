import React, { useEffect } from 'react';
import { Layout, Menu, theme } from 'antd';
import { NavLink, Outlet, useNavigate, useNavigation } from 'react-router-dom';

const { Header, Content } = Layout;

const Root: React.FC = () => {

    const checkUserSession = () => {
        const navigate = useNavigate();
        useEffect(() => {
            const userData = sessionStorage.getItem('userData');
            if (!userData) {
                navigate('/login');
            }
        }, [navigate]);
    };
    checkUserSession();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navLinks = [{ name: 'Home', path: '/', key: 1 },
    { name: 'Results', path: '/Results', key: 2 },
    { name: 'Modules', path: '/Modules', key: 3 },
    { name: 'Exams', path: '/Exams', key: 4 },
    { name: 'Enrollment', path: '/Enrollment', key: 5 },
    { name: 'Profile', path: '/Profile', key: 6 },
    ]

    const profileDropdown = () => {
        return (
            <DropDown />
        )
    }
    const items: any = navLinks.map(navLInk => ({
        label:
            <>
                <NavLink to={navLInk.path} key={navLInk.key}>{navLInk.name}</NavLink>
            </>
    }))
    items.push({
        label: profileDropdown(),
        key: 'profile',
        style: { marginLeft: 'auto' }
    })
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
            <Content className='root-content'>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <LoadingIndicator />
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default Root;

import { Flex, Spin } from 'antd';
import DropDown from './DropDown';

const LoadingIndicator: React.FC = () => {
    const navigation = useNavigation();

    // Check if there is an ongoing navigation
    const isLoading = navigation.state === 'loading';

    return (
        isLoading && (
            <Flex style={{ width: "100%", justifyContent: 'center' }} align="center" gap="middle">
                <Spin size="large" />
            </Flex>
        )
    )
};
