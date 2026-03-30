import { useEffect } from 'react'
import { Routes , Route , Navigate  } from 'react-router-dom'
import LoginPage from "./page/LoginPage.jsx"
import RegisterPage from "./page/RegisterPage.jsx"
import HomePage from "./page/HomePage.jsx"
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/useAuthStore.js'
import Layout from './layout/Layout.jsx'
import { Loader } from "lucide-react";
import AdminRoute from "./components/AdminRoute.jsx";

function App() {
  const { checkAuth, isCheckingAuth , authUser} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
    <Toaster/>
    <Routes>
      <Route path='/' element={<Layout/>}>
    <Route
      index
      element={ authUser ? <HomePage/> : <Navigate to={"/loginpage"}/>}
      /> 
      </Route>
      <Route
      path='/registerpage'
      element={ !authUser ? <RegisterPage/> : <Navigate to={"/loginpage"}/>}
      />
      <Route
      path='/loginpage'
      element={!authUser ? <LoginPage/> : <Navigate to={"/"}/>}
      />
      <Route element={<AdminRoute/>}>
      <Route path='/add-problem' element={authUser ? <AddProblemPage/> : <Navigate to={"/"}/>}/>
      </Route>
    </Routes>

      </div>
    </>
  )
}

export default App
