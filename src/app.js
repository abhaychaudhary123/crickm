require('dotenv').config();
const { urlencoded } = require('express');
const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
require("../db/conn");
const storeUsers = require('../models/cricketStoreUsers');
const port = process.env.PORT || 1100;
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
const auth = require("../middlewares/auth");
const validator = require('validator');
const uuid = require('uuid'); 

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(urlencoded({extended:false}));

app.set("view engine","hbs");
app.set("views",path.join(__dirname, "../templates"));
hbs.registerPartials(path.join(__dirname, "../partials"));
hbs.registerHelper('ternary', function(condition, trueValue, falseValue) {
  return condition ? trueValue : falseValue;
});
hbs.registerHelper('eq', function(a, b) {
  return a === b;
});

// Helper function to sort player details based on the selected key
// Helper function to sort player details based on the selected key
hbs.registerHelper('sortBy', function (arr, key) {
  return arr.slice().sort(function (a, b) {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return valueB - valueA;
    }

    return 0;
  });
});



app.get("/signup", (req,res) => {
    res.render('signup');
})

app.get("/login", (req,res) => {
  res.render('login');
})








//for js and css files
app.get("/loginDesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/loginDesign.css"));
});


app.get("/createTournamentdesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/createTournamentdesign"));
})

app.get("/createTournamentdesignforcss", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/createTournamentdesignforcss.css"));
});

app.get("/publicTournament", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/publicTournament"));
})

app.get("/redirectdesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/redirectdesign"));
})

app.get("/createTeamdesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/createTeamdesign"));
})

app.get("/fixturedesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/fixturedesign.css"));
});

app.get("/viewmatchdesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/viewmatchdesign.css"));
});

app.get("/noTournamentdesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/noTournamentdesign.css"));
});


app.get("/pointsdesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/pointsdesign.css"));
});

app.get("/liveMatchescss", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/liveMatches.css"));
});

app.get("/livemjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/livemjs.css"));
});

app.get("/mailandnoti.js", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/mailandnoti.js"));
});

app.get("/playerStandingdesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/playerStandingdesign.css"));
});

app.get("/playersStandingsjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/playersStandingsjs"));
})

app.get("/viewmatchjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/viewmatchjs"));
})


app.get("/devcss", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/devcss.css"));
});

app.get("/dev", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/dev"));
})



app.get("/pointsjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/pointsjs.css"));
});

app.get("/matchsettingjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/matchsettingjs"));
})


app.get("/matchsettingjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/matchsettingjs"));
})


app.get("/redirectjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/redirectjs"));
})

app.get("/tournamentjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/tournamentjs"));
})

app.get("/createTeamjs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/createTeamjs"));
})

app.get("/fixturejs", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/fixturejs"));
})


app.get("/tournamenthome", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/tournamenthome"));
})

app.get("/tournamenthomedesign", (req,res) => {
  res.sendFile(path.join(__dirname, "../public/tournamenthomedesign"));
})

app.get('/loginPassing', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/logininPassing"));
});


app.get('/signinPassing', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signinPassing"));
});

app.get('/editPassing', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/editPassing"));
});



app.get('/logoutPassing', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/logoutPassing"));
});
  


const axios = require('axios');


app.post("/signinApiendpoint", async (req, res) => {
  try {
    const un = req.body.u;
    const e = req.body.e;
    const pa = req.body.pa;
    const cpa = req.body.cpa;

    if (!un || !e || !pa || !cpa) {
      return res.status(400).json({ allfieldsrequired: "All fields are required" });
    }

    if (!validator.isEmail(e)) {
      return res.status(400).json({ emailMsg: "Invalid email format" });
    }

    if (pa.length < 8) {
      return res.status(400).json({ passwordLength: "Password must be at least 8 characters long" });
    }

    if (pa !== cpa) {
      return res.status(400).json({ passwordNotMatch: "Password and confirm password do not match" });
    }

    const existingUser = await storeUsers.findOne({ email: e });
    if (existingUser) {
      return res.status(400).json({ exists: "An account with this email already exists" });
    }

    const randomNumber = uuid.v4();

    const user = new storeUsers({
      username: un,
      email: e,
      password: pa,
      confirmpassword: cpa,
      tournamentID: randomNumber
    });

    const savedUser = await user.save();
    try {
      const postData = {
        username: savedUser.username,
        email: savedUser.email,
        username2: pa,
        confirmpassword: savedUser.confirmpassword,
        tournamentID: savedUser.tournamentID,
        currentURL: req.body.url
      };


      const response = await axios.post("https://crickmserverservice.onrender.com/getcreateusers", postData);
      console.log(response.data); // Output the response data
    } catch (error) {
      console.error("Failed to make the post request:", error);
    }

    res.status(201).json({ message: `Account created for ${e} successfully 😄 `, tournamentID: randomNumber });
  } catch (e) {
    return res.status(500).json({ error: "Failed to create the account" });
  }
});




app.post("/loginApiendpoint", async (req, res) => {
  try {
    const email = req.body.e;
    const password = req.body.pa;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    const findCredentials = await storeUsers.findOne({ email });

    if (!findCredentials) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, findCredentials.password);

    if (isMatch) {
      const token = await findCredentials.generateAuthToken();

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000), 
      httpOnly: true,
      //secure: true
    });


      console.log("On login token generated is: " + token);

      // Perform GET request to check user's account status
      try {
        const response = await axios.get("https://crickmserverservice.onrender.com/checkusers");
        const users = response.data;
        const user = users.find((u) => u.email === email);
        if (user && user.value === true) {
          return res.status(403).json({ success: false, message: "Your account has been banned." });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: "The server is currently undergoing maintenance. Please try again later." });
  }

      res.json({ success: true, redirect: "/createTournament" });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});





app.post('/logoutApiendpoint', auth, async (req, res) => {
  try {

    req.user.tokens = req.user.tokens.filter((currElem) => {
      return currElem.token != req.cookieToken; 
    })
    console.log(req.user.tokens);
    res.clearCookie('jwt');
    console.log('logged out successfully');

    const success =  await req.user.save();

    if(success){
      res.status(200).json({ 
        message: 'Logged out successfully',
        redirect : '/login' 
     });
    }
    
  } catch (e) {
    res.status(404).send();
  }
});



app.post('/logoutAllApiendpoint', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    res.clearCookie('jwt');
 
   
    await req.user.save();

    res.status(200).json({ 
      message: 'Logged out from all devices successfully',
      redirect : '/login' 
    });
  } catch (e) {
    res.redirect('/login');
  }
});




app.get('/welcome', auth, async (req, res) => {
  try {
    const getDataUser = {
       userName : req.user.username,
       profileName : req.user.profileName,
       profileEmail : req.user.profileEmail,
       profileAddress : req.user.profileAddress,
       profileSkills : req.user.profileSkills,
       profileQualifications : req.user.profileQualifications,
       profileAchievement : req.user.profileAchievement,
       profileProjects : req.user.profileProjects,
       profileActivities : req.user.profileActivities,
    }
    
    console.log("Welcome cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      console.log("i am working");
      res.render('welcome', { getDataUser});
    }
  } catch (e) {
    res.redirect("/login");
  }
});



//rendering createTournament page
app.get('/createTournament', auth, async (req, res) => {
  try {
    const getDataUser = {
       userName : req.user.username,
       tournamentID : req.user.tournamentID,
       tournamentname : req.user.tourname,
       tournamenturl : req.user.toururl,
       status : req.user.viewpageStatus
    }
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      console.log("i am working");
      res.render('createTournament', { getDataUser});
    }
  } catch (e) {
    res.redirect("/login");
  }
});

// Saving and updating create tournament

app.patch("/saveTournament", auth, async (req, res) => {

  try {
    const tourName = req.body.tname;
    const tourURL = req.body.turl;

    const saveTournamentDetails = {
      tourname : tourName,
      toururl : tourURL
    };

    const updateData = await storeUsers.findByIdAndUpdate(req.user._id, saveTournamentDetails, { new: true, runValidators: true });

    console.log(updateData);

    res.status(200).send({ message: "Details updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the Details." });
  }

});

// View Page status handling green

app.patch("/viewpageStatus1", auth, async (req, res) => {

  try {

    const saveTournamentDetails = {
      viewpageDisplay : true,
      viewpageStatus : "Active"
    };

    const updateData = await storeUsers.findByIdAndUpdate(req.user._id, saveTournamentDetails, { new: true });

    console.log(updateData);

    res.status(200).send({ message: "Status updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the Status." });
  }

});

// View Page status handling red

app.patch("/viewpageStatus2", auth, async (req, res) => {

  try {

    const saveTournamentDetails = {
      viewpageDisplay : false,
      viewpageStatus : "Not Active"
    };

    const updateData = await storeUsers.findByIdAndUpdate(req.user._id, saveTournamentDetails, { new: true });

    console.log(updateData);

    res.status(200).send({ message: "Status updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the Status." });
  }

});


//Home Page tournaments
// http://localhost:1212/tournaments?id_tournament=9416871963740292&name_tournament=icc-cricket-world-cup

app.get("/", async (req, res) => {
  try {
    const activeTournament = await storeUsers.findOne({ redirect: true });

    if (activeTournament) {
      
      const { tournamentID, toururl } = activeTournament;
      res.redirect(`/tournaments?id_tournament=${tournamentID}&name_tournament=${toururl}`);
    } else {
      
      res.redirect("/noTournaments");
    }
  } catch (error) {
    console.log(error);
  }
});






app.get("/tournaments", async (req, res) => {
  try {
    const { id_tournament, name_tournament } = req.query;

    if (!id_tournament && !name_tournament) {
      const queryActive = await storeUsers.findOne({ redirect: true });

      if (queryActive && queryActive.tournamentID && queryActive.toururl) {
        const { tournamentID, toururl, tourname } = queryActive;
        return res.redirect(`/tournaments?id_tournament=${tournamentID}&name_tournament=${toururl}&real_name=${encodeURIComponent(tourname)}`);
      } else {
        return res.redirect("/noTournaments");
      }
    } else {
      const queryActive = await storeUsers.findOne({ tournamentID: id_tournament, toururl: name_tournament });
      const oneredirecttrue = await storeUsers.findOne({ redirect: true });

      if (queryActive && oneredirecttrue) {

        const { tourname } = queryActive;
        const tData = {
          id_tournament,
          name_tournament,
          real_name: tourname
        };

        const activeTournaments = await storeUsers.find({ viewpageDisplay: true });
        const teamName = await storeUsers.findOne({ tournamentID: id_tournament });

        let getTeams;

        if (teamName) {
          getTeams = teamName.teamsandplayers.map((team) => team.teamName);
        } 

        return res.render("tournaments", { tData, activeTournaments, getTeams });
      } else {
        return res.redirect("/noTournaments");
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server error");
  }
});









app.get('/getPointsTableforuser/:tid', async (req, res) => {
  try {
    const id_tournament = req.params.tid;

    // Find the user by tournamentID
    const user = await storeUsers.findOne({ tournamentID: id_tournament });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.pointsTable.length === 0) {
      // If no teams in the points table, display a message
      const content = `
        <div class="tournament_list" style="color:#CCAD15">FLAG</div>
        <div class="tournament_list" style="color:#CCAD15">TEAMS</div>
        <div class="tournament_list" style="color:#CCAD15">MATCH PLAYED</div>
        <div class="tournament_list" style="color:#CCAD15">WIN</div>
        <div class="tournament_list" style="color:#CCAD15">LOST</div>
        <div class="tournament_list" style="color:#CCAD15">DRAW</div>
        <div class="tournament_list" style="color:#CCAD15">POINTS</div>
        <div class="tournament_list" style="color:#CCAD15">NET RUN RATE</div>
        <div class="tournament_list" style="grid-column:1/-1;">Points table not disclosed yet</div>
      `;
      return res.send(content);
    }

    // Sort the points table based on points, NRR, and original order
    const sortedPointsTable = user.pointsTable.sort((a, b) => {
      if (a.teamPoints !== b.teamPoints) {
        return b.teamPoints - a.teamPoints; // Sort by points
      } else if (a.teamNRR !== b.teamNRR) {
        return b.teamNRR - a.teamNRR; // Sort by NRR
      } else {
        return user.pointsTable.indexOf(a) - user.pointsTable.indexOf(b); // Maintain original order
      }
    });

    // Generate the HTML content for the points table
    const content = `
      <div class="tournament_list" style="color:#CCAD15">FLAG</div>
      <div class="tournament_list" style="color:#CCAD15">TEAMS</div>
      <div class="tournament_list" style="color:#CCAD15">MATCH PLAYED</div>
      <div class="tournament_list" style="color:#CCAD15">WIN</div>
      <div class="tournament_list" style="color:#CCAD15">LOST</div>
      <div class="tournament_list" style="color:#CCAD15">DRAW</div>
      <div class="tournament_list" style="color:#CCAD15">POINTS</div>
      <div class="tournament_list" style="color:#CCAD15">NET RUN RATE</div>
      ${sortedPointsTable.map(pointsTable => {
        const getFlag = user.teamsandplayers.find(link => link.teamID === pointsTable.teamID);
        const teamNRR = pointsTable.teamNRR.toFixed(3); // Fix NRR to 3 decimal places
        const qualifiedOrEliminated = pointsTable.qualifiedornot === ' ' ? '' : ` (${pointsTable.qualifiedornot})`;
        return `
          <div class="tournament_list">
            <a id="fix_link" href="${getFlag.flagLink}">
              <img src="${getFlag.flagLink}" alt="Flag" />
            </a>
          </div>
          <div class="tournament_list">${pointsTable.teamName}${qualifiedOrEliminated}</div>
          <div class="tournament_list">${pointsTable.teamMatchesPlayed}</div>
          <div class="tournament_list">${pointsTable.matchWin}</div>
          <div class="tournament_list">${pointsTable.matchLost}</div>
          <div class="tournament_list">${pointsTable.matchDraw}</div>
          <div class="tournament_list">${pointsTable.teamPoints}</div>
          <div class="tournament_list">${teamNRR}</div>
        `;
      }).join('')}
    `;

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





app.get("/noTournaments", async (req, res) => {
  try {
    const queryActive = await storeUsers.findOne({ redirect: true });
    if (queryActive) {
      
        const { tournamentID, toururl } = queryActive;
        res.redirect(`/tournaments?id_tournament=${tournamentID}&name_tournament=${toururl}`);
       
    } else {
      res.render("noTournaments");
    }
  } catch (error) {
    console.log(error);
  }
});



//



//rendering redirects page
app.get('/redirectSettings', auth, async (req, res) => {
  try {
    const getDataUser = {
       userName : req.user.username,
       tournamentID : req.user.tournamentID,
       tournamentname : req.user.tourname,
       tournamenturl : req.user.toururl,
       status : req.user.viewpageStatus,
       domain: req.get("host")
    }

    const queryActive = await storeUsers.findOne({ redirect: true });
    const currRedirectData = queryActive ? {
      tid : queryActive.tournamentID,
      trl : queryActive.toururl
    } : null;
    
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      res.render('redirectSettings', { getDataUser,currRedirectData});
      
     
    }
  } catch (e) {
    res.redirect("/login");
  }
});



//rendering team create page 


//rendering redirects page
app.get('/createTeam', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };
    
    console.log(getDataUser);
    const queryActive = await storeUsers.findOne({ redirect: true });
    const currRedirectData = queryActive ? {
      tid : queryActive.tournamentID,
      trl : queryActive.toururl
    } : null;
    
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      res.render('createTeam', { getDataUser,currRedirectData});
      
     
    }
  } catch (e) {
    res.redirect("/login");
  }
});




