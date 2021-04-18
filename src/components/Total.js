// import React from 'react';
import React , {useState, useEffect} from "react"
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Navbar/Navbar';
import fireDb from './../firebase'

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits() {

  var [patientObjects, setPatientObjects] = useState ()
  var [dateAndTime, setDateAndTime ] = useState()

  useEffect(() => {
    fireDb.database().ref('patients').once('value', snapshot=>{
      if(snapshot.val() != null)
        setPatientObjects(snapshot.numChildren());
      else
      setPatientObjects(0)
        // console.log(a);
    } )
    if (!Date.now) {
      Date.now = function() { return new Date().getTime(); }
  }
  let s = Date();
  var array = s.split(" ");
  var text = "";
  for (var i = 0; i < 5; i++)
   {
    text = text + " " + array[i];
    // console.log(text);
    setDateAndTime(text);
  }
  // console.log(array);
  //   console.log(text);
}, [])

  const classes = useStyles();
  return (
    <React.Fragment>
      <Title><h3>Total Patients</h3></Title>
      <Typography component="p" variant="h4">
        {patientObjects}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        <h5><b>Last updated on: </b></h5>
        
        <h6>{dateAndTime}</h6>
      </Typography>
      {/* <div>
        <Link color="primary" href="/patienttab" >
          View Patient List
        </Link>
      </div> */}
    </React.Fragment>
  );
}