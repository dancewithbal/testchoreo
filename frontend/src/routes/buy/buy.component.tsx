import { Button, Modal, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from '../../api/axios.auth';
import { GenResp, ReqTicket, ResTicket } from "../../dao/http/http.dao";
import * as cts from '../../const';

const Buy = () => {

    const [show, setShow] = useState(false);
    const [n1, setN1] = useState(0);
    const [n2, setN2] = useState(0);
    const [n3, setN3] = useState(0);
    const [n4, setN4] = useState(0);
    const currentDate = (new Date()).toISOString().slice(0, 10);
    const [drawDate, setDrawDate] = useState(currentDate);
    const [filterDrawDate, setFilterDrawDate] = useState("");
    var [tickets, setTickets] = useState<ResTicket[]>([])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleBuyTicket = () => {
        const body: ReqTicket = {
            numbers: [n1, n2, n3, n4],
            drawDate
        };
        // axios
        //     .post<ResTicket>(cts.BACKEND_BASE_URL + "/tickets", body, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     })
        //     .then(response => response.data)
        //     .then((data) => {
        //         resetNumbers();
        //         fetchTickets();
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         resetNumbers();
        //     });
        axios
            .get<ResTicket>(cts.BACKEND_BASE_URL + "/test")
            .then((response) => {
                console.log("----------" + response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        handleClose();
    }

    const handleRefundTicket = (ticketId: string) => {
        axios
            .delete<GenResp>(cts.BACKEND_BASE_URL + "/tickets/" + ticketId)
            .then((response) => {
                fetchTickets();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    const resetNumbers = () => {
        setN1(0);
        setN2(0);
        setN3(0);
        setN4(0);
    }

    useEffect(() => {
        fetchTickets();
    }, [filterDrawDate]);

    const fetchTickets = () => {
        var param = "";
        if (filterDrawDate) {
            param += "?drawDate=" + filterDrawDate;
        }
        axios
            .get<ResTicket[]>(cts.BACKEND_BASE_URL + "/tickets" + param)
            .then((response) => {
                setTickets(response.data);
                // const tickets: TicketState[] = [];
                // data.map((t) => {
                //     tickets.push({
                //         ticketId: t.ticketId,
                //         ticketNumbers: t.ticketNumbers,
                //         purchaseDate: t.purchaseDate,
                //         drawDate: t.drawDate
                //     })
                // })
                // dispatch(addedTickets(tickets));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                +
            </Button>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Buy Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table>
                        <thead>
                            <tr>
                                <th>Number 1</th>
                                <th>Number 2</th>
                                <th>Number 3</th>
                                <th>Number 4</th>
                                <th>Draw</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>
                                    <input className="form-control" id="n1" value={n1} type="number" onChange={e => setN1(+e.target.value)} min={cts.TICKET_START_NUMBER} max={cts.TICKET_END_NUMBER}></input>
                                </th>
                                <th>
                                    <input className="form-control" id="n2" value={n2} type="number" onChange={e => setN2(+e.target.value)} min={cts.TICKET_START_NUMBER} max={cts.TICKET_END_NUMBER}></input>
                                </th>
                                <th>
                                    <input className="form-control" id="n3" value={n3} type="number" onChange={e => setN3(+e.target.value)} min={cts.TICKET_START_NUMBER} max={cts.TICKET_END_NUMBER}></input>
                                </th>
                                <th>
                                    <input className="form-control" id="n4" value={n4} type="number" onChange={e => setN4(+e.target.value)} min={cts.TICKET_START_NUMBER} max={cts.TICKET_END_NUMBER}></input>
                                </th>
                                <th>
                                    <input className="form-control" id="drawDate" value={drawDate} type="date" onChange={e => setDrawDate(e.target.value)} min={currentDate}></input>
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleBuyTicket}>
                        Buy
                    </Button>
                </Modal.Footer>
            </Modal>
            <input className="form-control" id="filterDrawDate" value={filterDrawDate} type="date" onChange={e => setFilterDrawDate(e.target.value)}></input>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Draw Date</th>
                        <th>Numbers</th>
                        <th>Purchase Date</th>
                        <th>Refund</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tickets.map((res) => (
                            <tr key={res.ticketId}>
                                <td>{res.drawDate}</td>
                                <td>{res.ticketNumbers[0]}-{res.ticketNumbers[1]}-{res.ticketNumbers[2]}-{res.ticketNumbers[3]}</td>
                                <td>{res.purchaseDate}</td>
                                <th><button className="btn btn-danger" onClick={() => handleRefundTicket(res.ticketId)}>Refund</button></th>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
        </div>
    );

}

export default Buy;