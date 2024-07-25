document.getElementById('urlForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const longUrl = document.getElementById('longUrl').value;
    const apiUrl = 'https://8oxqs9zlt6.execute-api.us-east-1.amazonaws.com/dev/shorten';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longURL: longUrl })
    })
        .then(response => response.json())
        .then(data => {
            const shortUrl = `https://omteja04.github.io/?code=${data.body.shortURL}`;
            document.getElementById('shortUrlDisplay').innerHTML = `<a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
        })
        .catch(error => console.error('Error:', error));
});
