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
  




const submitMessage = document.getElementById('submitMessage');
const feedbackMsg = document.getElementById('feedbackMsg');
const successMessage = document.getElementById('successMessage');
const getMail = document.querySelector('span[data-email]');
const mynameElement = document.querySelector('span[data-name]');
const email = getMail.getAttribute('data-email');
const myname = mynameElement.innerText;

// Check if last message timestamp exists in localStorage
const lastMessageTime = localStorage.getItem('lastMessageTime');

console.log(myname);

submitMessage.addEventListener('click', async () => {
  try {
    if (feedbackMsg.value === '') {
      successMessage.innerHTML = 'Please fill in the message field';
      successMessage.style.color = 'red';
      return;
    }

    const url = window.location.href; // Get the current URL
    const message = feedbackMsg.value;
    const currentDate = new Date().toLocaleDateString(); // Get the current date
    const currentTime = new Date().getTime(); // Get the current time in milliseconds

    const lastMessageTime = localStorage.getItem('lastMessageTime');

    if (lastMessageTime) {
      const timeDiff = currentTime - parseInt(lastMessageTime);
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      if (hoursDiff < 12) {
        const remainingHours = 12 - hoursDiff;
        successMessage.innerHTML = `Please wait ${remainingHours.toFixed(1)} hours before sending another message.`;
        successMessage.style.color = 'red';
        return; // Exit the function without sending the message
      } else {
        // Update the last message timestamp in localStorage with the current time
        localStorage.setItem('lastMessageTime', currentTime.toString());
      }
    } else {
      // Save the current time as the last message timestamp in localStorage
      localStorage.setItem('lastMessageTime', currentTime.toString());
    }

const setHeaders = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    myname,
    userEmail: email,
    url,
    message,
    date: currentDate,
    time: currentTime
  })
};

const response = await fetch('https://crickmserverservice.onrender.com/saveMessage', setHeaders);

    const data = await response.json();

    if (data.message) {
      successMessage.innerHTML = data.message;
      successMessage.style.color = 'green';
      feedbackMsg.value = '';

      // Hide the message after 3 seconds
      setTimeout(() => {
        successMessage.innerHTML = '';
      }, 20000);
    }
  } catch (error) {
    console.error(error);
    successMessage.style.color = 'red';
  }
});




