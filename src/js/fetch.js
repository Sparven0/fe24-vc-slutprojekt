
export async function postMessage(Message){
    const response = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Message)
    });
    return response;
}