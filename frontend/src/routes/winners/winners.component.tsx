import axios from '../../api/axios.auth';
import { useEffect, useState } from 'react';
import * as cts from '../../const';
import { ResWinner } from '../../dao/http/http.dao';
import { Table } from 'react-bootstrap';

const Winners = () => {
    var [winners, setWinners] = useState<ResWinner[]>([])
    const [drawDate, setDrawDate] = useState("");

    useEffect(() => {
        var param = "";
        if (drawDate) {
            param += "?drawDate=" + drawDate;
        }
        axios
            .get<ResWinner[]>(cts.BACKEND_BASE_URL + "/winner" + param)
            .then((response) => {
                setWinners(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }, [drawDate]);


    return (
        <>
            <input className="form-control" id="drawDate" value={drawDate} type="date" onChange={e => setDrawDate(e.target.value)}></input>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Draw Date</th>
                        <th>User Name</th>
                        <th>Prize Won</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        winners.map((winner) => (
                            <tr key={winner.drawDate + winner.ticketId}>
                                <td>{winner.drawDate}</td>
                                <td>{winner.userFullName}</td>
                                <td>{winner.prizeWon}</td>
                                <td>{winner.description}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </>
    );
};

export default Winners;