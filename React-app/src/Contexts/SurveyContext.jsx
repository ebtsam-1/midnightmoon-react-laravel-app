import { createContext, useContext, useState, useEffect } from "react";
import AxiosClient from "../AxiosClient";


const SurveyContext = createContext({
    surveys:[]
});

export const SurveyProvider = ({children})=> {
    const [surveys, setSurveys] = useState([]);

    useEffect(()=>{
        AxiosClient.get('/projects')
        .then(({data})=>{
            console.log('survey context', data);
        }).catch((err)=>console.log(err))
        .finally();
    }, surveys)


    return (
        <SurveyContext.Provider value={{ surveys, setSurveys }}>
            { children }
        </SurveyContext.Provider>
    )
}

export const useSurveyContext = ()=> useContext(SurveyContext);