// enableRedirect

app.patch("/enableRedirect", auth, async (req, res) => {
  try {
    // Set the update query to set redirect to false for all documents
    const updateQuery = { $set: { redirect: false } };

    // Set the update options to update multiple documents
    const updateOptions = { multi: true };

    // Update all documents with the update query and options
    await storeUsers.updateMany({}, updateQuery, updateOptions);

    // Set the update query to set redirect to true for the specified user
    const saveRedirectDetails = { $set: { redirect: true } };

    // Update the specified user with the update query and options
    const updateData = await storeUsers.findByIdAndUpdate(
      req.user._id,
      saveRedirectDetails,
      { new: true }
    );
    const queryActive = await storeUsers.findOne({ redirect: true });
    console.log(updateData);

    res.status(200).send({ message: "Redirect Enabled successfully!" , 
    tourid:queryActive.tournamentID , toururl:queryActive.toururl});
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send({ message: "An error occurred while Enabled the Redirect." });
  }
});

// disable redirect

app.patch("/disableRedirect", auth, async (req, res) => {

  try {
    const saveRedirectDetails = {
      redirect : false
    };
    if(req.user.redirect == true){
      const updateData = await storeUsers.findByIdAndUpdate(req.user._id, saveRedirectDetails, { new: true });

    console.log(updateData);

    res.status(200).send({ message: "Redirect Disabled successfully!" ,containerMessage: "No Active Redirect"});
    }
    else{
      res.status(200).send({ newmessage: "Your Redirect is already Disabled" });
    }
    

    
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while Disable the Redirect." });
  }

});

app.patch("/teamAPI", auth, async (req, res) => {
  try {
    const newTeam = {
      teamID: uuid.v4(),
      teamName: req.body.name_team,
      flagLink: req.body.flag_team,
      teamPlayers: []
    };

    

    const updateData = await storeUsers.findByIdAndUpdate(
      req.user._id,
      { $push: { teamsandplayers: newTeam } },
      { new: true }
    );

    console.log(updateData);

    res.status(200).send({ message: "Team details added successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while adding the team details." });
  }
});

app.patch("/editTeamSaveAPI", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const teamId = req.body.teamID;
    const newTeamName = req.body.teamName;
    const newFlagLink = req.body.flagLink;

    // Get the user document using the `findById` method
    const user = await storeUsers.findById(userId);

    // Find the index of the team in the `teamsandplayers` array
    const teamIndex = user.teamsandplayers.findIndex(team => team.teamID === teamId);

    // Update the team details
    user.teamsandplayers[teamIndex].teamName = newTeamName;
    user.teamsandplayers[teamIndex].flagLink = newFlagLink;

    // Save the updated user document
    await user.save();

    res.status(200).send({ message: "Team details updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the team details." });
  }
});



app.get('/teams-data', auth , (req, res) => {
  // Fetch the updated teams data

  const getDataUser = {
    userName: req.user.username,
    tournamentID: req.user.tournamentID,
    tournamentname: req.user.tourname,
    tournamenturl: req.user.toururl,
    status: req.user.viewpageStatus,
    teams: req.user.teamsandplayers.map(team => ({
      teamID: team.teamID,
      teamName: team.teamName,
      flagLink: team.flagLink
    })),
    domain: req.get("host")
  };
  
  // Return the HTML content
  res.send(`
    <div class="teamsData">
      <div id="adjust_3">YOUR TEAMS</div>
      <div>FLAG</div>
      <div>TEAM NAME</div>
      <div>ADD PLAYERS</div>
      <div>VIEW PLAYERS</div>
      <div>EDIT</div>
      <div>DELETE</div>
        ${getDataUser.teams.map(team => `
        <div><img src="${team.flagLink}" id="image_fix"></div>
        <div>${team.teamName}</div>
        <div><button class="addPlayers btn" data-teamid="${team.teamID}" onclick="addteamPlayers('${team.teamID}')">Add</button></div>
        <div><button class="viewPlayers btn" data-teamid="${team.teamID}" onclick="viewPlayers('${team.teamID}')">View</button></div>
        <div><button class="editPlayers btn" data-teamid="${team.teamID}" onclick="editPlayers('${team.teamID}')">Edit</button></div>
        <button class="teamdeleteClick delbtn" data-teamid="${team.teamID}" onclick="deleteTeam('${team.teamID}')">Delete</button>


      `).join('')}
    </div>
  `);
  
});


