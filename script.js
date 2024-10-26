document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();

    const longUrl = document.getElementById('long-url').value;
    const apiUrl = 'https://6bzcoscgfc.execute-api.us-east-1.amazonaws.com/dev/shorten';
    const resultSection = document.getElementById('result-section');

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longURL: longUrl })
    })
        .then(response => response.json())
        .then(data => {
            const shortUrl = `https://omteja04.github.io/levi/?code=${data.body.shortURL}`;

            document.getElementById('shortUrlDisplay').innerHTML = `<a href="${shortUrl}" target="_blank" style="color: white;">${shortUrl}</a>`;
            resultSection.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
});

// Redirect logic
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const shortCode = urlParams.get('code');

    if (shortCode) {
        const apiUrl = `https://6bzcoscgfc.execute-api.us-east-1.amazonaws.com/dev/${shortCode}`;

        // Fetch the long URL from the API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.statusCode === 302) {
                    // Redirect to the long URL
                    window.location.href = data.headers.Location;
                } else {
                    throw new Error('Short URL not found');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.body.innerHTML = '<h1>Short URL not found</h1>';
            });
    }
});



function copyToClipboard() {
    const textToCopy = document.getElementById('shortUrlDisplay').innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Short URL copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}