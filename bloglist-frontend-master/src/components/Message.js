import React from 'react';
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap';
const Message = (props) =>
{
    if(!props.notification.message){
        return null;
    }
    if(props.notification.error===true){
        return(
            <Alert variant="danger">
                {props.notification.message} 
            </Alert>
        )
    }
    else{
        return(
            <Alert variant="success">
                {props.notification.message} 
            </Alert>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}
export default connect(
    mapStateToProps,
    null
  )(Message)
  