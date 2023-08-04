import React, { FC, Suspense, lazy, useEffect, useState } from 'react';
import { Steps } from "antd"
import { useNavigate, useRoutes,BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import store from "../useStore"
const Ipc = lazy(() => import("./App"))
const State = lazy(() => import("../state/index"))
const App: FC = () => {
    const [ipcname, initstate] = store(s => s.ipc.state)
    const [pageId, pageIdSet] = useState(0);
    const goto = useNavigate();
    const routerset = (c: number) => {
        pageIdSet(c);
        goto(`/${c}`)
    }
    useEffect(() => {
        if (!ipcname) {
            routerset(0);
        } else if (!initstate) {
            routerset(0);
        }
    }, [ipcname, initstate])
    const Pages = useRoutes([
        {
            path: "/*",
            element: <Suspense fallback={<>我是懒加载</>}><Ipc /></Suspense>,
        },
        {
            path: "/1",
            element: <Suspense fallback={<>我是懒加载</>}><State /></Suspense>,
        }])
    return <>
        <Steps
            onChange={routerset}
            current={pageId}
            items={[
                {
                    title: `建立通讯`,
                    description: ipcname ? "当前" + ipcname : "设置通讯方式",
                },
                {
                    title: '操作配置'
                }
            ]}
        />
        {Pages}
    </>;
}
ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)