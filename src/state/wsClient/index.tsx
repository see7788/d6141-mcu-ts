import React, { FC } from 'react'
import store from "../../useStore";
import {EditOutlined} from "@ant-design/icons"
import { Descriptions, Segmented, Input } from "antd"
function pase(obj:Object,pass:Array<string>){
    const ebool=(c:boolean)=>c?"true":"false"
    return Object.entries(obj)
        .filter((kv, i) => pass.indexOf(kv[0]) == -1)
        .map((kv, i) => <Descriptions.Item label={kv[0]} key={i}>{typeof kv[1]!=="boolean"?kv[1].toString():ebool(kv[1])}</Descriptions.Item>)
  
}
const App: FC = () => {
    const c = store(s => s.state.wsClient)
    const set_uri = (e: React.ChangeEvent<HTMLInputElement>) => store.setState(s => {
        s.state.wsClient.uri = e.target.value
        s.req<"wsClient">("config_set", { "wsClient": s.state.wsClient })
    });
    return (
        <Descriptions>
            {...pase(c,["uri"])}
            <Descriptions.Item label="uri">
                <Input
                    value={c.uri}
                    bordered={false}
                    allowClear={true}
                    suffix={<EditOutlined />}
                    onChange={set_uri}
                />
            </Descriptions.Item>
        </Descriptions>
    )
}
export default App