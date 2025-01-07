/* eslint-disable */
import { Button, Result } from 'antd';
import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError()
    const nav = useNavigate()
    return (
        <Result
            status="warning"
            title={error.message}
            extra={<Button type="primary" onClick={() => nav("/")}>Back Home</Button>}
        />
    )
}
export default ErrorPage