import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
// @material-ui/icons
import EmailIcon from "@material-ui/icons/Email";

import styles from "assets/jss/accuscript/sections/contactus_section_style.js";

const useStyles = makeStyles(styles);

export default function ContactusSection() {
  const classes = useStyles();

  const [contactInfo, setcontactInfo] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    content: "",
  });

  const [contactInfoValidate, setContactInfoValidate] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    content: "",
  });

  const handleInputChange = (event) => {
    event.persist();
    switch (event.target.id) {
      case "firstName":
        contactInfo.firstName = event.target.value;
        handleValidateForm(event.target.id);
        break;
      case "lastName":
        contactInfo.lastName = event.target.value;
        handleValidateForm(event.target.id);
        break;
      case "email":
        contactInfo.email = event.target.value;
        handleValidateForm(event.target.id);
        break;
      case "phone":
        contactInfo.phone = event.target.value;
        handleValidateForm(event.target.id);
        break;
      case "subject":
        contactInfo.subject = event.target.value;
        handleValidateForm(event.target.id);
        break;
      case "content":
        contactInfo.content = event.target.value;
        handleValidateForm(event.target.id);
        break;
    }
  }

  const handleValidateForm = (id) => {
    switch (id) {
      case "firstName":
        if (contactInfo.firstName.length < 3) {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            firstName: "At least 3 characters"
          }));
        } else {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            firstName: ""
          }));
        }
        break;
      case "lastName":
        if (contactInfo.lastName.length < 3) {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            lastName: "At least 3 characters"
          }));
        } else {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            lastName: ""
          }));
        }
        break;
      case "email":
        if (validateEmail(contactInfo.email) !== true) {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            email: "Email is incorrect."
          }));
        } else {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            email: ""
          }));
        }
        break;
      case "phone":
        if (contactInfo.phone.length < 5) {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            phone: "Please insert phone number"
          }));
        } else {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            phone: ""
          }));
        }
        break;
      case "subject":
        if (contactInfo.subject.length < 5) {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            subject: "At least 5 characters"
          }));
        } else {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            subject: ""
          }));
        }
        break;
      case "content":
        if (contactInfo.content.length < 10) {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            content: "At least 10 characters"
          }));
        } else {
          setContactInfoValidate(contactInfoValidate => ({
            ...contactInfoValidate,
            content: ""
          }));
        }
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
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <div className={classes.sectionTitle}>Contact Us</div>
        </GridItem>
      </GridContainer>
      <Box pt={2} pb={2}>
        <GridContainer>
          <GridItem xs={12} sm={6} md={6}>
            <Box pt={2} pb={2}>
              <TextField
                error={contactInfoValidate.firstName === "" ? false : true}
                id="firstName"
                label="First Name"
                defaultValue={contactInfo.firstName}
                variant="outlined"
                helperText={contactInfoValidate.firstName}
                fullWidth
                onChange={handleInputChange}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Box pt={2} pb={2}>
              <TextField
                error={contactInfoValidate.lastName === "" ? false : true}
                id="lastName"
                label="Last Name"
                defaultValue={contactInfo.lastName}
                variant="outlined"
                helperText={contactInfoValidate.lastName}
                fullWidth
                onChange={handleInputChange}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Box pt={2} pb={2}>
              <TextField
                error={contactInfoValidate.email === "" ? false : true}
                id="email"
                label="Email"
                defaultValue={contactInfo.email}
                variant="outlined"
                helperText={contactInfoValidate.email}
                fullWidth
                onChange={handleInputChange}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} sm={6} md={6}>
            <Box pt={2} pb={2}>
              <TextField
                error={contactInfoValidate.phone === "" ? false : true}
                id="phone"
                label="Phone number"
                defaultValue={contactInfo.phone}
                variant="outlined"
                helperText={contactInfoValidate.phone}
                fullWidth
                onChange={handleInputChange}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Box pt={2} pb={2}>
              <TextField
                error={contactInfoValidate.subject === "" ? false : true}
                id="subject"
                label="Subject"
                defaultValue={contactInfo.subject}
                variant="outlined"
                helperText={contactInfoValidate.subject}
                fullWidth
                onChange={handleInputChange}
              />
            </Box>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <Box pt={2} pb={2}>
              <TextField
                error={contactInfoValidate.content === "" ? false : true}
                id="content"
                label="How can we help?"
                defaultValue={contactInfo.content}
                variant="outlined"
                helperText={contactInfoValidate.content}
                fullWidth
                onChange={handleInputChange}
              />
            </Box>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Box pt={2} pb={2} display="flex" justifyContent="center">
              <Button variant="contained" size="large" color="primary">
                <EmailIcon className={classes.icons} />
                Contact Us
              </Button>
            </Box>
          </GridItem>
        </GridContainer>
      </Box>
    </div>
  );
}
