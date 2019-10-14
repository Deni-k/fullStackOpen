import React from 'react';
const Message = ({message, error}) =>
{
    const messageStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }
    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    if(message=== null){
        return null;
    }
    if(error===true){
        return(
            <div style={errorStyle}>
                {message} 
            </div>
        )
    }
    return(
        <div style={messageStyle}>
           {message} 
        </div>
    )
}
export default Message;