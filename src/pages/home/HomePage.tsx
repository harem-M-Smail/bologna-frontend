import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import { Card, Row, Col, Typography } from "antd";

const { Title } = Typography;

const HomePage = () => {
    const data = useLoaderData();
    console.log(data);
    return (
        <div style={{ padding: "20px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
                University Overview
            </Title>
            <Row gutter={[16, 16]}>
                {data.map((college) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={college.id}>
                        <Card
                            title={college.name}
                            bordered={true}
                            hoverable
                            style={{
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                            }}
                        >
                            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                                Departments: {college.numberOfDepartment}
                            </p>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HomePage;

export const homePageLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios
        .get("http://localhost:5083/api/User/data")
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