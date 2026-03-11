var express = require('express');
var router = express.Router();

let userModel = require('../schemas/users')


router.get('/:id/users', async function (req, res, next) {

  let id = req.params.id

  let users = await userModel.find(
    {
      role: id,
      isDeleted: false
    }
  ).populate("role")

  res.send(users)

})

module.exports = router;