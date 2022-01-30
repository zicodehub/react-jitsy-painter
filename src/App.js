import { JitsiMeeting } from '@jitsi/web-sdk';
import React, { useRef, useState } from 'react';
import CONFIG from './configs'
import INTERFACE from './interface_configs'

const AppStyle = {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: 'red',
}


const App = () => {
    const apiRef = useRef();
    const apiRefNew = useRef();
    const [ logItems, updateLog ] = useState([]);
    const [ showNew, toggleShowNew ] = useState(false);
    const [ knockingParticipants, updateKnockingParticipants ] = useState([]);

    const printEventOutput = payload => {
        updateLog(items => [ ...items, JSON.stringify(payload) ]);
    };

    const handleAudioStatusChange = (payload, feature) => {
        if (payload.muted) {
            updateLog(items => [ ...items, `${feature} off` ])
        } else {
            updateLog(items => [ ...items, `${feature} on` ])
        }
    };

    const handleChatUpdates = (payload, ref) => {
        if (payload.isOpen || !payload.unreadCount) {
            return;
        }
        ref.current.executeCommand('toggleChat');
        updateLog(items => [ ...items, `you have ${payload.unreadCount} unread messages` ])
    };

    const handleKnockingParticipant = payload => {
        updateLog(items => [ ...items, JSON.stringify(payload) ]);
        updateKnockingParticipants(participants => [ ...participants, payload?.participant ])
    };

    const resolveKnockingParticipants = (ref, condition) => {
        knockingParticipants.forEach(participant => {
            ref.current.executeCommand('answerKnockingParticipant', participant?.id, condition(participant));
            updateKnockingParticipants(participants => participants.filter(item => item.id === participant.id));
        });
    };

    const handleJitsiIFrameRef1 = iframeRef => {
        
        let style  = iframeRef.style
        style.height = "90%"
        
    };


    const handleApiReady = (apiObj, ref) => {
        ref.current = apiObj;
        ref.current.addEventListeners({
            // Listening to events from the external API
            audioMuteStatusChanged: payload => handleAudioStatusChange(payload, 'audio'),
            videoMuteStatusChanged: payload => handleAudioStatusChange(payload, 'video'),
            raiseHandUpdated: printEventOutput,
            tileViewChanged: printEventOutput,
            chatUpdated: payload => handleChatUpdates(payload, ref),
            knockingParticipant: handleKnockingParticipant
        });
    };

    const renderLog = () => logItems.map(
        (item, index) => (
            <div style={{
                fontFamily: 'monospace',
                padding: '5px'
            }} key={index}>{item}</div>
        )
    );

    const renderSpinner = () => (
        <div style={{
            fontFamily: 'sans-serif',
            textAlign: 'center'
        }}>Loading..</div>
    );


    return (
        <div id="main" style={AppStyle} >
            <h1 style={{
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}>Projet de Programmation répartie</h1>
        
            <JitsiMeeting
                domain="meet.jit.si"
                spinner={renderSpinner}
                onApiReady={externalApi => handleApiReady(externalApi, apiRef)}
                getIFrameRef={handleJitsiIFrameRef1}
                configOverwrite={CONFIG}
                interfaceConfigOverwrite={INTERFACE}
            />

        </div>
    );
};

export default App;