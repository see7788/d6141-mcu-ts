import React, { FC } from 'react'
import store from "../../useStore";
import { Descriptions, Segmented, Input } from "antd"
const App: FC = () => {
    const c = store(s => s.state.serialServer)
    const ebool=(c:boolean)=>c?"true":"false"
    const otf = Object.entries(c)
        .filter((kv, i) => ["uri"].indexOf(kv[0]) == -1)
        .map((kv, i) => <Descriptions.Item label={kv[0]} key={i}>{typeof kv[1]!=="boolean"?"":ebool(kv[1])}</Descriptions.Item>)
    return (
        <Descriptions>
            {...otf}
        </Descriptions>
    )
}
export default App