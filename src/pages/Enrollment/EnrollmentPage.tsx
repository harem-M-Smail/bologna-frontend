import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import { Flex, message, Row, Statistic } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import { useState } from "react";
const { Column } = Table;

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

interface Module {
    key: React.Key;
    name: string;
    code: string;
    credits: number;
    fullName: string;
    trialAttempt: string;
    moduleId: string;
}


const EnrollmentPage: React.FC = () => {
    const { inrolled, notInrolled } = useLoaderData()
    const [inrolledModules, setInrolled] = useState(inrolled)
    const [notInrolledModules, setNOtInrolled] = useState(notInrolled.modulesToEnroll)
    const [messageApi, contextHolder] = message.useMessage();
    const handleEnroll = async (moduleId) => {
        axios.post("http://localhost:5083/api/Student/enroll-module/" + moduleId).then(data => {
            message.success('module inrolled')
            // Update state
            setNOtInrolled((prev) =>
                prev.filter((module) => module.moduleId !== moduleId)
            );
            setInrolled((prev) => [
                ...prev,
                notInrolledModules.find((module) => module.moduleId === moduleId),
            ]);

        }).catch(err => {
            message.error('something went wrong')
        })
    }
    const handleWithdrawModule = async (moduleId) => {
        axios.delete("http://localhost:5083/api/Student/withdraw-module/" + moduleId).then(data => {
            message.success('module withdrawed')
            // Update state
            setInrolled((prev) =>
                prev.filter((module) => module.moduleId !== moduleId)
            );
            setNOtInrolled((prev) => [
                ...prev,
                inrolledModules.find((module) => module.moduleId === moduleId),
            ]);
        }).catch(err => {
            message.error('something went wrong')
        })
    }
    const columns: TableColumnsType<Module> = (actionName, action, color) => {
        return [
            { title: 'Module', width: 100, dataIndex: 'name', key: 'module', fixed: 'left' },
            { title: 'Code', dataIndex: 'code', key: '1' },
            { title: 'Instructor', dataIndex: 'fullName', key: '2' },
            { title: 'Credits', dataIndex: 'credits', key: '3' },
            { title: 'trial attempt', dataIndex: 'trialAttempt', key: '4' },
            {
                title: 'Register', key: 'operation', fixed: 'right', width: 100,
                render: (value: any) => <Button onClick={() => action(value.key)}>{actionName}</Button>
            },
        ];
    }
    const dataSource = (data) => {
        return data.map((module: Module) => ({ ...module, key: module.moduleId }))
    }
    const { styles } = useStyle();
    return (
        <>
            {contextHolder}
            <Flex justify="right">
                <Row gutter={16}>
                    <Statistic title="Modules registeraton deadline" value={`${notInrolled.from} to ${notInrolled.to}`} prefix={<FieldTimeOutlined />} />
                </Row>
            </Flex>
            <h2>enrolled subjects: </h2>
            <Table<Module>

                className={styles.customTable}
                pagination={false}
                columns={columns('withdraw', handleWithdrawModule, '#D91656')}
                dataSource={dataSource(inrolledModules)}
                scroll={{ x: 'max-content' }}
            >
                <Column title="Age" dataIndex="age" key="age" />

            </Table>
            <h2>not enrolled subjects: </h2>
            <Table<Module>
                className={styles.customTable}
                columns={columns('enroll', handleEnroll, '#C6E7FF')}
                pagination={false}
                dataSource={dataSource(notInrolledModules)}
                scroll={{ x: 'max-content' }}
            />
        </>

    );
};
export default EnrollmentPage;

export const enrollmentPageLoader = async () => {
    axios.defaults.withCredentials = true;

    const endpoints = [

        "http://localhost:5083/api/Student/modules-enrollment",
        "http://localhost:5083/api/Student/enrolled-modules",
        //  // Replace with the second endpoint
    ];

    try {
        const responses = await Promise.all(
            endpoints.map(endpoint => axios.get(endpoint))
        );

        // Check for unauthorized status in responses
        for (const res of responses) {
            if (res.status === 401) {
                return redirect('/login');
            }
        }

        // If all requests are successful, return the data
        const [notInrolled, inrolled] = responses.map(res => res.data);
        return { inrolled, notInrolled }
    } catch (err) {
        if (err.response && err.response.status === 401) {
            return redirect('/login');
        }
        throw new Error(err.message);
    }
};