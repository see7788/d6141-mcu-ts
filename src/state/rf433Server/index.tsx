import React, { FC, useState, useRef, useEffect } from 'react';
import Db from "./db"
import _ from "lodash"
import DoTypes from "./doTypes"
import store, { State } from "../../useStore";
import { Descriptions, Segmented, Row, Switch, InputRef, Input, Tooltip, Space, theme } from 'antd';
export const BYTYPENAMES = {
    '添加顺序': 0, '用途顺序': 2
} as const
const UiaddState: FC = () => {
    const rf433Server = store(s => s.state.rf433Server);
    const api = (op: State["rf433Server"]) => {
        store.getState().req<"rf433Server">("config_set", { rf433Server: op });
    }
    const BY = ['自然', "状态", '用途'];
    const byTypeSet = (v: string | number) => store.setState(s => {
        const index = BY.findIndex(c => c == v)
        s.state.rf433Server.by = index;
        api(s.state.rf433Server)
    });
    const ADD = ['禁止', "允许"];
    const addDbSet = (v: string | number) => store.setState(s => {
        const index = ADD.findIndex(c => c == v)
        s.state.rf433Server.add = !!index;
        api(s.state.rf433Server)
    })
    return (
        <Descriptions>
            {
                Object.keys(rf433Server.db).length ?
                    <Row><Db /></Row> :
                    <Descriptions.Item label="信号">请触发信号</Descriptions.Item>
            }
            <Descriptions.Item label="排序">
                <Segmented
                    //size="small"
                    options={BY}
                    value={BY[rf433Server.by]}
                    onChange={byTypeSet}
                />
            </Descriptions.Item>
            <Descriptions.Item label="新增">
                <Segmented
                    //size="small"
                    options={ADD}
                    value={ADD[rf433Server.add ? 1 : 0]}
                    onChange={addDbSet}
                />
            </Descriptions.Item>
            <Descriptions.Item label="用途">
                <DoTypes />
            </Descriptions.Item>
        </Descriptions>
    )
}
export default UiaddState