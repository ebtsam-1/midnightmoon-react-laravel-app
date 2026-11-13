import React, { useEffect } from 'react'
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useStateContext } from '../Contexts/ContextProvider'
import UserHeader from '../Components/header/UserHeader';
import Footer from '../Components/footer/Footer';


function DefaultUserLayout() {
    const {user,setUser,token} = useStateContext();
    // useEffect(()=>{
    //     AxiosClient.get('/profile')
    //     .then((data)=>{
    //         setUser(data.data.my_info);
    //     }).catch((err)=>{console.log(err)});
    // }, []);

    if (!token) {
        return <Navigate to='/login' />;
    }

    return (
    <div id="defaultLayout" className='page-bg page-bg--waves'>
        <div id="content">
           <UserHeader />
           <main className='page-content'>
            <Outlet />
           </main>
           <Footer />
        </div>
     </div>
  )
}

export default DefaultUserLayout
