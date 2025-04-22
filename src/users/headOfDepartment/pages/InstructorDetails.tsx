import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Descriptions, Table, Spin, Typography } from "antd";
import { useLocation, redirect } from "react-router-dom";

const { Title } = Typography;

const InstructorDetails = () => {
    const [instructorData, setInstructorData] = useState(null);
    const location = useLocation();

    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(location.search);
    const departmentId = queryParams.get("departmentId");
    const isMorning = queryParams.get("isMorning");
    const lecturerId = queryParams.get("lecturerId");

    useEffect(() => {
        const fetchData = async () => {
            axios.defaults.withCredentials = true;
            try {
                const response = await axios.get(
                    `http://localhost:5083/api/DepartmentHead/instructor/${departmentId}/${isMorning}/${lecturerId}`
                );
                if (response.status === 200) {
                    setInstructorData(response.data);
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
    }, [departmentId, isMorning, lecturerId]);

    if (!instructorData) {
        return <Spin style={{ display: "block", margin: "50px auto" }} />;
    }

    // Define columns for the modules table
    const columns = [
        {
            title: "Module Name",
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <div style={{ backgroundColor: "#e6f7ff", padding: "5px", borderRadius: "4px" }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Semester",
            dataIndex: "semester",
            key: "semester",
            render: (text) => (
                <div style={{ backgroundColor: "#f6ffed", padding: "5px", borderRadius: "4px" }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Degree",
            dataIndex: "degree",
            key: "degree",
            render: (text) => (
                <div style={{ backgroundColor: "#fffbe6", padding: "5px", borderRadius: "4px" }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (text) => (
                <div style={{ backgroundColor: "#fff1f0", padding: "5px", borderRadius: "4px" }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Credits",
            dataIndex: "credits",
            key: "credits",
            render: (text) => (
                <div style={{ backgroundColor: "#e6f7ff", padding: "5px", borderRadius: "4px" }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Lecturer Type",
            dataIndex: "lecturerType",
            key: "lecturerType",
            render: (text) => (
                <div style={{ backgroundColor: "#f9f0ff", padding: "5px", borderRadius: "4px" }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Enrollment Count",
            dataIndex: "enrollmentCount",
            key: "enrollmentCount",
            render: (text) => (
                <div style={{ backgroundColor: "#f6ffed", padding: "5px", borderRadius: "4px" }}>
                    {text}
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            {/* Instructor Basic Information */}
            <Card
                bordered={false}
                style={{
                    marginBottom: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={3} style={{ textAlign: "center" }}>
                    Instructor Information
                </Title>
                <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2, md: 3 }}
                    labelStyle={{ fontWeight: "bold" }}
                >
                    <Descriptions.Item label="Full Name">{instructorData.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Full Name (Kurdish)">
                        {instructorData.fullNameKurdish}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">{instructorData.email}</Descriptions.Item>
                    <Descriptions.Item label="Code">{instructorData.code}</Descriptions.Item>
                    <Descriptions.Item label="Phone Number">
                        {instructorData.phoneNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Gender">{instructorData.gender}</Descriptions.Item>
                    <Descriptions.Item label="Scientific Title">
                        {instructorData.scientificTitle}
                    </Descriptions.Item>
                    <Descriptions.Item label="Degree">{instructorData.degree}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Modules */}
            <Card
                bordered={false}
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={4} style={{ marginBottom: "20px" }}>
                    Modules
                </Title>
                <Table
                    dataSource={instructorData.modules}
                    columns={columns}
                    rowKey="name"
                    pagination={false}
                    bordered
                />
            </Card>
        </div>
    );
};

export default InstructorDetails;