/**
 *  AI GENERATED CODE
 *  USED FOR PROOF OF CONCEPT, REFERENCE ONLY
 * 
 *  JavaScript that handles site interaction and helps nodes and users establish WebRTC connections\
 *  Derrived from the webcam example of the aiortc GitHub repository
 */



var pc = null;
var selectedNodeId = null;

/**
 * On page load, fetch the list of available nodes from the server
 * and populate the dropdown menu.
 */
window.onload = async () => {
    const select = document.getElementById('node-select');
    const startButton = document.getElementById('start');
    
    try {
        const response = await fetch('/api/nodes');
        if (!response.ok) {
            throw new Error(`Failed to fetch node list: ${response.statusText}`);
        }
        const nodes = await response.json();
        
        // Clear the 'Loading...' option
        select.innerHTML = '';

        if (nodes.length === 0) {
            let option = document.createElement('option');
            option.value = "";
            option.innerText = "No nodes online";
            option.disabled = true;
            select.appendChild(option);
            startButton.disabled = true; // Disable start button if no nodes
        } else {
            // Add a placeholder
            let placeholder = document.createElement('option');
            placeholder.value = "";
            placeholder.disabled = true;
            placeholder.selected = true;
            placeholder.innerText = "Select a node...";
            select.appendChild(placeholder);

            // Populate with available nodes
            nodes.forEach(nodeId => {
                let option = document.createElement('option');
                option.value = nodeId;
                option.innerText = nodeId;
                select.appendChild(option);
            });
            startButton.disabled = false;
        }
    } catch (e) {
        select.innerHTML = '';
        let option = document.createElement('option');
        option.value = "";
        option.innerText = "Error loading nodes";
        option.disabled = true;
        select.appendChild(option);
        startButton.disabled = true;
        console.error(e);
        alert("Could not fetch node list from the server.");
    }
};


function negotiate() {
    pc.addTransceiver('video', { direction: 'recvonly' });
    // You can also add audio if your nodes support it
    // pc.addTransceiver('audio', { direction: 'recvonly' });

    return pc.createOffer().then((offer) => {
        return pc.setLocalDescription(offer);
    }).then(() => {
        // wait for ICE gathering to complete
        return new Promise((resolve) => {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                const checkState = () => {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });
    }).then(() => {
        var offer = pc.localDescription;
        
        // *** CRUCIAL CHANGE HERE ***
        // The fetch URL is now dynamic based on the selected node.
        return fetch('/offer/' + selectedNodeId, {
            body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }).then((response) => {
        return response.json();
    }).then((answer) => {
        return pc.setRemoteDescription(answer);
    }).catch((e) => {
        alert(e);
        stop(); // Stop on error
    });
}

function start() {
    // 1. Get the selected node from the dropdown
    selectedNodeId = document.getElementById('node-select').value;
    if (!selectedNodeId) {
        alert('Please select a node first!');
        return;
    }

    // 2. Create the RTCPeerConnection (same as before)
    var config = { sdpSemantics: 'unified-plan' };
    if (document.getElementById('use-stun').checked) {
        config.iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];
    }
    pc = new RTCPeerConnection(config);

    // connect video
    pc.addEventListener('track', (evt) => {
        if (evt.track.kind == 'video') {
            document.getElementById('video').srcObject = evt.streams[0];
        }
        // You can uncomment this if you expect audio tracks
        // else {
        //     document.getElementById('audio').srcObject = evt.streams[0];
        // }
    });

    // 3. Update UI and start negotiation
    document.getElementById('start').style.display = 'none';
    document.getElementById('stop').style.display = 'inline-block';
    negotiate();
}

function stop() {
    document.getElementById('stop').style.display = 'none';
    document.getElementById('start').style.display = 'inline-block';
    
    // reset video element
    document.getElementById('video').srcObject = null;

    // close peer connection
    if (pc) {
        setTimeout(() => pc.close(), 500);
    }
}