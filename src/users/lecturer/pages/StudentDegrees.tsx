import { Select, Table } from "antd";
import { keyframes } from "antd-style";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";


const StudentDegrees = () => {
    const data = useLoaderData();
    const [subject, setSubject] = useState(data[0]?.name || "");
    const [studentsDegrees, setStudentsDegrees] = useState([]);
    const [moduleWeightInfo, setModuleWeightInfo] = useState([]);
    const dataSource = studentsDegrees.length > 0 ?
        studentsDegrees.map(student => {
            return {
                key: Math.random(),
                name: student.fullName,
                totalDegree: student.totalDegree,
                ...student.activities.map((task, i) => ({ [i]: task.degree })).reduce((acc, curr) => Object.assign(acc, curr), {})
            }
        })
        : [];
    const moduleId = data.find((module) => module.name === subject)?.id
    const columnItem = (title, dataIndex, key) => ({ title, dataIndex, key });
    const columns = studentsDegrees.length > 0 && moduleWeightInfo.length > 0 ? [
        columnItem("Name", "name", "name"),
        ...studentsDegrees[0].activities.map((task, i) => columnItem(
            // generating title for each task
            <Link to={`${task.taskId.toString()}/${task.taskNumber.toString()}?module-id=${moduleId}`}>
                {
                    moduleWeightInfo.find(t => t.taskId == task.taskId)?.taskName
                    + (moduleWeightInfo.find(t => t.taskId == task.taskId)?.taskCount > 1 ? task.taskNumber.toString() : "")

                }
            </Link>
            ,
            // other arguments
            i,
            Math.random()
            // adding link to the task

        ))
        , {
            title: "Total",
            dataIndex: "totalDegree",
            key: "totalDegree",
        }
    ] : [];

    useEffect(() => {
        getDatas()
    }, [subject])
    const getDatas = async () => {
        axios.defaults.withCredentials = true;
        try {
            const { data: data1 } = await axios.get(`http://localhost:5083/api/Lecturer/students-degrees/${moduleId}`);
            setStudentsDegrees(data1);

            const { data: data2 } = await axios.get(`http://localhost:5083/api/Lecturer/module-weight-info/${moduleId}`);
            setModuleWeightInfo(data2);
        } catch (error) {
            throw new Error(error.message);
        }
    }
    return (
        <>
            {data.length == 0 ? <p>you haven't assigned to any module yet</p> :
                <>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <Select
                            defaultValue={subject}
                            style={{ width: 200 }}
                            onChange={(value) => {
                                setSubject(value)
                            }}
                            options={data.map((subject) => ({
                                value: subject.name,
                                label: subject.name,
                            }))}
                        />
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                        />
                    </div>
                </>
            }
        </>
    )
}

export default StudentDegrees;

export const studentGradesLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/Lecturer/modules"
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