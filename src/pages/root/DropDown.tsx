import React from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DropDown: React.FC = () => {

    const nav = useNavigate()
    const handleLogout = () => {
        axios.post("http://localhost:5083/api/User/logout").then((data) => {
            console.log(data)
            nav('/login')
        }).catch(err => {
            throw new Error(err.message)
        })
    }
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => nav('/lecturer/Profile')
        },
        {
            key: '4',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
                <Space>
                    <Avatar style={{ backgroundColor: "grey" }} icon={<UserOutlined />} />
                </Space>
            </a>
        </Dropdown>
    );
}

export default DropDown;