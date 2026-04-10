const apiUrl = '/api/weblinks';

const weblinkForm = document.getElementById('weblinkForm');
const weblinkList = document.getElementById('weblinkList');
const messageDiv = document.getElementById('message');

const idInput = document.getElementById('weblinkId');
const titleInput = document.getElementById('title');
const urlInput = document.getElementById('url');
const ratingInput = document.getElementById('rating');
const categoryInput = document.getElementById('category');

async function fetchWeblinks() {
    const response = await fetch(apiUrl);
    const data = await response.json();

    weblinkList.innerHTML = '';

    data.forEach(weblink => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${weblink.title}</strong><br>
            URL: ${weblink.url}<br>
            Rating: ${weblink.rating}<br>
            Category: ${weblink.category}<br>
            <div class="actions">
                <button onclick="editWeblink(${weblink.id})">Edit</button>
                <button onclick="deleteWeblink(${weblink.id})">Delete</button>
            </div>
        `;
        weblinkList.appendChild(li);
    });
}

weblinkForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const weblinkData = {
        title: titleInput.value,
        url: urlInput.value,
        rating: Number(ratingInput.value),
        category: categoryInput.value
    };

    const id = idInput.value;

    if (id) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(weblinkData)
        });
        showMessage('Weblink updated successfully');
    } else {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(weblinkData)
        });
        showMessage('Weblink added successfully');
    }

    weblinkForm.reset();
    idInput.value = '';
    fetchWeblinks();
});

async function editWeblink(id) {
    const response = await fetch(`${apiUrl}/${id}`);
    const weblink = await response.json();

    idInput.value = weblink.id;
    titleInput.value = weblink.title;
    urlInput.value = weblink.url;
    ratingInput.value = weblink.rating;
    categoryInput.value = weblink.category;

    showMessage('Editing selected weblink');
}

async function deleteWeblink(id) {
    const confirmed = confirm('Are you sure you want to delete this weblink?');

    if (!confirmed) {
        return;
    }

    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    showMessage('Weblink deleted successfully');
    fetchWeblinks();
}

function showMessage(message) {
    messageDiv.textContent = message;
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 2500);
}

fetchWeblinks();