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


export async function removeMessageById(id) {
    try {
        const messageRef = ref(database, `messages/${id}`);
        await set(messageRef, null);
        console.log(`Message with ID: ${id} removed successfully.`);
    } catch (error) {
        console.error(`Error removing message with ID: ${id}`, error);
    }
}
