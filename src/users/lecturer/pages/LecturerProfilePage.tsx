import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import { Descriptions, List } from 'antd';

const LecturerProfilePage = () => {
    // const data = useLoaderData()
    const data = {
        "fullName": "Ismael Khorshed Abdulrahman",
        "fullNameKurdish": "تێست",
        "code": "ISAB307",
        "email": "ismael.abdulrahman@epu.edu.iq",
        "phoneNumber": "7501335645",
        "gender": "Male",
        "scientificTitle": "Assistant Professor",
        "degree": "Bachelor",
        "lecturerAt": [
            {
                "academicName": "Erbil Technical Engineering College",
                "academicNameKurdish": "کۆلێژى تەکنیکى ئەندازیارى هەولێر",
                "departmentName": "Information System Engineering",
                "departmentNameKurdish": "ئەندازیاری سیستەمى زانیاری"
            },
            {
                "academicName": "Erbil Technical Engineering College",
                "academicNameKurdish": "کۆلێژى تەکنیکى ئەندازیارى هەولێر",
                "departmentName": "Information System Engineering",
                "departmentNameKurdish": "ئەندازیاری سیستەمى زانیاری"
            }
        ]
    }

    return (
        <div>

            <Descriptions title="Lecturer Profile" bordered>
                <Descriptions.Item label="Full Name">{data.fullName}</Descriptions.Item>
                <Descriptions.Item label="Full Name (Kurdish)">{data.fullNameKurdish}</Descriptions.Item>
                <Descriptions.Item label="Code">{data.code}</Descriptions.Item>
                <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{data.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Gender">{data.gender}</Descriptions.Item>
                <Descriptions.Item label="Scientific Title">{data.scientificTitle}</Descriptions.Item>
                <Descriptions.Item label="Degree">{data.degree}</Descriptions.Item>
            </Descriptions>
            <List
                header={<div>Lecturer At</div>}
                bordered
                dataSource={data.lecturerAt}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={item.academicName}
                            description={
                                <>
                                    <div>{item.academicNameKurdish}</div>
                                    <div>{item.departmentName}</div>
                                    <div>{item.departmentNameKurdish}</div>
                                </>
                            }
                        />
                    </List.Item>
                )}
            />

        </div>
    )
}
export default LecturerProfilePage
export const lecturerProfilePageLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/lecturer/info"
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