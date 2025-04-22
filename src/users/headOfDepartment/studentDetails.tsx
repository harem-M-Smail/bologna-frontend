import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Descriptions, Table, Spin, Typography } from "antd";
import { useLocation, redirect } from "react-router-dom";
const { Title } = Typography;

const StudentDetails = () => {
    const [studentData, setStudentData] = useState(null);
    const location = useLocation();

    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const studentId = queryParams.get("student_id");

    useEffect(() => {
        const fetchData = async () => {
            axios.defaults.withCredentials = true;
            try {
                const response = await axios.get(
                    `http://localhost:5083/api/DepartmentHead/student/${studentId}`
                );
                if (response.status === 200) {
                    setStudentData(response.data);
                } else if (response.status === 401 || response.status === 403) {
                    redirect("/login");
                } else {
                    throw new Error(response.statusText);
                }
            } catch (err) {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    redirect("/login");
                } else {
                    console.error(err);
                }
            }
        };
        fetchData();
    }, [studentId]);

    if (!studentData) {
        return <Spin style={{ display: "block", margin: "50px auto" }} />;
    }

    // Define columns for the enrollments table
    const columns = [
        {
            title: "Course Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <span style={{ fontWeight: "bold", color: "#1890ff" }}>{text}</span>,
        },
        {
            title: "Total Degree",
            dataIndex: "totalDegree",
            key: "totalDegree",
            render: (text) => (
                <span style={{ color: text > 50 ? "#52c41a" : "#ff4d4f" }}>{text}</span>
            ),
        },
        {
            title: "Total Absent Hours",
            dataIndex: "totalAbsentHour",
            key: "totalAbsentHour",
            render: (text) => (
                <span style={{ color: text > 0 ? "#faad14" : "#52c41a" }}>{text}</span>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Card
                bordered={false}
                style={{
                    marginBottom: "20px",
                    backgroundColor: "#f0f8ff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={3} style={{ color: "#1890ff", textAlign: "center" }}>
                    Student Information
                </Title>
                <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3 }}
                    labelStyle={{ fontWeight: "bold", color: "#555" }}
                    contentStyle={{ color: "#333" }}
                >
                    <Descriptions.Item label="Full Name">{studentData.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Full Name (Kurdish)">
                        {studentData.fullNameKurdish}
                    </Descriptions.Item>
                    <Descriptions.Item label="Degree">{studentData.degree}</Descriptions.Item>
                    <Descriptions.Item label="Student Code">{studentData.code}</Descriptions.Item>
                    <Descriptions.Item label="Birthday">{studentData.birthday}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{studentData.gender}</Descriptions.Item>
                    <Descriptions.Item label="Current Semester">
                        {studentData.currentSemester}
                    </Descriptions.Item>
                    <Descriptions.Item label="Theory Group">{studentData.theoryGroup}</Descriptions.Item>
                    <Descriptions.Item label="Practical Group">
                        {studentData.practicalGroup}
                    </Descriptions.Item>
                    <Descriptions.Item label="Year">{studentData.year}</Descriptions.Item>
                    <Descriptions.Item label="Is Morning">
                        {studentData.isMorning ? "Yes" : "No"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Is Parallel">
                        {studentData.isParallel ? "Yes" : "No"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Enrollments */}
            <Card
                bordered={false}
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={4} style={{ color: "#1890ff", marginBottom: "20px" }}>
                    Enrollments
                </Title>
                <Table
                    dataSource={studentData.enrollments}
                    columns={columns}
                    rowKey="name"
                    pagination={false}
                    bordered
                    style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}
                />
            </Card>
        </div>
    );
};

export default StudentDetails;