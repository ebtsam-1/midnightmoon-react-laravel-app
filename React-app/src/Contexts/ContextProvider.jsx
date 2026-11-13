import { createContext, useContext, useState, useEffect } from "react"
import AxiosClient from "../AxiosClient";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [isLoading, setIsLoading] = useState(true);

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    useEffect(() => {
        if (token) {
            AxiosClient.get('/profile') 
                .then(({ data }) => setUser(data.my_info))
                .catch(() => {
                    setToken(null); // token invalid/expired — log out
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [token]);

    return (
        <StateContext.Provider value={{ user, token, setUser, setToken, isLoading }}>
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);