// Nav functionalities

  async function getMatchSchedule() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('match_id');
      
      // Make a GET request to the server-side API endpoint
      const response = await fetch(`/getMatchScheduleonMatchID/${matchId}`);
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

  


  // save Click
const saveClick = document.getElementById('saveClick');
const team_select = document.getElementById('team_select');
const match_type_select = document.getElementById('match_type_select');
const batting_select = document.getElementById('batting_select');
const matchno = document.getElementById('matchno');
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

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match_id');



    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        matchId:matchId,
        match_type_select:match_type_select.value,
        matchno: matchno.value,
        stadiumName: std_name.value,
        stadiumLocation: std_location.value,
        date: formattedDate,
        time: formattedTime,
        batting_select:batting_select.value
      })
    };

    const response = await fetch('/saveMatchDetails', setHeaders);
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



// toggle
const matchDetail = document.getElementById('matchDetail');
const teamScore = document.getElementById('teamScore');
const playersof1click = document.getElementById('playersof1click');
const playersof2click = document.getElementById('playersof2click');

matchDetail.addEventListener('click', () => {
  document.getElementById('matchDetail_show').style.display = 'grid';
  document.getElementById('teamsScore_show').style.display = 'none';
  document.getElementById('playerof1_show').style.display = 'none';
  document.getElementById('playerof2_show').style.display = 'none';
});

teamScore.addEventListener('click', () => {
  document.getElementById('matchDetail_show').style.display = 'none';
  document.getElementById('teamsScore_show').style.display = 'grid';
  document.getElementById('playerof1_show').style.display = 'none';
  document.getElementById('playerof2_show').style.display = 'none';
});

playersof1click.addEventListener('click', () => {
  document.getElementById('matchDetail_show').style.display = 'none';
  document.getElementById('teamsScore_show').style.display = 'none';
  document.getElementById('playerof1_show').style.display = 'grid';
  document.getElementById('playerof2_show').style.display = 'none';
});

playersof2click.addEventListener('click', () => {
  document.getElementById('matchDetail_show').style.display = 'none';
  document.getElementById('teamsScore_show').style.display = 'none';
  document.getElementById('playerof1_show').style.display = 'none';
  document.getElementById('playerof2_show').style.display = 'grid';
});



