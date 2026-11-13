import { Navigate, Outlet, Link } from "react-router-dom";
import Header from "../Components/header/Header";
import AdminSidebar from "../Components/admin/AdminSidebar";

function AdminLayout() {
    return (
        <div id="adminLayout">
            <div id="content">
                <Header />
                <main>
                    <div className="home-container">
                        <AdminSidebar />
                        <div id="home">
                            <div className="cover">
                                <div>
                                    <p
                                        style={{
                                            color: "#fff",
                                            margin: 0,
                                            padding: "5px 20px",
                                            backgroundColor: "#5f5e5e52",
                                        }}
                                    >
                                        Dashboard
                                    </p>
                                    <p
                                        style={{
                                            color: "#fff",
                                            margin: "5px 0",
                                            padding: "5px 20px",
                                            backgroundColor: "#5f5e5e52",
                                        }}
                                    >
                                        Hey, wie geht's!
                                    </p>
                                </div>
                                <div className="analytics">
                                    <p
                                        style={{ width: "30%", color: "#fff" }}
                                    ></p>
                                    <div>
                                        <h4
                                            style={{ color: "#333", margin: 0 }}
                                        >
                                            Our activities amongst the world
                                        </h4>
                                        <p
                                            style={{
                                                color: "#555",
                                                borderBottom:
                                                    "1px solid #8f8d8d",
                                                margin: 0,
                                                padding: "5px 0",
                                            }}
                                        >
                                            Global analysis
                                        </p>
                                        <ul>
                                            <li
                                                style={{
                                                    borderRight:
                                                        "1px solid #6d6b6b",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        color: "#333",
                                                        margin: 0,
                                                    }}
                                                >
                                                    Activities count
                                                </p>
                                                <p
                                                    style={{
                                                        color: "#555",
                                                        margin: 0,
                                                    }}
                                                >
                                                    207
                                                </p>
                                            </li>
                                            <li>
                                                <p
                                                    style={{
                                                        color: "#333",
                                                        margin: 0,
                                                        padding: 0,
                                                    }}
                                                >
                                                    Location
                                                </p>
                                                <p
                                                    style={{
                                                        color: "#555",
                                                        margin: 0,
                                                        paddingTop: "3px",
                                                    }}
                                                >
                                                    Africa,Egypt
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="tabs">
                                <nav className="nav">
                                    <ul>
                                        <li>
                                            <Link to="/admin-panel" id="tabs-btn">
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/admin-panel/features" id="tabs-btn">
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/admin-panel/projects" id="tabs-btn">
                                                Projects
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/admin-panel/reports" id="tabs-btn">
                                                Reports
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/admin-panel/activities"
                                                id="tabs-btn"
                                            >
                                                Activities
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/admin-panel/products" id="tabs-btn">
                                                Products
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/admin-panel/users" id="tabs-btn">
                                                Users
                                            </Link>
                                        </li>
                                    </ul>
                                </nav>
                                <div id="tabs-content">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
