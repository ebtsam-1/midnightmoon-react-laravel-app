import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AxiosClient from "../../AxiosClient";
import ErrorBox from "../public/ErrorBox";

function FeaturesForm() {
    const nameRef = useRef();
    const descRef = useRef();
    const imgRef = useRef();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const store = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData();
        formData.append("name", nameRef.current.value);
        formData.append("desc", descRef.current.value);
        formData.append("img", imgRef.current.files[0]);

        AxiosClient.post('/features', formData)
            .then(({ data }) => {
                setTimeout(() => navigate('/admin-panel/features'), 1000);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors);
                }
            });
    }

    return (
        <div id="admin-form-box">
            <h2 className="global-color">create new feature</h2>

            <form id="form-box" onSubmit={store}>
                <input ref={nameRef} type="text" placeholder="features name" />
                <input ref={descRef} type="text" placeholder="features description" />
                <input ref={imgRef} type="file" placeholder="features image" />

                <ErrorBox errors={errors} />

                <button className="global-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default FeaturesForm;
