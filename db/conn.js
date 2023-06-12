const mongoose = require("mongoose");

const password = "#Abhay181c";
const encodedPassword = encodeURIComponent(password);

mongoose.connect(`mongodb+srv://abhay181c:${encodedPassword}@cluster0.yae2drt.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(`Connection Successful`);
  })
  .catch((err) => {
    console.log(`Failed to Connect: ${err}`);
  });

