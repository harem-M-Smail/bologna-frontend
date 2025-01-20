import { Avatar, Table } from "antd";
import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';

const ProfilePage = () => {
    const data = useLoaderData()

    const columns: any = [
        {
            dataIndex: 'name',
            key: 'name',
        },
        {
            dataIndex: 'value',
            key: 'value',
        },
    ];
    const userInfo = [
        {
            key: 1,
            name: 'FullName',
            value: data.fullName
        },
        {
            key: 2,
            name: 'FullName in Kurdish',
            value: data.fullNameKurdish
        },
        {
            key: 3,
            name: 'Academy',
            value: data.academicName
        },
        {
            key: 4,
            name: 'Department',
            value: data.departmentName
        },
        {
            key: 5,
            name: 'Current semester',
            value: data.currentSemester
        },
        {
            key: 6,
            name: 'Email',
            value: data.email
        },
        {
            key: 7,
            name: 'Student Code',
            value: data.studentCode
        },
    ]

    return (
        <div className="profile-page">
            <Table
                columns={columns}
                dataSource={userInfo}
                pagination={false}
                title={() => <><Avatar size={44} icon={<UserOutlined />} /> <span>{data.fullName}</span></>} />
        </div>
    )
}
export default ProfilePage
export const profilePageLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/Student/info"

    ).then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            console.log('then else')
            if (res.status === 401) {
                return redirect('/login')
            }
            return res.statusText
        }
    }).catch(err => {
        if (err.status == 401) {
            return redirect('/login')
        }
        throw new Error(err)

    })
    return response
}
