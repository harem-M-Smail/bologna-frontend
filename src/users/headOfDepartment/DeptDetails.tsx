import { useEffect, useState } from "react";
import { Select, Collapse, Table, Spin, Input, Button } from "antd";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

const { Option } = Select;
const { Panel } = Collapse;

const DeptDetails = () => {
    const nav = useNavigate()
    axios.defaults.withCredentials = true;
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState(null);
    const [isMorning, setIsMorning] = useState(true); // Default to "Morning"
    const [semester, setSemester] = useState(1); // Default to "1"
    const [degree, setDegree] = useState("Bachelor"); // Default to "Bachelor"
    const [loading, setLoading] = useState(false);
    const [collapseData, setCollapseData] = useState({});
    const [activeKey, setActiveKey] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5083/api/DepartmentHead/departments"
                );
                if (response.status == 401) {
                    redirect('/login')
                }
                setDepartments(response.data);
                setSelectedDept(response.data[0]);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        console.log('useeffected fired ')
        if (activeKey.includes("students") && selectedDept) {
            fetchCollapseData("students", selectedDept.id);
        }
    }, [semester, degree, activeKey, selectedDept]);

    const handleDepartmentChange = (value) => {
        handleCloseAll();
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
                    url = `http://localhost:5083/api/DepartmentHead/staffs/${id}/${isMorning}`;
                    break;
                case "instructors":
                    url = `http://localhost:5083/api/DepartmentHead/instructors/${id}/${isMorning}`;
                    break;
                case "examinationStaff":
                    url = `http://localhost:5083/api/DepartmentHead/examination-staff/${id}/${isMorning}`;
                    break;
                case "students":
                    url = `http://localhost:5083/api/DepartmentHead/students/${id}/${isMorning}/${semester}/${degree}`;
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

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Button
                    type="primary"
                    onClick={() => confirm()}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
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
            </div>
        ),
        filterIcon: (filtered) => (
            <span role="img" aria-label="search">
                🔍
            </span>
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : "",
    });

    const renderTable = (type) => {
        const data = collapseData[type] || [];
        const columns = {
            modules: [
                { title: "Name", dataIndex: "name", key: "name", fixed: "left", ...getColumnSearchProps("name") },
                { title: "Code", dataIndex: "code", key: "code" },
                { title: "Stage", dataIndex: "stage", key: "stage" },
                { title: "Semester", dataIndex: "semester", key: "semester" },
                { title: "Degree", dataIndex: "degree", key: "degree" },
            ],
            staff: [
                {
                    title: "Full Name",
                    dataIndex: "fullName",
                    key: "fullName",
                    fixed: "left",
                    ...getColumnSearchProps("fullName"),
                },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
                { title: "Gender", dataIndex: "gender", key: "gender" },
                { title: "Title", dataIndex: "scientificTitle", key: "scientificTitle" },
            ],
            instructors: [
                {
                    title: "Full Name",
                    dataIndex: "fullName",
                    key: "fullName",
                    fixed: "left",
                    ...getColumnSearchProps("fullName"),
                },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Code", dataIndex: "code", key: "code" },
                { title: "Degree", dataIndex: "degree", key: "degree" },
                { title: "Title", dataIndex: "scientificTitle", key: "scientificTitle" },
            ],
            examinationStaff: [
                {
                    title: "Full Name",
                    dataIndex: "fullName",
                    key: "fullName",
                    fixed: "left",
                    ...getColumnSearchProps("fullName"),
                },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Role", dataIndex: "role", key: "role" },
                { title: "Access", dataIndex: "access", key: "access" },
            ],
            students: [
                {
                    title: "Full Name",
                    dataIndex: "fullName",
                    key: "fullName",
                    fixed: "left",
                    ...getColumnSearchProps("fullName"),
                },
                {
                    title: "Full Name (Kurdish)",
                    dataIndex: "fullNameKurdish",
                    key: "fullNameKurdish",
                    ...getColumnSearchProps("fullNameKurdish"),
                },
                { title: "Email", dataIndex: "email", key: "email" },
                { title: "Code", dataIndex: "code", key: "code" },
                { title: "Birthday", dataIndex: "birthday", key: "birthday" },
                { title: "Gender", dataIndex: "gender", key: "gender" },
                { title: "Current Semester", dataIndex: "currentSemester", key: "currentSemester" },
                { title: "Theory Group", dataIndex: "theoryGroup", key: "theoryGroup" },
                { title: "Practical Group", dataIndex: "practicalGroup", key: "practicalGroup" },
                { title: "Year", dataIndex: "year", key: "year" },
                { title: "Degree", dataIndex: "degree", key: "degree" },
                {
                    title: "Is Morning",
                    dataIndex: "isMorning",
                    key: "isMorning",
                    render: (text) => (text ? "Yes" : "No"),
                },
                {
                    title: "Is Parallel",
                    dataIndex: "isParallel",
                    key: "isParallel",
                    render: (text) => (text ? "Yes" : "No"),
                },
            ],
        };

        return (
            <Table
                dataSource={data}
                columns={columns[type]}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1200 }} // Enable horizontal scrolling
                onRow={(record) => ({
                    onClick: () => {
                        if (type === "students") {
                            nav(`/lecturer/head_of_department/student_details/?student_id=${record.id}`);
                        } else if (type === "instructors") {
                            const queryParams = new URLSearchParams({
                                departmentId: selectedDept.id,
                                isMorning: isMorning.toString(),
                                lecturerId: record.id,
                            }).toString();
                            nav(`/lecturer/head_of_department/instructor_details?${queryParams}`);
                        }
                    },
                })}
            />
        );
    };

    const handleCollapseChange = (key) => {
        setActiveKey(key);
    };

    const handleCloseAll = () => {
        setActiveKey([]);
    };

    return (
        <div>
            {selectedDept && (
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <Select
                        className="dept-details-select"
                        value={selectedDept.id}
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
                    <Select
                        className="dept-details-select"
                        style={{ width: 200 }}
                        defaultValue="true"
                        onChange={(value) => {
                            handleCloseAll();
                            setIsMorning(value === "true");
                        }}
                    >
                        <Option value="true">Morning</Option>
                        <Option value="false">Evening</Option>
                    </Select>
                </div>
            )}

            {selectedDept && (
                <Collapse
                    accordion
                    style={{ marginTop: 20 }}
                    activeKey={activeKey}
                    onChange={(key) => {
                        handleCollapseChange(key);

                        if (key.length > 0) {
                            fetchCollapseData(key[0], selectedDept.id);
                        }
                    }}
                >
                    <Panel className="modules-panel" header="Modules" key="modules">
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
                    <Panel header="Students" key="students">
                        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                            <Select
                                className="dept-details-select"
                                style={{ width: 200 }}
                                defaultValue={1}
                                onChange={(value) => setSemester(value)}
                            >
                                {[...Array(8).keys()].map((i) => (
                                    <Option key={i + 1} value={i + 1}>
                                        Semester {i + 1}
                                    </Option>
                                ))}
                            </Select>
                            <Select
                                className="dept-details-select"
                                style={{ width: 200 }}
                                defaultValue="Bachelor"
                                onChange={(value) => setDegree(value)}
                            >
                                <Option value="Bachelor">Bachelor</Option>
                                <Option value="Master">Master</Option>
                                <Option value="PhD">PhD</Option>
                            </Select>
                        </div>
                        {loading ? <Spin /> : renderTable("students")}
                    </Panel>
                </Collapse>
            )}
        </div>
    );
};

export default DeptDetails;