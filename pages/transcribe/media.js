import React, { useEffect, useState } from "react";
import Router from "next/router";
import PropTypes from "prop-types";
// @material-ui/core components
import Box from '@material-ui/core/Box';
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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DeleteIcon from '@material-ui/icons/Delete';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import VisibilityIcon from '@material-ui/icons/Visibility';
import MoreIcon from '@material-ui/icons/More';
import {
  IconFlagUS,
  IconFlagUK,
  IconFlagAU,
  IconFlagFR,
  IconFlagDE,
  IconFlagES
} from 'material-ui-flags';
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
// call api
import mediaAPI from "apis/media";
import transcribeAPI from "apis/transcribe";
// pdf convert module
import { jsPDF } from "jspdf";

// payment components
import PaypalBtn from 'react-paypal-checkout';

// get paypal client id from .env file
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const PAYPAL_CLIENT_ID = publicRuntimeConfig.PAYPAL_CLIENT_ID;

// style
import useStyles from "assets/jss/accuscript/admin/media.js";

// table variables
const headCells = [
  { id: 'id', label: 'ID' },
  { id: 'user_name', label: 'User Name' },
  { id: 'file_name', label: 'File Name' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: 'file_size', label: 'File Size' },
  { id: 'duration', label: 'Duration' },
  { id: 'metadata', label: 'Meta Data' },
  { id: 'transcribe_status', label: 'Status' },
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

function Media() {
  // spoken language select component
  const [spokenLanguage, setSpokenLanguage] = React.useState("");
  const handleChangeLanguage = (event) => {
    setSpokenLanguage(event.target.value);
  };
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
  // data picker varialbles
  const [selectedFromDate, setSelectedFromDate] = React.useState(new Date());
  const [selectedToDate, setSelectedToDate] = React.useState(new Date());
  // data picker handlers
  const handleFromDateChange = (date) => {
    if (date > selectedToDate) {
      date = selectedToDate;
    }
    var start_date = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    var end_date = selectedToDate.getFullYear() + '-' + ((selectedToDate.getMonth() > 8) ? (selectedToDate.getMonth() + 1) : ('0' + (selectedToDate.getMonth() + 1))) + '-' + ((selectedToDate.getDate() > 9) ? selectedToDate.getDate() : ('0' + selectedToDate.getDate()));
    setSelectedFromDate(date);
    getMediaByDate(start_date.toString(), end_date.toString());
  };
  const handleToDateChange = (date) => {
    if (date < selectedFromDate) {
      date = selectedFromDate;
    }
    var start_date = selectedFromDate.getFullYear() + '-' + ((selectedFromDate.getMonth() > 8) ? (selectedFromDate.getMonth() + 1) : ('0' + (selectedFromDate.getMonth() + 1))) + '-' + ((selectedFromDate.getDate() > 9) ? selectedFromDate.getDate() : ('0' + selectedFromDate.getDate()));
    var end_date = date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()));
    setSelectedToDate(date);
    getMediaByDate(start_date, end_date);
  };
  const getMediaByDate = (start_date, end_date) => {
    setRows([])
    mediaAPI.getMediaByDate(start_date, end_date)
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          }
          if (response.success === 'true') {
            if (response.msg === "no data") {
              setRows([])
            } else {
              setRows(response.media_list)
            }
          }
        },
        error => {
          setMessageType("error")
          setMessage(error)
          setOpenMessage(true);
        }
      )
  }
  // functions
  const handleGotoUploadMedia = () => {
    Router.push("/admin/upload_media");
  }
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

  // handle delete media
  const handleDeleteMedia = (event, id) => {
    if (confirm("Do you want to delete this media?")) {
      setRows([])
      mediaAPI.deleteMedia(id)
        .then(
          response => {
            if (response.msg === 'Request failed with status code 401') {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
              setTimeout(function () { Router.push("/auth/signin"); }, 5000);
            }
            if (response.success === 'true') {
              setMessageType("success")
              setMessage(response.msg)
              setOpenMessage(true);
              setPage(0);
              setRows(response.media_list)
            } else {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
              setRows(response.media_list)
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

  // file information dialog variables and handle events
  const [openFileInformationDialog, setOpenFileInformationDialog] = React.useState(false);
  const [mediaInfo, setMediaInfo] = React.useState([]);
  const handleOpenFileInformationDialog = (event, id) => {
    setMediaInfo({});
    mediaAPI.getRealMediaURL(id)
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          }
          if (response.success === 'true') {
            for (var i = 0; i < rows.length; i++) {
              if (rows[i].id === id) {
                if (rows[i].transcribe_status === 1) {
                  var data = getJSONP(response.transcribe_url)
                  rows[i].transcript = JSON.parse(data).results.transcripts[0].transcript;
                  setMediaInfo(rows[i]);
                }
                break;
              }
            }
          }
        },
        error => {
          setMessageType("error")
          setMessage(error)
          setOpenMessage(true);
        }
      )

    setOpenFileInformationDialog(true);
  }
  const handleCloseFileInformationDialog = () => {
    setShowSubTranscript(false);
    setOpenFileInformationDialog(false);
  };

  // transcript prievew dialog variables and handle events
  const [openTranscriptPreviewDialog, setOpenTranscriptPreviewDialog] = React.useState(false);
  const handleOpenTranscriptPreviewDialog = (event, id) => {
    setMediaInfo({});
    mediaAPI.getRealMediaURL(id)
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          }
          if (response.success === 'true') {
            for (var i = 0; i < rows.length; i++) {
              if (rows[i].id === id) {
                if (rows[i].transcribe_status === 1) {
                  var data = getJSONP(response.transcribe_url)
                  rows[i].transcript = JSON.parse(data).results.transcripts[0].transcript;
                  setMediaInfo(rows[i]);
                }
                break;
              }
            }
          }
        },
        error => {
          setMessageType("error")
          setMessage(error)
          setOpenMessage(true);
        }
      )

    setOpenTranscriptPreviewDialog(true);
  }
  const handleCloseTranscriptPreviewDialog = () => {
    setOpenTranscriptPreviewDialog(false);
  };


  // transcribe start handler
  const [selectedMedia, setSelectedMedia] = React.useState({});
  const [openPaymentDialog, setOpenPaymentDialog] = React.useState(false);
  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
  }
  // payment variables and handlers
  const [envPayment, setEnvPayment] = React.useState('sandbox'); // you can set here to 'production' for production
  const [currencyPayment, setCurrencyPayment] = React.useState('USD'); // or you can set this value from your props or state  
  const [totalAmountPayment, setTotalAmountPayment] = React.useState(0);  // same as above, this is the total amount (based on currency) to be 
  const [localePayment, setLocalePayment] = React.useState('en_US');
  // For Customize Style: https://developer.paypal.com/docs/checkout/how-to/customize-button/
  const [stylePayment, setStylePayment] = React.useState({
    'label': 'pay',
    'tagline': false,
    'size': 'medium',
    'shape': 'pill',
    'color': 'gold'
  });

  const clientPayment = {
    sandbox: PAYPAL_CLIENT_ID,
    production: 'YOUR-PRODUCTION-APP-ID',
  }

  const [currentState, setCurrentState] = React.useState("nothing");

  const onSuccessPayment = (payment) => {
    // Congratulation, it came here means everything's fine!
    setCurrentState("paying");
    if (payment.paid === true) {
      setMessageType("success");
      setMessage("Payment succeed! Start transcribing now!");
      setOpenMessage(true);
      setCurrentState("transcribing");
      transcribeAPI.transcribe(selectedMedia.s3_url, selectedMedia.id, selectedMedia.file_name, spokenLanguage)
        .then(
          response => {
            if (response.msg === 'Request failed with status code 401') {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
              setTimeout(function () { Router.push("/auth/signin"); }, 5000);
            }
            if (response.success === 'false') {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
              setOpenPaymentDialog(false)
            } else if (response.success === 'true') {
              setMessageType("success")
              setMessage(response.msg)
              setOpenMessage(true);
              setOpenPaymentDialog(false)
            }
            getMedias();
          },
          error => {
            setMessageType("error")
            setMessage(error)
            setOpenMessage(true);
          }
        )
    } else {
      setMessageType("error");
      setMessage("Payment Failed, Try Again!");
      setOpenMessage(true);
    }
  }

  const onCancelPayment = (data) => {
    // User pressed "cancel" or close Paypal's popup!
    console.log('The payment was cancelled!', data);
  }

  const onErrorPayment = (err) => {
    // The main Paypal's script cannot be loaded or somethings block the loading of that script!
    console.log("Error!", err);
  }

  const handleOpenPaymentDialog = (event, row) => {
    setSelectedMedia(row);
    setTotalAmountPayment(row.price);
    setOpenFileInformationDialog(false);
    setOpenPaymentDialog(true);
  }

  const handleShowTranscribingMsg = () => {
    setMessageType("info");
    setMessage("Transcribe is proceeding now, It takes some minutes, Please wait some minutes!");
    setOpenMessage(true);
  }

  // sub transcript preview handler
  const [showSubTranscript, setShowSubTranscript] = React.useState(false);
  const handleSubTranscriptPreview = () => {
    setShowSubTranscript(true);
  }

  // initial method
  useEffect(() => {
    getMedias();
  }, [])

  const getMedias = () => {
    setRows([])
    mediaAPI.medias()
      .then(
        response => {
          if (response.msg === 'Request failed with status code 401') {
            setMessageType("error")
            setMessage(response.msg)
            setOpenMessage(true);
            setTimeout(function () { Router.push("/auth/signin"); }, 5000);
          }
          if (response.success === 'true') {
            if (response.msg === "no data") {
              setRows([])
            } else {
              setRows(response.media_list)
            }
          }
        },
        error => {
          setMessageType("error")
          setMessage(error)
          setOpenMessage(true);
        }
      )
  }

  // common javascript functions
  const getJSONP = (url, success) => {
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    return req.responseText;
  }

  // download pdf file
  const downloadPDF = (event, id) => {
    if (id !== undefined) {
      mediaAPI.getRealMediaURL(id)
        .then(
          response => {
            if (response.msg === 'Request failed with status code 401') {
              setMessageType("error")
              setMessage(response.msg)
              setOpenMessage(true);
              setTimeout(function () { Router.push("/auth/signin"); }, 5000);
            }
            if (response.success === 'true') {
              for (var i = 0; i < rows.length; i++) {
                if (rows[i].id === id) {
                  if (rows[i].transcribe_status === 1) {
                    var data = getJSONP(response.transcribe_url)
                    rows[i].transcript = JSON.parse(data).results.transcripts[0].transcript;
                    downloadPDFModule(rows[i].transcript);
                  }
                  break;
                }
              }
            }
          },
          error => {
            setMessageType("error")
            setMessage(error)
            setOpenMessage(true);
          }
        )

    } else {
      downloadPDFModule(mediaInfo.transcript);
    }
  }
  // download pdf module
  const downloadPDFModule = (transcript) => {
    var pageWidth = 8.5,
      lineHeight = 1.2,
      margin = 0.5,
      maxLineWidth = pageWidth - margin * 2,
      fontSize = 12,
      ptsPerInch = 72,
      oneLineHeight = (fontSize * lineHeight) / ptsPerInch,
      text = transcript,
      doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        lineHeight: lineHeight
      }).setProperties({ title: "Transcript" });

    var textLines = doc
      .setFont("helvetica")
      .setFontSize(fontSize)
      .splitTextToSize(text, maxLineWidth);
    for (var i = 0; i <= parseInt(textLines.length / 52); i++) {
      if (i !== 0) {
        doc.addPage("8.5", "1");
      }
      var onePageData = [];
      for (var j = 0; j < 52; j++) {
        if (textLines[i * 52 + j] === undefined) {
          break;
        }
        onePageData.push(textLines[i * 52 + j]);
      }
      doc.text(onePageData, margin, margin + 2 * oneLineHeight);
    }
    doc.save('file.pdf');
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
              <h4 className={classes.cardTitleWhite}>Media List</h4>
              <p className={classes.cardCategoryWhite}>
                This is a media list page.
              </p>
            </CardHeader>
            <CardBody>
              <Grid container justify="flex-end">
                <Box pt={1} pb={1}>
                  <Button variant="contained" color="primary" onClick={handleGotoUploadMedia}>
                    <CloudUploadIcon />
                    <div className={classes.iconBtnTextPos}>Upload new media</div>
                  </Button>
                </Box>
              </Grid>
              <Grid container>
                <Grid item alignitem="center">
                  <Box pt={1} pb={1}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        className={classes.datePicker}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-from"
                        label="From"
                        value={selectedFromDate}
                        onChange={handleFromDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      <KeyboardDatePicker
                        className={classes.datePicker}
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-to"
                        label="To"
                        value={selectedToDate}
                        onChange={handleToDateChange}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </Box>
                </Grid>
              </Grid>
              {/* table part */}
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
                                <TableCell>{row.userId}</TableCell>
                                <TableCell>{row.file_name}</TableCell>
                                <TableCell>{row.createdAt}</TableCell>
                                <TableCell>{row.updatedAt}</TableCell>
                                <TableCell>{(row.file_size / 1024 / 1024).toFixed(2)}MB</TableCell>
                                <TableCell>{parseInt(row.duration / 60)}:{(row.duration % 60) < 10 ? '0' : ''}{row.duration % 60}</TableCell>
                                <TableCell>{row.metadata}</TableCell>
                                <TableCell>
                                  {
                                    row.transcribe_status === 0 ?
                                      <Tooltip title="Start Transcript" arrow>
                                        <IconButton variant="contained" color="secondary" onClick={(event) => handleOpenPaymentDialog(event, row)}>
                                          <RecordVoiceOverIcon />
                                        </IconButton>
                                      </Tooltip>
                                      :
                                      <div>
                                        <Tooltip title="Preview Transcript" arrow>
                                          <IconButton variant="contained" color="primary" onClick={(event) => handleOpenTranscriptPreviewDialog(event, row.id)}>
                                            <VisibilityIcon />
                                          </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download Transcript" arrow>
                                          <IconButton variant="contained" color="primary" onClick={(event) => downloadPDF(event, row.id)}>
                                            <CloudDownloadIcon />
                                          </IconButton>
                                        </Tooltip>
                                      </div>
                                  }
                                </TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Show more media information" arrow>
                                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={(event) => handleOpenFileInformationDialog(event, row.id)}>
                                      <MoreIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete current media" arrow>
                                    <IconButton color="primary" aria-label="upload picture" component="span" onClick={(event) => handleDeleteMedia(event, row.id)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
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
                    rowsPerPageOptions={[5, 10, 25, 100]}
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
      {/* dialog part: File information dialog */}
      <Dialog
        open={openFileInformationDialog}
        onClose={handleCloseFileInformationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">File Information</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>Media ID</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.id}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>User Name</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.userId}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>File Name</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.file_name}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>File Path</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.s3_url}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>File Size</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && (mediaInfo.file_size / 1024 / 1024).toFixed(2)}MB
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>Duration</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && (parseInt(mediaInfo.duration / 60))}:{mediaInfo !== undefined && ((mediaInfo.duration % 60) < 10 ? 0 : '')}{mediaInfo !== undefined && (mediaInfo.duration % 60)}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>Created At</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.createdAt}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>Updated At</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.updatedAt}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>Meta Data</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.updatedAt}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <strong>Credit Used</strong>
            </Grid>
            <Grid item sm={8} md={10}>
              {mediaInfo !== undefined && mediaInfo.updatedAt}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item sm={4} md={2}>
              <Box pt={1} pb={1} >
                <strong>Status</strong>
              </Box>
            </Grid>
            <Grid item sm={8} md={10}>
              {
                mediaInfo !== undefined && mediaInfo.transcribe_status === 0 ?
                  <Box pt={1} pb={1} >
                    <Grid container>
                      <Grid item className={`${classes.notTranscribed} ${classes.paddingRight20}`}>Not Transcribed</Grid>
                      <Grid item>
                        <Button variant="contained" color="secondary" size="small" onClick={(event) => handleOpenPaymentDialog(event, mediaInfo)}>
                          <RecordVoiceOverIcon />
                          <div className={classes.iconBtnTextPos}>Start Transcript</div>
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                  :
                  <Box pt={1} pb={1}>
                    <Grid container>
                      <Grid item className={`${classes.transcribed} ${classes.paddingRight20}`}>Transcribed</Grid>
                      <Grid item className={classes.paddingRight20}>
                        <Button variant="contained" color="primary" size="small" onClick={handleSubTranscriptPreview}>
                          <VisibilityIcon />
                          <div className={classes.iconBtnTextPos}>Preview Transcript</div>
                        </Button>
                      </Grid>
                      <Grid item className={classes.paddingRight20}>
                        <Button ml={2} variant="contained" color="secondary" size="small" onClick={downloadPDF}>
                          <CloudDownloadIcon />
                          <div className={classes.iconBtnTextPos}>Download PDF</div>
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
              }
            </Grid>
          </Grid>
          {
            showSubTranscript === true ?
              <Grid container>
                <Grid item>
                  <div>{mediaInfo !== undefined && mediaInfo.transcript}</div>
                </Grid>
              </Grid>
              :
              ''
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFileInformationDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog part: transcript preview dialog */}
      <Dialog
        open={openTranscriptPreviewDialog}
        onClose={handleCloseTranscriptPreviewDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Transcript Preview</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item>
              <div>{mediaInfo !== undefined && mediaInfo.transcript}</div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTranscriptPreviewDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog part: payment dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleClosePaymentDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle id="alert-dialog-title">Payment</DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item>
              <Box pt={2} >
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-customized-select-label">What language was spoken?</InputLabel>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={spokenLanguage}
                    onChange={handleChangeLanguage}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="en-US">
                      English
                              <IconButton><IconFlagUS /></IconButton>
                      <IconButton><IconFlagUK /></IconButton>
                      <IconButton><IconFlagAU /></IconButton>
                    </MenuItem>
                    <MenuItem value="fr">
                      French
                              <IconButton><IconFlagFR /></IconButton>
                    </MenuItem>
                    <MenuItem value="de">
                      German
                              <IconButton><IconFlagDE /></IconButton>
                    </MenuItem>
                    <MenuItem value="es">
                      Spanish
                              <IconButton><IconFlagES /></IconButton>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box pt={2} >
                <PaypalBtn
                  env={envPayment}
                  client={clientPayment}
                  currency={currencyPayment}
                  total={totalAmountPayment}
                  locale={localePayment}
                  style={stylePayment}
                  onError={onErrorPayment}
                  onSuccess={onSuccessPayment}
                  onCancel={onCancelPayment}
                />
              </Box>
              {currentState === "transcribing" ?
                <div>Transcribing is proceeding now. Please wait some minutes.</div>
                :
                ''
              }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShowTranscribingMsg} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Media.layout = Admin;

export default Media;

