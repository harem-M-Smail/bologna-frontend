import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const nav = useNavigate()
    const onFinish = (values: any) => {
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:5083/api/User/login/' + values.username + '/' + values.password, { withCredentials: true })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    console.log('test got')
                    nav("/")
                } else if (res.status === 401) {
                    console.log('else if')
                }
            }).catch(err => {
                if (err.status === 401) {
                    console.log(err.message)
                }
                throw new Error(err)
            })
    };

    return (
        <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your Username!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' }]}
            >
                <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Flex>
            </Form.Item>

            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Log in
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;