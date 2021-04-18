/* eslint-disable jsx-a11y/anchor-is-valid */
import React , {useState, useEffect} from "react"
import PatientForm from "./PatientForm"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {storage} from "../../firebase"
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import fireDb from '../../firebase'
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';


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
      width: 435,
      height: 200,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const Patient = () => {

    var [patientObjects, setPatientObjects] = useState ({})
    var [currentId, setCurrentId] = useState('')
    var ImgName, ImgUrl,files

    // useEffect(() => {
    //     fireDb.auth.onAuthStateChanged((id) => {
    //         setCurrentId(id);
    //     });
    //     return () => {
    //     }
    // }, [])
    
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
  const [ stage, setStage ] = useState('');

  const handleOpen = key => {
    setOpen(true)
    handleUpload(key)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = e => {
    if (e.target.files[0]){
        setImage(e.target.files[0]);
        }
    }
            
    const handleUpload = key => {
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }
        const uploadTask = fireDb.storage().ref(`images/${key} ${Date()}`).put(image);

        var metadata = { cotentType: 'image/jpeg', };

        uploadTask.on(
            "state_changed",
            function(snapshot){
                // var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;  progress bar..not required
            },
            
            function(error){
                alert("Error saving the image!")
            },
            function(){
                uploadTask.snapshot.ref.getDownloadURL().then(function(url){
                    ImgUrl=url;
                    
                    fireDb.database().ref(`patients/`).child(`${key}`).update({imageUrl:ImgUrl, alzStage:stage
                    })
                    
                });
            }
        )
        
        console.log("image:",key)
        }
        
    

  
    return (
        <>
        {currentId.displayName}

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
                                        <td><Link to={'/viewpatient/'+id}>{patientObjects[id].fullName}</Link></td>
                                        <td>{patientObjects[id].mobile} </td>
                                        <td>{patientObjects[id].email} </td>
                                        <td>
                                            <a className='btn text-primary' onClick={() => setCurrentId(id) } >
                                                <FontAwesomeIcon icon='pencil-alt' />
                                            </a>
                                            <a className='btn text-danger' onClick={() => deleteDetail(id)}>
                                                <FontAwesomeIcon icon='trash-alt' />
                                            </a>
                                            <a className='btn' onClick={() => handleOpen(id) }>
                                                <FontAwesomeIcon icon='upload' />
                                            </a>
                                            
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="simple-modal-title"
                                                aria-describedby="simple-modal-description"
                                            >
                                                {
                                                    <div style={modalStyle} className={classes.paper}>
                                                    <h2 id="simple-modal-title">Upload patients latest MRI Scan</h2>
                                                    {/* <p>{currentId}</p> */}
                                                    <p id="simple-modal-description">
                                                      Select Image in .jpg format
                                                    </p>
                                                    <input type='file' id='image' onChange={handleChange} ></input>
                                                          {/* <button onClick={() => handleUpload} >Upload</button> */}
                                                          <Button
                                                            variant="contained"
                                                            color="primary"
                                                            className={classes.button}
                                                            size="small"
                                                            startIcon={<CloudUploadIcon />}
                                                            onClick={() => handleUpload} 
                                                        >
                                                            Upload
                                                        </Button>
                                                  </div>
                                                }
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