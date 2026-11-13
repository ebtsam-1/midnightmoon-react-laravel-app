import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Router from './Router.jsx'
import { RouterProvider } from 'react-router-dom'
import { ContextProvider } from './Contexts/ContextProvider.jsx'
import { Toaster } from 'react-hot-toast';
import "./styles/index.css"
import { SurveyProvider } from './Contexts/SurveyContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
    {/* <SurveyProvider> */}
    <Toaster position="top-right"
      containerStyle={{ zIndex: 99999, top: 65 }}
    />
    <RouterProvider router={Router}/>
    {/* </SurveyProvider> */}
    </ContextProvider>
  </StrictMode>
)
