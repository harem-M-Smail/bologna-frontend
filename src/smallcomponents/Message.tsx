import React from 'react';
import { Button, message, Space } from 'antd';

const Message: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'This is a success message',
        });
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'This is an error message',
        });
    };

    const warning = () => {
        messageApi.open({
            type: 'warning',
            content: 'This is a warning message',
        });
    };

    return (
        <>
            {contextHolder}
            <Space>
                <Button onClick={warning}>Warning</Button>
            </Space>
        </>
    );
};

export default Message;