import { Progress, Select, Table } from "antd";
import { redirect, useLoaderData } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Flex } from 'antd';
import type { ProgressProps } from 'antd';
// Define Columns
const columns = [
    {
        title: "Task Name",
        dataIndex: "taskName",
        key: "taskName",
        render: (text, record) => ({
            props: {
                style: {
                    backgroundColor: record.isTotal ? "#F3F4FD" : "transparent",
                },
            },
            children: text,
        }),
    },
    {
        title: "Degree",
        dataIndex: "degree",
        key: "degree",
    },
    {
        title: "Instructor Degree",
        dataIndex: "instructorDegree",
        key: "instructorDegree",
        render: (text, record) => (record.isTotal ? null : text), // Hide in total rows
    },
];

// Modules Degree Page Component
const ModulesDegreePage = () => {
    const data = useLoaderData(); // Load the data
    const [subject, setSubject] = useState(data[0]?.name || ""); // Set initial subject

    // Transform Data with Totals
    const transformedData = [];
    const selectedSubject = data.find((item) => item.name === subject);
    if (selectedSubject) {
        selectedSubject.activities.forEach((activity) => {
            let totalDegree = 0;

            activity.tasks.forEach((task, index) => {
                totalDegree += task.degree;

                transformedData.push({
                    key: `${activity.taskName}-${index}`,
                    taskName: activity.taskName,
                    degree: `${task.degree} / ${activity.weight}`,
                    instructorDegree: `${task.instructorDegree} / ${task.instructorWeight}`,
                });
            });

            // Add Average Row only if there are multiple tasks
            if (activity.tasks.length > 1) {
                const averageDegree = (totalDegree / activity.tasks.length).toFixed(2); // Average
                transformedData.push({
                    key: `average-${activity.taskName}`,
                    taskName: activity.taskName, // Keep the original task name
                    degree: `${averageDegree} / ${activity.weight}`,
                    isTotal: true, // Flag to identify total rows
                });
            }
        });

        // Add Final Row for Overall Total
        transformedData.push({
            key: "final-total",
            taskName: "Total",
            degree: selectedSubject.totalDegree,
            isTotal: true,
        });
    }
    const twoColors: ProgressProps['strokeColor'] = {
        '0%': 'green',
        '100%': 'red',
    };

    return (
        <>
            {data.length == 0 ? <p>you are not enrolled in any subject</p> :
                <>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <Select
                            defaultValue={subject}
                            style={{ width: 200 }}
                            onChange={(value) => setSubject(value)}
                            options={data.map((subject) => ({
                                value: subject.name,
                                label: subject.name,
                            }))}
                        />
                    </div>
                    <Flex direction="column" align="center" style={{ marginBottom: "20px" }}>
                        <Progress
                            percent={(selectedSubject.totalAbsentHour / selectedSubject.absentLimit) * 100}
                            strokeColor={selectedSubject.totalAbsentHour < selectedSubject.absentLimit / 2 ? 'green' : 'red'}
                            format={() => `${selectedSubject.totalAbsentHour} / ${selectedSubject.absentLimit} absent hours`}
                            size={[300, 15]}
                        />
                    </Flex>
                    <Table
                        columns={columns}
                        dataSource={transformedData}
                        pagination={false}
                        style={{ border: "1px solid #f0f0f0", borderRadius: "8px" }}
                    />
                </>
            }
        </>
    );
};

export default ModulesDegreePage;

export const ModulesDegreeLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/Student/modules-degree"
    ).then(res => {
        if (res.status === 200) {
            return res.data
        } else {
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



