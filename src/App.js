import React, { useState, useEffect } from 'react';
import "./App.css"

function JitsiMeetComponent() {
    const [room, setRoom] = useState('')
    const [name, setName] = useState('')
    const [start, setStart] = useState(false)    
    const [running, setRunning] = useState(false)    
    
    let id = 1
    
    const containerStyle = {
        width: '100%',
        height: '100vh',
        display: "flex"
    };

    const jitsiContainerStyle = {
        display:  'block',
        width: '50%',
        height: '100%',
    }

    const paintContainerStyle = {
        display:  'block',
        width: '50%',
        height: '100%',
    }

    let startConference = () => {
        try {
            const domain = 'meet.jit.si';
            const options = {
                roomName: room,
                userInfo: {
                    email: 'email@jitsiexamplemail.com',
                    displayName: name
                },
                parentNode: document.getElementById('jitsi-container'+id),
                interfaceConfigOverwrite: {
                    filmStripOnly: false,
                    SHOW_JITSI_WATERMARK: false,
                },
                configOverwrite: {
                    disableSimulcast: false,
                },
            };

            const api = new window.JitsiMeetExternalAPI(domain, options);
            window.zo = api

        } catch (error) {
            console.error('Failed to load Jitsi API', error);
        }
    }
    
    useEffect(()=> {
        id++
        if(start && !running) setRunning(true)
        try {
            setTimeout(() => {
                document.getElementById('jitsiConferenceFrame1').style.display = 'none'} , 5000)
        } catch {}
    })

    const renderJitsi = () => (
        <div id={"jitsi-container"+id} style={jitsiContainerStyle} />
    )
    
    const renderPaint = () => {
        if(running) return <iframe src={"https://chatpaint.herokuapp.com/?&name="+name} style={paintContainerStyle} />
        else if (start) return <h1> Espace de dessin collectif </h1>
        else return null
    }
    const renderForm = () => (
        <form>
            <input id='room' type='text' placeholder='Room' 
                value={room} onChange={(e) => setRoom(e.target.value)} />
            <input id='name' type='text' placeholder='Name' 
                value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleClick} type='submit'>
                Commencer
            </button>
        </form>
    )
    
    const handleClick = event => {
        event.preventDefault()
        if (room !== '' && name !== '' && !start) setStart(true)
    }
    return (
        <div style={containerStyle} >
            {renderJitsi()}
            {renderPaint()}
            {start ? ( running ?  null : startConference() ) : renderForm()}
        </div>
    );
}

export default JitsiMeetComponent;