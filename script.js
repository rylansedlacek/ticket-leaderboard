// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9TL3mJCT9a_RajDZdPtnhUQNns_0c6-o",
  authDomain: "ticket-c2705.firebaseapp.com",
  databaseURL: "https://ticket-c2705-default-rtdb.firebaseio.com",
  projectId: "ticket-c2705",
  storageBucket: "ticket-c2705.appspot.com",
  messagingSenderId: "374778677045",
  appId: "1:374778677045:web:e7e1e1c95149e56ffbee7c",
  measurementId: "G-B9W2JBNNHK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

const leaderboardDiv = document.getElementById('leaderboard');
const addUserForm = document.getElementById('add-user-form');

// Function to fetch leaderboard data
async function fetchLeaderboard() {
  const snapshot = await database.ref('leaderboard').orderByChild('num_tickets').once('value');
  const data = snapshot.val();
  displayLeaderboard(data);
}

// Function to display leaderboard data
function displayLeaderboard(data) {
  leaderboardDiv.innerHTML = '';
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headerRow = document.createElement('tr');
  const headers = ['Name', 'Car', 'Num Tickets'];

  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  Object.values(data).forEach(userData => {
    const row = document.createElement('tr');
    Object.values(userData).forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  leaderboardDiv.appendChild(table);
}

// Event listener for form submission
addUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addUserForm);
  const userData = {};
  formData.forEach((value, key) => {
    userData[key] = value;
  });

  // Add/update user data in Firebase
  await database.ref('leaderboard').push(userData);

  // Refresh leaderboard
  fetchLeaderboard();
});

// Initial fetch of leaderboard data
fetchLeaderboard();
