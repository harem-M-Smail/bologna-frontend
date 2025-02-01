import LoginForm from "./LoginForm"

const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="form-container">
                <div className="center-items">
                    <h3 style={{ padding: '1rem', color: 'white' }}>Login</h3>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}
export default LoginPage