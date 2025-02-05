
import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, useNavigation } from 'react-router-dom'
import Root, { rootLoader } from './pages/root/Root'
import ResultsPage, { resultsLoader } from './pages/results/ResultsPage'
import LoginPage from './pages/login/LoginPage'
import NotFound from './pages/support-pages/NotFound'
import ErrorPage from './pages/support-pages/ErrorPage'
import ModulesDegreePage, { ModulesDegreeLoader } from './pages/modules-degree/ModulesDegreePage'
import ProfilePage, { profilePageLoader } from './pages/profile/ProfilePage'
import HomePage from './pages/home/HomePage'
import EnrollementPage, { enrollmentPageLoader } from './pages/Enrollment/EnrollmentPage'
import ExamsPage, { examsPageLoader } from './pages/exams/ExamsPage'
import LecturerProfilePage, { lecturerProfilePageLoader } from './users/lecturer/pages/LecturerProfilePage'
import MySubjects, { mySubjectsLoader } from './users/lecturer/pages/MySubjects'


// Updated Workflow
// User logs in → Store user data in sessionStorage.
// User refreshes → sessionStorage is gone → Call /api/user → Restore user info.
// User closes the tab → sessionStorage is lost → If cookies exist, call /api/user.
// User logs out → Clear sessionStorage and ask the backend to remove cookies.
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />} loader={rootLoader} errorElement={<ErrorPage />}>
          <Route index element={<HomePage />} />
          <Route path='/student/results' element={<ResultsPage />} loader={resultsLoader} />
          <Route path='/student/enrollment' element={<EnrollementPage />} loader={enrollmentPageLoader} />
          <Route path='/student/profile' element={<ProfilePage />} loader={profilePageLoader} />
          <Route path='/student/exams' element={<ExamsPage />} loader={examsPageLoader} />
          <Route path='/student/Modules' element={<ModulesDegreePage />} loader={ModulesDegreeLoader} />
          {/* lecturer pages */}
          <Route path='lecturer/Profile' element={< LecturerProfilePage />} loader={lecturerProfilePageLoader} />
          <Route path='lecturer/mySubjects' element={< MySubjects />} loader={mySubjectsLoader} />

        </Route>
        <Route path='*' element={<NotFound />} />
        <Route path='/login' element={<LoginPage />} />
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
