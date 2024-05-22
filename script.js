function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const car = document.getElementById('car').value;
    const tickets = parseInt(document.getElementById('tickets').value || 0);
    const action = document.querySelector('input[name="action"]:checked').value;

    // Check if the participant already exists
    const existingParticipantIndex = leaderboardData.findIndex(participant => participant.name === name);

    if (action === "update" && existingParticipantIndex !== -1) {
        // If participant exists and action is update, update their tickets and date
        const date = new Date().toISOString(); // Current date and time
        leaderboardData[existingParticipantIndex].tickets += tickets;
        leaderboardData[existingParticipantIndex].date = date;
    } else {
        // If participant doesn't exist or action is sign up, add them to the leaderboard
        leaderboardData.push({ name, car, tickets });
    }

    // Update the leaderboard on the webpage
    updateLeaderboardUI();

    // Update the leaderboard data on GitHub
    updateLeaderboardData();
}

// Function to update the leaderboard on the webpage
function updateLeaderboardUI() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.querySelector('tbody').innerHTML = '';

    leaderboardData.forEach(participant => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${participant.name}</td><td>${participant.car}</td><td>${participant.tickets}</td><td>${participant.date}</td>`;
        leaderboard.querySelector('tbody').appendChild(newRow);
    });
}

// Function to update the leaderboard data on GitHub
function updateLeaderboardData() {
    const jsonData = JSON.stringify(leaderboardData);

    // Update the leaderboard data on GitHub using the GitHub API
    const accessToken = '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'; // Replace with your GitHub access token
    const gistId = '1c76a038b0d4f62ebda6433201662f3b'; // Replace with the ID of your GitHub Gist

    fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            files: {
                'leaderboard.json': {
                    content: jsonData
                }
            }
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Leaderboard data updated successfully!');
        } else {
            throw new Error('Failed to update leaderboard data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Initialize leaderboard data
let leaderboardData = [];

// Fetch leaderboard data from GitHub on page load
fetchLeaderboardData();

// Function to fetch leaderboard data from GitHub
function fetchLeaderboardData() {
    const gistId = '1c76a038b0d4f62ebda6433201662f3b'; // Replace with the ID of your GitHub Gist

    fetch(`https://api.github.com/gists/${gistId}`)
    .then(response => response.json())
    .then(data => {
        if (data.files && data.files['leaderboard.json']) {
            leaderboardData = JSON.parse(data.files['leaderboard.json'].content);
            updateLeaderboardUI();
        }
    })
    .catch(error => {
        console.error('Error fetching leaderboard data:', error);
    });
}

// Event listener for form submission
document.getElementById('signup-form').addEventListener('submit', handleSubmit);
