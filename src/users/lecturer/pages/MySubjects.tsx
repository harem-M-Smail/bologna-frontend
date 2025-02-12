import axios from "axios";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";

import { message, Table } from 'antd';
import { TableColumnsType, Modal } from 'antd';
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
    const nav = useNavigate();
    // const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState(useLoaderData())
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
                message.error(error.response.data.message);
            });
    }
    const onUpdateComplainAccess = (moduleId, complainValue) => {
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
                message.error(error.response.data.message);
            });
    }
    const workloadTablecolumns: TableColumnsType<Module> = [
        { title: 'Index', width: 15, dataIndex: 'index', key: '1' },
        { title: 'Task name', width: 100, dataIndex: 'taskName', key: '2', fixed: 'left' },
        { title: 'Weight', dataIndex: 'weight', key: '3' },
        { title: 'Task count', dataIndex: 'taskCount', key: '4' }]
    const columns: TableColumnsType<Module> = [
        { title: 'Index', width: 15, dataIndex: 'index', key: '1' },
        { title: 'Module', width: 100, dataIndex: 'name', key: 'module', fixed: 'left' },
        { title: 'Code', dataIndex: 'code', key: '2' },
        { title: 'Academic Name', dataIndex: 'academicName', key: '7' },
        { title: 'Stage', dataIndex: 'stage', key: '3' },
        { title: 'Degree', dataIndex: 'degree', key: '4' },
        { title: 'Type', dataIndex: 'type', key: '5' },
        { title: 'Lecturer Type', dataIndex: 'lecturerType', key: '6' },
        { title: 'Open complain', dataIndex: 'complainAccess', key: '9', render: (text, record) => <Switch checked={record.complainAccess} onChange={() => onUpdateComplainAccess(record.moduleId, !record.complainAccess)} /> },
        { title: 'Assist.lec Access', dataIndex: 'assistantAccess', key: '10', render: (text, record) => record.assistantAccess != null ? <Switch checked={record.assistantAccess} onChange={() => onUpdateAssistantAccess(record.moduleId, !record.assistantAccess)} /> : <span>no assistant</span> },
        {
            title: 'Workload',
            dataIndex: 'workload',
            key: '8',
            render: (text, record) => <FileTextOutlined onClick={() => showModal(record.moduleId)} />,
        }
    ];

    const dataSource = (data) => {
        return data.map((module: Module) => ({ ...module, key: module.moduleId, index: data.indexOf(module) + 1 }))
    }
    const { styles } = useStyle();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [query, setQuery] = useState(new URLSearchParams(window.location.search).get('moduleId') || '');
    const [workload, setWorkload] = useState([])


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.has("moduleId")) {
            const query = searchParams.get("moduleId")

            axios.defaults.withCredentials = true;
            axios.get(`http://localhost:5083/api/Lecturer/module-weight-info/${query}`).then(res => {
                if (res.status === 200) {
                    setWorkload(res.data)
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
        }
    }, [location.search]);


    const showModal = (moduleId) => {
        nav(`?moduleId=${moduleId}`);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        nav(window.location.pathname);
        setIsModalOpen(false);
    };

    return (
        <>
            <Modal title="Basic Modal" open={isModalOpen} footer={null} onCancel={handleCancel} >
                {workload.length > 0 &&
                    <Table<Module>
                        className={styles.customTable}
                        pagination={false}
                        columns={workloadTablecolumns}
                        dataSource={workload}
                        scroll={{ x: 'max-content' }}
                    />
                }

            </Modal>
            <Table<Module>
                className={styles.customTable}
                pagination={false}
                columns={columns}
                dataSource={dataSource(data)}
                scroll={{ x: 'max-content' }}
            />
            {query}
        </>

    );
};
export default MySubjects;

import React, { useEffect, useState } from 'react';
import { Switch } from 'antd';

const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
};


export const mySubjectsLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get("http://localhost:5083/api/lecturer/modules-info")
        .then(res => {
            if (res.status === 200 || res.status === 204) {
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

const getData = async (url) => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(url).then(res => {
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
