
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


// Active Click
const enableClick = document.querySelector('.enable');
const disableClick = document.querySelector('.disable');
const displayMessageAction = document.getElementById('actions');
const container = document.querySelector('#container');
const currentDomain = window.location.host;

enableClick.addEventListener('click', async () => {
  try {
    const setHeaders = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Add this to send cookies with the request
    };

    const response = await fetch('/enableRedirect', setHeaders);
    const data = await response.json();


    

    if (data.message) {
      displayMessageAction.innerHTML = data.message;
      displayMessageAction.style.color = 'green';
      setTimeout(() => {
        displayMessageAction.innerHTML = 'Actions';
        displayMessageAction.style.color = 'black';
      }, 3000);
      container.innerHTML = `${currentDomain}/tournaments?id_tournament=${data.tourid}&name_tournament=${data.toururl}`;
      container.style.color = 'black';
      
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



//dis


disableClick.addEventListener('click', async () => {
    try {
      const setHeaders = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Add this to send cookies with the request
      };
  
      const response = await fetch('/disableRedirect', setHeaders);
      const data = await response.json();
  
      if (data.message) {

            container.innerHTML = data.containerMessage;
            container.style.color = 'red';
         
            displayMessageAction.innerHTML = data.message;
            displayMessageAction.style.color = 'green';
            setTimeout(() => {
              displayMessageAction.innerHTML = 'Actions';
              displayMessageAction.style.color = 'black';
            }, 3000);
      }

      else {
        displayMessageAction.innerHTML = data.newmessage;
        displayMessageAction.style.color = 'red';
        setTimeout(() => {
          displayMessageAction.innerHTML = 'Actions';
          displayMessageAction.style.color = 'black';
        }, 3000);
  }
}
        
        
     catch (e) {
      console.log(e);
      displayMessageAction.innerHTML = 'An error occurred while updating the Status';
      displayMessageAction.style.color = 'red';
      setTimeout(() => {
        displayMessageAction.innerHTML = '';
      }, 3000);
    }
  });
  
  
  //auto reload content


