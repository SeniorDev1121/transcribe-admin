import React, { useState } from "react";
import Router from "next/router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
// core components
import Button from "components/CustomButtons/Button.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
// call api
import authAPI from "apis/auth";

// style
import styles from "assets/jss/accuscript/auth/signup.js";

const useStyles = makeStyles(styles);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Signup() {
  // styles
  const classes = useStyles();

  // variables
  const [isLoading, setIsLoading] = useState(false);
  const [authInfo, setAuthInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  })
  // snackbar part
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [openMessage, setOpenMessage] = React.useState(false);

  // functions
  const handleGotoSignin = () => {
    Router.push("/auth/signin");
  }

  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMessage(false);
  };

  const handleSignup = () => {
    if (authInfo.password !== authInfo.confirm_password) {
      setMessageType("warning")
      setMessage("Incorrect password and confirm password. Please insert corract password and confirm password.")
      setOpenMessage(true);
    } else if (validateEmail(authInfo.email) !== true) {
      setMessageType("warning")
      setMessage("Email is not validate. Please insert correct Email.")
      setOpenMessage(true);
    } else if (authInfo.first_name === "" || authInfo.last_name === "" || authInfo.email === "" || authInfo.password === "" || authInfo.confirm_password === "") {
      setMessageType("warning")
      setMessage("Please insert all information.")
      setOpenMessage(true);
    } else {
      setIsLoading(true);
      authAPI.signup(authInfo)
        .then(
          response => {
            setIsLoading(false)
            if (response.success === "false") {
              setMessageType("warning")
              setMessage(response.msg)
              setOpenMessage(true);
            } else if (response.success === "true") {
              setMessageType("success")
              setMessage(response.msg)
              setOpenMessage(true);
              setTimeout(function () { Router.push("/auth/signin"); }, 2000);
            } else {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
            }
          },
          error => {
            setIsLoading(false)
          }
        )
    }
  }

  const handleInputChange = (event) => {
    switch (event.target.id) {
      case "firstName":
        authInfo.first_name = event.target.value
        break;
      case "lastName":
        authInfo.last_name = event.target.value
        break;
      case "email":
        authInfo.email = event.target.value
        break;
      case "password":
        authInfo.password = event.target.value
        break;
      case "confirmPassword":
        authInfo.confirm_password = event.target.value
        break;
    }
  }

  const validateEmail = (email) => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(mailformat)) {
      return true;
    }
    return false;
  }

  return (
    <Grid className={classes.height95} container alignItems="center">
      <Grid className={classes.width95} >
        {/* snackbar component */}
        <Snackbar
          open={openMessage}
          autoHideDuration={5000}
          onClose={handleMessageClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Alert onClose={handleMessageClose} severity={messageType}>
            {message}
          </Alert>
        </Snackbar>

        <GridContainer justify="center" alignItems="center">
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardHeader color="primary">
                <h4 className={`${classes.displayFlex} ${classes.justifyCenter} ${classes.cardTitleWhite}`}>Sign Up</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="First Name"
                      id="firstName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Person className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={handleInputChange}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Last Name"
                      id="lastName"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Person className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={handleInputChange}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "text",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={handleInputChange}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Lock className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={handleInputChange}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Confirm Password"
                      id="confirmPassword"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Lock className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      onChange={handleInputChange}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Grid container justify="center">
                  <Button variant="contained" color="success" onClick={handleGotoSignin}>
                    Go to Sign In
                    </Button>
                  {
                    isLoading ?
                      <Button variant="contained" disabled color="primary" onClick={handleSignup}>
                        Sign Up
                      </Button> :
                      <Button variant="contained" color="primary" onClick={handleSignup}>
                        Sign Up
                      </Button>
                  }
                </Grid>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </Grid>
    </Grid>
  );
}

export default Signup;