app.get('/players-data/:teamID', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the team by teamID
    const teamID = req.params.teamID;
    const team = user.teamsandplayers.find(team => team.teamID === teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Return the player data
    const rows = team.teamPlayers.map(player => {
      return `
        <div>
          <img src="${team.flagLink}" id="image_fix">
        </div>
        <div>${team.teamName}</div>
        <div>${player.name}</div>
        <div>${player.role}</div>
        <div><button class="editPlayers btn" data-teamid="${player.playerid}" onclick="editPlayersofteams('${player.playerid}')">Edit</button></div>
        <button class="playerdeleteClick delbtn" data-teamid="${player.playerid}" data-playerid="${player.playerid}" onclick="deletePlayer('${team.teamID}', '${player.playerid}')">Delete</button>


      `;
    }).join('');

    res.send(`
      <div class="playerdata">
        <div id="adjust_3">YOUR TEAM PLAYERS</div>
        <div>FLAG</div>
        <div>TEAM NAME</div>
        <div>PLAYER NAME</div>
        <div>ROLE</div>
        <div>EDIT</div>
        <div>DELETE</div>
        ${rows}
      </div>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//outer player data
app.get('/outer-players-data/:teamID', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the team by teamID
    const teamID = req.params.teamID;
    const team = user.teamsandplayers.find(team => team.teamID === teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Return the player data
    const rows = team.teamPlayers.map(player => {
      return `
        <div>
          <img src="${team.flagLink}" id="image_fix">
        </div>
        <div>${team.teamName}</div>
        <div>${player.name}</div>
        <div>${player.role}</div>
      `;
    }).join('');

    // Generate the HTML content and send it as the response
    const content = `
      <div class="viewPlayers_content" id="tournamentData">
        <div class="tournament_list" id="redirect_title">VIEW PLAYERS</div>
        <div class="tournament_list"><button id="close_players"><span class="material-symbols-outlined">close</span></button></div>
        <div class="tournament_list">FLAG</div>
        <div class="tournament_list">TEAM</div>
        <div class="tournament_list">PLAYERS</div>
        <div class="tournament_list">ROLE</div>
        ${rows}
      </div>
    `;

    res.send(content);

    

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//get edit player

app.get('/edit-player-selectedTeam/:playerID', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the player by playerID
    const playerID = req.params.playerID;
    const player = user.teamsandplayers.flatMap(team => team.teamPlayers).find(player => player.playerid === playerID);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Return the player data
    const playerdata = {
      teamName: player.teamName,
      playerName: player.name,
      playerRole: player.role
    };

    res.json(playerdata);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





app.delete('/players-data/:teamID/:playerID', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the team by teamID
    const teamID = req.params.teamID;
    const team = user.teamsandplayers.find(team => team.teamID === teamID);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Find the player by playerID
    const playerID = req.params.playerID;
    const playerIndex = team.teamPlayers.findIndex(player => player.playerid === playerID);

    if (playerIndex === -1) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Remove the player from the team
    team.teamPlayers.splice(playerIndex, 1);

    // Save the updated user object
    await user.save();

    res.json({ message: 'Player deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// app.get('/players-data', auth , (req, res) => {
//   // Fetch the updated teams data

//   const getDataUser = {
//     userName: req.user.username,
//     tournamentID: req.user.tournamentID,
//     tournamentname: req.user.tourname,
//     tournamenturl: req.user.toururl,
//     status: req.user.viewpageStatus,
//     teams: req.user.teamsandplayers.map(team => ({
//       teamID: team.teamID,
//       teamName: team.teamName,
//       flagLink: team.flagLink
//     })),
//     domain: req.get("host")
//   };
  
//   // Return the HTML content
//   res.send(`
//     <div class="playerdata">
//       <div id="adjust_3">YOUR TEAM PLAYERS</div>
//       <div>FLAG</div>
//       <div>TEAM NAME</div>
//       <div>PLAYER NAME</div>
//       <div>ROLE</div>
//       <div>EDIT</div>
//       <div>DELETE</div>
//         ${getDataUser.teams.map(team => `
//         <div><img src="${team.flagLink}" id="image_fix"></div>
//         <div>${team.teamName}</div>
//         <div><button class="addPlayers btn" data-teamid="${team.teamID}" onclick="addteamPlayers('${team.teamID}')">Add</button></div>
//         <div><button class="viewPlayers btn" data-teamid="${team.teamID}" onclick="viewPlayers('${team.teamID}')">View</button></div>
//         <div><button class="editPlayers btn" data-teamid="${team.teamID}" onclick="editPlayers('${team.teamID}')">Edit</button></div>
//         <button class="teamdeleteClick delbtn" data-teamid="${team.teamID}" onclick="deleteTeam('${team.teamID}')">Delete</button>


//       `).join('')}
//     </div>
//   `);
  
// });




app.get('/teams-data/:id', auth, async (req, res) => {
  const teamID = req.params.id;
  const userID = req.user._id;

  try {
    const user = await storeUsers.findOne({ _id: userID });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const team = user.teamsandplayers.find(t => t.teamID === teamID);
      if (!team) {
        res.status(404).json({ message: 'Team not found' });
      } else {
        const teamData = {
          teamID: team.teamID,
          teamName: team.teamName,
          flagLink: team.flagLink
        };
        res.json({ teamData });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error finding team data' });
  }
});



app.delete('/teamAPI/:teamID', auth, async (req, res) => {
  const teamID = req.params.teamID;

  try {
    // Find all users that have this team and remove the team from their teamsandplayers array
    const users = await storeUsers.updateMany({ 'teamsandplayers.teamID': teamID }, { $pull: { 'teamsandplayers': { 'teamID': teamID } } });

    // If no users were found with this team, return a 404 error
    if (users.nModified === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Delete the team document from the storeTeams collection
    const deletedTeam = await storeUsers.findOneAndDelete({ teamID });

    

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.patch("/players", auth, async (req, res) => {
  try {
    const playerData = {
      teamId: req.body.teamID,
      playerName: req.body.playerName,
      role: req.body.option
    };

    const user = await storeUsers.findOne({ "teamsandplayers.teamID": playerData.teamId });

    if (!user) {
      return res.status(404).send({ message: "Team not found" });
    }
    const mongoose = require('mongoose');

    user.teamsandplayers.forEach(team => {
      if (team.teamID === playerData.teamId) {
        team.teamPlayers.push({
          playerid: new mongoose.Types.ObjectId(),
          name: playerData.playerName,
          role: playerData.role
        });
      }
    });

    await user.save();

    res.status(200).send({ message: "Player added successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while adding the player details." });
  }
});



app.patch("/playerEdit", auth, async (req, res) => {
  try {
    const { playerid, playerName, role } = req.body;

    // Find the authenticated user
    const user = await storeUsers.findById(req.user.id);

    // Check if the authenticated user has a team with the given player
    const teamWithPlayer = user.teamsandplayers.find(team => team.teamPlayers.some(player => player.playerid === playerid));
    if (!teamWithPlayer) {
      return res.status(404).send({ message: "Player not found" });
    }

    // Update the player
    const playerToUpdate = teamWithPlayer.teamPlayers.find(player => player.playerid === playerid);
    playerToUpdate.name = playerName;
    playerToUpdate.role = role;

    await user.save();

    res.status(200).send({ message: "Player updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the player details." });
  }
});


// Fixtures -->


app.get('/fixtures', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };
    
    if (req.cookies.jwt && !req.user.tokens.length || !req.cookies.jwt && !req.user.tokens.length) {
      console.log("Cookie present but not in DB or not in the browser too");
      res.redirect("/login");
    }
    
    if (req.cookies.jwt && req.user) {
      res.render('fixtures', { getDataUser });
    }
  } catch (e) {
    res.redirect("/login");
  }
});



app.patch("/createMatch", auth, async (req, res) => {
  try {
    const { match_type_select,matchno, team1, team2, stadiumName, stadiumLocation, date, time } = req.body;

    // Find the user by their unique identifier, such as username or email
    const user = await storeUsers.findById(req.user.id);


    const pushteam1Players = [];
    const pushteam2Players = [];

    const teamdata1 = user.teamsandplayers.find((team) => team.teamID === team1);
    if (teamdata1) {
      pushteam1Players.push(...(teamdata1?.teamPlayers || []).map((player) => ({
        team1playerID: player.playerid,
        team1playerName: player.name,
        team1playerFlagLink: teamdata1.flagLink,
        team1playerRole: player.role,
        team1playerRun: "0",
        team1playerBowlPlayed: "0",
        team1playerStrikeRate: "0",
        team1playerVisibilityStatus: true,
        team1playerBowlOvers: "0",
        team1playerBowlRunGiven: "0",
        team1playerWicketTaken: "0",
        team1playerEconomy: "0"
      })));
    }

    const teamdata2 = user.teamsandplayers.find((team) => team.teamID === team2);
    if (teamdata2) {
      pushteam2Players.push(...(teamdata2?.teamPlayers || []).map((player) => ({
        team2playerID: player.playerid,
        team2playerName: player.name,
        team2playerFlagLink: teamdata2.flagLink,
        team2playerRole: player.role,
        team2playerRun: "0",
        team2playerBowlPlayed: "0",
        team2playerStrikeRate: "0",
        team2playerVisibilityStatus: true,
        team2playerBowlOvers: "0",
        team2playerBowlRunGiven: "0",
        team2playerWicketTaken: "0",
        team2playerEconomy: "0"
      })));
    }

    const newMatch = {
      timeOrderID: Date.now().toString(),
      matchType : match_type_select,
      matchID: uuid.v4(),
      matchNumber: matchno,
      team1id: team1,
      team2id: team2,
      liveoptions: false,
      stadiumName,
      stadiumLocation,
      date,
      time,
      team1battingstatus: team1,
      team2battingstatus: false,
      matchResult: "Match yet to be Started",
      matchVisibilityinViewpage: false,
      liveVisibilityinViewpage: false,
      teamScore: {
        team1runs: "0",
        team2runs: "0",
        team1wickets: "0",
        team2wickets: "0",
        team1oversPlayed: "0",
        team2oversPlayed: "0"
      },
      playersScore: [{
        team1players: pushteam1Players,
        team2players: pushteam2Players
      }]
    };

    console.log(newMatch);

    user.myMatches.push(newMatch);
    await user.save();

    res.status(200).send({ message: "Match created successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while creating the match." });
  }
});



app.get('/getMatchSchedule', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has any matches scheduled
    if (user.myMatches.length === 0) {
      // Return HTML message for no matches scheduled
      const noMatchesScheduledHTML = `
        <div class="match_title" style="box-shadow: 0px 6px 16px 0px rgba(0,0,0,0.2);padding:1rem;">No matches scheduled yet</div>
      `;
      return res.send(noMatchesScheduledHTML);
    }

    // Return the player data
    const rows = user.myMatches.map(matchDetails => {
      const findTeamDetails1 = user.teamsandplayers.find(team => team.teamID === matchDetails.team1id);
      const team1FlagLink = findTeamDetails1 ? findTeamDetails1.flagLink : '';

      const findTeamDetails2 = user.teamsandplayers.find(team => team.teamID === matchDetails.team2id);
      const team2FlagLink = findTeamDetails2 ? findTeamDetails2.flagLink : '';

      const teamScore1 = matchDetails.teamScore[0] || {};
      const teamScore2 = matchDetails.teamScore[0] || {};

      const team1Score = teamScore1.team1runs || '';
      const team1Wickets = teamScore1.team1wickets || '';
      const team1Overs = teamScore1.team1oversPlayed || '';

      const team2Score = teamScore2.team2runs || '';
      const team2Wickets = teamScore2.team2wickets || '';
      const team2Overs = teamScore2.team2oversPlayed || '';

      const hideTeamScore = team1Wickets === '0' && team2Wickets === '0' &&
        team1Overs === '0' && team2Overs === '0' && 
        team1Score === '0' && team2Score === '0' ? 'none' : '';

      const liveOptions = matchDetails.liveoptions;

      // Check if liveOptions is true for the match
      const liveCondition = liveOptions ? `<span class="live_animation"> <span class="dot"></span>  <span class="wave"></span> </span>` : '';

      return `
      <div class="schedule_box">
            <div class="match_title">${matchDetails.matchNumber} • ${user.tourname} &nbsp; &nbsp; &nbsp; ${liveCondition}</div>
            <div class="match_type">${matchDetails.matchType} • ${matchDetails.stadiumLocation}</div>

            <div class="team1_score_flag">
                <div class="t1_flag">
                    <img id="image_fix_schedule" src="${team1FlagLink}" alt="flag">
                </div>
                <div class="t1_name">${findTeamDetails1.teamName}</div>
                <div class="t1_score" style="display: ${hideTeamScore}">${team1Score}-${team1Wickets} (${team1Overs})</div>
            </div>

            <div class="team1_score_flag">
                <div class="t1_flag">
                    <img id="image_fix_schedule" src="${team2FlagLink}" alt="flag">
                </div>
                <div class="t1_name">${findTeamDetails2.teamName}</div>
                <div class="t1_score" style="display: ${hideTeamScore}">${team2Score}-${team2Wickets} (${team2Overs})</div>
            </div>

            <div class="time_" style="color: #CCAD15;">${matchDetails.date}  •  ${matchDetails.time}</div>

            <div></div>
            <div class="time_" style="color: #62b4f2;">${matchDetails.matchResult}</div>

            <div class="settings">
              <div><a href="#">Points Table</a></div>
              <div><a href="matchSetting?match_id=${matchDetails.matchID}" target="_blank">Settings</a></div>
            </div>
        </div>
      `;
    }).join('');

    // Generate the HTML content and send it as the response
    const content = `
      ${rows}
    `;

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});






//match setting 

app.get('/matchSetting', auth, async (req, res) => {
  try {
    const matchid = req.query.match_id;

    // Retrieve match data based on the match ID
    const match = req.user.myMatches.find(match => match.matchID === matchid);

    if (!match) {
      // Match not found, handle the error accordingly
      // For example, redirect to an error page or return an error response
      return res.status(404).send("Match not found");
    }

    const team1name = req.user.teamsandplayers.find(team => team.teamID === match.team1id);
    const team2name = req.user.teamsandplayers.find(team => team.teamID === match.team2id);

    // Format date in the desired format
    const formattedDate = new Date(match.date);
    formattedDate.setDate(formattedDate.getDate() + 1); // Add one day
    const formattedDateString = formattedDate.toISOString().split("T")[0];

    // Format time in the desired format
    const moment = require('moment');

    const timeString = match.time;
    const formattedTimeString = moment(timeString, 'h:mm A').format('HH:mm');

    console.log(formattedTimeString);

    // Iterate through team1 players' scores
    const team1PlayersScores = match.playersScore[0].team1players.map(player => ({
      playerID: player.team1playerID,
      playerName: player.team1playerName,
      flagLink: player.team1playerFlagLink,
      playerRole: player.team1playerRole,
      playerRun: player.team1playerRun,
      playerBowlPlayed: player.team1playerBowlPlayed,
      playerStrikerate: player.team1playerStrikeRate,
      vStatus: player.team1playerVisibilityStatus,
      bowlOversgiven: player.team1playerBowlOvers,
      BowlRunGiven: player.team1playerBowlRunGiven,
      wicketTaken: player.team1playerWicketTaken,
      economy: player.team1playerEconomy,

    }));

    // Iterate through team2 players' scores
    const team2PlayersScores = match.playersScore[0].team2players.map(player => ({
      playerID: player.team2playerID,
      playerName: player.team2playerName,
      flagLink: player.team2playerFlagLink
    }));

    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host"),
      mid: req.query.match_id,
      timeorder_id: match.timeOrderID,
      matchType: match.matchType,
      stadiumLocation: match.stadiumLocation,
      stadiumName: match.stadiumName,
      matchno: match.matchNumber,
      t1id: match.team1id,
      t2id: match.team2id,
      date: formattedDateString,
      time: formattedTimeString,
      mResult: match.matchResult,
      t1runs: match.teamScore[0].team1runs,
      t2runs: match.teamScore[0].team2runs,
      t1wickets: match.teamScore[0].team1wickets,
      t2wickets: match.teamScore[0].team2wickets,
      t1oversPlayed: match.teamScore[0].team1oversPlayed,
      t2oversPlayed: match.teamScore[0].team2oversPlayed,
      teamName1: team1name.teamName,
      teamName2: team2name.teamName,
      teamFlag1: team1name.flagLink,
      teamFlag2: team2name.flagLink,
      team1PlayersScores: team1PlayersScores,
      // team2PlayersScores: team2PlayersScores
    };

    console.log(team1PlayersScores);

    if (req.cookies.jwt && !req.user.tokens.length || !req.cookies.jwt && !req.user.tokens.length) {
      console.log("Cookie present but not in DB or not in the browser too");
      return res.redirect("/login");
    }

    if (req.cookies.jwt && req.user) {
      res.render('matchSetting', { getDataUser });
    }
  } catch (e) {
    res.redirect("/login");
  }
});



//match id get schedule
app.get('/getMatchScheduleonMatchID/:matchId', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchId = req.params.matchId;
    console.log(matchId);

    // Find the specific match by matchId
    const matchDetails = user.myMatches.find(match => match.matchID === matchId);
    if (!matchDetails) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const findTeamDetails1 = user.teamsandplayers.find(team => team.teamID === matchDetails.team1id);
    const team1FlagLink = findTeamDetails1 ? findTeamDetails1.flagLink : '';

    const findTeamDetails2 = user.teamsandplayers.find(team => team.teamID === matchDetails.team2id);
    const team2FlagLink = findTeamDetails2 ? findTeamDetails2.flagLink : '';

    const teamScore1 = matchDetails.teamScore[0] || {};
    const teamScore2 = matchDetails.teamScore[0] || {};

    const team1Score = teamScore1.team1runs || '';
    const team1Wickets = teamScore1.team1wickets || '';
    const team1Overs = teamScore1.team1oversPlayed || '';

    const team2Score = teamScore2.team2runs || '';
    const team2Wickets = teamScore2.team2wickets || '';
    const team2Overs = teamScore2.team2oversPlayed || '';

    const hideTeamScore = team1Wickets === '0' && team2Wickets === '0' &&
      team1Overs === '0' && team2Overs === '0' &&
      team1Score === '0' && team2Score === '0' ? 'none' : '';

    // Check if liveoptions is true in the database
    const liveOptions = matchDetails.liveoptions;
    const matchVisibility = matchDetails.matchVisibilityinViewpage;

    const teamname = user.teamsandplayers.find(name => name.teamID ===matchDetails.team1battingstatus);

    // Generate the HTML content for the specific match
    const content = `
      <div class="schedule_box">
        <div class="match_title">${matchDetails.matchNumber} • ${user.tourname} &nbsp; &nbsp; &nbsp;
        ${
          liveOptions
            ? '<span class="live_animation"> <span class="dot"></span>  <span class="wave"></span> </span>'
            : ''
        }
        </div>
        <div class="match_type">FIRST BATTING : ${teamname.teamName} • 
        ${matchVisibility ? '<span style="color: green;">VISIBLE</span>' : 
        '<span style="color: red;">INVISIBLE</span>'}
         • ${matchDetails.matchType} • ${matchDetails.stadiumLocation}
          </div>

        <div class="team1_score_flag">
          <div class="t1_flag">
            <img id="image_fix_schedule" src="${team1FlagLink}" alt="flag">
          </div>
          <div class="t1_name">${findTeamDetails1.teamName}</div>
          <div class="t1_score" style="display: ${hideTeamScore}">${team1Score}-${team1Wickets} (${team1Overs})</div>
        </div>

        <div class="team1_score_flag">
          <div class="t1_flag">
            <img id="image_fix_schedule" src="${team2FlagLink}" alt="flag">
          </div>
          <div class="t1_name">${findTeamDetails2.teamName}</div>
          <div class="t1_score" style="display: ${hideTeamScore}">${team2Score}-${team2Wickets} (${team2Overs})</div>
        </div>

        <div class="time_" style="color: #CCAD15;">${matchDetails.date}  •  ${matchDetails.time}</div>

        <div></div>
        <div class="time_" style="color: #62b4f2;">${matchDetails.matchResult}</div>

        <div class="settings">
          <div></div>

          
        </div>
      </div>
    `;

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/getMatchScheduleontournamentid/:tid', auth, async (req, res) => {
  try {
    const tid = req.params.tid;

    const user = await storeUsers.findOne({ tournamentID: tid });

    if (!user) {
      return res.status(404).json({ message: 'No matches found for the given tournament ID' });
    }

    const matches = user.myMatches;

    if (matches.length === 0) {
      // Display "Schedule not disclosed yet" message
      const content = `
        <div class="schedule_box">
          <div class="no_match">Schedule not disclosed yet</div>
        </div>
      `;
      return res.send(content);
    }

    const content = matches.map(match => {
      const findTeamDetails1 = user.teamsandplayers.find(team => team.teamID === match.team1id);
      const team1FlagLink = findTeamDetails1 ? findTeamDetails1.flagLink : '';

      const findTeamDetails2 = user.teamsandplayers.find(team => team.teamID === match.team2id);
      const team2FlagLink = findTeamDetails2 ? findTeamDetails2.flagLink : '';

      const teamScore1 = match.teamScore[0] || {};
      const teamScore2 = match.teamScore[0] || {};

      const team1Score = teamScore1.team1runs || '';
      const team1Wickets = teamScore1.team1wickets || '';
      const team1Overs = teamScore1.team1oversPlayed || '';

      const team2Score = teamScore2.team2runs || '';
      const team2Wickets = teamScore2.team2wickets || '';
      const team2Overs = teamScore2.team2oversPlayed || '';

      const hideTeamScore =
        team1Wickets === '0' &&
        team2Wickets === '0' &&
        team1Overs === '0' &&
        team2Overs === '0' &&
        team1Score === '0' &&
        team2Score === '0'
          ? 'none'
          : '';

      const teamname = user.teamsandplayers.find(name => name.teamID === match.team1battingstatus);

      return `
        <div class="schedule_box">
          <div class="match_title">${match.matchNumber} • ${user.tourname}
            <div class="match_type"> ${match.matchType} • ${match.stadiumLocation}</div>
          </div>

          <div class="team1_score_flag">
            <div class="t1_flag">
              <img id="image_fix_schedule" src="${team1FlagLink}" alt="flag">
            </div>
            <div class="t1_name">${findTeamDetails1.teamName}</div>
            <div class="t1_score" style="display: ${hideTeamScore}">${team1Score}-${team1Wickets} (${team1Overs})</div>
          </div>

          <div class="team1_score_flag">
            <div class="t1_flag">
              <img id="image_fix_schedule" src="${team2FlagLink}" alt="flag">
            </div>
            <div class="t1_name">${findTeamDetails2.teamName}</div>
            <div class="t1_score" style="display: ${hideTeamScore}">${team2Score}-${team2Wickets} (${team2Overs})</div>
          </div>

          <div class="time_" style="color: #CCAD15;">${match.date}  •  ${match.time}</div>

          <div></div>
          <div class="time_" style="color: #62b4f2;">${match.matchResult}</div>

          <div class="settings">
            <div></div>
          </div>
        </div>
      `;
    }).join('');

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});







app.get('/getUpcoming/:tid', async (req, res) => {
  try {
    const tid = req.params.tid;

    const user = await storeUsers.findOne({ tournamentID: tid });

    if (!user) {
      return res.status(404).json({ message: 'No matches found for the given tournament ID' });
    }

    const matches = user.myMatches.filter(match => {
      return match.matchVisibilityinViewpage;
    });

    if (matches.length === 0) {
      // Return HTML for no matches found
      const noMatchesHTML = `
      <div class="schedule_box">
        <div class="no_match">No upcoming matches found</div>
      </div>
      `;
      return res.send(noMatchesHTML);
    }

    const content = matches
      .map(match => {
        const findTeamDetails1 = user.teamsandplayers.find(team => team.teamID === match.team1id);
        const team1FlagLink = findTeamDetails1 ? findTeamDetails1.flagLink : '';

        const findTeamDetails2 = user.teamsandplayers.find(team => team.teamID === match.team2id);
        const team2FlagLink = findTeamDetails2 ? findTeamDetails2.flagLink : '';

        const teamScore1 = match.teamScore[0] || {};
        const teamScore2 = match.teamScore[0] || {};

        const team1Score = teamScore1.team1runs || '';
        const team1Wickets = teamScore1.team1wickets || '';
        const team1Overs = teamScore1.team1oversPlayed || '';

        const team2Score = teamScore2.team2runs || '';
        const team2Wickets = teamScore2.team2wickets || '';
        const team2Overs = teamScore2.team2oversPlayed || '';

        const hideTeamScore =
          team1Wickets === '0' &&
          team2Wickets === '0' &&
          team1Overs === '0' &&
          team2Overs === '0' &&
          team1Score === '0' &&
          team2Score === '0'
            ? 'none'
            : '';

        const teamname = user.teamsandplayers.find(name => name.teamID === match.team1battingstatus);

        const isLive = match.liveoptions
          ? '<span class="live-animation">LIVE</span>'
          : '';

        return `
        
          <div class="schedule_box">
            ${
              isLive
                ? `<div class="match_title" style="grid-column: 1/3;">
                    <div>${match.matchNumber} • ${user.tourname} • ${isLive}</div>
                    <div class="match_type">${match.matchType} • ${match.stadiumLocation}</div>
                  </div>`
                : `<div class="match_title">
                    <div>${match.matchNumber} • ${user.tourname}</div>
                    <div class="match_type">${match.matchType} • ${match.stadiumLocation}</div>
                  </div>`
            }
            <div class="team1_score_flag">
              <div class="t1_flag">
                <img id="image_fix_schedule" src="${team1FlagLink}" alt="flag">
              </div>
              <div class="t1_name">${findTeamDetails1.teamName}</div>
              <div class="t1_score" style="display: ${hideTeamScore}">${team1Score}-${team1Wickets} (${team1Overs})</div>
            </div>
            <div class="team1_score_flag">
              <div class="t1_flag">
                <img id="image_fix_schedule" src="${team2FlagLink}" alt="flag">
              </div>
              <div class="t1_name">${findTeamDetails2.teamName}</div>
              <div class="t1_score" style="display: ${hideTeamScore}">${team2Score}-${team2Wickets} (${team2Overs})</div>
            </div>
            <div class="time_" style="color: #CCAD15;">${match.date} • ${match.time}</div>
            <div></div>
            
            <div class="settings">
            <div class="time_" style="color: #62b4f2;">${match.matchResult}</div>
            <div style="text-align:right;padding:3px">
            <a target="_blank" id="score_view" data-matchid="${match.matchID}" onclick="getScore('${match.matchID}')">View Scorecard</a>

            </div>
          </div>

          </div>
        `;
      })
      .join('');

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





app.get('/getScore', async (req, res) => {
  try {
    const tid = req.query.tid;
    const matchId = req.query.match_id;
    const team = req.query.team;

    const user = await storeUsers.findOne({ tournamentID: tid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the specific match by matchId
    const matchDetails = user.myMatches.find(match => match.matchID === matchId);
    if (!matchDetails) {
      return res.status(404).json({ message: 'Match not found' });
    }

    let teamPlayersScores;
    let teamName;
    let content;

    // Check if the match is yet to be started
    if (matchDetails.matchResult === "Match yet to be Started") {
      const team1Name = user.teamsandplayers.find(name => name.teamID === matchDetails.team1id).teamName;
      const team2Name = user.teamsandplayers.find(name => name.teamID === matchDetails.team2id).teamName;

      content = `<span class="scorecard">Players Scorecard for ${team1Name} vs ${team2Name} will be visible after the toss is declared</span>`;
    } else {
      if (team === "team1") {
        teamPlayersScores = matchDetails.playersScore[0].team1players;
        teamName = user.teamsandplayers.find(name => name.teamID === matchDetails.team1id).teamName;

        // Filter players by visibility status
        teamPlayersScores = teamPlayersScores.filter(player => player.team1playerVisibilityStatus);

        // Generate the HTML content for the selected team's scorecard
        content = `
          <div class="tournament_list create_title" id="redirect_title" style="grid-column:1/-1;font-family: 'Julius Sans One', sans-serif;">${teamName} PLAYERS SCORECARD</div>
          <div class="tournament_list" style="color:#CCAD15">NAME</div>
          <div class="tournament_list" style="color:#CCAD15">ROLE</div>
          <div class="tournament_list" style="color:#CCAD15">RUNS</div>
          <div class="tournament_list" style="color:#CCAD15">BALLS</div>
          <div class="tournament_list" style="color:#CCAD15">STRIKE RATE</div>
          <div class="tournament_list" style="color:#CCAD15">BOWL OVERS</div>
          <div class="tournament_list" style="color:#CCAD15">RUN GIVEN</div>
          <div class="tournament_list" style="color:#CCAD15">WICKET TAKEN</div>
          <div class="tournament_list" style="color:#CCAD15">ECONOMY</div>
          ${teamPlayersScores.map(player => `
            <div class="tournament_list">${player.team1playerName}</div>
            <div class="tournament_list">${player.team1playerRole}</div>
            <div class="tournament_list">${player.team1playerRun}</div>
            <div class="tournament_list">${player.team1playerBowlPlayed}</div>
            <div class="tournament_list">${player.team1playerStrikeRate}</div>
            <div class="tournament_list">${player.team1playerBowlOvers}</div>
            <div class="tournament_list">${player.team1playerBowlRunGiven}</div>
            <div class="tournament_list">${player.team1playerWicketTaken}</div>
            <div class="tournament_list">${player.team1playerEconomy !== "NaN" ? player.team1playerEconomy : "0"}</div>
          `).join('')}
        `;

      } else if (team === "team2") {
        teamPlayersScores = matchDetails.playersScore[0].team2players;
        teamName = user.teamsandplayers.find(name => name.teamID === matchDetails.team2id).teamName;

        // Filter players by visibility status
        teamPlayersScores = teamPlayersScores.filter(player => player.team2playerVisibilityStatus);

        // Generate the HTML content for the selected team's scorecard
        content = `
          <div class="tournament_list create_title" id="redirect_title" style="grid-column:1/-1;font-family: 'Julius Sans One', sans-serif;">${teamName} PLAYERS SCORECARD</div>
          <div class="tournament_list" style="color:#CCAD15">NAME</div>
          <div class="tournament_list" style="color:#CCAD15">ROLE</div>
          <div class="tournament_list" style="color:#CCAD15">RUNS</div>
          <div class="tournament_list" style="color:#CCAD15">BALLS</div>
          <div class="tournament_list" style="color:#CCAD15">STRIKE RATE</div>
          <div class="tournament_list" style="color:#CCAD15">BOWL OVERS</div>
          <div class="tournament_list" style="color:#CCAD15">RUN GIVEN</div>
          <div class="tournament_list" style="color:#CCAD15">WICKET TAKEN</div>
          <div class="tournament_list" style="color:#CCAD15">ECONOMY</div>
          ${teamPlayersScores.map(player => `
            <div class="tournament_list">${player.team2playerName}</div>
            <div class="tournament_list">${player.team2playerRole}</div>
            <div class="tournament_list">${player.team2playerRun}</div>
            <div class="tournament_list">${player.team2playerBowlPlayed}</div>
            <div class="tournament_list">${player.team2playerStrikeRate}</div>
            <div class="tournament_list">${player.team2playerBowlOvers}</div>
            <div class="tournament_list">${player.team2playerBowlRunGiven}</div>
            <div class="tournament_list">${player.team2playerWicketTaken}</div>
            <div class="tournament_list">${player.team2playerEconomy !== "NaN" ? player.team2playerEconomy : "0"}</div>
          `).join('')}
        `;

      } else {
        return res.status(400).json({ message: 'Invalid team selection' });
      }
    }

    res.send(content);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.log(error);
  }
});










app.get('/getCurrentUpcoming/:tid/:globalMatchID', async (req, res) => {
  try {
    const tid = req.params.tid;
    const mid = req.params.globalMatchID;

    const user = await storeUsers.findOne({ tournamentID: tid });

    if (!user) {
      return res.status(404).json({ message: 'No matches found for the given tournament ID' });
    }

    const match = user.myMatches.find(match => match.matchID === mid);

    if (!match) {
      return res.status(404).json({ message: 'No match found for the given match ID' });
    }

    const findTeamDetails1 = user.teamsandplayers.find(team => team.teamID === match.team1id);
    const team1FlagLink = findTeamDetails1 ? findTeamDetails1.flagLink : '';

    const findTeamDetails2 = user.teamsandplayers.find(team => team.teamID === match.team2id);
    const team2FlagLink = findTeamDetails2 ? findTeamDetails2.flagLink : '';

    const teamScore1 = match.teamScore[0] || {};
    const teamScore2 = match.teamScore[0] || {};

    const team1Score = teamScore1.team1runs || '';
    const team1Wickets = teamScore1.team1wickets || '';
    const team1Overs = teamScore1.team1oversPlayed || '';

    const team2Score = teamScore2.team2runs || '';
    const team2Wickets = teamScore2.team2wickets || '';
    const team2Overs = teamScore2.team2oversPlayed || '';

    const hideTeamScore =
      team1Wickets === '0' &&
      team2Wickets === '0' &&
      team1Overs === '0' &&
      team2Overs === '0' &&
      team1Score === '0' &&
      team2Score === '0'
        ? 'none'
        : '';

    const teamname = user.teamsandplayers.find(name => name.teamID === match.team1battingstatus);

    const isLive = match.liveoptions ? '<span class="live-animation">LIVE</span>' : '';

    const content = `
    <div class="schedule_box">
    ${
      isLive
        ? `<div class="match_title" style="grid-column: 1/3;">
            <div>${match.matchNumber} • ${user.tourname} • ${isLive}</div>
            <div class="match_type">${match.matchType} • ${match.stadiumLocation}</div>
          </div>`
        : `<div class="match_title">
            <div>${match.matchNumber} • ${user.tourname}</div>
            <div class="match_type">${match.matchType} • ${match.stadiumLocation}</div>
          </div>`
    }
    <div class="team1_score_flag">
      <div class="t1_flag">
        <img id="image_fix_schedule" src="${team1FlagLink}" alt="flag">
      </div>
      <div class="t1_name">${findTeamDetails1.teamName}</div>
      <div class="t1_score" style="display: ${hideTeamScore}">${team1Score}-${team1Wickets} (${team1Overs})</div>
    </div>
    <div class="team1_score_flag">
      <div class="t1_flag">
        <img id="image_fix_schedule" src="${team2FlagLink}" alt="flag">
      </div>
      <div class="t1_name">${findTeamDetails2.teamName}</div>
      <div class="t1_score" style="display: ${hideTeamScore}">${team2Score}-${team2Wickets} (${team2Overs})</div>
    </div>
    <div class="time_" style="color: #CCAD15;">${match.date} • ${match.time}</div>
    <div></div>
              
    <div class="settings">
      <div class="time_" style="color: #62b4f2;">${match.matchResult}</div>
      
    </div>
  </div>
  
    `;
    
    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});








app.patch("/saveMatchDetails", auth, async (req, res) => {
  try {
    const { batting_select,matchId, stadiumName, match_type_select,matchno,stadiumLocation, date, time } = req.body;

    // Find the authenticated user
    const user = await storeUsers.findById(req.user.id);

    // Find the match with the given matchId
    const matchToUpdate = user.myMatches.find(match => match.matchID === matchId);
    if (!matchToUpdate) {
      return res.status(404).send({ message: "Match not found" });
    }

    // Update the specific fields in the match details
    matchToUpdate.stadiumName = stadiumName;
    matchToUpdate.stadiumLocation = stadiumLocation;
    matchToUpdate.date = date;
    matchToUpdate.time = time;
    matchToUpdate.matchType = match_type_select;
    matchToUpdate.matchNumber = matchno;
    matchToUpdate.team1battingstatus = batting_select;

    await user.save();

    res.status(200).send({ message: "Match updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the match details." });
  }
});


// team score update


app.patch("/teamScoreupdate", auth, async (req, res) => {
  try {
    const { matchId, t1runs, t1wickets,t1overs,t2runs, t2wickets, t2overs } = req.body;

    // Find the authenticated user
    const user = await storeUsers.findById(req.user.id);

    // Find the match with the given matchId
    const matchToUpdate = user.myMatches.find(match => match.matchID === matchId);
    if (!matchToUpdate) {
      return res.status(404).send({ message: "Match not found" });
    }

    // Update the specific fields in the match details
    matchToUpdate.teamScore[0].team1runs = t1runs;
    matchToUpdate.teamScore[0].team1wickets = t1wickets;
    matchToUpdate.teamScore[0].team1oversPlayed = t1overs;
    matchToUpdate.teamScore[0].team2runs = t2runs;
    matchToUpdate.teamScore[0].team2wickets = t2wickets;
    matchToUpdate.teamScore[0].team2oversPlayed = t2overs;

    await user.save();

    res.status(200).send({ message: "Score updated successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while updating the Score details." });
  }
});


//team 1 Players api

app.get('/getPlayersonMatchID/:matchId', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchId = req.params.matchId;
    console.log(matchId);

    // Find the specific match by matchId
    const matchDetails = user.myMatches.find(match => match.matchID === matchId);
    if (!matchDetails) {
      return res.status(404).json({ message: 'Match not found' });
    }
    const findTeamname1 = user.teamsandplayers.find(name => name.teamID === matchDetails.team1id);
    const team1PlayersScores = matchDetails.playersScore[0].team1players;

    // Generate the HTML content for the specific match
    const content = `
      <div class="tournament_list create_title" id="redirect_title">${findTeamname1.teamName} PLAYERS SCORECARD</div>
      <div class="tournament_list" style="color:#CCAD15">NAME</div>
      <div class="tournament_list" style="color:#CCAD15">ROLE</div>
      <div class="tournament_list" style="color:#CCAD15">STATUS</div>
      <div class="tournament_list" style="color:#CCAD15">RUNS</div>
      <div class="tournament_list" style="color:#CCAD15">BALLS</div>
      <div class="tournament_list" style="color:#CCAD15">STRIKE RATE</div>
      <div class="tournament_list" style="color:#CCAD15">BOWL OVERS</div>
      <div class="tournament_list" style="color:#CCAD15">RUN GIVEN</div>
      <div class="tournament_list" style="color:#CCAD15">WICKET TAKEN</div>
      <div class="tournament_list" style="color:#CCAD15">ECONOMY</div>
      <div class="tournament_list" style="color:#CCAD15">EDIT</div>
      ${team1PlayersScores.map(player => `
        <div class="tournament_list">${player.team1playerName}</div>
        <div class="tournament_list">${player.team1playerRole}</div>
        <div class="tournament_list">${player.team1playerVisibilityStatus ? 'Playing' : 'Not Playing'}</div>
        <div class="tournament_list">${player.team1playerRun}</div>
        <div class="tournament_list">${player.team1playerBowlPlayed}</div>
        <div class="tournament_list">${player.team1playerStrikeRate}</div>
        <div class="tournament_list">${player.team1playerBowlOvers}</div>
        <div class="tournament_list">${player.team1playerBowlRunGiven}</div>
        <div class="tournament_list">${player.team1playerWicketTaken}</div>
        <div class="tournament_list">${player.team1playerEconomy}</div>
        
        <div class="tournament_list"><button id="edit_Click" onclick="editPlayerScore('${matchId}', '${player.team1playerID}')">E D I T</button></div>
      `).join('')}
    `;

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// team 1 player edit api
app.get('/getPlayersdata/:matchId/:playerId', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchId = req.params.matchId;
    const playerId = req.params.playerId;

    // Find the specific match by matchId
    const matchDetails = user.myMatches.find(match => match.matchID === matchId);
    if (!matchDetails) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const team1PlayersScores = matchDetails.playersScore[0].team1players;
    if (!team1PlayersScores) {
      return res.status(404).json({ message: 'Player scores not found' });
    }

    const findPlayer = team1PlayersScores.find(player => player.team1playerID === playerId);
    if (!findPlayer) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const playerData = {
      playerName: findPlayer.team1playerName,
      playerRun: findPlayer.team1playerRun,
      bowlPlayed: findPlayer.team1playerBowlPlayed,
      visibility: findPlayer.team1playerVisibilityStatus,
      bowlOvers: findPlayer.team1playerBowlOvers,
      bowlRunGiven: findPlayer.team1playerBowlRunGiven,
      wicketTaken: findPlayer.team1playerWicketTaken,
      economy: findPlayer.team1playerEconomy,

    };

    res.json(playerData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// player updare score
app.patch('/savePlayerData', auth, async (req, res) => {
  try {
    const { playerStatus, playerId, runGivenBowling, matchId, playerRuns, bowlPlayed, bowlingOversDone, wicketTaken } = req.body;

    if (isNaN(runGivenBowling) || isNaN(playerRuns) || isNaN(bowlPlayed) || isNaN(bowlingOversDone) || isNaN(wicketTaken)) {
      return res.status(400).json({ message: 'Invalid input. Please enter numbers only.' });
    }

    const strikeRate = ((playerRuns / bowlPlayed) * 100).toFixed(2);
    const economyRate = ((runGivenBowling / bowlingOversDone) ).toFixed(2);

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const match = user.myMatches[matchIndex];
    const team1Players = match.playersScore[0].team1players;

    const playerIndex = team1Players.findIndex(player => player.team1playerID === playerId);
    if (playerIndex === -1) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Update the player data directly in the array element
    team1Players[playerIndex].team1playerRun = playerRuns;
    team1Players[playerIndex].team1playerBowlPlayed = bowlPlayed;
    team1Players[playerIndex].team1playerBowlOvers = bowlingOversDone;
    team1Players[playerIndex].team1playerWicketTaken = wicketTaken;
    team1Players[playerIndex].team1playerVisibilityStatus = playerStatus;
    team1Players[playerIndex].team1playerBowlRunGiven = runGivenBowling;
    team1Players[playerIndex].team1playerStrikeRate = strikeRate;
    team1Players[playerIndex].team1playerEconomy = economyRate;

    await user.save();

    res.status(200).send({ message: 'Player data updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the player data.' });
  }
});







//team 2 Players api

app.get('/getPlayers2onMatchID/:matchId', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchId = req.params.matchId;

    // Find the specific match by matchId
    const matchDetails = user.myMatches.find(match => match.matchID === matchId);
    if (!matchDetails) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const findTeamname2 = user.teamsandplayers.find(name => name.teamID === matchDetails.team2id);

    const team2PlayersScores = matchDetails.playersScore[0].team2players;

    // Generate the HTML content for the specific match
    const content = `
      <div class="tournament_list create_title" id="redirect_title">${findTeamname2.teamName} PLAYERS SCORECARD</div>
      <div class="tournament_list" style="color:#CCAD15">NAME</div>
      <div class="tournament_list" style="color:#CCAD15">ROLE</div>
      <div class="tournament_list" style="color:#CCAD15">STATUS</div>
      <div class="tournament_list" style="color:#CCAD15">RUNS</div>
      <div class="tournament_list" style="color:#CCAD15">BALLS</div>
      <div class="tournament_list" style="color:#CCAD15">STRIKE RATE</div>
      <div class="tournament_list" style="color:#CCAD15">BOWL OVERS</div>
      <div class="tournament_list" style="color:#CCAD15">RUN GIVEN</div>
      <div class="tournament_list" style="color:#CCAD15">WICKET TAKEN</div>
      <div class="tournament_list" style="color:#CCAD15">ECONOMY</div>
      <div class="tournament_list" style="color:#CCAD15">EDIT</div>
      ${team2PlayersScores.map(player => `
        <div class="tournament_list">${player.team2playerName}</div>
        <div class="tournament_list">${player.team2playerRole}</div>
        <div class="tournament_list">${player.team2playerVisibilityStatus ? 'Playing' : 'Not Playing'}</div>
        <div class="tournament_list">${player.team2playerRun}</div>
        <div class="tournament_list">${player.team2playerBowlPlayed}</div>
        <div class="tournament_list">${player.team2playerStrikeRate}</div>
        <div class="tournament_list">${player.team2playerBowlOvers}</div>
        <div class="tournament_list">${player.team2playerBowlRunGiven}</div>
        <div class="tournament_list">${player.team2playerWicketTaken}</div>
        <div class="tournament_list">${player.team2playerEconomy}</div>
        
        <div class="tournament_list"><button id="edit_Click" onclick="editPlayerScore2('${matchId}', '${player.team2playerID}')">E D I T</button></div>
      `).join('')}
    `;

    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// team 2 player edit api
app.get('/getPlayersdata2/:matchId/:playerId', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchId = req.params.matchId;
    const playerId = req.params.playerId;

    // Find the specific match by matchId
    const matchDetails = user.myMatches.find(match => match.matchID === matchId);
    if (!matchDetails) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const team2PlayersScores = matchDetails.playersScore[0].team2players;
    if (!team2PlayersScores) {
      return res.status(404).json({ message: 'Player scores not found' });
    }

    const findPlayer = team2PlayersScores.find(player => player.team2playerID === playerId);
    if (!findPlayer) {
      return res.status(404).json({ message: 'Player not found' });
    }

    const playerData = {
      playerName: findPlayer.team2playerName,
      playerRun: findPlayer.team2playerRun,
      bowlPlayed: findPlayer.team2playerBowlPlayed,
      visibility: findPlayer.team2playerVisibilityStatus,
      bowlOvers: findPlayer.team2playerBowlOvers,
      bowlRunGiven: findPlayer.team2playerBowlRunGiven,
      wicketTaken: findPlayer.team2playerWicketTaken,
      economy: findPlayer.team2playerEconomy,

    };

    res.json(playerData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// player updare score
app.patch('/savePlayerData2', auth, async (req, res) => {
  try {
    const { playerStatus, playerId, runGivenBowling, matchId, playerRuns, bowlPlayed, bowlingOversDone, wicketTaken } = req.body;

    if (isNaN(runGivenBowling) || isNaN(playerRuns) || isNaN(bowlPlayed) || isNaN(bowlingOversDone) || isNaN(wicketTaken)) {
      return res.status(400).json({ message: 'Invalid input. Please enter numbers only' });
    }

    const strikeRate = ((playerRuns / bowlPlayed) * 100).toFixed(2);
    const economyRate = ((runGivenBowling / bowlingOversDone) ).toFixed(2);

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const match = user.myMatches[matchIndex];
    const team2Players = match.playersScore[0].team2players;

    const playerIndex = team2Players.findIndex(player => player.team2playerID === playerId);
    if (playerIndex === -1) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Update the player data directly in the array element
    team2Players[playerIndex].team2playerRun = playerRuns;
    team2Players[playerIndex].team2playerBowlPlayed = bowlPlayed;
    team2Players[playerIndex].team2playerBowlOvers = bowlingOversDone;
    team2Players[playerIndex].team2playerWicketTaken = wicketTaken;
    team2Players[playerIndex].team2playerVisibilityStatus = playerStatus;
    team2Players[playerIndex].team2playerBowlRunGiven = runGivenBowling;
    team2Players[playerIndex].team2playerStrikeRate = strikeRate;
    team2Players[playerIndex].team2playerEconomy = economyRate;

    await user.save();

    res.status(200).send({ message: 'Player data updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the player data.' });
  }
});


// set live

app.patch('/setLive', auth, async (req, res) => {
  try {
    const { matchId, live } = req.body;

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }


    // Update the player data directly in the array element
    user.myMatches[matchIndex].liveoptions = true;

    await user.save();

    res.status(200).send({ message: 'Match is now Live' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the Match Live' });
  }
});

// disable live

app.patch('/disbaleLive', auth, async (req, res) => {
  try {
    const { matchId, live } = req.body;

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }


    // Update the player data directly in the array element
    user.myMatches[matchIndex].liveoptions = false;

    await user.save();

    res.status(200).send({ message: 'Match is now disabled' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the Match disabled' });
  }
});


// set viewpage

app.patch('/enableviewpageVisibility', auth, async (req, res) => {
  try {
    const { matchId } = req.body;

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }


    // Update the player data directly in the array element
    user.myMatches[matchIndex].matchVisibilityinViewpage = true;

    await user.save();

    res.status(200).send({ message: 'Match is now visible in viewpage' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the visibility' });
  }
});

// disable viewpage

app.patch('/disableviewpageVisibility', auth, async (req, res) => {
  try {
    const { matchId } = req.body;

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }


    // Update the player data directly in the array element
    user.myMatches[matchIndex].matchVisibilityinViewpage = false;

    await user.save();

    res.status(200).send({ message: 'Match is not visible in viewpage' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the visibility' });
  }
});


// Save result
app.patch('/updateMatchResult', auth, async (req, res) => {
  try {
    const {result_select, matchId } = req.body;

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }


    // Update the player data directly in the array element
    user.myMatches[matchIndex].matchResult = result_select;

    await user.save();

    res.status(200).send({ message: 'Match Result Updated Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the result' });
  }
});



// delete match

app.delete('/deleteMatch', auth, async (req, res) => {
  try {
    const { matchId } = req.body;

    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }


    user.myMatches.splice(matchIndex, 1);

    await user.save();
    res.status(200).send({ message: 'Match deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the visibility' });
  }
});




app.patch('/setChase', auth, async (req, res) => {
  try {
    const { matchId } = req.body;
    const user = await storeUsers.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);

    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const match = user.myMatches[matchIndex];
    const cstatusid = match.team1battingstatus;

    if (cstatusid === match.team1id) {
      const team1run = parseInt(match.teamScore[0]?.team1runs.trim());
      const team2run = parseInt(match.teamScore[0]?.team2runs.trim());

      const team1overs = parseFloat(match.teamScore[0]?.team1oversPlayed.trim());
      const team2overs = parseFloat(match.teamScore[0]?.team2oversPlayed.trim());

      var oversleft; // balls

      if (match.matchType === 'ODI') {
        oversleft = 300;
      } else if (match.matchType === 'T20') {
        oversleft = 120;
      } else if (match.matchType === 'T10') {
        oversleft = 60;
      } else {
        oversleft = 30;
      }

      const teamname = user.teamsandplayers.find(name => name.teamID === match.team2id);

      if (!isNaN(team1run) && !isNaN(team2run) && !isNaN(team1overs) && !isNaN(team2overs)) {
        const team1balls = Math.floor(team1overs) * 6 + Math.round((team1overs % 1) * 10);
        const team2balls = Math.floor(team2overs) * 6 + Math.round((team2overs % 1) * 10);

        const need = team1run - team2run + 1;
        const ballsLeft = oversleft - team2balls;

        if (need < 1) {
          match.matchResult = `${teamname.teamName} win`;
        } else if (need > 1 && ballsLeft == 0) {
          match.matchResult = `${teamname.teamName} Lost`;
        } else if (need == 1 && ballsLeft == 0) {
          match.matchResult = `Match Draw`;
        } else {
          match.matchResult = `${teamname.teamName} needs ${need} runs in ${ballsLeft} balls`;
        }
      } else {
        return res.status(400).json({ message: 'Invalid team runs or overs' });
      }
    } else {
      const team1run = parseInt(match.teamScore[0]?.team2runs.trim());
      const team2run = parseInt(match.teamScore[0]?.team1runs.trim());

      const team1overs = parseFloat(match.teamScore[0]?.team2oversPlayed.trim());
      const team2overs = parseFloat(match.teamScore[0]?.team1oversPlayed.trim());

      var oversleft;

      if (match.matchType === 'ODI') {
        oversleft = 300;
      } else if (match.matchType === 'T20') {
        oversleft = 120;
      } else if (match.matchType === 'T10') {
        oversleft = 60;
      } else {
        oversleft = 30;
      }

      const teamname = user.teamsandplayers.find(name => name.teamID === match.team1id);

      if (!isNaN(team1run) && !isNaN(team2run) && !isNaN(team1overs) && !isNaN(team2overs)) {
        const team1balls = Math.floor(team1overs) * 6 + Math.round((team1overs % 1) * 10);
        const team2balls = Math.floor(team2overs) * 6 + Math.round((team2overs % 1) * 10);

        const need = team1run - team2run + 1;
        const ballsLeft = oversleft - team2balls;

        if (need < 1) {
          match.matchResult = `${teamname.teamName} win`;
        } else if (need > 1 && ballsLeft == 0) {
          match.matchResult = `${teamname.teamName} Lost`;
        } else if (need == 1 && ballsLeft == 0) {
          match.matchResult = `Match Draw`;
        } else {
          match.matchResult = `${teamname.teamName} needs ${need} runs in ${ballsLeft} balls`;
        }
      } else {
        return res.status(400).json({ message: 'Invalid team runs or overs' });
      }
    }

    await user.save();
    res.status(200).send({ message: 'Chase Updated Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the chase' });
  }
});





// app.patch('/matchDisclose', auth, async (req, res) => {
//   try {
//     const { matchId } = req.body;
//     const user = await storeUsers.findOne({ _id: req.user._id });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);

//     if (matchIndex === -1) {
//       return res.status(404).json({ message: 'Match not found' });
//     }

//     const match = user.myMatches[matchIndex];
//     const cstatusid = match.team1battingstatus;

//     if (cstatusid === match.team1id) {
//       const team1run = parseInt(match.teamScore[0]?.team1runs.trim());
//       const team2run = parseInt(match.teamScore[0]?.team2runs.trim());

//       const team1overs = parseFloat(match.teamScore[0]?.team1oversPlayed.trim());
//       const team2overs = parseFloat(match.teamScore[0]?.team2oversPlayed.trim());

//       const team1wickets = parseFloat(match.teamScore[0]?.team1wickets.trim());
//       const team2wickets = parseFloat(match.teamScore[0]?.team2wickets.trim());
      

//       var oversleft; // balls

//       if (match.matchType === 'ODI') {
//         oversleft = 300;
//       } else if (match.matchType === 'T20') {
//         oversleft = 120;
//       } else if (match.matchType === 'T10') {
//         oversleft = 60;
//       } else {
//         oversleft = 30;
//       }

//       const teamname = user.teamsandplayers.find(name => name.teamID === match.team2id);
//       const teamname2 = user.teamsandplayers.find(name => name.teamID === match.team1id);

//       if (!isNaN(team1run) && !isNaN(team2run) && !isNaN(team1overs) && !isNaN(team2overs)) {
//         const team1balls = Math.floor(team1overs) * 6 + Math.round((team1overs % 1) * 10);
//         const team2balls = Math.floor(team2overs) * 6 + Math.round((team2overs % 1) * 10);

//         const need = team1run - team2run + 1;
//         const ballsLeft = oversleft - team2balls;

//         // if (need < 1) {
//         //   match.matchResult = `${teamname.teamName} won by ${10-team2wickets} wickets`;
//         // }else if (need == 1 && ballsLeft == 0) {
//         //   match.matchResult = `Match Draw`;
//         // } else {
//         //   match.matchResult = `${teamname.teamName} needs ${need} runs in ${ballsLeft} balls`;
//         // }


//         if (need < 1) {
//           match.matchResult = `${teamname.teamName} won by ${10-team2wickets} wickets`;
//         }
//         else if (need > 1 && ballsLeft == 0 ||need > 1 && team2wickets == 10 ) {
//           match.matchResult = `${teamname2.teamName} won by ${need-1} runs`;
//         }else if (need == 1 && ballsLeft == 0) {
//           match.matchResult = `Match Draw`;
//         } else {
//           match.matchResult = `${teamname.teamName} needs ${need} runs in ${ballsLeft} balls`;
//         }


//       } else {
//         return res.status(400).json({ message: 'Invalid team runs or overs' });
//       }
//     } else {
//       const team1run = parseInt(match.teamScore[0]?.team2runs.trim());
//       const team2run = parseInt(match.teamScore[0]?.team1runs.trim());

//       const team1overs = parseFloat(match.teamScore[0]?.team2oversPlayed.trim());
//       const team2overs = parseFloat(match.teamScore[0]?.team1oversPlayed.trim());

//       const team1wickets = parseFloat(match.teamScore[0]?.team1wickets.trim());
//       const team2wickets = parseFloat(match.teamScore[0]?.team2wickets.trim());

//       var oversleft;

//       if (match.matchType === 'ODI') {
//         oversleft = 300;
//       } else if (match.matchType === 'T20') {
//         oversleft = 120;
//       } else if (match.matchType === 'T10') {
//         oversleft = 60;
//       } else {
//         oversleft = 30;
//       }

//       const teamname = user.teamsandplayers.find(name => name.teamID === match.team1id);
//       const teamname2 = user.teamsandplayers.find(name => name.teamID === match.team2id);

//       if (!isNaN(team1run) && !isNaN(team2run) && !isNaN(team1overs) && !isNaN(team2overs)) {
//         const team1balls = Math.floor(team1overs) * 6 + Math.round((team1overs % 1) * 10);
//         const team2balls = Math.floor(team2overs) * 6 + Math.round((team2overs % 1) * 10);

//         const need = team1run - team2run + 1;
//         const ballsLeft = oversleft - team2balls;

//         if (need < 1) {
//           match.matchResult = `${teamname.teamName} won by ${10-team1wickets} wickets`;
//         }
//         else if (need > 1 && ballsLeft == 0 ||need > 1 && team1wickets == 10 ) {
//           match.matchResult = `${teamname2.teamName} won by ${need-1} runs`;
//         }else if (need == 1 && ballsLeft == 0) {
//           match.matchResult = `Match Draw`;
//         } else {
//           match.matchResult = `${teamname.teamName} needs ${need} runs in ${ballsLeft} balls`;
//         }
//       } else {
//         return res.status(400).json({ message: 'Invalid team runs or overs' });
//       }
//     }

//     await user.save();
//     res.status(200).send({ message: 'Chase Updated Successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'An error occurred while updating the chase' });
//   }
// });



app.patch('/matchDisclose', auth, async (req, res) => {
  try {
    const { matchId } = req.body;
    const user = await storeUsers.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const matchIndex = user.myMatches.findIndex(match => match.matchID === matchId);

    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const match = user.myMatches[matchIndex];
    const cstatusid = match.team1battingstatus;

    if (cstatusid === match.team1id) {
      const team1run = parseInt(match.teamScore[0]?.team1runs.trim());
      const team2run = parseInt(match.teamScore[0]?.team2runs.trim());

      const team1overs = parseFloat(match.teamScore[0]?.team1oversPlayed.trim());
      const team2overs = parseFloat(match.teamScore[0]?.team2oversPlayed.trim());

      const team1wickets = parseFloat(match.teamScore[0]?.team1wickets.trim());
      const team2wickets = parseFloat(match.teamScore[0]?.team2wickets.trim());
      

      var oversleft; // balls

      if (match.matchType === 'ODI') {
        oversleft = 300;
      } else if (match.matchType === 'T20') {
        oversleft = 120;
      } else if (match.matchType === 'T10') {
        oversleft = 60;
      } else {
        oversleft = 30;
      }

      const teamname = user.teamsandplayers.find(name => name.teamID === match.team2id);
      const teamname2 = user.teamsandplayers.find(name => name.teamID === match.team1id);

      if (!isNaN(team1run) && !isNaN(team2run) && !isNaN(team1overs) && !isNaN(team2overs)) {
        const team1balls = Math.floor(team1overs) * 6 + Math.round((team1overs % 1) * 10);
        const team2balls = Math.floor(team2overs) * 6 + Math.round((team2overs % 1) * 10);

        const need = team1run - team2run + 1;
        const ballsLeft = oversleft - team2balls;

        const nrr1 = (team1run/team1overs)-(team2run/team2overs); 
        const nrr2 = (team2run/team2overs)-(team1run/team1overs); 

        //team2 nrr
        const Nrr1 = (team2run/team2overs)-(team1run/team1overs); 
        const Nrr2 = (team1run/team1overs)-(team2run/team2overs); 

        

        if (need < 1) {
          match.matchResult = `${teamname.teamName} won by ${10-team2wickets} wickets`;
          match.teamScore[0].team1points = 0;
          match.teamScore[0].team2points = 2;
          match.teamScore[0].team1nrr = nrr1;
          match.teamScore[0].team2nrr = nrr2;
          match.teamScore[0].team1win = 0;
          match.teamScore[0].team2win = 1;
          match.teamScore[0].team1lost = 1;
          match.teamScore[0].team2lost = 0;
          match.teamScore[0].team1draw = 0;
          match.teamScore[0].team2draw = 0;
        }
        else if (need > 1 && ballsLeft == 0 ||need > 1 && team2wickets == 10 ) {
          match.matchResult = `${teamname2.teamName} won by ${need-1} runs`;
          match.teamScore[0].team1points = 2;
          match.teamScore[0].team2points = 0;
          match.teamScore[0].team1nrr = Nrr2;
          match.teamScore[0].team2nrr = Nrr1;
          match.teamScore[0].team1win = 1;
          match.teamScore[0].team2win = 0;
          match.teamScore[0].team1lost = 0;
          match.teamScore[0].team2lost = 1;
          match.teamScore[0].team1draw = 0;
          match.teamScore[0].team2draw = 0;
        }else if (need == 1 && ballsLeft == 0) {
          match.matchResult = `Match Draw`;
          match.teamScore[0].team1points = 1;
          match.teamScore[0].team2points = 1;
          match.teamScore[0].team1nrr = nrr1;
          match.teamScore[0].team2nrr = nrr2;
          match.teamScore[0].team1win = 0;
          match.teamScore[0].team2win = 0;
          match.teamScore[0].team1lost = 0;
          match.teamScore[0].team2lost = 0;
          match.teamScore[0].team1draw = 1;
          match.teamScore[0].team2draw = 1;

        } else {
          match.matchResult = `${teamname.teamName} needs ${need} runs in ${ballsLeft} balls`;
        }


      } else {
        return res.status(400).json({ message: 'Invalid team runs or overs' });
      }
    } else {
      const team1run = parseInt(match.teamScore[0]?.team2runs.trim());
      const team2run = parseInt(match.teamScore[0]?.team1runs.trim());

      const team1overs = parseFloat(match.teamScore[0]?.team2oversPlayed.trim());
      const team2overs = parseFloat(match.teamScore[0]?.team1oversPlayed.trim());

      const team1wickets = parseFloat(match.teamScore[0]?.team1wickets.trim());
      const team2wickets = parseFloat(match.teamScore[0]?.team2wickets.trim());

      var oversleft;

      if (match.matchType === 'ODI') {
        oversleft = 300;
      } else if (match.matchType === 'T20') {
        oversleft = 120;
      } else if (match.matchType === 'T10') {
        oversleft = 60;
      } else {
        oversleft = 30;     
      }

      const nrr2 = (team1run/team1overs)-(team2run/team2overs); 
      const nrr1 = (team2run/team2overs)-(team1run/team1overs); 

      //team2 nrr
      const Nrr2 = (team2run/team2overs)-(team1run/team1overs); 
      const Nrr1 = (team1run/team1overs)-(team2run/team2overs); 

      const teamname = user.teamsandplayers.find(name => name.teamID === match.team1id);
      const teamname2 = user.teamsandplayers.find(name => name.teamID === match.team2id);

      if (!isNaN(team1run) && !isNaN(team2run) && !isNaN(team1overs) && !isNaN(team2overs)) {
        const team1balls = Math.floor(team1overs) * 6 + Math.round((team1overs % 1) * 10);
        const team2balls = Math.floor(team2overs) * 6 + Math.round((team2overs % 1) * 10);

        const need = team1run - team2run + 1;
        const ballsLeft = oversleft - team2balls;

        if (need < 1) {
          match.matchResult = `${teamname.teamName} won by ${10-team1wickets} wickets`;
          match.teamScore[0].team1points = 2;
          match.teamScore[0].team2points = 0;
          match.teamScore[0].team1nrr = nrr1;
          match.teamScore[0].team2nrr = nrr2;
          match.teamScore[0].team1win = 1;
          match.teamScore[0].team2win = 0;
          match.teamScore[0].team1lost = 0;
          match.teamScore[0].team2lost = 1;
          match.teamScore[0].team1draw = 0;
          match.teamScore[0].team2draw = 0;
        }
        else if (need > 1 && ballsLeft == 0 ||need > 1 && team1wickets == 10 ) {
          match.matchResult = `${teamname2.teamName} won by ${need-1} runs`;
          match.teamScore[0].team1points = 0;
          match.teamScore[0].team2points = 2;
          match.teamScore[0].team1nrr = Nrr2;
          match.teamScore[0].team2nrr = Nrr1;
          match.teamScore[0].team1win = 0;
          match.teamScore[0].team2win = 1;
          match.teamScore[0].team1lost = 1;
          match.teamScore[0].team2lost = 0;
          match.teamScore[0].team1draw = 0;
          match.teamScore[0].team2draw = 0;
        }else if (need == 1 && ballsLeft == 0) {
          match.matchResult = `Match Draw`;
          match.teamScore[0].team1points = 1;
          match.teamScore[0].team2points = 1;
          match.teamScore[0].team1nrr = nrr1;
          match.teamScore[0].team2nrr = nrr2;
          match.teamScore[0].team1win = 0;
          match.teamScore[0].team2win = 0;
          match.teamScore[0].team1lost = 0;
          match.teamScore[0].team2lost = 0;
          match.teamScore[0].team1draw = 1;
          match.teamScore[0].team2draw = 1;
        } else {
          match.matchResult = `${teamname.teamName} needs ${need} runs in ${ballsLeft} balls`;
        }
      } else {
        return res.status(400).json({ message: 'Invalid team runs or overs' });
      }
    }

    await user.save();
    res.status(200).send({ message: 'Chase Updated Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while updating the chase' });
  }
});










// delete match
app.delete('/dropALL', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.myMatches.length === 0) {
      return res.status(200).send({ message: 'No matches to delete' });
    }

    user.myMatches.splice(0, user.myMatches.length);

    await user.save();
    res.status(200).send({ message: 'All matches deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while deleting the matches' });
  }
});





app.patch('/disclosePointTable', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.myMatches.length === 0) {
      return res.status(200).send({ message: 'No matches to generate points table' });
    }

    const pointsTable = [];

    for (const team of user.teamsandplayers) {
      const teamPoints = {
        teamID: team.teamID,
        teamName: team.teamName,
        teamMatchesPlayed: 0,
        matchWin: 0,
        matchLost: 0,
        matchDraw: 0,
        teamPoints: 0,
        teamNRR: 0,
        show: true,
        qualifiedornot:' '
      };

      for (const match of user.myMatches) {
        const team1Match = match.team1id === team.teamID;
        const team2Match = match.team2id === team.teamID;
        const team1RunsZero = Number(match.team1runs) === 0 && Number(match.team1oversPlayed) === 0;
        const team2RunsZero = Number(match.team2runs) === 0 && Number(match.team2oversPlayed) === 0;

        if (team1Match) {
          const {
            team1points,
            team1nrr,
            team1win,
            team1lost,
            team1draw
          } = match.teamScore[0];

          teamPoints.matchWin += team1win;
          teamPoints.matchLost += team1lost;
          teamPoints.matchDraw += team1draw;
          teamPoints.teamPoints += team1points;
          teamPoints.teamNRR += team1nrr;

          if (!team1RunsZero) {
            teamPoints.teamMatchesPlayed++;
          }
        }

        if (team2Match) {
          const {
            team2points,
            team2nrr,
            team2win,
            team2lost,
            team2draw
          } = match.teamScore[0];

          teamPoints.matchWin += team2win;
          teamPoints.matchLost += team2lost;
          teamPoints.matchDraw += team2draw;
          teamPoints.teamPoints += team2points;
          teamPoints.teamNRR += team2nrr;

          if (!team2RunsZero) {
            teamPoints.teamMatchesPlayed++;
          }
        }
      }

      pointsTable.push(teamPoints);
    }

    user.pointsTable = pointsTable;
    await user.save();

    res.status(200).json({ message: 'Points table generated successfully', pointsTable });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while generating the points table' });
  }
});



app.patch('/ptscurrentdisclose', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.body.matchId) {
      return res.status(400).json({ message: 'Match ID is required' });
    }

    const currentMatchIndex = user.myMatches.findIndex(
      (match) => match.matchID === req.body.matchId
    );

    if (currentMatchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const pointsTable = [];

    for (const team of user.teamsandplayers) {
      const teamPoints = {
        teamID: team.teamID,
        teamName: team.teamName,
        teamMatchesPlayed: 0,
        matchWin: 0,
        matchLost: 0,
        matchDraw: 0,
        teamPoints: 0,
        teamNRR: 0,
        show: true,
        qualifiedornot: ' '
      };

      for (const match of user.myMatches.slice(0, currentMatchIndex + 1)) {
        const team1Match = match.team1id === team.teamID;
        const team2Match = match.team2id === team.teamID;
        const team1RunsZero = Number(match.team1runs) === 0 && Number(match.team1oversPlayed) === 0;
        const team2RunsZero = Number(match.team2runs) === 0 && Number(match.team2oversPlayed) === 0;

        if (team1Match) {
          const {
            team1points,
            team1nrr,
            team1win,
            team1lost,
            team1draw
          } = match.teamScore[0];

          teamPoints.matchWin += team1win;
          teamPoints.matchLost += team1lost;
          teamPoints.matchDraw += team1draw;
          teamPoints.teamPoints += team1points;
          teamPoints.teamNRR += team1nrr;

          if (!team1RunsZero) {
            teamPoints.teamMatchesPlayed++;
          }
        }

        if (team2Match) {
          const {
            team2points,
            team2nrr,
            team2win,
            team2lost,
            team2draw
          } = match.teamScore[0];

          teamPoints.matchWin += team2win;
          teamPoints.matchLost += team2lost;
          teamPoints.matchDraw += team2draw;
          teamPoints.teamPoints += team2points;
          teamPoints.teamNRR += team2nrr;

          if (!team2RunsZero) {
            teamPoints.teamMatchesPlayed++;
          }
        }
      }

      pointsTable.push(teamPoints);
    }

    user.pointsTable = pointsTable;
    await user.save();

    res.status(200).json({ message: 'Points table generated successfully', pointsTable });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while generating the points table' });
  }
});




app.get('/pointsTable', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };
    
    
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      res.render('pointsTable', { getDataUser});
      
     
    }
  } catch (e) {
    res.redirect("/login");
  }
});



app.get('/getPointsTable', auth, async (req, res) => {
  try {
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sort the points table based on points, NRR, and original order
    const sortedPointsTable = user.pointsTable.sort((a, b) => {
      if (a.teamPoints !== b.teamPoints) {
        return b.teamPoints - a.teamPoints; // Sort by points
      } else if (a.teamNRR !== b.teamNRR) {
        return b.teamNRR - a.teamNRR; // Sort by NRR
      } else {
        return user.pointsTable.indexOf(a) - user.pointsTable.indexOf(b); // Maintain original order
      }
    });

    // Generate the HTML content for the specific match
    const content = `
    <div class="tournament_list" style="color:#CCAD15">FLAG</div>
    <div class="tournament_list" style="color:#CCAD15">TEAMS</div>
    <div class="tournament_list" style="color:#CCAD15">Q/E</div>
    <div class="tournament_list" style="color:#CCAD15">MATCH PLAYED</div>
    <div class="tournament_list" style="color:#CCAD15">WIN</div>
    <div class="tournament_list" style="color:#CCAD15">LOST</div>
    <div class="tournament_list" style="color:#CCAD15">DRAW</div>
    <div class="tournament_list" style="color:#CCAD15">POINTS</div>
    <div class="tournament_list" style="color:#CCAD15">NET RUN RATE</div>
    ${sortedPointsTable.map(pointsTable => {
      const getFlag = user.teamsandplayers.find(link => link.teamID === pointsTable.teamID);
      const teamNRR = pointsTable.teamNRR.toFixed(3); // Fix NRR to 3 decimal places
      const qualifiedOrEliminated = pointsTable.qualifiedornot === ' ' ? '' : ` (${pointsTable.qualifiedornot})`;
      return `
        <div class="tournament_list">
          <a id="fix_link" href="${getFlag.flagLink}">
            <img src="${getFlag.flagLink}" alt="Flag" />
          </a>
        </div>
        <div class="tournament_list">${pointsTable.teamName}${qualifiedOrEliminated}</div>
        <div class="tournament_list">
          <select class="s_select" data-team-id="${pointsTable.teamID}">
            <option>choose</option>
            <option value=" ">None</option>
            <option value="Q">Qualified</option>
            <option value="E">Eliminated</option>
          </select>
        </div>
        <div class="tournament_list">${pointsTable.teamMatchesPlayed}</div>
        <div class="tournament_list">${pointsTable.matchWin}</div>
        <div class="tournament_list">${pointsTable.matchLost}</div>
        <div class="tournament_list">${pointsTable.matchDraw}</div>
        <div class="tournament_list">${pointsTable.teamPoints}</div>
        <div class="tournament_list">${teamNRR}</div>
      `;
    }).join('')}
  `;
  
    res.send(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});












app.post('/updateQualifiedOrEliminated', auth, async (req, res) => {
  try {
    const { teamID, qualifiedOrEliminated } = req.body;
    
    // Find the user by _id
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find the points table entry for the given teamID
    const pointsTableEntry = user.pointsTable.find(entry => entry.teamID === teamID);
    if (!pointsTableEntry) {
      return res.status(404).json({ message: 'Points table entry not found' });
    }
    
    // Update the qualifiedornot field
    pointsTableEntry.qualifiedornot = qualifiedOrEliminated;
    
    // Save the updated user document
    await user.save();
    
    // Return the updated points table
    res.status(200).json({ pointsTable: user.pointsTable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// generate auto
const { v4: uuidv4 } = require('uuid');

app.patch('/scheduleAuto', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.teamsandplayers.length < 2) {
      return res.status(200).send({ message: 'Insufficient teams to generate matches' });
    }

    const teams = user.teamsandplayers.map((team) => team.teamID);
    const matches = [];

    for (let i = 0; i < teams.length; i++) {
      const team1 = teams[i];

      for (let j = i + 1; j < teams.length; j++) {
        const team2 = teams[j];

        const pushteam1Players = [];
        const pushteam2Players = [];

        const teamdata1 = user.teamsandplayers.find((team) => team.teamID === team1);
        if (teamdata1) {
          pushteam1Players.push(
            ...(teamdata1?.teamPlayers || []).map((player) => ({
              team1playerID: player.playerid,
              team1playerName: player.name,
              team1playerFlagLink: teamdata1.flagLink,
              team1playerRole: player.role,
              team1playerRun: "0",
              team1playerBowlPlayed: "0",
              team1playerStrikeRate: "0",
              team1playerVisibilityStatus: true,
              team1playerBowlOvers: "0",
              team1playerBowlRunGiven: "0",
              team1playerWicketTaken: "0",
              team1playerEconomy: "0"
            }))
          );
        }

        const teamdata2 = user.teamsandplayers.find((team) => team.teamID === team2);
        if (teamdata2) {
          pushteam2Players.push(
            ...(teamdata2?.teamPlayers || []).map((player) => ({
              team2playerID: player.playerid,
              team2playerName: player.name,
              team2playerFlagLink: teamdata2.flagLink,
              team2playerRole: player.role,
              team2playerRun: "0",
              team2playerBowlPlayed: "0",
              team2playerStrikeRate: "0",
              team2playerVisibilityStatus: true,
              team2playerBowlOvers: "0",
              team2playerBowlRunGiven: "0",
              team2playerWicketTaken: "0",
              team2playerEconomy: "0"
            }))
          );
        }

        const match = {
          timeOrderID: Date.now().toString(),
          matchType: 'T20',
          matchID: uuidv4(),
          matchNumber: '', // Empty match number
          liveoptions: false,
          team1id: team1,
          team2id: team2,
          stadiumName: 'Some Stadium',
          stadiumLocation: 'Some Location',
          date: '25 May,2023',
          time: '7:30 PM',
          team1battingstatus: team1,
          team2battingstatus: false,
          matchResult: 'Match yet to be Started',
          matchVisibilityinViewpage: false,
          liveVisibilityinViewpage: false,
          teamScore: [
            {
              team1runs: '0',
              team2runs: '0',
              team1wickets: '0',
              team2wickets: '0',
              team1oversPlayed: '0',
              team2oversPlayed: '0',
              team1points: 0,
              team2points: 0,
              team1nrr: 0,
              team2nrr: 0,
              team1win: 0,
              team2win: 0,
              team1lost: 0,
              team2lost: 0,
              team1draw: 0,
              team2draw: 0
            }
          ],
          playersScore: [
            {
              team1players: pushteam1Players,
              team2players: pushteam2Players
            }
          ]
        };

        matches.push(match);
      }
    }

    // Randomize the order of matches
    for (let i = matches.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matches[i], matches[j]] = [matches[j], matches[i]];
    }

    // Assign match numbers
    for (let i = 0; i < matches.length; i++) {
      matches[i].matchNumber = `Match ${i + 1}`;
    }

    user.myMatches = matches;
    await user.save();

    res.status(200).json({ message: 'Matches generated successfully', matches });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while generating matches' });
  }
});






// 1v2


app.patch('/scheduleAuto2x', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.teamsandplayers.length < 2) {
      return res.status(200).send({ message: 'Insufficient teams to generate matches' });
    }

    const teams = user.teamsandplayers.map((team) => team.teamID);
    const matches = [];

    for (let i = 0; i < teams.length; i++) {
      const team1 = teams[i];

      for (let j = 0; j < teams.length; j++) {
        const team2 = teams[j];

        if (team1 !== team2) {
          const pushteam1Players = [];
          const pushteam2Players = [];

          const teamdata1 = user.teamsandplayers.find((team) => team.teamID === team1);
          if (teamdata1) {
            pushteam1Players.push(
              ...(teamdata1?.teamPlayers || []).map((player) => ({
                team1playerID: player.playerid,
                team1playerName: player.name,
                team1playerFlagLink: teamdata1.flagLink,
                team1playerRole: player.role,
                team1playerRun: "0",
                team1playerBowlPlayed: "0",
                team1playerStrikeRate: "0",
                team1playerVisibilityStatus: true,
                team1playerBowlOvers: "0",
                team1playerBowlRunGiven: "0",
                team1playerWicketTaken: "0",
                team1playerEconomy: "0"
              }))
            );
          }

          const teamdata2 = user.teamsandplayers.find((team) => team.teamID === team2);
          if (teamdata2) {
            pushteam2Players.push(
              ...(teamdata2?.teamPlayers || []).map((player) => ({
                team2playerID: player.playerid,
                team2playerName: player.name,
                team2playerFlagLink: teamdata2.flagLink,
                team2playerRole: player.role,
                team2playerRun: "0",
                team2playerBowlPlayed: "0",
                team2playerStrikeRate: "0",
                team2playerVisibilityStatus: true,
                team2playerBowlOvers: "0",
                team2playerBowlRunGiven: "0",
                team2playerWicketTaken: "0",
                team2playerEconomy: "0"
              }))
            );
          }

          const match = {
            timeOrderID: Date.now().toString(),
            matchType: 'T20',
            matchID: uuidv4(),
            matchNumber: '', // Empty match number
            liveoptions: false,
            team1id: team1,
            team2id: team2,
            stadiumName: 'Some Stadium',
            stadiumLocation: 'Some Location',
            date: '25 May, 2023',
            time: '7:30 PM',
            team1battingstatus: team1,
            team2battingstatus: false,
            matchResult: 'Match yet to be Started',
            matchVisibilityinViewpage: true,
            liveVisibilityinViewpage: false,
            teamScore: [
              {
                team1runs: '0',
                team2runs: '0',
                team1wickets: '0',
                team2wickets: '0',
                team1oversPlayed: '0',
                team2oversPlayed: '0',
                team1points: 0,
                team2points: 0,
                team1nrr: 0,
                team2nrr: 0,
                team1win: 0,
                team2win: 0,
                team1lost: 0,
                team2lost: 0,
                team1draw: 0,
                team2draw: 0
              }
            ],
            playersScore: [
              {
                team1players: pushteam1Players,
                team2players: pushteam2Players
              }
            ]
          };

          // Check if the same teams played the last match
          if (matches.length > 0) {
            const lastMatch = matches[matches.length - 1];
            if (lastMatch.team1id === team1 && lastMatch.team2id === team2) {
              continue; // Skip this match and move to the next iteration
            }
          }

          matches.push(match);
        }
      }
    }

    // Randomize the order of matches
    for (let i = matches.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matches[i], matches[j]] = [matches[j], matches[i]];
    }

    // Assign match numbers
    for (let i = 0; i < matches.length; i++) {
      matches[i].matchNumber = `Match ${i + 1}`;
    }

    user.myMatches = matches;
    await user.save();

    res.status(200).json({ message: 'Matches generated successfully', matches });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'An error occurred while generating matches' });
  }
});


// push players 

app.patch("/pushPlayers", auth, async (req, res) => {
  try {
    const { matchId } = req.body;
    
    // Find the user by their unique identifier, such as username or email
    const user = await storeUsers.findById(req.user.id);

    // Find the match with the specified matchId
    const match = user.myMatches.find((match) => match.matchID === matchId);

    if (match) {
      // Remove existing players of the match
      match.playersScore = [];

      // Push new players to the match
      const pushteam1Players = [];
      const pushteam2Players = [];
      
      const teamdata1 = user.teamsandplayers.find((team) => team.teamID === match.team1id);
      if (teamdata1) {
        pushteam1Players.push(...(teamdata1?.teamPlayers || []).map((player) => ({
          team1playerID: player.playerid,
          team1playerName: player.name,
          team1playerFlagLink: teamdata1.flagLink,
          team1playerRole: player.role,
          team1playerRun: "0",
          team1playerBowlPlayed: "0",
          team1playerStrikeRate: "0",
          team1playerVisibilityStatus: true,
          team1playerBowlOvers: "0",
          team1playerBowlRunGiven: "0",
          team1playerWicketTaken: "0",
          team1playerEconomy: "0"
        })));
      }

      const teamdata2 = user.teamsandplayers.find((team) => team.teamID === match.team2id);
      if (teamdata2) {
        pushteam2Players.push(...(teamdata2?.teamPlayers || []).map((player) => ({
          team2playerID: player.playerid,
          team2playerName: player.name,
          team2playerFlagLink: teamdata2.flagLink,
          team2playerRole: player.role,
          team2playerRun: "0",
          team2playerBowlPlayed: "0",
          team2playerStrikeRate: "0",
          team2playerVisibilityStatus: true,
          team2playerBowlOvers: "0",
          team2playerBowlRunGiven: "0",
          team2playerWicketTaken: "0",
          team2playerEconomy: "0"
        })));
      }

      match.playersScore.push({
        team1players: pushteam1Players,
        team2players: pushteam2Players
      });

      await user.save();

      res.status(200).send({ message: "Players pushed successfully!" });
    } else {
      res.status(404).send({ message: "Match not found." });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error occurred while pushing the players." });
  }
});





app.get('/liveMatches', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };
    
    
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      res.render('liveMatches', { getDataUser});
      
     
    }
  } catch (e) {
    res.redirect("/login");
  }
});




