
// fold
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
const name_team = document.getElementById('name_team');
const flag_team = document.getElementById('flag_team');
const displayMessageAction = document.getElementById('actions');
const currentDomain = window.location.host;

saveClick.addEventListener('click', async () => {
  try {
    // check if input fields are not empty
    if (!name_team.value || !flag_team.value) {
      displayMessageAction.innerHTML = 'Please fill in all required fields';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
      body: JSON.stringify({
        name_team: name_team.value,
        flag_team: flag_team.value
      })
    };

    const response = await fetch('/teamAPI', setHeaders);
    const data = await response.json();

    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      name_team.value = '';
      flag_team.value = '';

      fetchData(); 
      
     

      
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the Status';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});

//team refersh
async function fetchData() {
  try {
    const response = await fetch('/teams-data');
    const data = await response.text();
    // Update the HTML content with the updated teams data
    document.querySelector('.teamsData').innerHTML = data;
  } catch (error) {
    console.error(error);
  }
}
fetchData(); 

//delete team



async function deleteTeam(teamID) {
  try {
    const setHeaders = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
    };

    const response = await fetch(`/teamAPI/${teamID}`, setHeaders);
    const data = await response.json();

    if (data.message) {
      // Show a success message
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      // Refresh the teams data
      fetchData();
    }
  } catch (error) {
    console.error(error);
    // Show an error message
    displayMessageAction.innerHTML = data.message;
    displayMessageAction.style.color = 'green';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
    alert('An error occurred while deleting the team');
  }
}

// edit player
  
async function editPlayers(teamID) {
  const response = await fetch(`/teams-data/${teamID}`);
  const data = await response.json();

  // Update the input fields with the team data
  if (data.teamData) {
    // const editTeamButton = document.getElementById('editTeamButton');
    const editTeamsDiv = document.querySelector('.edit_teams');

    editTeamsDiv.style.display === 'block' ;



    document.getElementById("team_id_edit").value = data.teamData.teamID;
    document.getElementById("team_name_edit").value = data.teamData.teamName;
    document.getElementById("team_flag_edit").value = data.teamData.flagLink;
  
    // Show the edit teams container
    document.querySelector(".edit_teams").style.display = "block";
  } else {
    console.error("Error: Team data not found");
  }
  

  // Show the edit teams container
  document.querySelector(".edit_teams").style.display = "block";
}


//save edited 
const saveEditemTeam = document.getElementsByClassName('saveEditemTeam')[0];
const edit_teams = document.getElementsByClassName('edit_teams');
const team_name_edit = document.getElementById('team_name_edit');
const team_flag_edit = document.getElementById('team_flag_edit');
const team_id_edit = document.getElementById('team_id_edit');
const close = document.getElementById('close');

close.addEventListener('click',() => {
  edit_teams[0].style.display = "none";
})

saveEditemTeam.addEventListener('click', async () => {
  try {
    // check if input fields are not empty
    if (!team_name_edit.value || !team_flag_edit.value) {
      displayMessageAction.innerHTML = 'Please fill in all required fields';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
      body: JSON.stringify({
        teamID: team_id_edit.value,
        teamName: team_name_edit.value,
        flagLink: team_flag_edit.value
      })
    };

    const response = await fetch('/editTeamSaveAPI', setHeaders);
    const data = await response.json();
    
    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      edit_teams[0].style.display = "none";
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      fetchData(); // assuming this function is defined elsewhere in the code
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the Status';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});



var storeid ;
//Team add option click

async function addteamPlayers(teamID) {
  const response = await fetch(`/teams-data/${teamID}`);
  const data = await response.json();

  if (data.teamData) {
    document.getElementById("teamid").value = teamID;
    document.getElementById("get_team").value = `${data.teamData.teamName}`;
    document.querySelector(".add_players_teams").style.display = "block";
    document.querySelector(".go_back").style.display = "block";
    document.querySelector(".add_teams_team").style.display = "none";

    //passing data

    fetchPlayersData(teamID); 
    storeid = teamID;
  } else {
    console.error("Error: Team data not found");
  }
}

  document.querySelector(".go_back").addEventListener("click", function() {
  document.querySelector(".add_players_teams").style.display = "none";
  document.querySelector(".go_back").style.display = "none";
  document.querySelector(".add_teams_team").style.display = "grid";
});



// Add players
const savePlayers = document.querySelector('#savePlayers');
const teamid = document.getElementById('teamid');
const pname = document.getElementById('pname');
const radioButtons = document.querySelectorAll('input[name="role"]');
let selectedOption;

radioButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedOption = button.value;
  });
});

savePlayers.addEventListener('click', async () => {
  try {
    // check if input fields are not empty
    if (!pname.value || !teamid.value || !selectedOption) {
      displayMessageAction.innerHTML = 'Please fill in all required fields';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
      body: JSON.stringify({
        teamID: teamid.value,
        playerName: pname.value,
        option: selectedOption
      })
    };

    const response = await fetch('/players', setHeaders);
    const data = await response.json();
    
    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      edit_teams[0].style.display = "none";
      pname.value = '';
      fetchPlayersData(storeid); 
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the Status';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});

// custom dropdown



//players refresh
async function fetchPlayersData(teamID) {
  try {
    const response = await fetch(`/players-data/${teamID}`);

    
    const data = await response.text();
    // Update the HTML content with the updated teams data
    document.querySelector('.playerdata').innerHTML = data;
  } catch (error) {
    console.error(error);
  }
}


// Player delete 

async function deletePlayer(teamID, playerID) {
  try {
    const setHeaders = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
    };

    const response = await fetch(`/players-data/${teamID}/${playerID}`, setHeaders);
    const data = await response.json();

    if (data.message) {
      // Show a success message
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      // Refresh the player data
      fetchPlayersData(storeid); 
    }
  } catch (error) {
    console.error(error);
    // Show an error message
    displayMessageAction.innerHTML = error.message;
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
    alert('An error occurred while deleting the player');
  }
}



// View Players

async function viewPlayers(teamID) {
  try {
    const response = await fetch(`/outer-players-data/${teamID}`);
    const data = await response.text();
    const playersView = document.querySelector(".players_view");
    playersView.innerHTML = data;
    playersView.style.display = "block";
    
    // Add the event listener to the close button
    const closeBtn = document.getElementById('close_players');
    closeBtn.addEventListener('click', () => {
      playersView.style.display = "none";
    });
  } catch (error) {
    console.error(error);
  }
}



// // Get the parent element of the close button
// const parent = document.querySelector('.players_view');

// // Attach the event listener to the parent element
// parent.addEventListener('click', (event) => {
//   // Check if the event target matches the close button
//   if (event.target.matches('#close_players')) {
//     // Hide the container
//     const playersView = document.getElementsByClassName("players_view")[0];
//     playersView.style.display = "none";
//   }
// });



// Edit Player info
var defaultChecked;

// Edit Player info
async function editPlayersofteams(playerid) {
  try {
    const response = await fetch(`/edit-player-selectedTeam/${playerid}`);
    const data = await response.json();

    // Fill default values for player name and role
    document.querySelector('.edit_player').style.display = "block";
    document.getElementById("player_id_edit").value = playerid;
    document.getElementById("player_name_edit").value = data.playerName;

    
    if (data.playerRole === 'Batsman') {
      document.getElementById("batsman1").checked = true;
      defaultChecked = "Batsman";
    }
    else if (data.playerRole === 'Bowler'){
      document.getElementById("bowler1").checked = true;
      defaultChecked = "Bowler";
    }
    else {
      // Set a default value for the radio input
      document.getElementById("all-rounder1").checked = true;
      defaultChecked = "All Rounder";
    }
  } catch (error) {
    console.error(error);
  }
}


const closeButton = document.getElementById('close_playersedit');
const editPlayerModal = document.querySelector('.edit_player');

closeButton.addEventListener('click', () => {
  editPlayerModal.style.display = 'none';
});


// Save Players Data
// Save Players Data
const savePlayersTeam = document.querySelector('#savePlayers_team');
const playerIdEdit = document.getElementById('player_id_edit');
const playerNameEdit = document.getElementById('player_name_edit');
const radioButtons1 = document.querySelectorAll('input[name="role1"]');
let selectedOption1;

radioButtons1.forEach(button => {
  button.addEventListener('click', () => {
    selectedOption1 = button.value;
  });
});

savePlayersTeam.addEventListener('click', async () => {
  try {
    // check if input fields are not empty and radio button is checked
    if (!playerIdEdit.value || !playerNameEdit.value  || !document.querySelector('input[name="role1"]:checked')) {
      displayMessageAction.innerHTML = 'Please fill in all required fields';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      return;
    }

    // use defaultChecked value if no radio button is selected
    if (!selectedOption1) {
      selectedOption1 = defaultChecked;
    }

    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Add this to send cookies with the request
      body: JSON.stringify({
        playerid: playerIdEdit.value,
        playerName: playerNameEdit.value,
        role: selectedOption1
      })
    };

    const response = await fetch('/playerEdit', setHeaders);
    const data = await response.json();

    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      edit_teams[0].style.display = "none";
      pname.value = '';
      fetchPlayersData(storeid);
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the player';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});
