import React, { useEffect, useState } from "react";
import { Select, Card, Collapse, Table, Spin } from "antd";
import axios from "axios";

const { Option } = Select;
const { Panel } = Collapse;

const DeptDetails = () => {
    axios.defaults.withCredentials = true;
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [loading, setLoading] = useState(false);
    const [collapseData, setCollapseData] = useState({});

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5083/api/DepartmentHead/departments"
                );
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    const handleDepartmentChange = (value) => {
        const department = departments.find((dept) => dept.id === value);
        setSelectedDept(department);
    };

    const fetchCollapseData = async (type, id) => {
        setLoading(true);
        try {
            let url = "";
            switch (type) {
                case "modules":
                    url = `http://localhost:5083/api/DepartmentHead/modules/${id}`;
                    break;
                case "staff":
                    url = `http://localhost:5083/api/DepartmentHead/staffs/${id}/true`;
                    break;
                case "instructors":
                    url = `http://localhost:5083/api/DepartmentHead/instructors/${id}/true`;
                    break;
                case "examinationStaff":
                    url = `http://localhost:5083/api/DepartmentHead/examination-staff/${id}/true`;
                    break;
                default:
                    break;
            }

            const response = await axios.get(url);
            setCollapseData((prev) => ({ ...prev, [type]: response.data }));
        } catch (error) {
            console.error(`Error fetching ${type} data:`, error);
        } finally {
            setLoading(false);
        }
    };

    const renderTable = (type) => {
        const data = collapseData[type] || [];
        const columns = {
            modules: [
                { title: "Name", dataIndex: "name", key: "name" },
                { title: "Code", dataIndex: "code", key: "code" },
                { title: "Stage", dataIndex: "stage", key: "stage" },
                { title: "Semester", dataIndex: "semester", key: "semester" },
                { title: "Degree", dataIndex: "degree", key: "degree" },
            ],
            staff: [
                { title: "Full Name", dataIndex: "fullName", key: "fullName" },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
                { title: "Gender", dataIndex: "gender", key: "gender" },
                { title: "Title", dataIndex: "scientificTitle", key: "scientificTitle" },
            ],
            instructors: [
                { title: "Full Name", dataIndex: "fullName", key: "fullName" },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Code", dataIndex: "code", key: "code" },
                { title: "Degree", dataIndex: "degree", key: "degree" },
                { title: "Title", dataIndex: "scientificTitle", key: "scientificTitle" },
            ],
            examinationStaff: [
                { title: "Full Name", dataIndex: "fullName", key: "fullName" },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Role", dataIndex: "role", key: "role" },
                { title: "Access", dataIndex: "access", key: "access" },
            ],
        };

        return <Table dataSource={data} columns={columns[type]} rowKey="id" pagination={false} />;
    };

    return (
        <div>
            <h1>Department Details</h1>
            <Select
                style={{ width: 300 }}
                placeholder="Select a department"
                onChange={handleDepartmentChange}
            >
                {departments.map((dept) => (
                    <Option key={dept.id} value={dept.id}>
                        {dept.name}
                    </Option>
                ))}
            </Select>

            {/* {selectedDept && (
                <Card title={selectedDept.name} style={{ marginTop: 20 }}>
                    <p>Kurdish Name: {selectedDept.kurdishName}</p>
                    <p>Is Morning: {selectedDept.isMorning ? "Yes" : "No"}</p>
                    <p>Degrees:</p>
                    <ul>
                        {selectedDept.degrees.map((degree, index) => (
                            <li key={index}>
                                {degree.name} ({degree.kurdishName}) - {degree.semesterDuration} semesters
                            </li>
                        ))}
                    </ul>
                </Card>
            )} */}

            {selectedDept && (
                <Collapse
                    accordion
                    style={{ marginTop: 20 }}
                    onChange={(key) => {
                        if (key.length > 0) {
                            fetchCollapseData(key[0], selectedDept.id);
                        }
                    }}
                >
                    <Panel header="Modules" key="modules">
                        {loading ? <Spin /> : renderTable("modules")}
                    </Panel>
                    <Panel header="Staff" key="staff">
                        {loading ? <Spin /> : renderTable("staff")}
                    </Panel>
                    <Panel header="Instructors" key="instructors">
                        {loading ? <Spin /> : renderTable("instructors")}
                    </Panel>
                    <Panel header="Examination Staff" key="examinationStaff">
                        {loading ? <Spin /> : renderTable("examinationStaff")}
                    </Panel>
                </Collapse>
            )}
        </div>
    );
};

export default DeptDetails;