import { ref, push, set } from "firebase/database";
import {database} from "./firebase.js";

export async function postMessage(Message){    
    try {
        const messageRef = ref(database, 'messages');
        const newMessageRef = await push(messageRef, Message);
        return { success: true, id: newMessageRef.key, message: "Message posted successfully"};
    } catch (error) {
        console.error("Error posting message:", error);
        return { success: false, message: "Error posting message" };
    }
}


export async function profanityCheckAndPost(message) {
    try {
        const res = await fetch('https://vector.profanity.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log(data)
       if(data.isProfanity == true){
        return {isProfanity: true};
       }
       else{
        return {isProfanity: false};
       }
       
    } catch (error) {
        console.error("Error checking profanity:", error);
        return false; 
    }
}




export async function removeMessageById(id) {
    try {
        const messageRef = ref(database, `messages/${id}`);
        await set(messageRef, null);
        console.log(`Message with ID: ${id} removed successfully.`);
    } catch (error) {
        console.error(`Error removing message with ID: ${id}`, error);
    }
}