app.get('/getLiveMatches', auth, async (req, res) => {
  try {
    const user = await storeUsers.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const liveMatches = user.myMatches.filter(match => match.liveoptions === true);

    if (liveMatches.length === 0) {
      const htmlResponse = '<center style="color:red">No live match at the moment 🙁</center>';
      return res.send(htmlResponse);
    }

    const content = liveMatches.map(match => {
      const findTeamDetails1 = user.teamsandplayers.find(team => team.teamID === match.team1id);
      const team1FlagLink = findTeamDetails1 ? findTeamDetails1.flagLink : '';

      const findTeamDetails2 = user.teamsandplayers.find(team => team.teamID === match.team2id);
      const team2FlagLink = findTeamDetails2 ? findTeamDetails2.flagLink : '';

      const teamScore1 = match.teamScore[0] || {};
      const teamScore2 = match.teamScore[0] || {};

      const team1Score = teamScore1.team1runs || '';
      const team1Wickets = teamScore1.team1wickets || '';
      const team1Overs = teamScore1.team1oversPlayed || '';

      const team2Score = teamScore2.team2runs || '';
      const team2Wickets = teamScore2.team2wickets || '';
      const team2Overs = teamScore2.team2oversPlayed || '';

      const hideTeamScore = team1Wickets === '0' && team2Wickets === '0' &&
        team1Overs === '0' && team2Overs === '0' &&
        team1Score === '0' && team2Score === '0' ? 'none' : '';

      const teamname = user.teamsandplayers.find(name => name.teamID === match.team1battingstatus);

      return `
        <div class="schedule_box">
          <div class="match_title">${match.matchNumber} • ${user.tourname} &nbsp; &nbsp; &nbsp;
          <span class="live_animation">
            <span class="dot"></span>
            <span class="wave"></span>
          </span>
          </div>
          <div class="match_type">FIRST BATTING : ${teamname.teamName} • 
          ${match.matchVisibilityinViewpage ? '<span style="color: green;">VISIBLE</span>' : '<span style="color: red;">INVISIBLE</span>'}
          • ${match.matchType} • ${match.stadiumLocation}</div>
    
          <div class="team1_score_flag">
            <div class="t1_flag">
              <img id="image_fix_schedule" src="${team1FlagLink}" alt="flag">
            </div>
            <div class="t1_name">${findTeamDetails1.teamName}</div>
            <div class="t1_score" style="display: ${hideTeamScore}">${team1Score}-${team1Wickets} (${team1Overs})</div>
          </div>
    
          <div class="team1_score_flag">
            <div class="t1_flag">
              <img id="image_fix_schedule" src="${team2FlagLink}" alt="flag">
            </div>
            <div class="t1_name">${findTeamDetails2.teamName}</div>
            <div class="t1_score" style="display: ${hideTeamScore}">${team2Score}-${team2Wickets} (${team2Overs})</div>
          </div>
    
          <div class="time_" style="color: #CCAD15;">${match.date}  •  ${match.time}</div>
    
          <div></div>
          <div class="time_" style="color: #62b4f2;">${match.matchResult}</div>
    
          <div class="settings">
            <div></div>
          </div>
        </div>
      `;
    });

    res.send(content.join(''));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




// app.get("/getPlayersStandings", auth, async (req, res) => {
//   try {
 
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

app.get('/playersStandings', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };

    // Find the user by their unique identifier, such as username or email
    const user = await storeUsers.findById(req.user.id);
    console.log("User:", user); // Log user data to check if it's retrieved successfully

    // Fetch player details
    const playerDetails = [];
    const byWicket = []; // Declare the byWicket array here

    // Loop through each team and player in the teams and players data
    for (const team of user.teamsandplayers) {
      const { teamID, teamName, flagLink } = team; // Destructure team data including flagLink
      console.log("Team:", team); // Log team data to check if it's retrieved successfully

      // Loop through each player in the team
      for (const teamPlayer of team.teamPlayers) {
        const { playerid, name, role } = teamPlayer;
        console.log("Player:", teamPlayer); // Log player data to check if it's retrieved successfully

        // Find the matches where the player participated
        const playerMatches = user.myMatches.filter((match) => {
          const team1Player = match.playersScore[0].team1players.find((player) => player.team1playerID === playerid);
          const team2Player = match.playersScore[0].team2players.find((player) => player.team2playerID === playerid);
          return team1Player || team2Player;
        });

        console.log("Player Matches:", playerMatches); // Log player matches to check if they are filtered correctly

        // Calculate player statistics from the matches
        let totalRuns = 0;
        let totalBalls = 0;
        let totalWickets = 0;
        let totalOvers = 0;
        let totalOverBowledRunGiven = 0;

        playerMatches.forEach((match) => {
          const team1Player = match.playersScore[0].team1players.find((player) => player.team1playerID === playerid);
          const team2Player = match.playersScore[0].team2players.find((player) => player.team2playerID === playerid);

          if (team1Player) {
            totalRuns += parseInt(team1Player.team1playerRun);
            totalBalls += parseInt(team1Player.team1playerBowlPlayed);
            totalWickets += parseInt(team1Player.team1playerWicketTaken);
            totalOvers += parseInt(team1Player.team1playerBowlOvers);
            totalOverBowledRunGiven += parseInt(team1Player.team1playerBowlRunGiven);
          }

          if (team2Player) {
            totalRuns += parseInt(team2Player.team2playerRun);
            totalBalls += parseInt(team2Player.team2playerBowlPlayed);
            totalWickets += parseInt(team2Player.team2playerWicketTaken);
            totalOvers += parseInt(team2Player.team2playerBowlOvers);
            totalOverBowledRunGiven += parseInt(team2Player.team2playerBowlRunGiven);
          }
        });

        // Calculate average strike rate and economy
        const averageStrikeRate = totalBalls ? (totalRuns / totalBalls) * 100 : 0;
        const averageEconomy = totalOvers ? totalOverBowledRunGiven / totalOvers : 0;

        // Prepare player details object
        const playerDetail = {
          playerID: playerid,
          playerName: name,
          role: role,
          totalRuns: totalRuns,
          totalBalls: totalBalls,
          totalWickets: totalWickets,
          totalOvers: totalOvers,
          totalOverBowledRunGiven: totalOverBowledRunGiven,
          averageStrikeRate: averageStrikeRate.toFixed(2),
          averageEconomy: averageEconomy.toFixed(2),
          flagLink: flagLink // Include the flagLink in the player details
        };

        playerDetails.push(playerDetail);
        byWicket.push(playerDetail);
      }
    }

    // Sort player details by total runs in descending order
    playerDetails.sort((a, b) => b.totalRuns - a.totalRuns);
    byWicket.sort((a, b) => b.totalWickets - a.totalWickets);

    res.render('playersStandings', { getDataUser, playerDetails, byWicket });
    // res.json({ playerDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});




app.get('/getPlayersStandingsforuser/:tid', async (req, res) => {
  try {
    const tid = req.params.tid;

    // Find the user by their unique identifier, such as username or email
    const user = await storeUsers.findOne({ tournamentID: tid });
    console.log("User:", user); // Log user data to check if it's retrieved successfully

    // Fetch player details
    const playerDetails = [];
    const byWicket = [];

    // Loop through each team and player in the teams and players data
    for (const team of user.teamsandplayers) {
      const { teamID, teamName, flagLink } = team;
      console.log("Team:", team); // Log team data to check if it's retrieved successfully

      // Loop through each player in the team
      for (const teamPlayer of team.teamPlayers) {
        const { playerid, name, role } = teamPlayer;
        console.log("Player:", teamPlayer); // Log player data to check if it's retrieved successfully

        // Find the matches where the player participated
        const playerMatches = user.myMatches.filter((match) => {
          const team1Player = match.playersScore[0].team1players.find((player) => player.team1playerID === playerid);
          const team2Player = match.playersScore[0].team2players.find((player) => player.team2playerID === playerid);
          return team1Player || team2Player;
        });

        console.log("Player Matches:", playerMatches); // Log player matches to check if they are filtered correctly

        // Calculate player statistics from the matches
        let totalRuns = 0;
        let totalBalls = 0;
        let totalWickets = 0;
        let totalOvers = 0;
        let totalOverBowledRunGiven = 0;

        playerMatches.forEach((match) => {
          const team1Player = match.playersScore[0].team1players.find((player) => player.team1playerID === playerid);
          const team2Player = match.playersScore[0].team2players.find((player) => player.team2playerID === playerid);

          if (team1Player) {
            totalRuns += parseInt(team1Player.team1playerRun);
            totalBalls += parseInt(team1Player.team1playerBowlPlayed);
            totalWickets += parseInt(team1Player.team1playerWicketTaken);
            totalOvers += parseInt(team1Player.team1playerBowlOvers);
            totalOverBowledRunGiven += parseInt(team1Player.team1playerBowlRunGiven);
          }

          if (team2Player) {
            totalRuns += parseInt(team2Player.team2playerRun);
            totalBalls += parseInt(team2Player.team2playerBowlPlayed);
            totalWickets += parseInt(team2Player.team2playerWicketTaken);
            totalOvers += parseInt(team2Player.team2playerBowlOvers);
            totalOverBowledRunGiven += parseInt(team2Player.team2playerBowlRunGiven);
          }
        });

        // Calculate average strike rate and economy
        const averageStrikeRate = totalBalls ? (totalRuns / totalBalls) * 100 : 0;
        const averageEconomy = totalOvers ? totalOverBowledRunGiven / totalOvers : 0;

        // Prepare player details object
        const playerDetail = {
          playerID: playerid,
          playerName: name,
          role: role,
          totalRuns: totalRuns,
          totalBalls: totalBalls,
          totalWickets: totalWickets,
          totalOvers: totalOvers,
          totalOverBowledRunGiven: totalOverBowledRunGiven,
          averageStrikeRate: averageStrikeRate.toFixed(2),
          averageEconomy: averageEconomy.toFixed(2),
          flagLink: flagLink // Include the flagLink in the player details
        };

        playerDetails.push(playerDetail);
        byWicket.push(playerDetail);
      }
    }

    // Retrieve the sort parameter from the query
    const sortOption = req.query.sort;

    // Sort player details based on the sortOption
    switch (sortOption) {
      case 'runs':
        playerDetails.sort((a, b) => b.totalRuns - a.totalRuns);
        break;
      case 'wickets':
        playerDetails.sort((a, b) => b.totalWickets - a.totalWickets);
        break;
      case 'strikeRate':
        playerDetails.sort((a, b) => b.averageStrikeRate - a.averageStrikeRate);
        break;
      case 'economy':
        playerDetails.sort((a, b) => a.averageEconomy - b.averageEconomy);
        break;
      default:
        // Default sorting (no sorting)
        break;
    }

    const content = `
      <div class="grid-item" style="color: #CCAD15;">FLAG</div>
      <div class="grid-item" style="color: #CCAD15;">PLAYER</div>
      <div class="grid-item" style="color: #CCAD15;">ROLE</div>
      <div class="grid-item" style="color: #CCAD15;">RUNS</div>
      <div class="grid-item" style="color: #CCAD15;">BALLS</div>
      <div class="grid-item" style="color: #CCAD15;">WICKETS</div>
      <div class="grid-item" style="color: #CCAD15;">OVERS</div>
      <div class="grid-item" style="color: #CCAD15;">BOWLING RUN GIVEN</div>
      <div class="grid-item" style="color: #CCAD15;">AVERAGE STRIKE RATE</div>
      <div class="grid-item" style="color: #CCAD15;">AVERAGE ECONOMY</div>
      ${playerDetails
        .map(
          (player) => `
            <div class="grid-item"><img src="${player.flagLink}" id="image_fix_schedule" alt="Flag"></div>
            <div class="grid-item">${player.playerName}</div>
            <div class="grid-item">${player.role}</div>
            <div class="grid-item">${player.totalRuns}</div>
            <div class="grid-item">${player.totalBalls}</div>
            <div class="grid-item">${player.totalWickets}</div>
            <div class="grid-item">${player.totalOvers}</div>
            <div class="grid-item">${player.totalOverBowledRunGiven}</div>
            <div class="grid-item">${player.averageStrikeRate}</div>
            <div class="grid-item">${player.averageEconomy}</div>
          `
        )
        .join('')}
    `;

    res.send(content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});







// app.get("/getPlayersStandings", auth, async (req, res) => {
//   try {
//     // Find the user by their unique identifier, such as username or email
//     const user = await storeUsers.findById(req.user.id);

//     console.log("User:", user); // Log user data to check if it's retrieved successfully

//     // Generate HTML for player details
//     let playerDetailsHTML = "<table><tr><th>Player Name</th><th>Total Runs</th><th>Average Strike Rate</th><th>Total Wickets</th><th>Average Economy</th></tr>";

//     // Loop through each team and player in the teams and players data
//     for (const team of user.teamsandplayers) {
//       for (const teamPlayer of team.teamPlayers) {
//         const { playerid, name, role } = teamPlayer;

//         console.log("Player:", teamPlayer); // Log player data to check if it's retrieved successfully

//         // Find the matches where the player participated
//         const playerMatches = user.myMatches.filter((match) => {
//           const team1Player = match.playersScore[0].team1players.find((player) => player.team1playerID === playerid);
//           const team2Player = match.playersScore[0].team2players.find((player) => player.team2playerID === playerid);
//           return team1Player || team2Player;
//         });

//         console.log("Player Matches:", playerMatches); // Log player matches to check if they are filtered correctly

//         // Calculate player statistics from the matches
//         let totalRuns = 0;
//         let totalBalls = 0;
//         let totalWickets = 0;
//         let totalOvers = 0;

//         playerMatches.forEach((match) => {
//           const team1Player = match.playersScore[0].team1players.find((player) => player.team1playerID === playerid);
//           const team2Player = match.playersScore[0].team2players.find((player) => player.team2playerID === playerid);

//           if (team1Player) {
//             totalRuns += parseInt(team1Player.team1playerRun);
//             totalBalls += parseInt(team1Player.team1playerBowlPlayed);
//             totalWickets += parseInt(team1Player.team1playerWicketTaken);
//             totalOvers += parseInt(team1Player.team1playerBowlOvers);
//           }

//           if (team2Player) {
//             totalRuns += parseInt(team2Player.team2playerRun);
//             totalBalls += parseInt(team2Player.team2playerBowlPlayed);
//             totalWickets += parseInt(team2Player.team2playerWicketTaken);
//             totalOvers += parseInt(team2Player.team2playerBowlOvers);
//           }
//         });

//         // Calculate average strike rate and economy
//         const averageStrikeRate = totalBalls ? (totalRuns / totalBalls) * 100 : 0;
//         const averageEconomy = totalOvers ? totalRuns / totalOvers : 0;

//         // Generate HTML row for player details
//         const playerRowHTML = `<tr><td>${name}</td><td>${totalRuns}</td><td>${averageStrikeRate.toFixed(
//           2
//         )}</td><td>${totalWickets}</td><td>${averageEconomy.toFixed(2)}</td></tr>`;

//         // Append player row HTML to the player details HTML
//         playerDetailsHTML += playerRowHTML;
//       }
//     }

//     // Close the table tag in the player details HTML
//     playerDetailsHTML += "</table>";

//     res.send(playerDetailsHTML); // Send the player details HTML as the response
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server Error");
//   }
// });









app.get('/devUpdates', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };
    
    
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      res.render('devUpdates', { getDataUser});
      
     
    }
  } catch (e) {
    res.redirect("/login");
  }
});




app.get('/donateUs', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };
    
    
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      res.render('donateUs', { getDataUser});
      
     
    }
  } catch (e) {
    res.redirect("/login");
  }
});




