import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../Contexts/ContextProvider'

function GuestLayout() {
    const {token} = useStateContext();
    if(token) {
        <Navigate to='/' />
    }
    return (
        <div id="guestLayout">
            <Outlet />
        </div>
    )
}

export default GuestLayout
