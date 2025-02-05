import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { NavLink, Outlet, redirect, useLoaderData, useNavigation } from 'react-router-dom';
import { Flex, Spin } from 'antd';
import DropDown from './DropDown';
import axios from 'axios';
const { Header, Content } = Layout;

const Root: React.FC = () => {
    // const data = useLoaderData();
    // console.log(data)
    //expect a user that has access for more than one role
    const userLinks = [
        {
            user: 'Student',
            links: [
                { name: 'Home', path: '/', key: 1 },
                { name: 'Results', path: '/student/Results', key: 2 },
                { name: 'Modules', path: '/student/Modules', key: 3 },
                { name: 'Exams', path: '/student/Exams', key: 4 },
                { name: 'Enrollment', path: '/student/Enrollment', key: 5 },
            ],
        },
        {
            user: 'Lecturer',
            links: [
                { name: 'Home', path: '/', key: 11 },
                { name: 'My Subjects', path: '/lecturer/mysubjects', key: 12 },
                { name: 'lecturerpage3', path: '/Modules', key: 13 },
            ],
        },
    ]
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const userRoles = JSON.parse(sessionStorage.getItem('userData')).roles;

    let navLinks = userLinks.filter(userLink => userRoles.includes(userLink.user)).map(userLink => userLink.links).flat();
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


export const rootLoader = () => {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        axios.defaults.withCredentials = true;
        return axios.get('http://localhost:5083/api/User/get-session')
            .then(res => {
                if (res.status === 200) {
                    sessionStorage.setItem('userData', JSON.stringify(res.data));
                    console.log('200')
                    return res.data;
                } else {
                    if (res.status === 401 || res.status === 403) {
                        return redirect('/login');
                    }
                    return res.statusText;
                }
            }).catch(err => {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    return redirect('/login');
                }
                throw new Error(err);
            });
    }
    return null
}