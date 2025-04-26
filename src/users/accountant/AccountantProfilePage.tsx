import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import { Card, Descriptions, Typography } from "antd";

const { Title } = Typography;

const AccountantProfilePage = () => {
    const data = useLoaderData();

    return (
        <div style={{ padding: "20px" }}>
            <Card
                bordered={false}
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Title level={3} style={{ textAlign: "center", marginBottom: "20px" }}>
                    Accountant Profile
                </Title>
                <Descriptions
                    bordered
                    column={{ xs: 1, sm: 2 }}
                    labelStyle={{ fontWeight: "bold", color: "#555" }}
                    contentStyle={{ color: "#333" }}
                >
                    <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
                    <Descriptions.Item label="Academic Name">{data.academicName}</Descriptions.Item>
                    <Descriptions.Item label="Academic Name (Kurdish)">
                        {data.academicNameKurdish}
                    </Descriptions.Item>
                    <Descriptions.Item label="Code">{data.code}</Descriptions.Item>
                    <Descriptions.Item label="Type">{data.type}</Descriptions.Item>
                    <Descriptions.Item label="Is Morning">
                        {data.isMorning ? "Yes" : "No"}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
};

export default AccountantProfilePage;

export const AccountantprofilePageLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios
        .get("http://localhost:5083/api/Accountant/info")
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
