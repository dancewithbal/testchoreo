import axios from '../../api/axios.auth';
import { useEffect, useState } from 'react';
import * as cts from '../../const';
import { Result } from '../../dao/login/login.dao';

const Results = () => {
    var [results, setResults] = useState<Result[]>([])

    useEffect(() => {
        axios
            .get<Result[]>(cts.BACKEND_BASE_URL + "/results")
            .then((response) => {
                console.log(response.data);
                setResults(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (
        <div>{results.map((result) => {
            return <div key={result.date}>{result.date}</div>
        })}</div>
    );
};

export default Results;