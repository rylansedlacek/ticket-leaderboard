// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDjGkW4t8TEe_tI6Zgrw_BUuZ5-8rRn7k",
  authDomain: "ticket2-3b63e.firebaseapp.com",
  databaseURL: "https://ticket2-3b63e-default-rtdb.firebaseio.com",
  projectId: "ticket2-3b63e",
  storageBucket: "ticket2-3b63e.appspot.com",
  messagingSenderId: "1083023057759",
  appId: "1:1083023057759:web:c33f1ce6cd14ca0820ccea",
  measurementId: "G-DCKJFTP836"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nameInput = document.getElementById('name');
const carInput = document.getElementById('car');
const ticketsInput = document.getElementById('tickets');
const leaderboard = document.getElementById('leaderboard');

async function addOrUpdateEntry() {
    const name = nameInput.value.trim();
    const car = carInput.value.trim();
    const tickets = parseInt(ticketsInput.value.trim(), 10);

    if (name && car && !isNaN(tickets)) {
        const docId = `${name}_${car}`;

        try {
            await setDoc(doc(db, 'tickets', docId), { name, car, tickets });
            console.log("Document successfully written!");
            fetchLeaderboard();
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    } else {
        alert('Please fill in all fields.');
    }
}

async function fetchLeaderboard() {
    leaderboard.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'tickets'));
    querySnapshot.forEach((doc) => {
        const { name, car, tickets } = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `<td>${name}</td><td>${car}</td><td>${tickets}</td>`;
        leaderboard.appendChild(row);
    });
}

// Fetch leaderboard on page load
window.onload = fetchLeaderboard;
