import { Select, Table, Input, Button, Space, Upload, message, Progress } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import * as XLSX from "xlsx";

const StudentDegrees = () => {
    const data = useLoaderData();
    const [subject, setSubject] = useState(data[0]?.name || "");
    const [studentsDegrees, setStudentsDegrees] = useState([]);
    const [moduleWeightInfo, setModuleWeightInfo] = useState([]);
    const [uploadedData, setUploadedData] = useState([]);
    const [progress, setProgress] = useState(0); // Progress bar state
    const [isUpdating, setIsUpdating] = useState(false); // Update state
    const searchInput = useRef(null);

    const moduleId = data.find((module) => module.name === subject)?.id;

    const dataSource = studentsDegrees.length > 0
        ? studentsDegrees.map((student) => {
            return {
                key: student.enrollmentId,
                name: student.fullName,
                totalDegree: student.totalDegree,
                ...student.activities
                    .map((task, i) => ({ [`${task.taskId}-${task.taskNumber}`]: task.instructorDegree }))
                    .reduce((acc, curr) => Object.assign(acc, curr), {}),
            };
        })
        : [];

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && clearFilters()}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : false,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const columnItem = (title, dataIndex, key) => ({ title, dataIndex, key });

    const columns = studentsDegrees.length > 0 && moduleWeightInfo.length > 0
        ? [
            {
                ...columnItem("Name", "name", "name"),
                fixed: "left",
                ...getColumnSearchProps("name"),
            },
            ...studentsDegrees[0].activities.map((task, i) =>
                columnItem(
                    <Link to={`${task.taskId.toString()}/${task.taskNumber.toString()}?module-id=${moduleId}`}>
                        {moduleWeightInfo.find((t) => t.taskId == task.taskId)?.taskName +
                            (moduleWeightInfo.find((t) => t.taskId == task.taskId)?.taskCount > 1
                                ? task.taskNumber.toString()
                                : "")}
                    </Link>,
                    `${task.taskId}-${task.taskNumber}`,
                    Math.random()
                )
            ),
            {
                title: "Total",
                dataIndex: "totalDegree",
                key: "totalDegree",
                fixed: "right",
                sorter: (a, b) => a.totalDegree - b.totalDegree,
            },
        ]
        : [];

    useEffect(() => {
        getDatas();
    }, [subject]);

    const getDatas = async () => {
        axios.defaults.withCredentials = true;
        try {
            const { data: data1 } = await axios.get(
                `http://localhost:5083/api/Lecturer/students-degrees/${moduleId}`
            );
            setStudentsDegrees(data1);

            const { data: data2 } = await axios.get(
                `http://localhost:5083/api/Lecturer/module-weight-info/${moduleId}`
            );
            setModuleWeightInfo(data2);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const exportToExcel = () => {
        const headerRow = ["Name", ...moduleWeightInfo.flatMap((task) =>
            Array.from({ length: task.taskCount }, (_, i) => `${task.taskName}${i + 1}`)
        ), "Total"];

        const dataRows = studentsDegrees.map((student) => {
            const taskDegrees = moduleWeightInfo.flatMap((task) =>
                Array.from({ length: task.taskCount }, (_, i) => {
                    const activity = student.activities.find(
                        (a) => a.taskId === task.taskId && a.taskNumber === i + 1
                    );
                    return activity ? activity.instructorDegree : 0;
                })
            );

            return [student.fullName, ...taskDegrees, student.totalDegree];
        });

        const worksheetData = [headerRow, ...dataRows];
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Student Degrees");
        XLSX.writeFile(workbook, "StudentDegrees.xlsx");
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            setUploadedData(jsonData);
            message.success("File uploaded successfully!");
        };

        reader.readAsArrayBuffer(file);
    };

    const updateDegrees = async () => {
        setIsUpdating(true);
        setProgress(0);

        const groupedData = moduleWeightInfo.flatMap((task) =>
            Array.from({ length: task.taskCount }, (_, i) => {
                const taskKey = `${task.taskName}${i + 1}`;
                const studentsDegree = uploadedData.map((student) => ({
                    enrollmentId: studentsDegrees.find((s) => s.fullName === student.Name)?.enrollmentId,
                    instructorDegree: student[taskKey] || 0,
                }));

                return {
                    taskId: task.taskId,
                    taskNumber: i + 1,
                    instructorWeight: task.weight,
                    studentsDegree: studentsDegree.filter((s) => s.enrollmentId !== undefined),
                };
            })
        );

        const totalTasks = groupedData.length;
        let completedTasks = 0;

        for (const taskData of groupedData) {
            if (taskData.studentsDegree.length > 0) {
                try {
                    await axios.patch(
                        `http://localhost:5083/api/Lecturer/update-degrees/${moduleId}`,
                        taskData
                    );
                } catch (error) {
                    message.error(`Failed to update task: ${taskData.taskId}, number: ${taskData.taskNumber}`);
                    console.log("data", taskData);
                }
            }

            completedTasks++;
            setProgress(Math.round((completedTasks / totalTasks) * 100));
        }

        setIsUpdating(false);
        message.success("All tasks updated successfully!");
    };

    return (
        <>
            {data.length === 0 ? (
                <p>You haven't been assigned to any module yet</p>
            ) : (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <div>
                        <Button onClick={exportToExcel}>Export to Excel</Button>
                        <Upload
                            accept=".xlsx, .xls"
                            showUploadList={false}
                            beforeUpload={(file) => {
                                handleFileUpload({ target: { files: [file] } });
                                return false;
                            }}
                        >
                            <Button icon={<UploadOutlined />}>Upload Excel</Button>
                        </Upload>
                        <Button onClick={updateDegrees} disabled={uploadedData.length === 0 || isUpdating}>
                            Update Degrees
                        </Button>
                        {isUpdating && (
                            <Progress percent={progress} status={progress < 100 ? "active" : "success"} />
                        )}
                    </div>

                    <Select
                        defaultValue={subject}
                        style={{ width: 200, margin: "1rem" }}
                        onChange={(value) => {
                            setSubject(value);
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
                        scroll={{ x: "max-content" }}
                    />
                </div>
            )}
        </>
    );
};

export default StudentDegrees;

export const studentGradesLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios
        .get("http://localhost:5083/api/Lecturer/modules")
        .then((res) => {
            if (res.status === 200) {
                return res.data;
            } else {
                if (res.status === 401) {
                    return redirect("/login");
                }
                return res.statusText;
            }
        })
        .catch((err) => {
            if (err.status === 401) {
                return redirect("/login");
            }
            throw new Error(err);
        });
    return response;
};