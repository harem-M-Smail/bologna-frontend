import React from 'react';
import { Table, ConfigProvider } from 'antd';
import type { TableProps } from 'antd';


const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Subject',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mark',
        dataIndex: 'degreeLevel',
        key: 'key',
    },
];
const ResultTable: React.FC = ({ result }) => {
    const modulesFinalDegrees = result.modulesFinalDegrees.map((item, index) => ({ ...item, key: index }))
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgContainer: '#F6F4F0',
                    },
                }}

            >

                <Table<DataType> columns={columns}
                    style={{ width: '30rem' }}
                    dataSource={modulesFinalDegrees}
                    pagination={false}
                    title={() => `semester: ${result.semester}`}
                    footer={() => `Result: ${result.totalCredits != null ? 'Passed' : 'Failed'}`} />
            </ConfigProvider>

        </>
    )
}

export default ResultTable;