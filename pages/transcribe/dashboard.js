import React, { useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Warning from "@material-ui/icons/Warning";
import LocalOffer from "@material-ui/icons/LocalOffer";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

// call api
import priceAPI from "apis/price";

import styles from "assets/jss/nextjs-material-dashboard/views/dashboardStyle.js";

const useStyles = makeStyles(styles);
var $ = window.$ = window.jQuery = require('jquery');

function Dashboard() {
  const classes = useStyles();
  
  const [dashboardValue, setDashboardValue] = React.useState({
    all_aws_price: 0,
    all_price: 0,
    all_users: 0,
    all_visitors: 0,
    today_visitors: 0,
  });

  // initial method
  useEffect(() => {
    getDashboard();
  }, [])

  const getDashboard = () => {
    priceAPI.dashboard()
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          } else {
            setDashboardValue(dashboardValue => ({
              ...dashboardValue,
              all_aws_price: response.all_aws_price,
              all_price: response.all_price,
              all_users: response.all_users,
              all_visitors: response.all_visitors,
              today_visitors: response.today_visitors,
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

  useEffect(() => {
    setTimeout(function () {
      $(".count").each(function () {
        var val = $(this).attr("data-text");
        counter(val, $(this));
      });
    }, 500);
    function counter(val, $this) {
      var countval = (val / 10);
      var totalCount = countval;
      var x = setInterval(function () {
        totalCount = totalCount + countval;
        $this.text(totalCount.toFixed(2) + "$");
        if (totalCount >= val) {
          $this.text(parseFloat(val).toFixed(2) + "$");
          clearInterval(x);
        }
      }, 150);
    }
    setTimeout(function () {
      $(".userCount").each(function () {
        var val = $(this).attr("data-text");
        userCounter(val, $(this));
      });
    }, 500);
    function userCounter(val, $this) {
      var countval = (val / 10);
      var totalCount = countval;
      var x = setInterval(function () {
        totalCount = totalCount + countval;
        $this.text(parseInt(totalCount));
        if (totalCount >= val) {
          $this.text(val);
          clearInterval(x);
        }
      }, 150);
    }
  })
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>content_copy</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Revenue</p>
              <h3 className={classes.cardTitle}><div className="count" data-text={dashboardValue.all_price - dashboardValue.all_aws_price}>0</div></h3>
              <p className={classes.cardCategory}>All Price</p>
              <h3 className={classes.cardTitle}><div className="count" data-text={dashboardValue.all_price}>0</div></h3>
              <p className={classes.cardCategory}>All AWS Price</p>
              <h3 className={classes.cardTitle}><div className="count" data-text={dashboardValue.all_aws_price}>0</div></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  Get more space
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>All Users</p>
              <h3 className={classes.cardTitle}><div className="userCount" data-text={dashboardValue.all_users}>0</div></h3>
              <p className={classes.cardCategory}>All Visitors</p>
              <h3 className={classes.cardTitle}><div className="userCount" data-text={dashboardValue.all_visitors}>0</div></h3>
              <p className={classes.cardCategory}>Today Visitors</p>
              <h3 className={classes.cardTitle}><div className="userCount" data-text={dashboardValue.today_visitors}>0</div></h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                Tracked from Github
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Email Subscriptions</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="dark">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Tasks</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

Dashboard.layout = Admin;

export default Dashboard;
