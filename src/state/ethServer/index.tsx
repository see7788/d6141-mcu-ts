import React, { FC } from 'react'
import store from "../../useStore";
import { Descriptions, Segmented, Input } from "antd"
function pase(obj:Object,pass:Array<string>){
    const ebool=(c:boolean)=>c?"true":"false"
    return Object.entries(obj)
        .filter((kv, i) => pass.indexOf(kv[0]) == -1)
        .map((kv, i) => <Descriptions.Item label={kv[0]} key={i}>{typeof kv[1]!=="boolean"?kv[1].toString():ebool(kv[1])}</Descriptions.Item>)
  
}
const App: FC = () => {
    const c = store(s => s.state.ethServer)
    return (
        <Descriptions>
            {...pase(c,[])}
        </Descriptions>
    )
}
export default App