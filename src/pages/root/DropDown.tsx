import React from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DropDown: React.FC = () => {

    const nav = useNavigate()
    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:5083/api/User/logout");
            nav('/login');
            sessionStorage.removeItem('userData');
        } catch (err) {
            nav('/login');

            if (axios.isAxiosError(err)) {
                console.error("Logout failed: ", err.response?.data || err.message);
            } else {
                console.error("Logout failed: ", err);
            }
        }
    }
    const userData = (JSON.parse(sessionStorage.getItem('userData')));
    const items: MenuProps['items'] = [
        {
            key: '1',
            // label: userData.username,
            label: "",
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => nav(`/${userData.roles[0]}/Profile`)
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