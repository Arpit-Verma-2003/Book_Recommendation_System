function handleGenreSelection() {
  var genreDropdown = document.getElementById('genre');
  var customGenreInput = document.getElementById('customGenre');

  if (genreDropdown.value === 'other') {
    customGenreInput.style.display = 'block';
  } else {
    customGenreInput.style.display = 'none';
  }
}


function getRecommendations() {
  var genreDropdown = document.getElementById('genre');
  var customGenreInput = document.getElementById('customGenre');
  var genre = genreDropdown.value === 'custom' ? customGenreInput.value : genreDropdown.value;
  var writer = document.getElementById('writer').value;

  // Clear previous recommendations
  var recommendationsContainer = document.getElementById('recommendations');
  recommendationsContainer.innerHTML = '';

  // Make API request to Google Books API
  var query = '';

  if (genre !== '') {
    query += 'subject:' + genre;
  }

  if (genre !== '' && writer !== '') {
    query += '+';
  }

  if (writer !== '') {
    query += 'inauthor:' + writer;
  }

  var url = 'https://www.googleapis.com/books/v1/volumes?q=' + query + '&maxResults=10';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      var books = data.items;

      if (!books || books.length === 0) {
        recommendationsContainer.innerHTML = '<li>No recommendations found.</li>';
        return;
      }

      books.forEach(book => {
        var title = book.volumeInfo.title;
        var authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown';
        var imageLink = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'no-image.jpg';

        var li = document.createElement('li');
        var img = document.createElement('img');
        var h3 = document.createElement('h3');
        var p = document.createElement('p');

        img.src = imageLink;
        h3.innerText = title;
        p.innerText = authors;

        li.appendChild(img);
        li.appendChild(h3);
        li.appendChild(p);

        recommendationsContainer.appendChild(li);
      });
    })
    .catch(error => {
      recommendationsContainer.innerHTML = '<li>Error: ' + error.message + '</li>';
    });
}

// Call the getRecommendations function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  getRecommendations();
});
