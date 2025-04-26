import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Select, Descriptions, Table, Spin, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departmentDetails, setDepartmentDetails] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStage, setSelectedStage] = useState(1);
    const [loading, setLoading] = useState(false);

    // Fetch the list of departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get("http://localhost:5083/api/Accountant/departments");
                if (response.status === 200) {
                    setDepartments(response.data);
                    setSelectedDepartment(response.data[0]); // Select the first department by default
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, []);

    // Fetch department details and students when the selected department or stage changes
    useEffect(() => {
        if (!selectedDepartment) return;

        const fetchDepartmentDetails = async () => {
            try {
                const response = await axios.get("http://localhost:5083/api/Accountant/departments-info");
                if (response.status === 200) {
                    const details = response.data.find((d) => d.id === selectedDepartment.id);
                    setDepartmentDetails(details);
                }
            } catch (err) {
                console.error(err);
            }
        };

        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:5083/api/Accountant/parallel-students/${selectedDepartment.id}/${selectedStage}`
                );
                if (response.status === 200) {
                    setStudents(response.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartmentDetails();
        fetchStudents();
    }, [selectedDepartment, selectedStage]);

    // Define columns for the students table
    const studentColumns = [
        {
            title: "Full Name",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Stage",
            dataIndex: "stage",
            key: "stage",
        },
    ];

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <Card
                bordered={false}
                style={{
                    marginBottom: "20px",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                    Departments
                </Title>
                <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                    {/* Department Select */}
                    <Select
                        style={{ width: "300px" }}
                        value={selectedDepartment?.id}
                        onChange={(value) => {
                            const department = departments.find((d) => d.id === value);
                            setSelectedDepartment(department);
                        }}
                    >
                        {departments.map((department) => (
                            <Option key={department.id} value={department.id}>
                                {department.name} ({department.kurdishName})
                            </Option>
                        ))}
                    </Select>

                    {/* Stage Select */}
                    <Select
                        style={{ width: "150px" }}
                        value={selectedStage}
                        onChange={(value) => setSelectedStage(value)}
                    >
                        {[1, 2, 3, 4].map((stage) => (
                            <Option key={stage} value={stage}>
                                Stage {stage}
                            </Option>
                        ))}
                    </Select>
                </div>

                {/* Department Details */}
                {departmentDetails && (
                    <Descriptions
                        bordered
                        column={{ xs: 1, sm: 2, md: 3 }}
                        labelStyle={{ fontWeight: "bold" }}
                        contentStyle={{ color: "#333" }}
                    >
                        <Descriptions.Item label="Name">{departmentDetails.name}</Descriptions.Item>
                        <Descriptions.Item label="Kurdish Name">
                            {departmentDetails.kurdishName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Code">{departmentDetails.code}</Descriptions.Item>
                        <Descriptions.Item label="Is Morning">
                            {departmentDetails.isMorning ? "Yes" : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Is Evening">
                            {departmentDetails.isEvening ? "Yes" : "No"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Year">{departmentDetails.year}</Descriptions.Item>
                        <Descriptions.Item label="Modules">
                            {departmentDetails.summary.modules}
                        </Descriptions.Item>
                        <Descriptions.Item label="Male Lecturers">
                            {departmentDetails.summary.maleLecturers}
                        </Descriptions.Item>
                        <Descriptions.Item label="Female Lecturers">
                            {departmentDetails.summary.femaleLecturers}
                        </Descriptions.Item>
                        <Descriptions.Item label="Male Students">
                            {departmentDetails.summary.maleStudents}
                        </Descriptions.Item>
                        <Descriptions.Item label="Female Students">
                            {departmentDetails.summary.femaleStudents}
                        </Descriptions.Item>
                        <Descriptions.Item label="Archived Students">
                            {departmentDetails.summary.archivedStudents}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Card>

            {/* Students Table */}
            <Card
                bordered={false}
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={4} style={{ marginBottom: "20px" }}>
                    Students
                </Title>
                {loading ? (
                    <Spin style={{ display: "block", margin: "50px auto" }} />
                ) : (
                    <Table
                        dataSource={students}
                        columns={studentColumns}
                        rowKey="id"
                        pagination={false}
                        bordered
                    />
                )}
            </Card>
        </div>
    );
};

export default Departments;