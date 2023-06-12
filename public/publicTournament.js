

async function getMatchSchedule() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('id_tournament');
      
      const response = await fetch(`/getMatchScheduleontournamentid/${tid}`);
      const data = await response.text();
  
      const scheduleBox = document.querySelector('.matches');
      scheduleBox.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  getMatchSchedule();



  async function upcomingSchedule() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('id_tournament');
      
      const response = await fetch(`/getUpcoming/${tid}`);
      const data = await response.text();
  
      const scheduleBox1 = document.querySelector('.upcoming_matches');
      scheduleBox1.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  upcomingSchedule();



  document.querySelector('.matches').style.display = "none";
  document.querySelector('.standings').style.display = "none";
  document.querySelector('.pointsTable').style.display = "none";
  document.querySelector('.liveScore').style.display = "none";
  document.querySelector('.refreshandselect').style.display = "none";

  const getUpclick = document.querySelector('.upcoming-matches');
  getUpclick.style.backgroundColor = "#06a27e";

  getUpclick.addEventListener('click', () => {
    document.querySelector('.matches').style.display = "none";
    document.querySelector('.upcoming_matches').style.display = "grid";
    getUpclick.style.backgroundColor = "#06a27e";
    getScheduleClick.style.backgroundColor = "#4A4A4A";
    getRankClick.style.backgroundColor = "#4A4A4A";
    getpointsClick.style.backgroundColor = "#4A4A4A";
    document.querySelector('.standings').style.display = "none";
    document.querySelector('.pointsTable').style.display = "none";
    document.querySelector('.liveScore').style.display = "none";
    document.querySelector('.refreshandselect').style.display = "none";
    document.querySelector('.getcurrentmatchno').style.display = "none";
  });
  

  const getScheduleClick = document.querySelector('.Schedule');
  
  getScheduleClick.addEventListener('click', () => {
    document.querySelector('.matches').style.display = "grid";
    getUpclick.style.backgroundColor = "#4A4A4A";
    getScheduleClick.style.backgroundColor = "#06a27e";
    getRankClick.style.backgroundColor = "#4A4A4A";
    getpointsClick.style.backgroundColor = "#4A4A4A";
    document.querySelector('.upcoming_matches').style.display = "none";
    document.querySelector('.standings').style.display = "none";
    document.querySelector('.pointsTable').style.display = "none";
    document.querySelector('.liveScore').style.display = "none";
    document.querySelector('.getcurrentmatchno').style.display = "none";
    document.querySelector('.refreshandselect').style.display = "none";
  });


  const getRankClick = document.querySelector('.ranks');
  
  getRankClick.addEventListener('click', () => {
    document.querySelector('.matches').style.display = "none";
    document.querySelector('.standings').style.display = "grid";
    getUpclick.style.backgroundColor = "#4A4A4A";
    getScheduleClick.style.backgroundColor = "#4A4A4A";
    getRankClick.style.backgroundColor = "#06a27e";
    getpointsClick.style.backgroundColor = "#4A4A4A";
    document.querySelector('.upcoming_matches').style.display = "none";
    document.querySelector('.pointsTable').style.display = "none";
    document.querySelector('.liveScore').style.display = "none";
    document.querySelector('.getcurrentmatchno').style.display = "none";
    document.querySelector('.refreshandselect').style.display = "none";
  });
  

  const getpointsClick = document.querySelector('.points');
  
  getpointsClick.addEventListener('click', () => {
    document.querySelector('.matches').style.display = "none";
    document.querySelector('.standings').style.display = "none";
    document.querySelector('.upcoming_matches').style.display = "none";
    document.querySelector('.pointsTable').style.display = "grid";
    getUpclick.style.backgroundColor = "#4A4A4A";
    getScheduleClick.style.backgroundColor = "#4A4A4A";
    getRankClick.style.backgroundColor = "#4A4A4A";
    getpointsClick.style.backgroundColor = "#06a27e";
    document.querySelector('.liveScore').style.display = "none";
    document.querySelector('.getcurrentmatchno').style.display = "none";
    document.querySelector('.refreshandselect').style.display = "none";
  });



  


  async function getPointsTable() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('id_tournament');
  
      const response = await fetch(`/getPointsTableforuser/${tid}`);
      const data = await response.text();
  
      const points_table = document.querySelector('.pointsTable');
      points_table.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  getPointsTable();
  

  async function sortAndFetchPlayerStandings() {
    try {
      const sortSelect = document.getElementById('sortSelect');
      const selectedOption = sortSelect.value || 'runs'; // Set default option to "runs" if no option is selected
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('id_tournament');
  
      // Fetch the player standings based on the selected option
      const response = await fetch(`/getPlayersStandingsforuser/${tid}?sort=${selectedOption}`);
      const data = await response.text();
  
      const points_table = document.querySelector('.rankings');
      points_table.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Set the default selected option to "runs"
  document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.value = 'runs';
    sortAndFetchPlayerStandings();
  });
  


  var globalMatchID;
  var selectedTeam = "team1"; // Default selected team is Team 1
  
  async function getScore(match_id, team = selectedTeam) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('id_tournament');
  
      globalMatchID = match_id;
      getCurrentUpcoming(globalMatchID);
      const response = await fetch(`/getScore?tid=${tid}&match_id=${match_id}&team=${team}`);
      const data = await response.text();
      document.querySelector('.liveScore').style.display = "grid";
      document.querySelector('.upcoming_matches').style.display = "none";
      document.querySelector('.standings').style.display = "none";
      document.querySelector('.pointsTable').style.display = "none";
      const points_table = document.querySelector('.liveScore');
      points_table.innerHTML = data;
      selectedTeam = team; // Update the selected team
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  // Default selection of "Team 1" on page load
  window.addEventListener("load", function() {
    getScore(match_id, selectedTeam); // Replace match_id with the actual match ID value
  });
  
  // Event listener for the team select dropdown
  document.getElementById("select_team").addEventListener("change", function() {
    const team = this.value;
    getScore(globalMatchID, team);
  });
  

  

  async function getCurrentUpcoming(globalMatchID) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tid = urlParams.get('id_tournament');
  
      const response = await fetch(`/getCurrentUpcoming/${tid}/${globalMatchID}`);
      const data = await response.text();
  
      // Update DOM elements
      document.querySelector('.getcurrentmatchno').style.display = "grid";
      document.querySelector('.upcoming_matches').style.display = "none";
      document.querySelector('.standings').style.display = "none";
      document.querySelector('.pointsTable').style.display = "none";
      document.querySelector('.refreshandselect').style.display = "grid";
  
      const liveScoreElement = document.querySelector('.getcurrentmatchno');
      liveScoreElement.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  

  document.getElementById("select_team").addEventListener("change", function() {
    const team = this.value;
    
    // Make an AJAX request to the server to fetch the respective team's score
    fetch(`/getScore?tid=${tid}&match_id=${matchId}&team=${team}`)
      .then(response => response.text())
      .then(content => {
        document.getElementById("scorecard").innerHTML = content;
      })
      .catch(error => console.log(error));
  });
  


  document.querySelector('#refresh').addEventListener('click', () => {
    getCurrentUpcoming(globalMatchID);
    getScore(globalMatchID, team = selectedTeam);
  })