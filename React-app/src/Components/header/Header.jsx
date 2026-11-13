import React, { useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import logo from "../../assets/MidnightMoon-logo-transparent.png";
import { useStateContext } from "../../Contexts/ContextProvider";
import AxiosClient from "../../AxiosClient";
import toast from "react-hot-toast";

function Header() {
    const { user, setUser,setToken } = useStateContext();
    const imageUrl = import.meta.env.VITE_STORAGE_BASE_URL;
    const navigate = useNavigate();
    
    useEffect(() => {
        AxiosClient.get("/profile")
            .then(({ data }) => {
                setUser(data.my_info);
                console.log(data.my_info);
            })
            .catch((err) => console.log(err));
    }, []);

    function logout()
    {
        AxiosClient.post('/logout')
        .then(({data})=>{
            setToken(null);
            setTimeout(()=>navigate('/login'))
        }).catch((err)=>{
            setToken(null);
            toast.success('Logged out successfully!');
            setTimeout(()=>navigate('/login'))
        })
    }

    return (
        <header className="header">
            <div id="logo-div">
                <Link to="/admin-panel">
                    <img id="logo" src={logo} alt="" />
                </Link>
            </div>
            <div id="search-div">
                <input type="text" id="search-bar" placeholder="Search" />
            </div>
            <div id="logout-div">
                <div>
                    <img
                        id="avatar"
                        src={`${imageUrl}/${user.avatar}`}
                        alt="avatar"
                    />
                    <h4>{user.name}</h4>
                    <div>
                        <svg onClick={logout}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
