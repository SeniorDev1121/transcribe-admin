/*eslint-disable*/
import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// core components
import Button from "components/CustomKitButtons/Button.js";
// @material-ui/icons
import HomeIcon from "@material-ui/icons/Home";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import GroupIcon from "@material-ui/icons/Group";
import EmailIcon from "@material-ui/icons/Email";
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined";

// var $ = require('jquery');

import styles from "assets/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

// $("#homeBtn").click(function() {
//   $('html, body').animate({
//       scrollTop: $("#home").offset().top
//   }, 2000);
// });

export default function HeaderLinks(props) {
  const classes = useStyles();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          id="homeBtn"
          href="#home"
          color="transparent"
          className={classes.navLink}
          >
          <HomeIcon className={classes.icons} />
          Home
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          id="pricingBtn"
          href="#pricing"
          color="transparent"
          className={classes.navLink}
          >
          <AttachMoneyIcon className={classes.icons} />
          Pricing
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          id="aboutusBtn"
          href="#aboutus"
          color="transparent"
          className={classes.navLink}
          >
          <GroupIcon className={classes.icons} />
          About Us
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          id="contactusBtn"
          href="#contactus"
          color="transparent"
          className={classes.navLink}
        >
          <EmailIcon className={classes.icons} />
          Contact Us
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/auth/signin"
          color="transparent"
          className={classes.navLink}
        >
          <PermIdentityOutlinedIcon className={classes.icons} />
          Sign In
        </Button>
      </ListItem>
    </List>
  );
}
