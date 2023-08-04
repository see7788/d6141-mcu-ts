import React, { FC, lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from "../app-websocket/App"
const hostname = window.location.hostname
const wsuri = `ws://${hostname === "localhost" ? "192.168.110.174" : hostname}/ws` as const
ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
).render(
    <React.StrictMode>
        <BrowserRouter>
            <App wsUri={wsuri}/>
        </BrowserRouter>
    </React.StrictMode>
)
