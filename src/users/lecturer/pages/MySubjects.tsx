import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";

import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { createStyles } from 'antd-style';
import Icon, { FileTextOutlined } from '@ant-design/icons';
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
    const data = useLoaderData()
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
