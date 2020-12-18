import React, { useEffect, useState } from "react";
import Dropzone from 'react-dropzone';
// @material-ui/core components
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import { Typography } from "@material-ui/core";
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
import uploadMediaAPI from "apis/upload-media";
import transcribeAPI from "apis/transcribe";
// payment components
import PaypalBtn from 'react-paypal-checkout';

// style
import useStyles from "assets/jss/accuscript/admin/upload_media.js";

// get paypal client id from .env file
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const PAYPAL_CLIENT_ID = publicRuntimeConfig.PAYPAL_CLIENT_ID;

function UploadMedia() {
  ///////////////////////////////////////////////////////////////////
  ////////////////// common variables and handlers //////////////////
  ///////////////////////////////////////////////////////////////////
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
  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  // stepper variables and handlers
  const [activeStep, setActiveStep] = React.useState(0);

  const getSteps = () => {
    return ['Upload File', 'Add Details', 'Payment', 'Start Transcribe', 'Transcribing'];
  }
  const steps = getSteps();

  // dropzone variables and handlers
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const addKeyInAcceptedFiles = (selectedFiles) => {
    setAcceptedFiles(selectedFiles)
  }

  // common javascript functions
  const getJSONP = (url, success) => {
    var req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    return req.responseText;
  }

  ///////////////////////////////////////////////////////////////////
  ///////////////////// step 1 File upload part /////////////////////
  ///////////////////////////////////////////////////////////////////

  // upload progress variables and handlers
  const [progress, setProgress] = React.useState([]);
  const [total, setTotal] = React.useState([]);
  const [loaded, setLoaded] = React.useState([]);
  const [speed, setSpeed] = React.useState([]);
  const [uploadStates, setUploadStates] = React.useState([]); // initial, loading, success, failure, 
  const [allUploadState, setAllUploadState] = React.useState('initial'); // initial, loading, success, failure, 
  // uploaded file information
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const callbackProgress = (index, progressArray, totalArray, loadedArray, speedArray) => {
    var tempArray = [];
    progressArray.forEach(element => {
      tempArray.push(element);
    });
    setProgress(tempArray);
    tempArray = [];
    totalArray.forEach(element => {
      tempArray.push(element);
    });
    setTotal(tempArray);
    tempArray = [];
    loadedArray.forEach(element => {
      tempArray.push(element)
    });
    setLoaded(tempArray);
    tempArray = [];
    speedArray.forEach(element => {
      tempArray.push(element)
    });
    setSpeed(tempArray);
  }

  const renderUploadStateCircularProgress = () => {
    if (allUploadState === 'initial') {
      return null;
    } else if (allUploadState === 'loading') {
      return <div className={classes.root}>
        <Grid container>
          <Grid item className={classes.displayFlex}>
            <Box pt={1}>
              <CircularProgress size={14} color="secondary" />
            </Box>
            <Box ml={1} pt={1} className={classes.uploading}>
              {acceptedFiles.length} file{acceptedFiles.length === 1 ? '' : 's'} uploading
              </Box>
          </Grid>
        </Grid>
      </div>
    } else if (allUploadState === 'failure') {
      return <div className={classes.root}>
        <Grid container>
          <Grid item className={classes.displayFlex}>
            <Box pt={1} className={classes.uploadFailure}>
              Uploading Failure.
              </Box>
          </Grid>
        </Grid>
      </div>
    } else if (allUploadState === 'success') {
      return <Box pt={1} className={classes.uploadSuccess}>
        {acceptedFiles.length} file{acceptedFiles.length === 1 ? '' : 's'} uploaded
      </Box>;
    }
  }

  useEffect(() => {
    fileUpload();
  }, [acceptedFiles])

  // file upload handler
  const fileUpload = () => {
    let progresssArray = [];
    let totalArray = [];
    let loadedArray = [];
    let speedArray = [];
    let state = [];
    let uploadedArray = [];
    for (var i = 0; i < acceptedFiles.length; i++) {
      progresssArray.push(0);
      totalArray.push(0);
      loadedArray.push(0);
      speedArray.push(0);
      state.push('loading');
    }
    setUploadStates(state);
    if (acceptedFiles.length !== 0) {
      setAllUploadState("loading");
    }
    for (var i = 0; i < acceptedFiles.length; i++) {
      var startTime = new Date();
      if (acceptedFiles.length !== 0) {
        var fileUploadInfo = new FormData();
        fileUploadInfo.append('file', acceptedFiles[i]);
        fileUploadInfo.append('index', i);
        uploadMediaAPI.upload(fileUploadInfo, callbackProgress, i, startTime, progresssArray, totalArray, loadedArray, speedArray)
          .then(
            response => {
              if (response.success === 'false') {
                state[response.index] = 'failure'
              } else if (response.success === 'true') {
                state[response.index] = 'success'
              }
              uploadedArray.push(response);
              var tempArray = [];
              state.forEach(element => {
                tempArray.push(element);
              });
              setUploadStates(tempArray);
            },
            error => {
              console.log(error)
              setUploadStates(state);
            }
          )
      }
    }
    setUploadedFiles(uploadedArray);
  }

  useEffect(() => {
    changeAllUploadState();
  }, [uploadStates])

  const changeAllUploadState = () => {
    let count = 0;
    for (var i = 0; i < uploadStates.length; i++) {
      if (uploadStates[i] === 'success') {
        count++;
      }
    }
    if (count === uploadStates.length && count !== 0) {
      setMessageType("success");
      setAllUploadState("success");
      setMessage("All files are uploaded successfully!");
      setOpenMessage(true);
      setActiveStep(1);
    }
  }

  ///////////////////////////////////////////////////////////////////
  /////////////////// step 2 select langauge part ///////////////////
  ///////////////////////////////////////////////////////////////////
  // spoken language select component
  const [spokenLanguage, setSpokenLanguage] = React.useState("");
  const handleChangeLanguage = (event) => {
    setSpokenLanguage(event.target.value);
    setActiveStep(2);
  };

  ///////////////////////////////////////////////////////////////////
  /////////////////////// step 3 payment part ///////////////////////
  ///////////////////////////////////////////////////////////////////
  // payment variables and handlers
  let envPayment = 'sandbox'; // you can set here to 'production' for production
  let currencyPayment = 'USD'; // or you can set this value from your props or state  
  let totalAmountPayment = 0;  // same as above, this is the total amount (based on currency) to be 
  for (var i = 0; i < uploadedFiles.length; i++) {
    totalAmountPayment += uploadedFiles[i].price;
  }
  let localePayment = 'en_US';
  // For Customize Style: https://developer.paypal.com/docs/checkout/how-to/customize-button/
  let stylePayment = {
    'label': 'pay',
    'tagline': false,
    'size': 'medium',
    'shape': 'pill',
    'color': 'gold'
  };

  const clientPayment = {
    sandbox: PAYPAL_CLIENT_ID,
    production: 'YOUR-PRODUCTION-APP-ID',
  }

  const [paymentState, setPaymentState] = React.useState({})

  const onSuccessPayment = (payment) => {
    // Congratulation, it came here means everything's fine!
    setPaymentState(payment);
    if (payment.paid === true) {
      setMessageType("success");
      setMessage("Payment succeed!");
      setOpenMessage(true);
      setActiveStep(3);
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


  ///////////////////////////////////////////////////////////////////
  ////////////////// step 4 start transcribe part ///////////////////
  ///////////////////////////////////////////////////////////////////
  // transcribed file information
  const [transcribedFiles, setTranscribedFiles] = useState([]);
  const [transcribeStates, setTranscribeStates] = useState([]);
  const [allTranscribeState, setAllTranscribeState] = useState('success');
  // transcribe handler
  const handleTranscribeStart = () => {
    let state = [];
    setTranscribedFiles([]);
    for (var i = 0; i < uploadedFiles.length; i++) {
      state.push('transcribing');
    }
    setTranscribeStates(state);
    setAllTranscribeState('transcribing');
    setActiveStep(4);
    for (var i = 0; i < uploadedFiles.length; i++) {
      transcribeAPI.multitranscribes(uploadedFiles[i].s3_url, uploadedFiles[i].mediaId, i, spokenLanguage, uploadedFiles[i].file_name)
        .then(
          response => {
            if (response.success === 'false') {
              state[response.index] = 'failure'
              setMessageType("error");
              setMessage(response.msg);
              setOpenMessage(true);
            } else if (response.success === 'true') {
              state[response.index] = 'success'
              let copiedResponse = response;
              var data = getJSONP(copiedResponse.transcribe_url)
              copiedResponse.transcript = JSON.parse(data).results.transcripts[0].transcript;
              setTranscribedFiles(transcribedFiles => [...transcribedFiles, copiedResponse]);
            }
            var tempArray = [];
            state.forEach(element => {
              tempArray.push(element);
            });
            setTranscribeStates(tempArray);
          },
          error => {
            console.log(error)
            setTranscribeStates(state);
          }
        )
    }

  }

  useEffect(() => {
    changeAllTranscribeState();
  }, [transcribeStates])

  const changeAllTranscribeState = () => {
    var count = 0;
    if (transcribeStates.length != 0) {
      for (var i = 0; i < transcribeStates.length; i++) {
        if (transcribeStates[i] === 'transcribing') {
          count++;
        } else if(transcribeStates[i] === 'failure') {
          setAllTranscribeState('failure');
        }
      }
      if (count === 0) {
        setAllTranscribeState('success');
        setActiveStep(5);
      }
    }
  }

  ///////////////////////////////////////////////////////////////////
  //////////////////// step 5 transcribing part /////////////////////
  ///////////////////////////////////////////////////////////////////



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
              <h4 className={classes.cardTitleWhite}>Upload Audio/Video Files</h4>
              <p className={classes.cardCategoryWhite}>
                This is a subscription page.
              </p>
            </CardHeader>
            <CardBody className={classes.cardBody}>
              {/* Stepper part */}
              <Grid item sm={12} md={12} lg={10}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Grid>
              {/* dropzone part */}
              <Grid item sm={12} md={12} lg={12} className={classes.padding20}>
                <Dropzone
                  onDrop={selectedFiles => { addKeyInAcceptedFiles(selectedFiles) }}
                  accept="audio/mpeg, audio/wav, video/mp4, video/mpeg, video/webm, audio/ogg, video/ogg"
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div className={classes.dropzone} {...getRootProps()}>
                        <div className={classes.root}>
                          <input {...getInputProps()} />
                          <h3><strong>Drag and drop additional audio/video file(s) here</strong></h3>
                          <Grid container alignItems="center">
                            <Typography>We accept most file formats</Typography>
                            <ErrorOutlineIcon className={classes.ErrorOutlineIcon} />
                          </Grid>
                          <Grid container alignItems="center">
                            <Typography>Our max file size is 4GB</Typography>
                            <ErrorOutlineIcon className={classes.ErrorOutlineIcon} />
                          </Grid>
                          <div><strong>{acceptedFiles.map((acceptedFile, index) => <div key={index}>{acceptedFile.path}</div>)}</strong></div>
                        </div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </Grid>
              {/* step 1 part file upload */}
              <Grid item className={classes.padding20}>
                <div className={classes.stepTitle}>Step 1: Upload File</div>
                <Grid container>
                  {renderUploadStateCircularProgress()}
                  {acceptedFiles.map((acceptedFile, index) => {
                    return (
                      <Grid container key={index}>
                        <Grid item className={classes.root}>
                          <div className={classes.root}>
                            {
                              uploadStates[index] === "loading" ?
                                <Box pt={1} className={classes.uploading}>
                                  {acceptedFile.name}
                                </Box> : ''
                            }
                            {
                              uploadStates[index] === "success" ?
                                <Box pt={1} className={classes.uploadSuccess}>
                                  {acceptedFile.name}
                                </Box> : ''
                            }
                            {
                              uploadStates[index] === "failure" ?
                                <Box pt={1} className={classes.uploadFailure}>
                                  {acceptedFile.name}
                                </Box> : ''
                            }
                            <Box pt={1} pb={1}>
                              {progress[index] !== undefined &&
                                <LinearProgress size={50} className={classes.linearProgress} variant="determinate" value={progress[index]} />
                              }
                            </Box>
                            <GridContainer justify="center">
                              <GridItem item sm={12} md={12}>
                                <div className={classes.spaceBetween}>
                                  {
                                    uploadStates[index] === "loading" ?
                                      <Box pb={1} className={classes.uploading}>
                                        <Typography>Uploading ({total[index] !== undefined && total[index].toFixed(2)}MB/{loaded[index] !== undefined && loaded[index].toFixed(2)}MB at {speed[index] !== undefined && speed[index].toFixed(2)}MB/s)</Typography>
                                      </Box> : ''
                                  }
                                  {
                                    uploadStates[index] === "success" ?
                                      <Box pb={1} className={classes.uploadSuccess}>
                                        <Typography>Upload Success ({total[index] !== undefined && total[index].toFixed(2)}MB/{loaded[index] !== undefined && loaded[index].toFixed(2)}MB at {speed[index] !== undefined && speed[index].toFixed(2)}MB/s)</Typography>
                                      </Box> : ''
                                  }
                                  {
                                    uploadStates[index] === "failure" ?
                                      <Box pb={1} className={classes.uploadFailure}>
                                        <Typography>Upload Failure ({total[index] !== undefined && total[index].toFixed(2)}MB/{loaded[index] !== undefined && loaded[index].toFixed(2)}MB at {speed[index] !== undefined && speed[index].toFixed(2)}MB/s)</Typography>
                                      </Box> : ''
                                  }
                                  {/* <Button variant="contained" color="secondary" size="small" onClick={(event) => handleRemoveFile(event, acceptedFile)}>
                                    <DeleteIcon />
                                    <Typography>Remove</Typography>
                                  </Button> */}
                                </div>
                              </GridItem>
                            </GridContainer>
                          </div>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
              {/* step 2 part select language */}
              {
                activeStep >= 1 ?
                  <Grid item className={classes.padding20}>
                    <div className={classes.stepTitle}>Step 2: Add Details</div>
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
                      </Grid>
                    </Grid>

                  </Grid>
                  :
                  ''
              }
              {/* step 3 part payment part */}
              {
                activeStep >= 2 ?
                  <Grid item className={classes.padding20}>
                    <div className={classes.stepTitle}>Step 3: Payment</div>
                    <Grid container>
                      <Grid item>
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
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  ''
              }
              {/* step 4 part start transcribe */}
              {
                activeStep >= 3 ?
                  <Grid item className={classes.padding20}>
                    <div className={classes.stepTitle}>Step 4: Start Transcribe</div>
                    <Grid container>
                      <Grid item>
                        <Box pt={2} >
                          <Button variant="contained" color="primary" size="large" onClick={(event) => handleTranscribeStart()}>
                            <RecordVoiceOverIcon />
                            <Typography className={classes.iconBtnTextPos}>Start Transcribing Now</Typography>
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  ''
              }
              {/* step 5 part transcribing part */}
              {
                activeStep >= 4 ?
                  <Grid item className={classes.padding20}>
                    <div className={classes.stepTitle}>Step 5: Transcribing</div>
                    <Grid container>
                      <Grid item>
                        <Box pt={2} >
                          {
                            allTranscribeState === 'transcribing' ?
                              <div>
                                <CircularProgress size={14} color="secondary" /> {transcribeStates.length}Files are transcribing
                            </div>
                              :
                              ''
                          }
                          {transcribedFiles.map((transcribedFile, index) => {
                            return (
                              <div key={index}>
                                <Box pt={1}>
                                  <Button variant="contained" color="secondary" size="small" >
                                    <Typography className={classes.iconBtnTextPos}>View Content of {transcribedFile.file_name}</Typography>
                                  </Button>
                                </Box>
                                <Box pt={1}>
                                  <div>
                                    {
                                      transcribedFile.transcript !== undefined && transcribedFile.transcript
                                    }
                                  </div>
                                </Box>
                              </div>
                            );
                          })}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  :
                  ''
              }
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

UploadMedia.layout = Admin;

export default UploadMedia;

