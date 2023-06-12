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
  

// save Click
const saveClick = document.getElementById('saveClick');
const team_select = document.getElementById('team_select');
const match_type_select = document.getElementById('match_type_select');
const matchno = document.getElementById('matchno');
const teamselect1 = document.getElementById('team-select-1');
const teamselect2 = document.getElementById('team-select-2');
const std_name = document.getElementById('std_name');
const std_location = document.getElementById('std_location');
const date = document.getElementById('date');
const time = document.getElementById('time');
const displayMessageAction = document.getElementById('actions');
const currentDomain = window.location.host;

const options = {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
};

const options1 = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
};


saveClick.addEventListener('click', async () => {
  try {
    // Validate match number
    if (matchno.value === '') {
      displayMessageAction.innerHTML = 'Please enter a match number';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    // Validate team select 1
    if (teamselect1.value === '') {
      displayMessageAction.innerHTML = 'Please select Team 1';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    // Validate team select 2
    if (teamselect2.value === '') {
      displayMessageAction.innerHTML = 'Please select Team 2';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

     // Validate team select 2
     if (teamselect1.value === teamselect2.value) {
      displayMessageAction.innerHTML = 'Both selected teams should be different';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    // Validate stadium name
    if (std_name.value.trim() === '') {
      displayMessageAction.innerHTML = 'Please enter a stadium name';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    // Validate stadium location
    if (std_location.value.trim() === '') {
      displayMessageAction.innerHTML = 'Please enter a stadium location';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    // Validate date
    if (date.value === '') {
      displayMessageAction.innerHTML = 'Please select a date';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    // Validate time
    if (time.value === '') {
      displayMessageAction.innerHTML = 'Please select a time';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    const selectedDate = new Date(date.value);
    const formattedDate = selectedDate.toLocaleDateString('en-US', options);

    const selectedTime = new Date(`January 1, 2023 ${time.value}`);
    const formattedTime = selectedTime.toLocaleTimeString('en-US', options1);

    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        match_type_select:match_type_select.value,
        matchno: matchno.value,
        team1: teamselect1.value,
        team2: teamselect2.value,
        stadiumName: std_name.value,
        stadiumLocation: std_location.value,
        date: formattedDate,
        time: formattedTime
      })
    };

    const response = await fetch('/createMatch', setHeaders);
    const data = await response.json();

    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      getMatchSchedule();
      // Reset input fields
      matchno.value = '';
      teamselect1.value = '';
      teamselect2.value = '';
      std_name.value = '';
      std_location.value = '';
      date.value = '';
      time.value = '';
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the status';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});


// Get Schedule

async function getMatchSchedule() {
  try {
    // Make a GET request to the server-side API endpoint
    const response = await fetch('/getMatchSchedule');
    const data = await response.text();

    // Set the received HTML content in the schedule_box element
    const scheduleBox = document.querySelector('.schedule_data');
    scheduleBox.innerHTML = data;
  } catch (error) {
    console.error('Error:', error);
    // Handle any error that occurred during the request
  }
}

// Call the function to retrieve and set the match schedule
getMatchSchedule();


const refresh_box = document.getElementById('refresh_box');

refresh_box.addEventListener('click', () => {
  getMatchSchedule();
})


document.getElementById('delete_all_box').addEventListener('click', function() {
  document.getElementById('confirmation_popup').classList.add('show');
});

document.getElementById('cancel_drop').addEventListener('click', function() {
  document.getElementById('confirmation_popup').classList.remove('show');
});

document.getElementById('confirm_drop').addEventListener('click', function() {
  // Perform the drop all action here
  // ...
  
  document.getElementById('confirmation_popup').classList.remove('show');
});


   // Drop ALL

   const confirm_drop = document.getElementById('confirm_drop');

   confirm_drop.addEventListener('click', async () => {
 
     try {
       // Make the API call to save the data
       const urlParams = new URLSearchParams(window.location.search);
       const matchId = urlParams.get('match_id');
 
       const setHeaders = {
         method: 'delete',
         headers: {
           'Content-Type': 'application/json'
         },
         credentials: 'include', // Add this to send cookies with the request
         body: JSON.stringify({matchId
         })
       };
 
    
       const response = await fetch('/dropALL', setHeaders);
       const data = await response.json();
 
   
       if (data.message) {
         displayMessageAction.innerHTML = data.message;
         displayMessageAction.style.color = 'green';
         setTimeout(() => {
           displayMessageAction.innerHTML = 'Actions';
           displayMessageAction.style.color = 'black';
         }, 3000);
         getMatchSchedule();
       }
     } catch (error) {
       console.error(error);
       displayMessageAction.innerHTML = 'An error occurred while updating the player data.';
       displayMessageAction.style.color = 'red';
       setTimeout(() => {
         displayMessageAction.innerHTML = 'Actions';
         displayMessageAction.style.color = 'black';
       }, 3000);
     }
     
   });
 


   // Match Points

   const disclose_pts = document.getElementById('disclose_pts');

   disclose_pts.addEventListener('click', async () => {
 
     try {
       // Make the API call to save the data
       const urlParams = new URLSearchParams(window.location.search);
       const matchId = urlParams.get('match_id');
 
       const setHeaders = {
         method: 'PATCH',
         headers: {
           'Content-Type': 'application/json'
         },
         credentials: 'include', // Add this to send cookies with the request
         body: JSON.stringify({matchId
         })
       };
 
    
       const response = await fetch('/disclosePointTable', setHeaders);
       const data = await response.json();
 
   
       if (data.message) {
         displayMessageAction.innerHTML = data.message;
         displayMessageAction.style.color = 'green';
         setTimeout(() => {
           displayMessageAction.innerHTML = 'Actions';
           displayMessageAction.style.color = 'black';
         }, 3000);
         getMatchSchedule();
       }
     } catch (error) {
       console.error(error);
       displayMessageAction.innerHTML = 'An error occurred while updating the player data.';
       displayMessageAction.style.color = 'red';
       setTimeout(() => {
         displayMessageAction.innerHTML = 'Actions';
         displayMessageAction.style.color = 'black';
       }, 3000);
     }
     
   });
 

      
// Match Points

const auto_schedule = document.getElementById('auto_schedule');

auto_schedule.addEventListener('click', async () => {

  try {
    // Make the API call to save the data
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match_id');

    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
      body: JSON.stringify({matchId
      })
    };

  
    const response = await fetch('/scheduleAuto', setHeaders);
    const data = await response.json();


    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      getMatchSchedule();
    }
  } catch (error) {
    console.error(error);
    displayMessageAction.innerHTML = 'An error occurred while updating the player data.';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
  
});


    

// Match Points

const auto_schedule2 = document.getElementById('auto_schedule2');

auto_schedule2.addEventListener('click', async () => {

  try {
    // Make the API call to save the data
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match_id');

    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
      body: JSON.stringify({matchId
      })
    };


    const response = await fetch('/scheduleAuto2x', setHeaders);
    const data = await response.json();


    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      getMatchSchedule();
    }
  } catch (error) {
    console.error(error);
    displayMessageAction.innerHTML = 'An error occurred while updating the player data.';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
  
});




