
import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useNavigation } from 'react-router-dom'
import Root from './pages/root/Root'
import ResultsPage, { resultsLoader } from './pages/results/ResultsPage'
import LoginPage from './pages/login/LoginPage'
import NotFound from './pages/support-pages/NotFound'
import ErrorPage from './pages/support-pages/ErrorPage'
import ModulesDegreePage, { ModulesDegreeLoader } from './pages/modules-degree/ModulesDegreePage'
import ProfilePage, { profilePageLoader } from './pages/profile/ProfilePage'
import HomePage from './pages/home/HomePage'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
          <Route index element={<HomePage />} />
          <Route path='results' element={<ResultsPage />} loader={resultsLoader} />
          <Route path='profile' element={<ProfilePage />} loader={profilePageLoader} />
          <Route path='login' element={<LoginPage />} />
          <Route path='Modules' element={<ModulesDegreePage />} loader={ModulesDegreeLoader} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </>
    )
  )
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
