// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
const db = firebase.firestore();

const nameInput = document.getElementById('name');
const carInput = document.getElementById('car');
const ticketsInput = document.getElementById('tickets');
const leaderboard = document.getElementById('leaderboard');

function addOrUpdateEntry() {
    const name = nameInput.value.trim();
    const car = carInput.value.trim();
    const tickets = parseInt(ticketsInput.value.trim(), 10);

    if (name && car && !isNaN(tickets)) {
        const docId = `${name}_${car}`;

        db.collection('tickets').doc(docId).set({ name, car, tickets })
            .then(() => {
                console.log("Document successfully written!");
                fetchLeaderboard();
            })
            .catch(error => {
                console.error("Error writing document: ", error);
            });
    } else {
        alert('Please fill in all fields.');
    }
}

function fetchLeaderboard() {
    leaderboard.innerHTML = '';
    db.collection('tickets').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const { name, car, tickets } = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `<td>${name}</td><td>${car}</td><td>${tickets}</td>`;
            leaderboard.appendChild(row);
        });
    });
}

// Fetch leaderboard on page load
fetchLeaderboard();
