import { Select, Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";

const StudentDegrees = () => {
    const data = useLoaderData();
    const [subject, setSubject] = useState(data[0]?.name || "");
    const [studentsDegrees, setStudentsDegrees] = useState([]);
    const [moduleWeightInfo, setModuleWeightInfo] = useState([]);
    const searchInput = useRef(null);

    const dataSource = studentsDegrees.length > 0
        ? studentsDegrees.map((student) => {
            return {
                key: Math.random(),
                name: student.fullName,
                totalDegree: student.totalDegree,
                ...student.activities
                    .map((task, i) => ({ [i]: task.degree }))
                    .reduce((acc, curr) => Object.assign(acc, curr), {}),
            };
        })
        : [];

    const moduleId = data.find((module) => module.name === subject)?.id;

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
                ...columnItem("Name", "name", "name"), fixed: "left",
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
                    i,
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

    return (
        <>
            {data.length === 0 ? (
                <p>You haven't been assigned to any module yet</p>
            ) : (
                <>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
                            scroll={{ x: 'max-content' }}

                        />
                    </div>
                </>
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