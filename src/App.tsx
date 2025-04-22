
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
import { studentGradesLoader } from './users/lecturer/pages/StudentDegrees'
import UpgradeDegrees from './users/lecturer/pages/UpgradeDegrees'
import StudentDegrees from './users/lecturer/pages/StudentDegrees'
import DepartmentInfo, { departmentInfoPageLoader } from './users/headOfDepartment/DepartmentInfo'
import DeptDetails from './users/headOfDepartment/DeptDetails'
import StudentDetails from './users/headOfDepartment/studentDetails'
import InstructorDetails from './users/headOfDepartment/pages/InstructorDetails'


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
          <Route path='/student/semesters_degree' element={<ResultsPage />} loader={resultsLoader} />
          <Route path='/student/Modules' element={<EnrollementPage />} loader={enrollmentPageLoader} />
          <Route path='/student/profile' element={<ProfilePage />} loader={profilePageLoader} />
          <Route path='/student/Examinations' element={<ExamsPage />} loader={examsPageLoader} />
          <Route path='/student/Degrees' element={<ModulesDegreePage />} loader={ModulesDegreeLoader} />
          {/* lecturer pages */}
          <Route path='lecturer/Profile' element={< LecturerProfilePage />} loader={lecturerProfilePageLoader} />
          <Route path='lecturer/modules' element={< MySubjects />} loader={mySubjectsLoader} />
          <Route path='lecturer/student-degrees' element={< StudentDegrees />} loader={studentGradesLoader} />
          <Route path='lecturer/student-degrees/:taskId/:taskNumber' element={< UpgradeDegrees />} />
          {/* head of department pages */}
          <Route path='lecturer/head_of_department/department_info' element={< DepartmentInfo />} loader={departmentInfoPageLoader} />
          <Route path='lecturer/head_of_department/department_details' element={< DeptDetails />} />
          <Route path='lecturer/head_of_department/student_details' element={< StudentDetails />} />
          <Route path='lecturer/head_of_department/instructor_details' element={< InstructorDetails />} />
          {/* 404 page */}


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
