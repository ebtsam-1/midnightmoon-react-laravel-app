import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../Contexts/ContextProvider";

const AuthMiddleware = ({ requiredRole }) => {
    const { token, user, isLoading } = useStateContext();

    if (isLoading) return null; // or a spinner

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        console.log(user);
        return <Navigate to="/not-found-page" replace />;
    }

    return <Outlet />;
};

export default AuthMiddleware;