// Send team score



  // save Click
  const saveScoreClick = document.getElementById('saveScoreClick');
  const t1runs = document.getElementById('t1runs');
  const t1wickets = document.getElementById('t1wickets');
  const t1overs = document.getElementById('t1overs');
  const t2runs = document.getElementById('t2runs');
  const t2wickets = document.getElementById('t2wickets');
  const t2overs = document.getElementById('t2overs');
  

  
  saveScoreClick.addEventListener('click', async () => {
    try {
      // Validate match number
      if (t1runs.value === '' || t1wickets.value === '' || t1overs.value === '' ||
       t2runs.value === '' || t2wickets.value === '' || t2overs.value === '') {
        displayMessageAction.innerHTML = 'Fields should not be empty';
        displayMessageAction.style.color = 'red';
        setTimeout(() => {
          displayMessageAction.innerHTML = 'Actions';
          displayMessageAction.style.color = 'black';
        }, 3000);
        return;
      }
  
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('match_id');
      
  
      const setHeaders = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          t1runs:t1runs.value,
          t1wickets:t1wickets.value,
          t1overs: t1overs.value,
          t2runs: t2runs.value,
          t2wickets: t2wickets.value,
          t2overs: t2overs.value,
          matchId
        })
      };
  
      const response = await fetch('/teamScoreupdate', setHeaders);
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
  


  async function getPlayers() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('match_id');
      
      // Make a GET request to the server-side API endpoint
      const response = await fetch(`/getPlayersonMatchID/${matchId}`);
      const data = await response.text();
  
      // Set the received HTML content in the schedule_box element
      const scheduleBox = document.querySelector('.players_1');
      scheduleBox.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
      // Handle any error that occurred during the request
    }
  }
  
  // Call the function to retrieve and set the match schedule
  getPlayers();



  const saveButton = document.getElementById('savePlayerdataClick');
  var cmatchID,cplayerID;

  async function editPlayerScore(matchId, playerId) {
    try {
      // Show the edit teams section
      const editTeamsSection = document.querySelector('.edit_teams');
      editTeamsSection.style.display = 'block';
  
      // Get the input fields
      const matchIdInput = document.getElementById('match_id');
      const playerIdInput = document.getElementById('player_id');
      const playerNameInput = document.getElementById('player_name');
      const playerRunsInput = document.getElementById('player_runs');
      const bowlPlayedInput = document.getElementById('bowl_played');
      const bowlingOversDoneInput = document.getElementById('bowling_overs_done');
      const wicketTakenInput = document.getElementById('wicket_taken');
      const runGivenBowlingInput = document.getElementById('run_given_bowling');
      const playerStatusInput = document.getElementById('status_select');
  
      const response = await fetch(`/getPlayersdata/${matchId}/${playerId}`);
      const data = await response.json();
  
      // Set the values for matchId and playerId inputs
      matchIdInput.value = matchId;
      playerIdInput.value = playerId;
      playerNameInput.value = data.playerName;
      playerRunsInput.value = data.playerRun;
      bowlPlayedInput.value = data.bowlPlayed;
      bowlingOversDoneInput.value = data.bowlOvers;
      runGivenBowlingInput.value = data.bowlRunGiven;
      wicketTakenInput.value = data.wicketTaken;
      playerStatusInput.value = data.visibility;
  
     

      cmatchID = matchId;
      cplayerID = playerId;

    } catch (error) {
      console.error(error);
      // Handle the error
    }
  }

   // Save button event listener
      
   saveButton.addEventListener('click', async () => {
      try {
        const playerNameInput = document.getElementById('player_name');
        const playerRunsInput = document.getElementById('player_runs');
        const bowlPlayedInput = document.getElementById('bowl_played');
        const bowlingOversDoneInput = document.getElementById('bowling_overs_done');
        const wicketTakenInput = document.getElementById('wicket_taken');
        const runGivenBowlingInput = document.getElementById('run_given_bowling');
        const playerStatusInput = document.getElementById('status_select');
    
        const playerName = playerNameInput.value;
        const playerRuns = playerRunsInput.value;
        const bowlPlayed = bowlPlayedInput.value;
        const bowlingOversDone = bowlingOversDoneInput.value;
        const wicketTaken = wicketTakenInput.value;
        const runGivenBowling = runGivenBowlingInput.value;
        const playerStatus = playerStatusInput.value;
    
        // Make the API call to save the data

        const setHeaders = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Add this to send cookies with the request
          body: JSON.stringify({
            playerName,
            matchId: cmatchID,
            playerId: cplayerID,
            playerRuns: playerRuns,
            bowlPlayed: bowlPlayed,
            bowlingOversDone: bowlingOversDone,
            wicketTaken: wicketTaken,
            runGivenBowling: runGivenBowling,
            playerStatus: playerStatus
          })
        };
    
        const response = await fetch('/savePlayerData', setHeaders);
        const data = await response.json();

    
        if (data.message) {
          displayMessageAction.innerHTML = data.message;
          displayMessageAction.style.color = 'green';
          setTimeout(() => {
            displayMessageAction.innerHTML = 'Actions';
            displayMessageAction.style.color = 'black';
          }, 3000);
          const editTeamsSection = document.querySelector('.edit_teams');
          editTeamsSection.style.display = 'none';
          getPlayers();
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
  
  
  
  const close = document.querySelector('#close');
  close.addEventListener('click', () => {
    const editTeamsSection = document.querySelector('.edit_teams');
    editTeamsSection.style.display = 'none';
  });
  


  // Team 2 score things


  async function getPlayers2() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('match_id');
      
      // Make a GET request to the server-side API endpoint
      const response = await fetch(`/getPlayers2onMatchID/${matchId}`);
      const data = await response.text();
  
      // Set the received HTML content in the schedule_box element
      const scheduleBox = document.querySelector('.players_2');
      scheduleBox.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
      // Handle any error that occurred during the request
    }
  }
  
  // Call the function to retrieve and set the match schedule
  getPlayers2();


  const saveButton2 = document.getElementById('savePlayerdataClick2');
var cmatchID2,cplayerID2;
  async function editPlayerScore2(matchId, playerId) {
    try {
      // Show the edit teams section
      const editTeamsSection = document.querySelector('.edit_teams2');
      editTeamsSection.style.display = 'block';
  
      // Get the input fields
      const matchIdInput = document.getElementById('match_id2');
      const playerIdInput = document.getElementById('player_id2');
      const playerNameInput = document.getElementById('player_name2');
      const playerRunsInput = document.getElementById('player_runs2');
      const bowlPlayedInput = document.getElementById('bowl_played2');
      const bowlingOversDoneInput = document.getElementById('bowling_overs_done2');
      const wicketTakenInput = document.getElementById('wicket_taken2');
      const runGivenBowlingInput = document.getElementById('run_given_bowling2');
      const playerStatusInput = document.getElementById('status_select2');
  
      const response = await fetch(`/getPlayersdata2/${matchId}/${playerId}`);
      const data = await response.json();
  
      // Set the values for matchId and playerId inputs
      matchIdInput.value = matchId;
      playerIdInput.value = playerId;
      playerNameInput.value = data.playerName;
      playerRunsInput.value = data.playerRun;
      bowlPlayedInput.value = data.bowlPlayed;
      bowlingOversDoneInput.value = data.bowlOvers;
      runGivenBowlingInput.value = data.bowlRunGiven;
      wicketTakenInput.value = data.wicketTaken;
      playerStatusInput.value = data.visibility;
  
     

      cmatchID2 = matchId;
      cplayerID2 = playerId;

    } catch (error) {
      console.error(error);
      // Handle the error
    }
  }

   // Save button event listener
      
   saveButton2.addEventListener('click', async () => {
      try {
        const playerNameInput = document.getElementById('player_name2');
        const playerRunsInput = document.getElementById('player_runs2');
        const bowlPlayedInput = document.getElementById('bowl_played2');
        const bowlingOversDoneInput = document.getElementById('bowling_overs_done2');
        const wicketTakenInput = document.getElementById('wicket_taken2');
        const runGivenBowlingInput = document.getElementById('run_given_bowling2');
        const playerStatusInput = document.getElementById('status_select2');
    
        const playerName = playerNameInput.value;
        const playerRuns = playerRunsInput.value;
        const bowlPlayed = bowlPlayedInput.value;
        const bowlingOversDone = bowlingOversDoneInput.value;
        const wicketTaken = wicketTakenInput.value;
        const runGivenBowling = runGivenBowlingInput.value;
        const playerStatus = playerStatusInput.value;
    
        // Make the API call to save the data

        const setHeaders = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Add this to send cookies with the request
          body: JSON.stringify({
            playerName,
            matchId: cmatchID2,
            playerId: cplayerID2,
            playerRuns: playerRuns,
            bowlPlayed: bowlPlayed,
            bowlingOversDone: bowlingOversDone,
            wicketTaken: wicketTaken,
            runGivenBowling: runGivenBowling,
            playerStatus: playerStatus
          })
        };
    
        const response = await fetch('/savePlayerData2', setHeaders);
        const data = await response.json();

    
        if (data.message) {
          displayMessageAction.innerHTML = data.message;
          displayMessageAction.style.color = 'green';
          setTimeout(() => {
            displayMessageAction.innerHTML = 'Actions';
            displayMessageAction.style.color = 'black';
          }, 3000);
          const editTeamsSection = document.querySelector('.edit_teams2');
          editTeamsSection.style.display = 'none';
          getPlayers2();
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
  

  const close2 = document.querySelector('#close2');
  close2.addEventListener('click', () => {
    const editTeamsSection = document.querySelector('.edit_teams2');
    editTeamsSection.style.display = 'none';
  });
  


  // Live options 

  const live = document.getElementById('live');

  live.addEventListener('click', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('match_id');


    try {
      // Make the API call to save the data

      const setHeaders = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Add this to send cookies with the request
        body: JSON.stringify({
          matchId
        })
      };

   
      const response = await fetch('/setLive', setHeaders);
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


  
  const disable_live = document.getElementById('disable_live');

  disable_live.addEventListener('click', async () => {

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
        body: JSON.stringify({
          matchId
        })
      };
  
      const response = await fetch('/disbaleLive', setHeaders);
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


  // Viewpage options

  // viewpage options 

  const enable_viewpage = document.getElementById('enable_viewpage');

  enable_viewpage.addEventListener('click', async () => {

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
        body: JSON.stringify({
          viewpageVisibility:true,matchId
        })
      };

   
      const response = await fetch('/enableviewpageVisibility', setHeaders);
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


  const disable_viewpage2 = document.getElementById('disable_viewpage2');

  disable_viewpage2.addEventListener('click', async () => {

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
        body: JSON.stringify({
          viewpageVisibility:true,matchId
        })
      };

   
      const response = await fetch('/disableviewpageVisibility', setHeaders);
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


  // confirm box

  document.getElementById('drop_match').addEventListener('click', function() {
    document.querySelector('.confirmation-dialog').style.display = 'flex';
  });
  
  document.querySelectorAll('.dialog-button').forEach(function(button) {
    button.addEventListener('click', function() {
      document.querySelector('.confirmation-dialog').style.display = 'none';
    });
  });
  

  // delete api match

  const delete_match = document.getElementById('delete_match');

  delete_match.addEventListener('click', async () => {
    try {
      // Make the API call to delete the match
  
      const urlParams = new URLSearchParams(window.location.search);
      const matchId = urlParams.get('match_id');
  
      const setHeaders = {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Add this to send cookies with the request
        body: JSON.stringify({
          matchId
        })
      };
  
      const response = await fetch('/deleteMatch', setHeaders);
      const data = await response.json();
  
      if (data.message) {
        // Redirect to the fixtures page
        window.location.href = "/fixtures";
         // Remove the current page from the browser's history
      history.replaceState(null, null, "/fixtures");
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
  


  // match result set
  
  const result_select = document.getElementById('result_select');
  const save_result_click = document.getElementById('save_result_click');

  save_result_click.addEventListener('click', async () => {

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
        body: JSON.stringify({
          result_select:result_select.value,matchId
        })
      };

   
      const response = await fetch('/updateMatchResult', setHeaders);
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


  // Set chase

  const setChase = document.getElementById('setChase');

  setChase.addEventListener('click', async () => {

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

   
      const response = await fetch('/setChase', setHeaders);
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


   // Match Disclose

   const disclose_result = document.getElementById('disclose_result');

   disclose_result.addEventListener('click', async () => {
 
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
 
    
       const response = await fetch('/matchDisclose', setHeaders);
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
 

      // Match Disclose
// Get a reference to the dis_ptcurrent button
const dis_ptcurrent = document.getElementById('dis_ptcurrent');

// Add an event listener to the button
dis_ptcurrent.addEventListener('click', async () => {
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
      body: JSON.stringify({ matchId })
    };

    const response = await fetch('/ptscurrentdisclose', setHeaders);
    const data = await response.json();

    if (data.message) {
      // Display success message
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';

      // Reset message after 3 seconds
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);

      // Refresh the match schedule
      getMatchSchedule();
    }
  } catch (error) {
    // Handle error
    console.error(error);
    displayMessageAction.innerHTML = 'An error occurred while updating the player data.';
    displayMessageAction.style.color = 'red';

    // Reset message after 3 seconds
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});



// Push Players


const push_players = document.getElementById('push_players');

// Add an event listener to the button
push_players.addEventListener('click', async () => {
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
      body: JSON.stringify({ matchId })
    };

    const response = await fetch('/pushPlayers', setHeaders);
    const data = await response.json();

    if (data.message) {
      // Display success message
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';

      // Reset message after 3 seconds
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);

      // Refresh the match schedule
      getMatchSchedule();
    }
  } catch (error) {
    // Handle error
    console.error(error);
    displayMessageAction.innerHTML = 'An error occurred while updating the player data.';
    displayMessageAction.style.color = 'red';

    // Reset message after 3 seconds
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});
