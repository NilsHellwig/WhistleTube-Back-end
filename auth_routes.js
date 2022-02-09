const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

module.exports = function (app, User) {
  // Register
  app.post("/register", async (req, res) => {
    try {
      // Get user input
      const { username, email, password } = req.body;

      // Validate user input
      if (!(email && password && username)) {
        return res.status(400).send("Bitte überall eine Angabe machen.");
      }

      const email_already_in_use = await User.findOne({ email });
      const username_already_in_use = await User.findOne({ username });

      if (username_already_in_use != null) {
        return res
          .status(409)
          .send("Dieser Nutzername wird bereits verwendet.");
      }

      if (email_already_in_use != null) {
        return res.status(409).send("Diese E-Mail wird bereits verwendet.");
      }

      encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await User.create({
        username,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "12h",
        }
      );
      // save user token
      user.token = token;
      res.status(201).json(user);
    } catch (err) {
      console.log("ERROR: ", err);
    }
  });

  app.post("/login", async (req, res) => {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;

      // Validate user input
      if (!(email && password)) {
        res
          .status(400)
          .send(
            "Bitte geben Sie die korrekte E-Mail und das korrekte Passwort ein."
          );
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "12h",
          }
        );

        // save user token
        user.token = token;
        // user
        console.log(email, "logged in");
        res.status(200).json(user);
      }
      res
        .status(400)
        .send(
          "Bitte geben Sie die korrekte E-Mail und das korrekte Passwort ein."
        );
    } catch (err) {}
    // Our register logic ends here
  });

  app.post("/check_auth", auth, (req, res) => {
    res.status(201).json(req.body);
  });
};