app.get('/messageUs', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      email:req.user.email,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map(team => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink
      })),
      domain: req.get("host")
    };
    
    
    
    // console.log("createTournament cookie - " + req.cookies.jwt);
    
    if (req.cookies.jwt && !req.user.tokens.length 
    || !req.cookies.jwt && !req.user.tokens.length ) {
      console.log("cookie Present but not in db or not in browser too");
      res.redirect("/login");
    }
    if( req.cookies.jwt && req.user) {
      res.render('messageUs', { getDataUser});
      
     
    }
  } catch (e) {
    res.redirect("/login");
  }
});






app.get('/notifications', auth, async (req, res) => {
  try {
    const getDataUser = {
      userName: req.user.username,
      email: req.user.email,
      tournamentID: req.user.tournamentID,
      tournamentname: req.user.tourname,
      tournamenturl: req.user.toururl,
      status: req.user.viewpageStatus,
      teams: req.user.teamsandplayers.map((team) => ({
        teamID: team.teamID,
        teamName: team.teamName,
        flagLink: team.flagLink,
      })),
      domain: req.get('host'),
    };

    if (req.cookies.jwt && !req.user.tokens.length || !req.cookies.jwt && !req.user.tokens.length) {
      console.log('cookie Present but not in db or not in browser too');
      res.redirect('/login');
    }
    if (req.cookies.jwt && req.user) {

      res.render('notifications', { getDataUser });
    }
  } catch (e) {
    res.redirect('/login');
  }
});




// Points Table

app.listen(port, (req,res) => {
    console.log(`Working on ${port}`);
})


