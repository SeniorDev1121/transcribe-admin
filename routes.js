/*!

=========================================================
* * NextJS Material Dashboard v1.0.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Movie from "@material-ui/icons/Movie";
import People from "@material-ui/icons/People";
import AttachMoney from "@material-ui/icons/AttachMoney";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,

    layout: "/transcribe",
  },
  {
    path: "/media",
    name: "Media",
    icon: Movie,

    layout: "/transcribe",
  },
  {
    path: "/user",
    name: "User",
    icon: People,

    layout: "/transcribe",
  },
  {
    path: "/price",
    name: "Price",
    icon: AttachMoney,

    layout: "/transcribe",
  },
];

export default dashboardRoutes;
