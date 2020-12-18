import { makeStyles } from "@material-ui/core/styles";
// styles
const uploadMediaStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  displayFlex: {
    display: "flex"
  },
  cardBody: {
    paddingBottom: "50px"
  },
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  dropzone: {
    minHeight: "148px",
    border: "4px dashed #3d58ec",
    padding: "10px 50px 40px 50px"
  },
  ErrorOutlineIcon: {
    fontSize: "16px",
    marginLeft: "5px",
    marginTop: "-5px"
  },
  padding20: {
    padding: "20px 0"
  },
  circularProgress: {
    fontSize: "20px"
  },
  spaceBetween: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  stepTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#3f51b5",
  },
  uploading: {
    fontWeight: '700',
    color: '#3f51b5'
  },
  uploadSuccess: {
    fontWeight: '700',
    color: 'green'
  },
  uploadFailure: {
    fontWeight: '700',
    color: '#c51162'
  },
  formControl: {
    minWidth: "240px"
  },
  iconBtnTextPos: {
    marginLeft: "10px"
  },
}));
export default uploadMediaStyles;