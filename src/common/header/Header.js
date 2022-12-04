import React, { useEffect, useState } from "react";
import './Header.css';
import AppLogo from '../../assets/logo.svg';
import { Button } from "@material-ui/core";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import Register from '../modal/Register'
import Login from "../modal/Login";
import { Link } from "react-router-dom";



const modalBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1.5px solid #d3d3d3',
    boxShadow: 24,
    p: 4,
    borderRadius: '5px'
};

const Header = (props) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // state to manage modal
    const [open, setOpen] = React.useState(false);
    // functions to manage open/close of modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const [tabValue, setTabValue] = React.useState('1'); // state to handle tab values
    const onTabChange = (event, newValue) => { // event handler for tab selection
        setTabValue(newValue);
    };

    useEffect(() => {
        // initial check if the user is already logged in or not.
        const accessToken = sessionStorage.getItem('access-token')
        if (accessToken) {
            setIsLoggedIn(true);
        }
    }, [])


    let headerButton;

    if (isLoggedIn) {
        headerButton = <Button variant='contained' onClick={onLogoutButtonClick}>Logout</Button>
    } else {
        headerButton = <Button variant='contained' onClick={handleOpen}>Login</Button>
    }


    async function onLogoutButtonClick() {
        try {
            const rawResponse = await fetch('http://localhost:8085/api/v1/auth/logout', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Accept": "application/json;charset=UTF-8",
                    authorization: `Bearer ${sessionStorage.getItem('access-token')}`
                },
            });
            if (rawResponse.ok) {
                sessionStorage.clear();
                setIsLoggedIn(false)
            } else {
                const response = await rawResponse.json();
                throw (new Error(response.message || 'Something went wrong!'));
            }
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    }

    function LoginRegisterModal() {
        return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={modalBoxStyle}>
                    <TabContext value={tabValue}>
                        <div className='tab-list-container'>
                            <TabList onChange={onTabChange} aria-label="lab API tabs example">
                                <Tab label="Login" value="1" />
                                <Tab label="Register" value="2" />
                            </TabList>
                        </div>
                        <TabPanel value="1"><Login setIsLoggedIn={setIsLoggedIn} handleClose={handleClose} /></TabPanel>
                        <TabPanel value="2"><Register baseUrl={props.baseUrl} /></TabPanel>
                    </TabContext>
                </Box>
            </Modal>
        )
    }

    const onBookButtonClick = () => {
        if (!isLoggedIn) {
            handleOpen()
        }
    }

    //const bookNowButton = '';

    return (
        <div className="header">
            <div>
                <img src={AppLogo} className='app-logo rotate-anim' alt='movie-app-logo' />
            </div>
            <div>
                {props.showBookNow ?
                    (isLoggedIn ? <Link to={`/bookshow/${props.movieId}`} style={{ textDecoration: 'none' }}>
                                     <Button variant='contained' color='primary' style={{ marginRight: "10px" }}>Book Show</Button>
                                  </Link> 
                                : <Button variant='contained' color='primary' style={{ marginRight: "10px" }} onClick={onBookButtonClick}>Book Show</Button>)
                    : null
                }
                {headerButton}
            </div>
            <LoginRegisterModal />
        </div >
    )
}

export default Header;