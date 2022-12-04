import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import '../modal/stylesheets/ModalStyleSheet.css';

const Register = (props) => {
    const [firstName, setFirstName] = useState('');
    const [reqFirstName, setReqFirstName] = useState("dispNone");

    const [lastName, setLastName] = useState('');
    const [reqLastName, setReqLastName] = useState("dispNone");

    const [email, setEmail] = useState('');
    const [reqEmail, setReqEmail] = useState("dispNone");

    const [password, setPassword] = useState('');
    const [reqPassword, setReqPassword] = useState("dispNone");

    const [contactNo, setContactNo] = useState('');
    const [reqContactNo, setReqContactNo] = useState("dispNone");

    const [registrationStatus, setRegistrationStatus] = useState(false);

    const onFirstNameChanged = (e) => {
        setFirstName(e.target.value.split(","))
    }

    const onLastNameChanged = (e) => {
        setLastName(e.target.value.split(","))
    }

    const onEmailChanged = (e) => {
        setEmail(e.target.value.split(","))
    }

    const onPasswordChanged = (e) => {
        setPassword(e.target.value.split(","))
    }

    const onContactNoChanged = (e) => {
        setContactNo(e.target.value.split(","))
    }

    const onRegisterButtonClick = async () => {
        if (validateUserInput()) {
            const registerBody = {
                "email_address": email[0],
                "first_name": firstName[0],
                "last_name": lastName[0],
                "mobile_number": contactNo[0],
                "password": password[0]
            }

            try {
                const rawResponse = await fetch('http://localhost:8085/api/v1/signup', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Accept": "application/json;charset=UTF-8"
                    },
                    body: JSON.stringify(registerBody)
                })

                const response = await rawResponse.json()

                if (rawResponse.ok) {
                    setRegistrationStatus(true);
                } else {
                    throw (new Error(response.message || 'Something went wrong!'))
                }
            } catch (e) {
                alert(`Error: ${e.message}`);
            }
        }
    }

    const validateUserInput = () => {
        firstName === "" ? setReqFirstName("dispBlock") : setReqFirstName("dispNone");
        lastName === "" ? setReqLastName("dispBlock") : setReqLastName("dispNone");
        email === "" ? setReqEmail("dispBlock") : setReqEmail("dispNone");
        password === "" ? setReqPassword("dispBlock") : setReqPassword("dispNone");
        contactNo === "" ? setReqContactNo("dispBlock") : setReqContactNo("dispNone");

        if (
            firstName === "" ||
            lastName === "" ||
            email === "" ||
            password === "" ||
            contactNo === ""
        ) {
            return false;
        }

        return true;
    }

    return (
        <div className="container">
            <div>
                <FormControl required className="formControl">
                    <InputLabel htmlFor="firstname">First Name</InputLabel>
                    <Input id="firstname" value={firstName} onChange={onFirstNameChanged} />
                    <FormHelperText className={reqFirstName}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>

                <br /> <br />

                <FormControl required className="formControl">
                    <InputLabel htmlFor="lastname">Last Name</InputLabel>
                    <Input id="lastname" value={lastName} onChange={onLastNameChanged} />
                    <FormHelperText className={reqLastName}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>

                <br /> <br />

                <FormControl required className="formControl">
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input id="email" type={"email"} value={email} onChange={onEmailChanged} />
                    <FormHelperText className={reqEmail}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>

                <br /> <br />

                <FormControl required className="formControl">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" type={"password"} value={password} onChange={onPasswordChanged} />
                    <FormHelperText className={reqPassword}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>

                <br /> <br />

                <FormControl required  className="formControl">
                    <InputLabel htmlFor="contact-no">Contact No.</InputLabel>
                    <Input id="contact-no" value={contactNo} onChange={onContactNoChanged} />
                    <FormHelperText className={reqContactNo}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>

                <br /> <br />

                {registrationStatus ? <RegistrationSuccessMessage /> : null}
                
            </div>

            <br />

            <div className="btn-holder">
                <Button
                    variant="contained"
                    onClick={onRegisterButtonClick}
                    color="primary">
                    Register
                </Button>
            </div>
        </div>
    )
}

function RegistrationSuccessMessage() {
    return (
        <div><p>Registration Successful. Please Login!</p></div>
    )
}

export default Register;