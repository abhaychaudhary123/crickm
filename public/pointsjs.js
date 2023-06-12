// Nav functionalities

function fold() {
    var txt = document.getElementsByClassName("h");
    var grid_container = document.getElementsByClassName("grid-container")[0];
    var dashboardContainer = document.getElementsByClassName("dashboard_container")[0];
    for (var i = 0; i < txt.length; i++) {
      if (txt[i].style.display === "none") {
        txt[i].style.display = "grid";
        txt[i].style.opacity = 1; // Set opacity to 1 when showing the element
        dashboardContainer.style.gridTemplateColumns = "1fr min-content";
        grid_container.style.gridTemplateColumns = "27rem 1fr";
        grid_container.style.transition = "grid-template-columns 0.5s ease-in-out";
      } else {
        txt[i].style.opacity = 0.5; // Set opacity to 0.5 when hiding the element
        txt[i].style.display = "none";
        dashboardContainer.style.gridTemplateColumns = "1fr";
        grid_container.style.gridTemplateColumns = "6.5rem 1fr";
        grid_container.style.transition = "grid-template-columns 0.5s ease-in-out";
      }
    }
  }
  
  async function getPointsTable() {
    try {
      // Make a GET request to the server-side API endpoint
      const response = await fetch('/getPointsTable');
      const data = await response.text();
  
      // Set the received HTML content in the schedule_box element
      const points_table = document.querySelector('.points_table');
      points_table.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
      // Handle any error that occurred during the request
    }
  }
  
  // Call the function to retrieve and set the match schedule
  getPointsTable();
  

  document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('change', function(event) {
      if (event.target.classList.contains('s_select')) {
        const teamID = event.target.dataset.teamId;
        const qualifiedOrEliminated = event.target.value;
  
        // Make an AJAX request to updateQualifiedOrEliminated API
        fetch('/updateQualifiedOrEliminated', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ teamID, qualifiedOrEliminated, qualifiedornot: qualifiedOrEliminated })
        })
        .then(response => response.json())
        .then(data => {
          // Handle the response if needed
          console.log(data);
          getPointsTable();
        })
        .catch(error => {
          // Handle the error if needed
          console.error(error);
        });
      }
    });
  });
  
  
  