import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Navbar/Navbar';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function Deposits() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Total Patients</Title>
      <Typography component="p" variant="h4">
        23 Patients
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on 15 March, 2021
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View Patient List
        </Link>
      </div>
    </React.Fragment>
  );
}