import React from 'react';
import { Table, ConfigProvider, Flex, Typography } from 'antd';
import type { TableProps } from 'antd';
const { Text } = Typography;


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
        render: (text) => (
            <Text style={{ color: text === 'F' ? 'red' : 'inherit' }}>{text}</Text>
        ),
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
                    footer={() => <Flex justify='space-between'><span>{`Result: ${result.totalCredits != null ? `Passed` : 'Failed'}`}</span><span>{result.averageDegree && `Credit: ${result.totalCredits}/30`}</span></Flex>} />
            </ConfigProvider>

        </>
    )
}

export default ResultTable;