import axios from '../../api/axios.auth';
import { useEffect, useState } from 'react';
import * as cts from '../../const';
import { ResDraw } from '../../dao/http/http.dao';
import { Table } from 'react-bootstrap';

const Results = () => {
    var [draws, setDraws] = useState<ResDraw[]>([])

    useEffect(() => {
        axios
            .get<ResDraw[]>(cts.BACKEND_BASE_URL + "/draws")
            .then((response) => {
                console.log(response.data);
                setDraws(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (
        <Table striped bordered hover size="sm">
            <thead>
                <tr>
                    <th>Draw Date</th>
                    <th>Winning Numbers</th>
                </tr>
            </thead>
            <tbody>
                {
                    draws.map((draw) => (
                        <tr key={draw.drawDate}>
                            <td>{draw.drawDate}</td>
                            <td>{draw.winningNumbers[0]}-{draw.winningNumbers[1]}-{draw.winningNumbers[2]}-{draw.winningNumbers[3]}</td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>

    );
};

export default Results;