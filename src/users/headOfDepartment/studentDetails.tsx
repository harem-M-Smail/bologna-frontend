import axios from "axios";
import { redirect } from "react-router-dom";

const StudentDetails = () => {
    return (
        <div>

        </div>
    )
}
export default StudentDetails;
const studentDetailsLoader = async () => {
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