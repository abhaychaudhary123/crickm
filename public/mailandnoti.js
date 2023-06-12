var myMailButton = document.querySelector("#me");
var allNotificationsButton = document.querySelector("#all");

var myMailDiv = document.querySelector(".personal");
var allNotificationsDiv = document.querySelector(".all_notification");

allNotificationsButton.style.color = "red";

myMailButton.addEventListener("click", function() {
  allNotificationsDiv.style.display = "none";
  myMailButton.style.color = "red";
  allNotificationsButton.style.color = "black";
  myMailDiv.style.display = "grid";
  getMailPersonal();
});

allNotificationsButton.addEventListener("click", function() {
  myMailDiv.style.display = "none";
  myMailButton.style.color = "black";
  allNotificationsButton.style.color = "red";
  allNotificationsDiv.style.display = "grid";
 
});




async function getNotification_users() {
    try {
      const response = await fetch('https://crickmserverservice.onrender.com/getNotification_users');
      const data = await response.text();
  
      const edit_respond = document.querySelector('.all_notification');
      edit_respond.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
 

  async function getMailPersonal() {
    try {
      const meButton = document.getElementById('me');
      const email = meButton.getAttribute('data-email');
      console.log(email);
      
      // Use the email value to fetch data or perform any desired operations
      const response = await fetch(`https://crickmserverservice.onrender.com/getMail_users?email=${email}`);
      const data = await response.text();
    
      const edit_respond = document.querySelector('.personal');
      edit_respond.innerHTML = data;
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  getNotification_users();
  