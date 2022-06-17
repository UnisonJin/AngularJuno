const express = require("express");
const router = express.Router();
const db = require("./dbConnection");
const { signupValidation, loginValidation } = require("./validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", signupValidation, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE address = ${db.escape(
      req.body.address
    )} AND hash = ${db.escape(req.body.hash)};`,
    (err, result) => {
      if (result.length) {
        console.log("register", result);
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        // username is available
        db.query(
          `INSERT INTO users (first_name, last_name, email, address, hash, entity_id) VALUES ('${
            req.body.firstName
          }', '${req.body.lastName}', ${db.escape(req.body.email)}, '${
            req.body.address
          }', '${req.body.hash}', '${req.body.entityID}')`,
          (err, result) => {
            if (err) {
              // throw err;
              console.log(err);
              return res.status(400).send({
                msg: err,
              });
            }
            return res.status(201).send({
              msg: "The user has been registerd with us!",
            });
          }
        );
      }
    }
  );
});

router.get("/user", signupValidation, (req, res, next) => {
  const address = decodeURI(req.query.address || "");
  const hash = decodeURI(req.query.hash || "");
  console.log("get user. address = ", address, "hash = ", hash);
  if (!address || !hash)
    return res.status(400).send({ msg: "No address or no hash value" });
  db.query(
    `SELECT * FROM users WHERE address = ${db.escape(
      address
    )} AND hash = ${db.escape(hash)};`,
    (err, result) => {
      if (err) return res.status(400).send({ msg: err });
      return res.send({ success: true, users: result });
    }
  );
});

// router.post('/login', loginValidation, (req, res, next) => {
//   db.query(
//     `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
//     (err, result) => {
//       // user does not exists
//       if (err) {
//         throw err;
//         return res.status(400).send({
//           msg: err
//         });
//       }
//       if (!result.length) {
//         return res.status(401).send({
//           msg: 'Email or password is incorrect!'
//         });
//       }
//       // check password
//       bcrypt.compare(
//         req.body.password,
//         result[0]['password'],
//         (bErr, bResult) => {
//           // wrong password
//           if (bErr) {
//             throw bErr;
//             return res.status(401).send({
//               msg: 'Email or password is incorrect!'
//             });
//           }
//           if (bResult) {
//             const token = jwt.sign({id:result[0].id},'the-super-strong-secrect',{ expiresIn: '1h' });
//             db.query(
//               `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
//             );
//             return res.status(200).send({
//               msg: 'Logged in!',
//               token,
//               user: result[0]
//             });
//           }
//           return res.status(401).send({
//             msg: 'Username or password is incorrect!'
//           });
//         }
//       );
//     }
//   );
// });

router.post("/get-user", signupValidation, (req, res, next) => {
  db.query("SELECT * FROM users", function (error, results) {
    if (error) throw error;

    console.log(results);
    return res.send({
      error: false,
      data: results,
      message: "Fetch Successfully.",
    });
  });
});
module.exports = router;
