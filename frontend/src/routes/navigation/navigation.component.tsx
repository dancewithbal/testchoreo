import { Fragment } from "react/jsx-runtime";
import { NavLink, Outlet } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/logo-h-80.svg";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loggedOut } from '../../store/features/user/user.slice';
import getPkce from "oauth-pkce";

import "./navigation.styles.scss";
import * as cts from "../../const";
import { PkceKeys } from "../../dao/login/login.dao";
import { Button, Container, Nav, NavDropdown, Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";

const Navigation = () => {

    const { loggedIn, fullName, picture, email } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();


    const loginBtnClick = () => {
        getPkce(50, (error, { verifier, challenge }) => {
            const pkceKeys: PkceKeys = {
                challenge: challenge,
                verifier: verifier,
            };
            window.sessionStorage.setItem(cts.PKCE_LOCAL_KEY, JSON.stringify(pkceKeys));

            let codeChallenge = encodeURIComponent(challenge);

            let uri = `${cts.AUTH_LOGIN_URI}?scope=${encodeURIComponent(cts.SCOPE)}&response_type=${cts.RESP_TYPE}&redirect_uri=${encodeURIComponent(cts.REDIRECT_URI)}&client_id=${cts.CLIENT_ID}&code_challenge_method=${cts.CODE_CHALLENGE_METHOD}&code_challenge=${codeChallenge}`;

            window.location.assign(uri);
        });
    };

    const logoutBtnClick = () => {
        window.sessionStorage.removeItem(cts.TOKENS_LOCAL_KEY);
        dispatch(loggedOut());
        // const body: LogoutRequest = {
        //     client_id: cts.CLIENT_ID,
        //     post_logout_redirect_uri: cts.REDIRECT_URI,
        //     state: "loggedOut",
        // };
        // axios
        //     .post(cts.AUTH_LOGOUT_URI, new URLSearchParams(body), {
        //         headers: {
        //             "Content-Type": "application/x-www-form-urlencoded",
        //         },
        //     })
        //     .then((response) => {
        //         console.log("********");
        //         console.log(response);
        //         console.log("********");
        //         // window.sessionStorage.removeItem(cts.TOKENS_LOCAL_KEY);
        //         // dispatch(loggedOut());
        //     })
        //     .catch((error) => {
        //         console.log("---------------");
        //         console.log(error);
        //         console.log("---------------");
        //     });
        //     console.log("000000000000000000000000000000");
        // TODO do the logout call to asgardio as well . above does not return state param as mentioned in the asgardeo doc
    }

    return (
        <Fragment>
            <Navbar sticky="top" collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">
                        <Logo className="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                            <Nav.Link as={NavLink} to="/Buy" hidden={!loggedIn} disabled={!loggedIn}>Buy</Nav.Link>
                            <Nav.Link as={NavLink} to="/results">Results</Nav.Link>
                            <Button variant="secondary" hidden={loggedIn} disabled={loggedIn} onClick={loginBtnClick}>Login</Button>
                            <NavDropdown hidden={!loggedIn} title={
                                <OverlayTrigger placement="bottom" overlay={
                                    <Tooltip id={`tooltip-${email}`}>
                                        <strong>DanceFloor Account</strong><br />
                                        <strong>{fullName}</strong>
                                        <p>{email}</p>
                                    </Tooltip>
                                }>
                                    <img className="rounded-circle" width="40%"
                                        src={picture}
                                        alt={email}
                                    />
                                </OverlayTrigger>
                            } id="collapsible-nav-dropdown">
                                <NavDropdown.Item onClick={logoutBtnClick}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </Fragment>
    );
};

export default Navigation;
