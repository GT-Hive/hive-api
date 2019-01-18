const fs = require('fs');
const privateKey = fs.readFileSync(__dirname + '/../../config/private.key', 'utf8');
const publicKey = fs.readFileSync(__dirname + '/../../config/public.key', 'utf8');
const issuer = 'GT-Hive';
const signOptions = {
  issuer,
  expiresIn: '12h',
  algorithm: "RS256",
};

exports.login = (req, res) => {
  const email = req.params.email;
  const password = req.params.password;
  // if login successful
  const date = new Date();
  const token = jwt.sign(payload, privateKey, signOptions);

  db.User.findOne({
    where: { email },
    attributes: ['id', ['first_name', 'last_name']]
  }).then(user => {
    console.log(user);
    console.log("Token :" + token);
    res.json({
      user,
      token,
      expires_at: date.setHours(date.getHours() + 12),
    });
  });
};

exports.register = (req, res) => {

};
