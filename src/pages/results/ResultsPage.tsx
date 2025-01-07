import axios from "axios"
import ResultTable from "./ResultTable"
import { redirect, useLoaderData } from "react-router-dom"

const ResultsPage = () => {
    const results: any = useLoaderData()
    return (
        <div className="results-contaier">
            {results.map((result) => <ResultTable key={result.semester} result={result} />)}
        </div>
    )
}
export default ResultsPage
export const resultsLoader = async () => {
    axios.defaults.withCredentials = true;
    const response = await axios.get(
        "http://localhost:5083/api/Student/final-degrees"

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