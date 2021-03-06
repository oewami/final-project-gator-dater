import React, { useState } from 'react';
import { connect } from 'react-redux';
import './css/Home.css';
//import img from './img/bg.jpg';
import img2 from './img/start.jpg';
import SnowStorm from 'react-snowstorm';
import { Button } from 'react-bootstrap';
import { Container, Row, Col, Label, Fade, ButtonToolbar, Form, FormGroup, Input, Alert } from 'reactstrap';
import Cookies from 'js-cookie'
import md5 from 'md5'
import axios from 'axios'
import NavBar from './NavBar'
import { setUsername, setPassword, setAge, setEmail, setFirstName, setLastName, setIsLoggedIn, setPreference } from '../redux/actions/userActions';
import history from './history'

var validator = require('email-validator');

const options = { withCredentials: true };

const Home = ({ dispatch, username, password, age, email, firstName, lastName, isLoggedIn }) => {
    const [success, setSuccess] = useState('');
    const [loginBox, setLoginBox] = useState(false);
    const [createBox, setCreateBox] = useState(false);
    const [fadeIn, setFadeIn] = useState(true);

    const bgGround = {
        backgroundImage: 'url(' + img2 + ')',
        height:'1080px',
 };
    const goLogin = (e) => {
        setLoginBox(true);
        setFadeIn(false);
        setCreateBox(false);
        dispatch(setUsername(''));
        dispatch(setPassword(''));
        dispatch(setIsLoggedIn(false));
        document.getElementById('greeting').style.display = 'none';
    }

    const goCreate = (e) => {
        setLoginBox(false);
        setFadeIn(false);
        setCreateBox(true);
        dispatch(setUsername(''));
        dispatch(setPassword(''));
        document.getElementById('greeting').style.display = 'none';
    }

    const createUser = (e) => {
        e.preventDefault();
        if (username !== 0 && password !== 0 && age !== 0 && email !== 0 && firstName !== 0 && lastName !== 0) {
            if (validator.validate(email)) {
                axios.post('/createUser', {
                    username,
                    password: md5(password),
                    firstName,
                    lastName,
                    age,
                    email,
                })
                    .then((res) => {
                        setSuccess(res.data);
                        if (res.data === 'Success') {
                            Cookies.set("username", username);
                            Cookies.set("password", md5(password));
                            Cookies.set("isLoggedIn", true);

                            dispatch(setUsername(username));
                            dispatch(setPassword(password));
                            dispatch(setAge(age));
                            dispatch(setEmail(email));
                            dispatch(setFirstName(firstName));
                            dispatch(setLastName(lastName));
                            dispatch(setIsLoggedIn(true));

                            history.push("/adduserinfo");
                        }
                    }).catch(err => console.log(err));
            } else { setSuccess('Missing \'@\' on email'); }
        } else { setSuccess('Invalid. Please type in something.'); }
    }

    const goHome = () => {
        setCreateBox(false);
        setLoginBox(false);
        setFadeIn(true);
        dispatch(setAge(''));
        dispatch(setEmail(''));
        dispatch(setIsLoggedIn(''));
        setSuccess('');
        document.getElementById('greeting').style.display = 'inline';
    }

    function goProfile(e) {
        e.preventDefault();
        if (username !== 0 && password !== 0) {
            const body = {
                username,
                password: md5(password),
            }
            axios.post('/login', body, options)
                .then((res) => {
                    setPassword("");
                    if (res.data) {
                        Cookies.set("username", res.data.username);
                        Cookies.set("password", res.data.password);
                        Cookies.set("isLoggedIn", true);

                        dispatch(setUsername(res.data.username));
                        dispatch(setPassword(res.data.password));
                        dispatch(setAge(res.data.age));
                        dispatch(setEmail(res.data.email));
                        dispatch(setFirstName(res.data.firstName));
                        dispatch(setLastName(res.data.lastName));
                        dispatch(setPreference(res.data.preference));
                        dispatch(setIsLoggedIn(true));

                        console.log(isLoggedIn)

                        history.push("/profile");
                    } else {
                        Cookies.set("username", "");
                        Cookies.set("password", "");
                        Cookies.set("isLoggedIn", false);
                    }
                    console.log(res);
                }).catch(e => console.log(e));
        } else {
            setSuccess("Failed. Wrong username and/or password");
        }
    }

    const Log = () => {
        return (
            <div>
                <Alert color='black' isOpen={loginBox} id='login' >
                    <h4>Welcome back</h4><br />

                    <Form>
                        <FormGroup>
                            <Label >Username</Label>
                            <Input bsSize='sm' value={username} onChange={e => dispatch(setUsername(e.target.value))} id='username' placeholder='admin' />
                        </FormGroup>
                        <FormGroup>
                            <Label >Password</Label>
                            <Input bsSize='sm' type='password' value={password} onChange={e => dispatch(setPassword(e.target.value))} id='password' placeholder='******' />
                        </FormGroup>

                        <Row form>
                            <Col md={6}>
                                <Button onClick={goProfile} variant='warning' block>Login</Button>
                            </Col>
                            <Col md={6}>
                                <Button onClick={goHome} variant='warning' block>Back</Button>
                            </Col>
                        </Row>
                    </Form>
                    <h5>{success}</h5>

                </Alert>
            </div>
        )
    }

    const Create = () => {
        return (
            <div>
                <Alert color='black' isOpen={createBox} id='login' > <br /><br />
                    <h4> Create Page</h4><br />
                    <Form>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label >Username</Label>
                                    <Input bsSize='sm' value={username} onChange={e => dispatch(setUsername(e.target.value))} id='username' placeholder='username' />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label >Password</Label>
                                    <Input bsSize='sm' type='password' value={password} onChange={e => dispatch(setPassword(e.target.value))} id='password' placeholder='password' />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label >First Name</Label>
                                    <Input bsSize='sm' value={firstName} onChange={e => dispatch(setFirstName(e.target.value))} placeholder='Brian' />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label >Last Name</Label>
                                    <Input bsSize='sm' type='email' value={lastName} onChange={e => dispatch(setLastName(e.target.value))} placeholder='Parra' />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label >Age</Label>
                                    <Input bsSize='sm' value={age} onChange={e => dispatch(setAge(e.target.value))} placeholder='(18 ~ 65)' />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label >Email</Label>
                                    <Input bsSize='sm' type='email' value={email} onChange={e => dispatch(setEmail(e.target.value))} placeholder='brianparra@mail.sfsu.edu' />
                                </FormGroup>
                            </Col>
                        </Row>


                        <br />
                        <Row form>
                            <Col md={6}>

                                <Button onClick={createUser} variant='warning' block>Continue</Button>
                            </Col>


                        </Row>
                        <br />
                        <Row form>
                            <Col md={6}>
                                <Button onClick={goHome} variant='warning' block>Back</Button>
                            </Col>
                        </Row>
                    </Form>
                    <h5>{success}</h5>
                </Alert>
            </div>
        )
    }

    return (
        <div style={bgGround} id='bg'>

            {/* For the snow baby. */}
            <SnowStorm />
            {/* References Raymond Test NavBar */}
            <NavBar />
            <Container >
                <Row>
                    {loginBox && (
                        <Col sm='12' md={{ size: 6, offset: 4 }}>
                            <div className='iBox' >{Log()}</div>
                        </Col>
                    )}

                    {createBox && (
                        <Col sm='12' md={{ size: 6, offset: 3 }}>
                            <div className='cBox'>{Create()}</div>
                        </Col>
                    )}

                    <Fade in={fadeIn} id='greeting'>
                        <h1>gator.dater</h1>
                        <p>A dating app for SFSU students, in which students register and see people who match their dating interests. <br />
                            Our goal is to make our fellow SFSU students feel a little less cold this winter.</p>

                        <ButtonToolbar>
                            <Button onClick={goLogin} variant='outline-warning'>Login</Button>  &nbsp;&nbsp;
                            <Button onClick={goCreate} variant='outline-warning' >Sign up</Button>
                        </ButtonToolbar>
                    </Fade>
                </Row>
            </Container>
        </div>
    );
};

const mapStateToProps = state => ({
    username: state.userReducer.username,
    password: state.userReducer.password,
    age: state.userReducer.age,
    email: state.userReducer.email,
    firstName: state.userReducer.firstName,
    lastName: state.userReducer.lastName,
    isLoggedIn: state.userReducer.isLoggedIn,
});

export default connect(mapStateToProps)(Home);