const apiUrl = 'https://664f38c0fafad45dfae2e067.mockapi.io/tickets';

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
            const response = await fetch(apiUrl);
            const data = await response.json();
            const existingEntry = data.find(entry => entry.name === name && entry.car === car);

            if (existingEntry) {
                await fetch(`${apiUrl}/${existingEntry.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, car, tickets })
                });
            } else {
                await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, car, tickets })
                });
            }
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
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        data.forEach(({ name, car, tickets }) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${name}</td><td>${car}</td><td>${tickets}</td>`;
            leaderboard.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching leaderboard: ", error);
    }
}

// Fetch leaderboard on page load
window.onload = fetchLeaderboard;
