import React, { useEffect, useState } from "react";
import Router from "next/router";
import PropTypes from "prop-types";
// @material-ui/core components
import Grid from '@material-ui/core/Grid';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
// @material-ui/icons
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// call api
import userAPI from "apis/user";

// style
import useStyles from "assets/jss/accuscript/admin/user.js";

// table variables
const headCells = [
  { id: 'id', label: 'ID' },
  { id: 'first_name', label: 'Full Name' },
  { id: 'email', label: 'Email' },
  { id: 'permission', label: 'Permission' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: 'action', label: 'Action' },
];
// table functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.head}
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function User() {
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
  // table variables
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState([]);
  // table handle event
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  // handle add new user
  const handleAddNewUser = () => {
    if (validateEmail(userInfo.email) !== true) {
      setMessageType("warning")
      setMessage("Email is not validate. Please insert correct Email.")
      setOpenMessage(true);
    } else if (userInfo.first_name === "" || userInfo.last_name === "" || userInfo.email === "") {
      setMessageType("warning")
      setMessage("Please insert all information.")
      setOpenMessage(true);
    } else {
      userAPI.addUser(userInfo)
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
              setMessage("Adding new user success!")
              setOpenMessage(true);
              setRows(response.users)
            } else {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
            }
            setOpenDialog(false)
          },
          error => {
            setMessageType("error")
            setMessage(error)
            setOpenMessage(true);
          }
        )
    }
  }

  // handle edit user
  const handleEditUser = () => {
    if (validateEmail(userInfo.email) !== true) {
      setMessageType("warning")
      setMessage("Email is not validate. Please insert correct Email.")
      setOpenMessage(true);
    } else if (userInfo.first_name === "" || userInfo.last_name === "" || userInfo.email === "") {
      setMessageType("warning")
      setMessage("Please insert all information.")
      setOpenMessage(true);
    } else {
      userAPI.editUser(userInfo, editableID)
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
              setRows(response.users)
            } else {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
            }
            setOpenDialog(false)
          },
          error => {
            setMessageType("error")
            setMessage(error)
            setOpenMessage(true);
          }
        )
    }
  }

  // handle delete user
  const handleDeleteUser = (event, id) => {
    if (confirm("Do you want to delete this user?")) {
      userAPI.deleteUser(id)
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
              setMessage("Deleting user success!")
              setOpenMessage(true);
              setPage(0);
              setRows(response.users)
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
  }

  // dialog variables
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(true);
  const [editableID, setEditableID] = React.useState(1);
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
  })

  // dialog handle events
  const handleOpenDialog = (event, selectedID, boolean) => {
    if (boolean !== true) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === selectedID) {
          setUserInfo(userInfo => ({
            ...userInfo,
            first_name: rows[i].first_name,
            last_name: rows[i].last_name,
            email: rows[i].email,
          }));
        }
      }
    } else {
      setUserInfo(userInfo => ({
        ...userInfo,
        first_name: '',
        last_name: '',
        email: '',
      }));
    }

    setIsAdding(boolean)
    setEditableID(selectedID)
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); };

  // input field handle events
  const handleInputChange = (event) => {
    event.persist();
    switch (event.target.id) {
      case "firstName":
        setUserInfo(userInfo => ({
          ...userInfo,
          first_name: event.target.value,
        }));
        break;
      case "lastName":
        setUserInfo(userInfo => ({
          ...userInfo,
          last_name: event.target.value,
        }));
        break;
      case "email":
        setUserInfo(userInfo => ({
          ...userInfo,
          email: event.target.value,
        }));
        break;
    }
  }

  // email vailation handle events
  const validateEmail = (email) => {
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(mailformat)) {
      return true;
    }
    return false;
  }

  // initial method
  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = () => {
    userAPI.users()
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          } else {
            setRows(response.users)
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
              <h4 className={classes.cardTitleWhite}>User List</h4>
              <p className={classes.cardCategoryWhite}>
                This is a user list page.
              </p>
            </CardHeader>
            <CardBody>
              <Grid container justify="flex-end">
                <Button className={classes.personAddButton} variant="contained" color="primary" onClick={(event) => handleOpenDialog(event, -1, true)}>
                  <PersonAddIcon className={classes.personAddIcon} />
                    Add new user
                  </Button>
              </Grid>
              <div className={classes.root}>
                <Paper className={classes.paper}>
                  <TableContainer>
                    <Table
                      className={classes.table}
                      aria-labelledby="tableTitle"
                      size="medium"
                      aria-label="enhanced table"
                    >
                      <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                      />
                      <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => {
                            return (
                              <TableRow key={row.id}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                >
                                  {row.id}
                                </TableCell>
                                <TableCell>{row.first_name} {row.last_name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.permission}</TableCell>
                                <TableCell>{row.createdAt}</TableCell>
                                <TableCell>{row.updatedAt}</TableCell>
                                <TableCell align="center">
                                  <IconButton color="primary" aria-label="upload picture" component="span" onClick={(event) => handleOpenDialog(event, row.id, false)}>
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton color="primary" aria-label="upload picture" component="span" onClick={(event) => handleDeleteUser(event, row.id)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {/* User add dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">User {isAdding ? 'Add' : 'Edit'}</DialogTitle>
        <DialogContent>
          {
            isAdding ?
              <DialogContentText>
                Please insert all information to add user.
              </DialogContentText> :
              <DialogContentText>
                Please insert all information to edit user.
              </DialogContentText>
          }
          <TextField
            margin="dense"
            id="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={userInfo.first_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="lastName"
            label="Last Name"
            type="text"
            fullWidth
            value={userInfo.last_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="text"
            fullWidth
            value={userInfo.email}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          {
            isAdding ?
              <Button onClick={handleAddNewUser} color="primary">
                Add
              </Button> :
              <Button onClick={handleEditUser} color="primary">
                Edit
              </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

User.layout = Admin;

export default User;
