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

 //Save Tournament Details
 
const saveclick = document.getElementById('saveClick');
const displayMessageAction = document.getElementById('actions');
const tnameInput = document.getElementById('tname');
const turlInput = document.getElementById('turl');
const tournamentName = document.querySelector('.content_tabledata > div:nth-child(2)');
const tournamentUrl = document.querySelector('.content_tabledata > div:nth-child(6)');

saveclick.addEventListener('click', async () => {
  const tname = tnameInput.value;
  const turl = turlInput.value;

  // Check if fields are empty
  if (!tname || !turl) {
    displayMessageAction.innerHTML = 'Fields cannot be empty';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Save Actions';
        displayMessageAction.style.color = 'black';
    }, 3000);
    return;
  }

  const passData = { tname, turl };

  try {
    const setheaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passData)
    };

    const response = await fetch('/saveTournament', setheaders);
    const data = await response.json();

    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      tournamentName.innerText = tname;
      tournamentUrl.innerText = turl;
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Save Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the details';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Save Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});

// Active Click

const activeClick = document.getElementById('activeClick');
const removeClick = document.getElementById('removeClick');
const statusAction = document.querySelector('.content_tabledata > div:nth-child(8)');



activeClick.addEventListener('click', async () => {
 
  try {
    const setheaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch('/viewpageStatus1', setheaders);
    const data = await response.json();

    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      statusAction.innerText = "Active";
      statusAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Save Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the Status';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Save Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});


// Remove Click

removeClick.addEventListener('click', async () => {
 
  try {
    const setheaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch('/viewpageStatus2', setheaders);
    const data = await response.json();

    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      statusAction.innerText = "Not Active";
      statusAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Save Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
    }
  } catch (e) {
    console.log(e);
    displayMessageAction.innerHTML = 'An error occurred while updating the Status';
    displayMessageAction.style.color = 'red';
    setTimeout(() => {
      displayMessageAction.innerHTML = 'Save Actions';
      displayMessageAction.style.color = 'black';
    }, 3000);
  }
});


