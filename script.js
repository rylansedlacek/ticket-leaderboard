function fetchLeaderboardData() {
    const gistId = '1c76a038b0d4f62ebda6433201662f3b'; 

    fetch(`https://api.github.com/gists/${gistId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard data');
        }
        return response.json();
    })
    .then(data => {
        if (data.files && data.files['leaderboard.json']) {
            const content = data.files['leaderboard.json'].content;
            leaderboardData = content.trim() === '{}' ? [] : JSON.parse(content);
            console.log('Leaderboard Data:', leaderboardData); // Debug logging
        } else {
            leaderboardData = []; 
            console.log('Leaderboard Data:', leaderboardData); 
        }
        updateLeaderboardUI();
    })
    .catch(error => {
        console.error('Error fetching leaderboard data:', error);
    });
}

function updateLeaderboardUI() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.querySelector('tbody').innerHTML = '';


    if (!Array.isArray(leaderboardData)) {
        console.error('leaderboardData is not an array:', leaderboardData);
        return;
    }

    leaderboardData.forEach(participant => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${participant.name}</td><td>${participant.car}</td><td>${participant.tickets}</td><td>${participant.date}</td>`;
        leaderboard.querySelector('tbody').appendChild(newRow);
    });
}

function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const car = document.getElementById('car').value;
    const tickets = parseInt(document.getElementById('tickets').value || 0);
    const action = document.querySelector('input[name="action"]:checked').value;


    const existingParticipantIndex = Array.isArray(leaderboardData) ? leaderboardData.findIndex(participant => participant.name === name) : -1;

    if (action === "update" && existingParticipantIndex !== -1) {
        const date = new Date().toISOString(); // Current date and time
        leaderboardData[existingParticipantIndex].tickets += tickets;
        leaderboardData[existingParticipantIndex].date = date;
    } else {
        leaderboardData.push({ name, car, tickets });
    }

    updateLeaderboardUI();
    updateLeaderboardData();
}

function updateLeaderboardData() {
    const jsonData = JSON.stringify(leaderboardData);

    const accessToken = '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'; 
    const gistId = '1c76a038b0d4f62ebda6433201662f3b'; 

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

let leaderboardData = [];
fetchLeaderboardData();

document.getElementById('signup-form').addEventListener('submit', handleSubmit);
