import { Button, InputNumber, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { redirect, useLocation } from "react-router-dom";

const UpgradeDegrees = () => {

    // Get the URL parameters
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const moduleId = queryParams.get("module-id");
    const taskId = location.pathname.split("/").slice(-2, -1)[0];
    const taskNumber = location.pathname.split("/").pop();
    const getData = async (moduleId) => {
        try {
            axios.defaults.withCredentials = true;

            const studentData = await axios
                .get(`http://localhost:5083/api/Lecturer/students-degrees/${moduleId}`)
                .then((res) => {
                    if (res.status === 200) {
                        return res.data;
                    } else {
                        if (res.status === 401) {
                            return redirect("/login");
                        }
                        return res.data;
                    }
                })
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        return redirect("/login");
                    }
                    throw new Error(err);
                });

            const taskWeightdata = await axios
                .get(`http://localhost:5083/api/Lecturer/module-weight-info/${moduleId}`)
                .then((res) => {
                    if (res.status === 200) {
                        return res.data;
                    } else {
                        if (res.status === 401) {
                            return redirect("/login");
                        }
                        return res.data;
                    }
                })
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        return redirect("/login");
                    }
                    throw new Error(err);
                });

            return { studentData, taskWeightdata };
        } catch (e) {
            throw new Error(e);
        }
    };

    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const { studentData, taskWeightdata } = await getData(moduleId);
            setDataSource(
                studentData.map((student) => {
                    return {
                        name: student.fullName,
                        currentDegree: student.activities.find(task => task.taskId.toString() == taskId && task.taskNumber == taskNumber).degree,
                        instructorDegree: Number(student.activities.find(task => task.taskId == taskId.toString() && task.taskNumber == taskNumber).instructorDegree),
                        instructorWeight: Number(student.activities.find(task => task.taskId == taskId.toString() && task.taskNumber == taskNumber).instructorWeight),
                        key: Math.random(),
                        enrollmentId: student.enrollmentId,
                    }
                })
            )
            setInstructorWeight(studentData[0].activities.find(task => task.taskId.toString() == taskId && task.taskNumber == taskNumber).instructorWeight)
            console.log(studentData[0].activities.find(task => task.taskId.toString() == taskId && task.taskNumber == taskNumber).instructorWeight)
        };
        if (moduleId) {
            fetchData();
        }
    }, [moduleId]);
    const [instructorWeight, setInstructorWeight] = useState(100);
    const column = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "task",
            dataIndex: "currentDegree",
            key: "currentDegree",
        },
        {
            title: <><span>new Degree on: </span><InputNumber value={instructorWeight} onChange={e => setInstructorWeight(e)} /></>,
            dataIndex: "instructorDegree",
            key: "instructorDegree",
            render: (text, record) => (
                <InputNumber
                    value={record.instructorDegree}
                    onChange={(e) => {
                        setDataSource((prevDataSource) =>
                            prevDataSource.map((item) =>
                                item.key === record.key
                                    ? { ...item, instructorDegree: e }
                                    : item
                            )
                        );
                    }}
                />
            )
        }
    ];
    const onsubmit = async () => {
        try {
            let submitionData = {
                "taskId": taskId,
                "taskNumber": taskNumber,
                "instructorWeight": instructorWeight,
                "studentsDegree": dataSource.map((student) => {
                    return {
                        "enrollmentId": student.enrollmentId,
                        "instructorDegree": student.instructorDegree
                    }
                })
            }
            axios.defaults.withCredentials = true;
            await axios.patch(`http://localhost:5083/api/Lecturer/update-degrees/${moduleId}`,
                submitionData
            ).then((res) => {
                if (res.status === 200) {
                    alert("upgraded successfully");
                } else {
                    if (res.status === 401) {
                        return redirect("/login");
                    }
                    return res.data;
                }
            });
        } catch (e) {
            alert(e);
        }
    };
    return <div>
        <div className="submition-button-container">
            <Button
                className="degree-submit-button"
                onClick={onsubmit}
            >Update</Button>
        </div>
        {
            dataSource.length > 0 &&
            <Table dataSource={dataSource} columns={column} pagination={false} />
        }
    </div>;
};

export default UpgradeDegrees;