import { makeStyles } from "@material-ui/core/styles";
// styles
const mediaStyles = makeStyles((theme) => ({
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
  datePicker: {
    marginRight: "20px"
  },
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750,
  },
  head: {
    backgroundColor: "#3d58ec",
    color: "white"
  },
  headSortLabel: {
    color: "white"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  iconBtnTextPos: {
    marginLeft: "10px"
  },
  notTranscribed: {
    display: "flex",
    alignItems: "center",
    color: '#f50057',
    fontSize: "16px",
    fontWeight: "700",
  },
  transcribed: {
    display: "flex",
    alignItems: "center",
    color: '#3f51b4',
    fontSize: "16px",
    fontWeight: "700",
  },
  paddingRight20: {
    paddingRight: "20px"
  },
  formControl: {
    minWidth: "240px"
  },
}));

export default mediaStyles;
