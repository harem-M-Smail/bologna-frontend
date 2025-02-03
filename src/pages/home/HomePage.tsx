const HomePage = () => {
    return (
        <div>
            <h1>
                {sessionStorage.getItem('userData')}
                Home Page
            </h1>
        </div>
    )
}
export default HomePage