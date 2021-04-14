/* eslint-disable jsx-a11y/anchor-is-valid */
import React , {useState, useEffect, Component } from "react"
import PatientForm from "./PatientForm"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {firestore, storage} from "../../firebase"
import { Link } from "react-router-dom"
import { Inset } from "@winderful/react-spacing"
import Box from '@material-ui/core/Box'
import Popup from '../Popup'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import fireDb from '../../firebase'
import { positions } from '@material-ui/system'
import axios from 'axios';
import Button from 'react-bootstrap/Button'




function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }



  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const Patient = () => {

    

    var [patientObjects, setPatientObjects] = useState ({})
    var [buttonPopup, setButtonPopup] = useState(false)
    var [currentId, setCurrentId] = useState('')

    useEffect(() => {
        fetch("/predict").then(response =>
            response.json().then(data => {
                console.log(data);
            })
            );
    }, []);
    
    
    useEffect(() => {
        fireDb.database().ref('patients').on('value', snapshot=>{
            if(snapshot.val() != null)
                setPatientObjects({
                    ...snapshot.val()
                })
            else
                setPatientObjects({})
        } )
    }, [])

    const deleteDetail = key => {
        if(window.confirm('Are you sure you want to delete this record?')){
            fireDb.database().ref(`patients/${key}`).remove(
                err => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        setCurrentId('')
                    }
                }
            )
        }
        
    }

    const addOrEdit = obj =>{
        if (currentId===""){
            fireDb.database().ref('patients').push(
                obj,
                err => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        setCurrentId('')
                    }
                }
            )
        }
        else{
            fireDb.database().ref(`patients/${currentId}`).set(
                obj,
                err => {
                    if(err){
                        console.log(err)
                    }
                    else{
                        setCurrentId('')
                    }
                }
            )
        }
    }
    const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [ image,setImage ] = useState(null);
  const [stage, setStage] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = e => {
    if (e.target.files[0]){
        setImage(e.target.files[0]);
        }
        var self = this;
        // const formData = new FormData()
        // formData.append('file', e.target.files[0], 'img.png')
        
        // axios.post('https://alzheimers-stage-prediction.herokuapp.com/predict', formData)
        // .then(function(response, data) {
        //         data = response.data;
        //         console.log(data);
        //         setStage(data);
                
        //         })
        // console.log(stage)
        
    }
            
    const handleUpload = () => {
        
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            snapshot => {},
            error => {
                console.log(error);
            },
            () => {
                storage.ref("images").child(image.name)
            }
        )
        // setStage('');
        }
        // console.log(stage)
    console.log("image:",image)
  
    
    const body = (
    
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Upload patients latest MRI Scan</h2>
      <p id="simple-modal-description">
        Select Image in .jpg format
      </p>
      <input type='file' onChange={handleChange} ></input>
      {stage.length > 0 &&
            <button type="submit" onClick={handleUpload} >Upload</button>
      
    }
    {stage.length > 0 &&
        <Box border={2} width="auto" mx="auto" mt={3} p={2} position="center" bgcolor="grey.700" color="white" fontWeight="fontWeightBold">
            { stage }
        </Box>}   
            </div>
    );
    return (
        <>

            <div className="row">
                <div className="col-md-5">
                <div >
                <br></br>
                <br></br>
                <h3 className="display-6 text-center">Add a new Patient</h3>
                
            </div>
                    {/* <PatientForm {...([addOrEdit, currentId, patientObjects])} /> */}
                    <PatientForm {...({addOrEdit,currentId,patientObjects})} />
                </div>
                <div className="col-md-7">
                <br></br>
                <br></br>
                    <div style={{marginLeft:180}}><h3>List Of Patients</h3></div>
                    <table className="table table-borderless table-stripped">
                        <thead className="thead-light">
                            <tr>
                            <th>Full Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys(patientObjects).map(id =>{
                                    return <tr key={id}>
                                        <td><Link to='/'>{patientObjects[id].fullName}</Link></td>
                                        <td>{patientObjects[id].mobile} </td>
                                        <td>{patientObjects[id].email} </td>
                                        <td>
                                            <a className='btn text-primary' onClick={() => setCurrentId(id) } >
                                                <FontAwesomeIcon icon='pencil-alt' />
                                            </a>
                                            <a className='btn text-danger' onClick={() => deleteDetail(id)}>
                                                <FontAwesomeIcon icon='trash-alt' />
                                            </a>
                                            <a className='btn' onClick={handleOpen }>
                                                <FontAwesomeIcon icon='upload' />
                                            </a>
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="simple-modal-title"
                                                aria-describedby="simple-modal-description"
                                            >
                                                {body}
                                            </Modal>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default Patient;