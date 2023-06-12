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
  

  function sortPlayerDetails() {
    var sortSelect = document.getElementById("sortSelect");
    var selectedOption = sortSelect.value;
    
    var runsTable = document.getElementById("runsTable");
    var wicketsTable = document.getElementById("wicketsTable");
    
    if (selectedOption === "totalRuns") {
      runsTable.style.display = "grid";
      wicketsTable.style.display = "none";
    } else if (selectedOption === "totalWickets") {
      runsTable.style.display = "none";
      wicketsTable.style.display = "grid";
    }
  }

