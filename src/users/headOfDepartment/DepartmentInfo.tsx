import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import { Card, Row, Col, Divider, Tag } from "antd";
import { Typography } from 'antd';
const { Title, Text } = Typography;

const DepartmentInfo = () => {
    const data = useLoaderData()
    console.log(data)
    return (

        <div>
            {data.map((department: any, index: number) => (
                <Card
                    key={index}
                    title={
                        <div>
                            <Title level={4}>{department.departmentName}</Title>
                            <Text type="secondary">{department.departmentNameKurdish}</Text>
                        </div>
                    }
                    style={{ marginBottom: "20px" }}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Text strong>Academic Name:</Text>
                            <p>{department.academicName}</p>
                            <Text type="secondary">{department.academicNameKurdish}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Code:</Text>
                            <p>{department.code}</p>
                            <Text strong>Shift:</Text>
                            <p>{department.isMorning ? "Morning" : "Evening"}</p>
                        </Col>
                    </Row>
                    <Divider />
                    <Title level={5}>Degrees Offered</Title>
                    <Row gutter={[16, 16]}>
                        {department.degree.map((deg: any, idx: number) => (
                            <Col key={idx} span={8}>
                                <Card size="small" bordered>
                                    <Text strong>{deg.name}</Text>
                                    <p>{deg.kurdishName}</p>
                                    <Text type="secondary">
                                        Semester Duration: {deg.semesterDuration}
                                    </Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Divider />
                    <Row gutter={[16, 16]} justify="center">
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Tag color="blue" style={{ width: "100%", textAlign: "center" }}>
                                Modules: {department.summary.modules}
                            </Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Tag color="green" style={{ width: "100%", textAlign: "center" }}>
                                Male Lecturers: {department.summary.maleLecturers}
                            </Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Tag color="purple" style={{ width: "100%", textAlign: "center" }}>
                                Female Lecturers: {department.summary.femaleLecturers}
                            </Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Tag color="orange" style={{ width: "100%", textAlign: "center" }}>
                                Male Students: {department.summary.maleStudents}
                            </Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Tag color="red" style={{ width: "100%", textAlign: "center" }}>
                                Female Students: {department.summary.femaleStudents}
                            </Tag>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8}>
                            <Tag color="gold" style={{ width: "100%", textAlign: "center" }}>
                                Archived Students: {department.summary.archivedStudents}
                            </Tag>
                        </Col>
                    </Row>
                </Card>
            ))}
        </div>
    )
}
export default DepartmentInfo
export const departmentInfoPageLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/DepartmentHead/departments-info"
    ).then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            console.log('then else')
            if (res.status === 401 || res.status === 403) {
                return redirect('/login')
            }
            return res.statusText
        }
    }).catch(err => {
        if (err.status == 401 || err.response.status == 403) {
            return redirect('/login')
        }
        throw new Error(err)

    })
    return response
}