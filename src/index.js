 // Variable declarations to reference different HTML elements on the page
const filmListElem = document.getElementById("films");
const moviePosterElem = document.getElementById("poster");
const movieTitleElem = document.getElementById("title");
const durationElem = document.getElementById("runtime");
const movieDescriptionElem = document.getElementById("film-info");
const screeningTimeElem = document.getElementById("showtime");
const availableTicketsElem = document.getElementById("ticket-num");
const buyButtonElem = document.getElementById("buy-ticket");
//  removes all child elements from the element and replaces them with new child elements.
filmListElem.replaceChildren();  

// Function to fetch movie details from the server
function fetchMovieDetails(id) {
  fetch(`http://localhost:3000/films/${id}`)
    .then(response => response.json())
    .then(cinema => {
      displayMovieDetails(cinema);
      
    })
    
}

// Function to display movie details on the webpage
function displayMovieDetails(cinema) {
  movieTitleElem.textContent = cinema.title;
  durationElem.textContent = `${cinema.runtime} minutes`;
  movieDescriptionElem.textContent = cinema.description;
  screeningTimeElem.textContent = cinema.showtime;
  moviePosterElem.src = cinema.poster;

  let ticketsRemaining = cinema.capacity - cinema.tickets_sold;
  availableTicketsElem.textContent = ticketsRemaining;

  
}

// Function to update the ticket count and handle the "Sold Out" status
function updateTicketStatus(ticketsRemaining) {
  buyButtonElem.addEventListener("click", (event) => {
    event.preventDefault();

    if (ticketsRemaining > 0) {
      ticketsRemaining--;
      availableTicketsElem.textContent = ticketsRemaining;
      updateTicketsStatusOnTheServer(ticketsRemaining);
      postNewTicket();
    } else {
      buyButtonElem.innerHTML = "Sold Out";
      buyButtonElem.disabled = true;
    }
  });
}

// Function to update tickets_sold on the server
function updateTicketsStatusOnTheServer(ticketsRemaining) {
  const id = 1; // Assuming you are always updating the details for movie with id 1
  fetch(`http://localhost:3000/films/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickets_sold: cinema.capacity - ticketsRemaining,
    }),
  })
    .then(response => response.json())
    .then(updatedCinema => console.log(updatedCinema))
}

// Function to post new ticket to the tickets endpoint
function postNewTicket() {
  const id = 1; // Assuming you are always posting the ticket for movie with id 1
  fetch(`http://localhost:3000/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      film_id: id,
      number_of_tickets: 1,
    }),
  })
    .then(response => response.json())
    .then(newTicket => console.log(newTicket))
   
}

// Function to delete a film from the server
function deleteCinemaDetails(id, cinemaItem) {
  fetch(`http://localhost:3000/films/${id}`, { method: "DELETE" })
    .then(response => response.json())
    .then(details => {
      console.log(details);
      cinemaItem.remove(); // Remove the film from the list after successful deletion
    })
    
}

// Function to display a list of movies and add click event listeners to each movie item
function MovieList() {
  fetch("http://localhost:3000/films")
    .then(response => response.json())
    .then(cinemaList => {
      cinemaList.forEach(cinema => {
        const cinemaItem = createCinemaListItem(cinema);
        filmListElem.append(cinemaItem);
      });
    })
  }
// Function to create a list item for a movie
function createCinemaListItem(cinema) {
  const cinemaItem = document.createElement("li");
  cinemaItem.textContent = cinema.title.toUpperCase();
  cinemaItem.style.color = "blue";

  // Create a delete button for each film
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.color = "gray";
  deleteButton.style.cursor = "pointer";

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    deleteCinemaDetails(cinema.id, cinemaItem);
  });

  cinemaItem.append(deleteButton);

  cinemaItem.addEventListener("click", (event) => {
    event.preventDefault();
    fetchMovieDetails(cinema.id);
  });

  return cinemaItem;
}

// Initialize the movie list on page load
MovieList();