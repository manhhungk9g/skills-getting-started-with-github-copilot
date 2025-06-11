document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/activities');
        const activities = await response.json();
        
        const container = document.getElementById('activities-container');
        
        Object.entries(activities).forEach(([activityName, activityData]) => {
            const card = createActivityCard(activityName, activityData);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading activities:', error);
    }
});

function createActivityCard(name, data) {
    const card = document.createElement('div');
    card.className = 'activity-card';
    
    const participantsList = data.participants.length > 0 
        ? `<ul class="participants-list">
            ${data.participants.map(email => `<li>${email}</li>`).join('')}
           </ul>`
        : `<div class="no-participants">No participants yet</div>`;
    
    card.innerHTML = `
        <h3 class="activity-title">${name}</h3>
        <p class="activity-description">${data.description}</p>
        <div class="activity-schedule">📅 ${data.schedule}</div>
        <div class="activity-capacity">
            Capacity: ${data.participants.length}/${data.max_participants} participants
        </div>
        
        <div class="participants-section">
            <h4 class="participants-title">Current Participants</h4>
            ${participantsList}
        </div>
        
        <button class="signup-button" onclick="signupForActivity('${name}')">
            Sign Up for ${name}
        </button>
    `;
    
    return card;
}

async function signupForActivity(activityName) {
    const email = prompt('Enter your email address:');
    if (!email) return;
    
    try {
        const response = await fetch(`/activities/${encodeURIComponent(activityName)}/signup?email=${encodeURIComponent(email)}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert(`Successfully signed up for ${activityName}!`);
            location.reload(); // Refresh to show updated participants
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail}`);
        }
    } catch (error) {
        alert('Error signing up. Please try again.');
        console.error('Signup error:', error);
    }
}
