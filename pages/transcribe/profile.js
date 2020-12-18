import React, { useEffect, useState } from "react";
import Router from "next/router";
import PropTypes from "prop-types";
// @material-ui/core components
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// layout for this page
import Transcribe from "layouts/Transcribe.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// call api
import priceAPI from "apis/price";

// style
import useStyles from "assets/jss/accuscript/transcribe/price.js";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Profile(props) {
  // permission
  let perm;
  if (typeof localStorage === "undefined" || localStorage === null) {
  } else {
    perm = localStorage.getItem('permission')
  }
  const [permission, setPermission] = React.useState(perm);
  // styles
  const classes = useStyles();
  // snackbar variables and handle events
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [openMessage, setOpenMessage] = React.useState(false);
  const handleMessageClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMessage(false);
  };

  const [priceValue, setPriceValue] = React.useState({
    price_per_half_minute: 0,
    price_per_minute: 0,
    minimum_price: 0,
  });
  const handleChange = (prop) => (event) => {
    setPriceValue({ ...priceValue, [prop]: event.target.value });
  };

  // handle edit price
  const handleEditPrice = () => {
    priceAPI.editPrice(priceValue)
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          }
          if (response.msg === 'success') {
            setMessageType("success")
            setMessage("Editing User success!")
            setOpenMessage(true);
          } else {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
          }
        },
        error => {
          setMessageType("error")
          setMessage(error)
          setOpenMessage(true);
        }
      )

  }

  // initial method
  useEffect(() => {
    getPrice();
  }, [])

  const getPrice = () => {
    priceAPI.price()
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          } else {
            setPriceValue(priceValue => ({
              ...priceValue,
              price_per_half_minute: response.price.price_per_half_minute,
              price_per_minute: response.price.price_per_minute,
              minimum_price: response.price.minimum_price,
            }));
          }
        },
        error => {
          setMessageType("error")
          setMessage(error)
          setOpenMessage(true);
        }
      )
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
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
          {/* page content */}
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>User Profile</h4>
              <p className={classes.cardCategoryWhite}>
                This is an user profile page.
              </p>
            </CardHeader>
            <CardBody>
              <GridContainer justify="center" alignItems="center">
                <GridItem xs={12} sm={6} md={4} lg={4}>
                  <Box display="flex" justifyContent="flex-end" alignItems="center" p={1}>
                    <strong>First Name: </strong>
                  </Box>
                </GridItem>
                <GridItem xs={12} sm={6} md={8} lg={8} >
                  <Box display="flex" justifyContent="flex-start" alignItems="center" p={1}>
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                      <OutlinedInput
                        id="minutePrice"
                        type="number"
                        onChange={handleChange('price_per_minute')}
                        value={priceValue.price_per_minute}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        labelWidth={60}
                      />
                    </FormControl>
                  </Box>
                </GridItem>
                <GridItem xs={12} sm={6} md={4} lg={4}>
                  <Box display="flex" justifyContent="flex-end" alignItems="center" p={1}>
                    <strong>Last Name: </strong>
                  </Box>
                </GridItem>
                <GridItem xs={12} sm={6} md={8} lg={8} >
                  <Box display="flex" justifyContent="flex-start" alignItems="center" p={1}>
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                      <OutlinedInput
                        id="secondPrice"
                        type="number"
                        onChange={handleChange('price_per_half_minute')}
                        value={priceValue.price_per_half_minute}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        labelWidth={60}
                      />
                    </FormControl>
                  </Box>
                </GridItem>
                <GridItem xs={12} sm={6} md={4} lg={4}>
                  <Box display="flex" justifyContent="flex-end" alignItems="center" p={1}>
                    <strong>Minimal Price: </strong>
                  </Box>
                </GridItem>
                <GridItem xs={12} sm={6} md={8} lg={8} >
                  <Box display="flex" justifyContent="flex-start" alignItems="center" p={1}>
                    <FormControl variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                      <OutlinedInput
                        id="minimum_price"
                        type="number"
                        onChange={handleChange('minimum_price')}
                        value={priceValue.minimum_price}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        labelWidth={60}
                      />
                    </FormControl>
                  </Box>
                </GridItem>
                <GridItem xs={12} sm={6} md={4} lg={4}>
                </GridItem>                
                {
                  permission === 'admin' &&
                  <GridItem xs={12} sm={6} md={8} lg={8} >
                    <Box display="flex" justifyContent="flex-start" alignItems="center" p={1}>
                      <Button variant="contained" color="primary" size="large" onClick={handleEditPrice}>
                        Update Price
                      </Button>
                    </Box>
                  </GridItem>
                }
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Profile.layout = Transcribe;

export default Profile;
