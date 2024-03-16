import { Button, Modal, Table } from "react-bootstrap";
import { useAppSelector } from "../../store/hooks";
import { useEffect, useState } from "react";
import { useAppDispatch } from '../../store/hooks';
import { addedTicket, addedTickets, removedTicket } from '../../store/features/tickets/tickets.slice';
import axios from '../../api/axios.auth';
import { GenResp, ReqTicket, ResTicket } from "../../dao/http/http.dao";
import * as cts from '../../const';
import { TicketState } from "../../dao/state/state.dao";

const Buy = () => {

    const [show, setShow] = useState(false);
    const [n1, setN1] = useState(0);
    const [n2, setN2] = useState(0);
    const [n3, setN3] = useState(0);
    const [n4, setN4] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const dispatch = useAppDispatch();

    const tickets = useAppSelector((state) => state.tickets);

    const handleBuyTicket = () => {
        const body: ReqTicket = {
            numbers: [n1, n2, n3, n4]
        };
        axios
            .post<ResTicket>(cts.BACKEND_BASE_URL + "/tickets", body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                resetNumbers();
                dispatch(addedTicket({
                    ticketId: data.ticketId,
                    ticketNumbers: data.ticketNumbers,
                    purchaseDate: data.purchaseDate
                }));
            })
            .catch((error) => {
                console.log(error);
                resetNumbers();
            });
        handleClose();
    }

    const handleRefundTicket = (ticketId: string) => {
        axios
            .delete<GenResp>(cts.BACKEND_BASE_URL + "/tickets/" + ticketId)
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                dispatch(removedTicket(ticketId));
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
        axios
            .get<ResTicket[]>(cts.BACKEND_BASE_URL + "/tickets")
            .then(response => response.data)
            .then((data) => {
                console.log(data);
                const tickets: TicketState[] = [];
                data.map((t) => {
                    tickets.push({
                        ticketId: t.ticketId,
                        ticketNumbers: t.ticketNumbers,
                        purchaseDate: t.purchaseDate
                    })
                })
                dispatch(addedTickets(tickets));
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                +
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} animation={false}>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>
                                    <input id="n1" value={n1} type="number" onChange={e => setN1(+e.target.value)}></input>
                                </th>
                                <th>
                                    <input id="n2" value={n2} type="number" onChange={e => setN2(+e.target.value)}></input>
                                </th>
                                <th>
                                    <input id="n3" value={n3} type="number" onChange={e => setN3(+e.target.value)}></input>
                                </th>
                                <th>
                                    <input id="n4" value={n4} type="number" onChange={e => setN4(+e.target.value)}></input>
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
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Ticket Id</th>
                        <th>Numbers</th>
                        <th>Purchase Date</th>
                        <th>Refund</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tickets.map((res) => (
                            <tr key={res.ticketId}>
                                <td>{res.ticketId}</td>
                                <td>{res.ticketNumbers}</td>
                                <td>{res.purchaseDate.toLocaleString()}</td>
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