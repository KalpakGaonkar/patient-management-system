/* eslint-disable react-hooks/exhaustive-deps */
import React ,{useState,useEffect} from "react"
import { Form } from "react-bootstrap"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import HomeIcon from '@material-ui/icons/Home';
import PhoneAndroidTwoToneIcon from '@material-ui/icons/PhoneAndroidTwoTone';

const PatientForm = (props) => {
    const initialFieldValues= {
        fullName:"",
        mobile:"",
        email:"",
        address:""
    }
    var [values,setValues] = useState(initialFieldValues)

    useEffect(() => {
        if(props.currentId === '')
            setValues({
                ...initialFieldValues
            })
        else
            setValues({
                ...props.patientObjects[props.currentId]
            })
    }, [ props.currentId, props.patientObjects])

    const handleInputChange = e =>{
        var {name, value} = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleFormSubmit = e =>{
        e.preventDefault();
         props.addOrEdit(values);
    };
    return (
        <Form autoComplete="off" onSubmit={handleFormSubmit}>
            <div className="form-group input-group">
                <div className="input-group-prepend">
                    <div className="input-group-test">
                        <AccountBoxRoundedIcon/>
                    </div>
                </div>
                <input className="form-control" placeholder="Full Name" name="fullName" value={values.fullName} onChange={handleInputChange}/>
            </div>
            <div className="form-row">
            <div className="form-group input-group col-md-6">
                <div className="input-group-prepend">
                    <div className="input-group-test">
                        <PhoneAndroidTwoToneIcon/>
                    </div>
                </div>
                <input className="form-control" placeholder="Mobile" name="mobile" value={values.mobile} onChange={handleInputChange} />
            </div>
            <div className="form-group input-group col-md-6">
                <div className="input-group-prepend">
                    <div className="input-group-test">
                        <MailOutlineIcon/>
                    </div>
                </div>
                <input className="form-control" placeholder="Email" name="email" value={values.email} onChange={handleInputChange}/>
            </div>
            <div>
            <div className="form-group" style={{width:"450px"}}>
                {/* <div className="input-group-prepend">
                    <div className="input-group-test">
                    <HomeIcon/>
                    </div>
                </div> */}
                <textarea  className="form-control" placeholder="Address" name="address" value={values.address} onChange={handleInputChange}></textarea>
            </div>
            <div className="form-group">
                <input type="submit" onClick={handleFormSubmit} value={props.currentId === "" ?"Save":"Update"} className="btn btn-primary btn-block"></input>
            </div>
            </div>
            </div>
        </Form>
    );
}
export default PatientForm;