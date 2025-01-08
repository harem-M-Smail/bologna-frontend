import { Select, Table } from 'antd';
import { redirect, useLoaderData } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

// const data = useLoaderData()
// console.log(data)
// Example Data
const activities = [

];

// Transform Data
const transformedData = activities.flatMap((activity, activityIndex) =>
    activity.tasks.map((task, taskIndex) => ({
        key: `${activityIndex}-${taskIndex}`,
        taskName: activity.taskName,
        weight: activity.weight,
        taskNumber: task.taskNumber,
        degree: task.degree,
        instructorDegree: task.instructorDegree,
        instructorWeight: task.instructorWeight,
    }))
);

// Define Columns
const columns = [
    {
        title: "Task Name",
        dataIndex: "taskName",
        key: "taskName",
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
    }
];

// Subject Colors
const subjectColors = {
    Quiz: "#ffffff",
    Homework: "#e6f7ff",
    Report: "#e6f7ff",
    Midterm_Theory: "#e6f7ff",
    Class_Activity: "#e6f7ff",

};

// Ant Design Table
const ModulesDegreePage = () => {
    const data = useLoaderData()
    const [subject, setSubject] = useState(data[0].name)
    console.log(subject)
    return (
        <>
            <div className="center-items">
                <Select
                    defaultValue={subject}
                    style={{ width: 120 }}
                    onChange={() => 0}
                    options={
                        data.map(subject => {
                            return {
                                value: subject.name,
                                label: subject.name
                            }
                        })
                    }
                />
            </div>
            <Table
                columns={columns}
                dataSource={transformedData}
                rowClassName={(record) => {
                    // Apply color based on task name
                    return subjectColors[record.taskName]
                        ? `row-color-${record.taskName}`
                        : "";
                }}
                pagination={false}
            />
        </>

    );
};

// Custom CSS for Row Colors
const style = document.createElement("style");
style.innerHTML = `
  .row-color-Homework {
    background-color: #e6f7ff;
  }
  .row-color-Report {
    background-color: #f6ffed;
  }
    .row-color-Midterm_Theory {
    background-color:rgb(255, 230, 238);
  }
    .row-color-Quiz {
    background-color:rgb(230, 255, 233);;
  }
    .row-color-Class_Activity {
    background-color:rgb(230, 255, 250);
  }
`;
document.head.appendChild(style);

export default ModulesDegreePage;
export const ModulesDegreeLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/Student/modules-degree"

    ).then(res => {
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
