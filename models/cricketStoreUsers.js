const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const playerSchema = new mongoose.Schema({
  playerid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email ID already present"],
    validate: {
      validator: validator.isEmail,
      message: "Invalid email format"
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  confirmpassword: {
    type: String,
    required: true,
    minlength: 8
  },
  tournamentID: {
    type: String,
    required: true,
  },
  tourname: {
    type: String,
    required: true,
    default: 'Tournament Title comes here'
  },
  toururl: {
    type: String,
    required: true,
    default: 'Tournament URL comes here'
  },
  viewpageDisplay: {
    type: Boolean,
    required: true,
    default: false
  },
  viewpageStatus: {
    type: String,
    required: true,
    default: "Not Active"
  },
  redirect: {
    type: Boolean,
    required: true,
    default: false
  },
  pointsTable: [{
    teamID: {
      type: String,
      required: true
    },
    teamName: {
      type: String,
      required: true
    },
    teamMatchesPlayed: {
      type: Number,
      required: true
    },
    matchWin: {
      type: Number,
      required: true
    },
    matchLost: {
      type: Number,
      required: true
    },
    matchDraw: {
      type: Number,
      required: true
    },
    teamPoints: {
      type: Number,
      required: true
    },
    teamNRR: {
      type: Number,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    qualifiedornot: {
      type: String,
      default:'',
    },
  }], 
  teamsandplayers: [{
    teamID: {
      type: String,
      required: true
    },
    teamName: {
      type: String,
      required: true
    },
    flagLink: {
      type: String,
      required: true
    },
    teamPlayers: [playerSchema]
  }], 
  myMatches: [{
    timeOrderID: {
      type: String,
      required: true
    },
    matchType: {
      type: String,
      required: true
    },
    matchID: {
      type: String,
      required: true
    },
    matchNumber: {
      type: String,
      required: true
    },
    liveoptions: {
      type: Boolean,
      required: true
    },
    team1id: {
      type: String,
      required: true
    },
    team2id: {
      type: String,
      required: true
    },
    stadiumName: {
      type: String,
      required: true
    },
    stadiumLocation: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    team1battingstatus: {
      type: String,
      required: true
    },
    team2battingstatus: {
      type: Boolean,
      required: true
    },
    matchResult: {
      type: String,
      required: true
    },
    matchVisibilityinViewpage: {
      type: Boolean,
      required: true
    },
    liveVisibilityinViewpage: {
      type: Boolean,
      required: true
    },
    teamScore: [{
      team1runs: {
        type: String,
        required: true
      },
      team2runs: {
        type: String,
        required: true
      },
      team1wickets: {
        type: String,
        required: true
      },
      team2wickets: {
        type: String,
        required: true
      },
      team1oversPlayed: {
        type: String,
        required: true
      },
      team2oversPlayed: {
        type: String,
        required: true
      },
      team1points: {
        type: Number,
        default:0,
        required: true
      },
      team2points: {
        type: Number,
        default:0,
        required: true
      },
      team1nrr: {
        type: Number,
        default:0,
        required: true
      },
      team2nrr: {
        type: Number,
        default:0,
        required: true
      },
      team1win: {
        type: Number,
        default:0,
        required: true
      },
      team2win: {
        type: Number,
        default:0,
        required: true
      },
      team1lost: {
        type: Number,
        default:0,
        required: true
      },
      team2lost: {
        type: Number,
        default:0,
        required: true
      },
      team1draw: {
        type: Number,
        default:0,
        required: true
      },
      team2draw: {
        type: Number,
        default:0,
        required: true
      }
    }],
    playersScore: [{
      team1players: [{
        team1playerID: {
          type: String,
          required: true
        },
        team1playerName: {
          type: String,
          // required: true
        },
        team1playerFlagLink: {
          type: String,
          required: true
        },
        team1playerRole: {
          type: String,
          required: true
        },
        team1playerRun: {
          type: String,
          required: true
        },
        team1playerBowlPlayed: {
          type: String,
          required: true
        },
        team1playerStrikeRate: {
          type: String,
          required: true
        },
        team1playerVisibilityStatus: {
          type: Boolean,
          required: true
        },
        team1playerBowlOvers: {
          type: String,
          required: true
        },
        team1playerBowlRunGiven: {
          type: String,
          required: true
        },
        team1playerWicketTaken: {
          type: String,
          required: true
        },
        team1playerEconomy: {
          type: String,
          required: true
        }
      }],
      team2players: [{
        team2playerID: {
          type: String,
          required: true
        },
        team2playerName: {
          type: String,
          required: true
        },
        team2playerFlagLink: {
          type: String,
          required: true
        },
        team2playerRole: {
          type: String,
          required: true
        },
        team2playerRun: {
          type: String,
          required: true
        },
        team2playerBowlPlayed: {
          type: String,
          required: true
        },
        team2playerStrikeRate: {
          type: String,
          required: true
        },
        team2playerVisibilityStatus: {
          type: Boolean,
          required: true
        },
        team2playerBowlOvers: {
          type: String,
          required: true
        },
        team2playerBowlRunGiven: {
          type: String,
          required: true
        },
        team2playerWicketTaken: {
          type: String,
          required: true
        },
        team2playerEconomy: {
          type: String,
          required: true
        }
      }],
    }]
  }], 
  
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.generateAuthToken = async function(){
  try {
    
    const token = jwt.sign({ _id: this._id}, process.env.SECRET_KEY);

    this.tokens = this.tokens.concat({token});

    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
}


userSchema.pre('save', async function (next) {
  if(this.isModified("password")){
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
  }
  next();
});


const storeUsers = new mongoose.model('users_cricketManager', userSchema);

module.exports = storeUsers;
