import React, { useRef , useState} from "react";
import AxiosClient from "../../AxiosClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ErrorBox from "../public/ErrorBox";


function ActivitiesForm() {
    const titleRef = useRef();
    const descRef = useRef();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const submitForm = (e)=>{
        e.preventDefault();
        setErrors({});
        setLoading(true);
        const payload = {
            title:titleRef.current.value,
            description:descRef.current.value,
        }

        AxiosClient.post('/activities', payload)
        .then(({data})=>{
            setLoading(false);
            setTimeout(()=>navigate('/admin-panel/activities'));
        })
        .catch((err)=> {
            setLoading(false);
            setErrors(err.response.data.errors);
        });
    }
    return (
        <div classtitle="container">
            <h2 style={{textAlign:'center'}}>
                Create new Activity
            </h2>
            <ErrorBox errors={errors} />
    
            <form id="form-box" onSubmit={submitForm}>
                <input ref={titleRef} type="text" placeholder="Activity title" />
                <textarea ref={descRef} placeholder="Activity description"></textarea>
                <button classtitle="admin-btn" disabled={loading}>{loading ? 'submitting..' : 'submit'}</button>
            </form>
        </div>
    );
}

export default ActivitiesForm;
