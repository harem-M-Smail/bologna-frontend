import axios from "axios";
import { redirect, useLoaderData } from "react-router-dom";
import type { TableProps } from 'antd';

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Subject',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Mark',
        dataIndex: 'degreeLevel',
        key: 'key',
    },
];
const InrollmentPage = () => {
    const data=useLoaderData()
    
    return (
        <div>

        </div>
    )
}
export default InrollmentPage



export const profilePageLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/Student/enrollment-status"
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
