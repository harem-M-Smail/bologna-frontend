import { Modal, Select, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, redirect, useLoaderData, useNavigate, } from "react-router-dom";
import { useParams } from "react-router-dom";
import Input from "antd/es/input/Input";

const StudentDegrees = () => {
    const data = useLoaderData();
    const [subject, setSubject] = useState(data[0]?.name || "");
    const [studentsDegrees, setStudentsDegrees] = useState([]);
    const [moduleWeightInfo, setModuleWeightInfo] = useState([]);

    const dataSource = studentsDegrees.length > 0 ?
        studentsDegrees.map(student => {
            return {
                key: "name",
                name: student.fullName,
                ...student.activities.map((task, i) => ({ [i]: task.degree })).reduce((acc, curr) => Object.assign(acc, curr), {})
            }
        })
        : [];

    const columnItem = (title, dataIndex, key) => ({ title, dataIndex, key });
    const columns = studentsDegrees.length > 0 && moduleWeightInfo.length > 0 ? [
        columnItem("Name", "name", "name"),
        ...studentsDegrees[0].activities.map((task, i) => columnItem(
            // generating title for each task
            <Link to={`${task.taskId.toString()}/${task.taskNumber.toString()}`}>
                {
                    moduleWeightInfo.find(t => t.taskId == task.taskId)?.taskName
                    + (moduleWeightInfo.find(t => t.taskId == task.taskId)?.taskCount > 1 ? task.taskNumber.toString() : "")

                }
            </Link>
            ,
            // other arguments
            i,
            Math.random()
        ))
    ] : [];
    const moduleId = data.find((module) => module.name === subject)?.id
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

    // logic for the modal component
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { taskId, taskNumber } = useParams();
    useEffect(() => {
        if (taskId && taskNumber) {
            setIsModalOpen(true);
        }
        setStudentsDegree(studentsDegrees.map(student => ({ enrollmentId: student.enrollmentId, instructorDegree: student.activities.filter(a => a.taskId == taskId && a.taskNumber == taskNumber)[0]?.instructorDegree })))
    }, [taskId, taskNumber]);
    const nav = useNavigate();
    const handleCancel = () => {
        nav('/lecturer/student-degrees');
        setIsModalOpen(false);
    }

    const UpgradeDegreesColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "new degree",
            dataIndex: "newDegree",
            key: "newDegree",

            render: (text, record) => <Input value={record.taskNumber} />

        }
    ];
    const [instructorWeight, setInstructorWeight] = useState(100)
    const [studentsDegree, setStudentsDegree] = useState([])
    console.log(studentsDegree)
    const submitionData = {
        taskId: taskId,
        taskNumber: taskNumber,
        instructorWeight: instructorWeight,
        studentsDegree: studentsDegree
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
                        <Modal
                            title="Update degrees"
                            open={isModalOpen}
                            footer={null}
                            onCancel={handleCancel}>
                            <Table
                                dataSource={dataSource}
                                columns={UpgradeDegreesColumns}
                                pagination={false}
                            />

                        </Modal>
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