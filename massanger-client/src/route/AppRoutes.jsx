import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom' // 1. Добавили Navigate
import Registration from '../pages/Registration'
import Chat from '../pages/Chat'
import ChoiceUser from '../components/ChoiceUser'
import Alluser from '../components/Alluser'

function ProtectedRoute({ children }) {
    const isAuth = localStorage.getItem('isAuth') === 'true'
    return isAuth ? children : <Navigate to="/" replace />
}

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Registration />} />
                <Route path='/choice' element={<ProtectedRoute><Alluser /></ProtectedRoute>} />
                <Route path='/chat' element={<Chat />} /> 
            </Routes>
        </BrowserRouter>
    )
}