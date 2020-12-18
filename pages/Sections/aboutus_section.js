import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/accuscript/sections/aboutus_section_style.js";

const useStyles = makeStyles(styles);

export default function AboutusSection() {
  const classes = useStyles();
  const photo_url = require('assets/img/faces/marc.jpg');
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <div className={classes.sectionTitle}>About Us</div>
      </GridItem>
      {/* photo part */}
      <GridItem xs={12} sm={4} md={3}>
        <Box pt={4} pb={4} pr={1}>
          <img src={photo_url} alt="logo" className={classes.img} />
        </Box>
      </GridItem>
      {/* about us part */}
      <GridItem xs={12} sm={8} md={9}>
        <Box pt={4} pb={4}>
          <div className={classes.title}>
            Hermione Spencer
            </div>
          <div className={classes.text}>
            Jamie is a seasoned software executive and company builder. He led the US expansion for Xero helping the company raise over $250M in capital, reach 700,000 customers, and a $2.5 Billion market cap. Before joining Xero, Jamie was the youngest executive at Sage running its small business unit which became the fastest growing business in North America. He also co-founded a taxi-hailing app called TaxiNow that was subsequently acquired. In his spare time, Jamie can be found surfing, golfing, or picking up toys.
            </div>
        </Box>
      </GridItem>
    </GridContainer>
  );
}
