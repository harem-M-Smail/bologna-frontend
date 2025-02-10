import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";

import { message, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import { FileTextOutlined } from '@ant-design/icons';
const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
        customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
    };
});

const MySubjects: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState(useLoaderData())
    console.log(data)
    const onUpdateAssistantAccess = (moduleId, accessValue) => {
        axios.patch(`http://localhost:5083/api/Lecturer/update-assistant-access/${moduleId}/${accessValue}`)
            .then(response => {
                if (response.status === 200 || response.status === 204) {
                    setData(data.map(module => module.moduleId === moduleId ? { ...module, assistantAccess: accessValue } : module))
                    message.success(`Access ${accessValue ? 'granted' : 'revoked'} successfully`);

                } else {
                    message.error('Failed to update assistant access');
                }
            })
            .catch(error => {
                message.error('Error updating assistant access:', error);
            });
    }
    const onUpdateComplainAccess = (moduleId, complainValue) => {
        console.log(moduleId, complainValue)

        axios.patch(`http://localhost:5083/api/Lecturer/set-complain/${moduleId}/${complainValue}`)
            .then(response => {
                if (response.status === 200 || response.status === 204) {
                    setData(data.map(module => module.moduleId === moduleId ? { ...module, complainAccess: complainValue } : module))
                    message.success(`Access ${complainValue ? 'granted' : 'revoked'} successfully`);

                } else {
                    message.error('Failed to update complain');
                }
            })
            .catch(error => {
                message.error('Error updating complain:', error);
            });
    }
    const columns: TableColumnsType<Module> = () => {
        return [
            { title: 'Index', width: 15, dataIndex: 'index', key: '1' },
            { title: 'Module', width: 100, dataIndex: 'name', key: 'module', fixed: 'left' },
            { title: 'Code', dataIndex: 'code', key: '2' },
            { title: 'Academic Name', dataIndex: 'academicName', key: '7' },
            { title: 'Stage', dataIndex: 'stage', key: '3' },
            { title: 'Degree', dataIndex: 'degree', key: '4' },
            { title: 'Type', dataIndex: 'type', key: '5' },
            { title: 'Lecturer Type', dataIndex: 'lecturerType', key: '6' },
            { title: 'open complain', dataIndex: 'complainAccess', key: '20', render: (record) => <span>{record ? "true" : "false"}</span> },
            { title: 'Open complain', dataIndex: 'stage', key: '9', render: (text, record) => <Switch checked={record.complainAccess} onChange={() => onUpdateComplainAccess(record.moduleId, !record.complainAccess)} /> },
            { title: 'Assist.lec Access', dataIndex: 'assistantAccess', key: '20', render: (record) => <span>{record ? "true" : "false"}</span> },
            { title: 'Assist.lec Access', dataIndex: 'assistantAccess', key: '10', render: (text, record) => <Switch checked={record.assistantAccess} onChange={() => onUpdateAssistantAccess(record.moduleId, !record.assistantAccess)} /> },
            {
                title: 'Workload',
                dataIndex: 'workload',
                key: '8',
                render: () => <FileTextOutlined />,
            }
        ];
    }
    const dataSource = (data) => {
        return data.map((module: Module) => ({ ...module, key: module.moduleId, index: data.indexOf(module) + 1 }))
    }
    const { styles } = useStyle();
    return (
        <>
            <Table<Module>
                className={styles.customTable}
                pagination={false}
                columns={columns()}
                dataSource={dataSource(data)}
                scroll={{ x: 'max-content' }}
            />
        </>

    );
};
export default MySubjects;

import React, { useState } from 'react';
import { Switch } from 'antd';

const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
};


export const mySubjectsLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get("http://localhost:5083/api/lecturer/modules-info")
        .then(res => {
            if (res.status === 200) {
                return res.data
            } else {
                console.log('then else')
                if (res.status === 401) {
                    return redirect('/login')
                }
                return res.statusText
            }
        }).catch(err => {
            if (err.status == 401) {
                return redirect('/login')
            }
            throw new Error(err)

        })
    return response
}
