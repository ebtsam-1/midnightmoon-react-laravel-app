import { createBrowserRouter } from "react-router-dom";
import Login from "./Views/Login";
import Register from "./Views/Register";
import GuestLayout from "./Views/GuestLayout";
import DefaultUserLayout from "./Views/DefaultUserLayout";
import UsersIndex from "./Components/users/UsersIndex";
import UsersForm from "./Components/users/UsersForm";
import Home from "./Components/public/Home";
import AdminLayout from "./Views/AdminLayout";
import FeaturesAdmin from "./Components/features/FeaturesAdmin";
import FeaturesForm from "./Components/features/FeaturesForm";
import ActivitiesIndex from "./Components/Activities/ActivitiesIndex";
import ProductsIndex from "./Components/products/ProductsIndex";
import UserProductsIndex from "./Components/products/UserProductsIndex";
import ActivitiesForm from "./Components/Activities/ActivitiesForm";
import ProductsForm from "./Components/products/ProductsForm";
import ReportsForm from "./Components/reports/ReportsForm";
import ReportsIndex from "./Components/reports/ReportsIndex";
import ProjectsIndex from "./Components/projects/ProjectsIndex";
import ProjectsForm from "./Components/projects/ProjectsForm";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import NotFoundPage from "./Views/NotFoundPage";
import UserProjectsIndex from "./Components/projects/UserProjectsIndex";
import ProductDetails from "./Components/products/ProductDetails";
import ProjectDetails from "./Components/projects/ProjectDetails";
import ContactUs from "./Components/public/ContactUs";
import AboutUs from "./Components/public/AboutUs";
import Dashboard from "./Components/admin/Dashboard"
import ReportsAdmin from "./Components/reports/ReportsAdmin";

const Router = createBrowserRouter([
    {
        element: <AuthMiddleware />,
        children: [
            {
                path: "/",
                element: <DefaultUserLayout />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    },
                    {
                        path: "/projects",
                        element: <UserProjectsIndex />,
                    },
                    {
                        path: "/projects/:id",
                        element: <ProjectDetails />,
                    },
                    {
                        path: "/projects/:projectId/reports",
                        element: <ReportsIndex />,
                    },
                    {
                        path: "/reports",
                        element: <ReportsIndex />,
                    },
                    {
                        path: "/activities",
                        element: <ActivitiesIndex />,
                    },
                    {
                        path: "/products",
                        element: <UserProductsIndex/>,
                    },
                    {
                        path: "/products/:id",
                        element: <ProductDetails/>,
                    },
                    {
                        path:'/contact-us',
                        element:<ContactUs />
                    },
                    {
                        path:'/about-us',
                        element:<AboutUs />
                    }
                ],
            },
        ],
    },

    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
        ],
    },
    {
        element: <AuthMiddleware requiredRole='admin'/>,
        children: [
            {
                path: "/admin-panel",
                element: <AdminLayout />,
                children: [
                    {
                        path: "",
                        element: <Dashboard />,
                    },
                    {
                        path: "users",
                        element: <UsersIndex />,
                    },
                    {
                        path: "users/create",
                        element: <UsersForm key="UserCreate" />,
                    },
                    {
                        path: "users/edit/:id",
                        element: <UsersForm key="UserUpdate" />,
                    },
                    {
                        path: "features",
                        element: <FeaturesAdmin />,
                    },
                    {
                        path: "features/create",
                        element: <FeaturesForm />,
                    },
                    {
                        path: "activities",
                        element: <ActivitiesIndex />,
                    },
                    {
                        path: "activities/create",
                        element: <ActivitiesForm />,
                    },
                    {
                        path: "products",
                        element: <ProductsIndex />,
                    },
                    {
                        path: "products/create",
                        element: <ProductsForm />,
                    },
                    {
                        path: "reports",
                        element: <ReportsAdmin />,
                    },
                    {
                        path: "reports/create",
                        element: <ReportsForm />,
                    },
                    {
                        path: "projects",
                        element: <ProjectsIndex />,
                    },
                    {
                        path: "projects/create",
                        element: <ProjectsForm />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <NotFoundPage />,
    },
]);

export default Router;
