var express = require('express');
var router = express.Router();

let userModel = require('../schemas/users')


// GET ALL
router.get('/', async function (req, res, next) {

  let users = await userModel.find(
    {
      isDeleted: false
    }
  ).populate("role")

  res.send(users)

})


// GET BY ID
router.get('/:id', async function (req, res, next) {

  try {

    let id = req.params.id

    let result = await userModel.findById(id)

    if (!result || result.isDeleted) {

      res.status(404).send({
        message: "ID NOT FOUND"
      })

    } else {

      res.send(result)

    }

  } catch (error) {

    res.status(404).send({
      message: "ID NOT FOUND"
    })

  }

})


// CREATE
router.post('/', async function (req, res, next) {

  let newUser = new userModel(req.body)

  await newUser.save()

  res.send(newUser)

})


// UPDATE
router.put('/:id', async function (req, res, next) {

  try {

    let id = req.params.id

    let result = await userModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    res.send(result)

  } catch (error) {

    res.status(404).send({
      message: "ID NOT FOUND"
    })

  }

})


// SOFT DELETE
router.delete('/:id', async function (req, res, next) {

  try {

    let id = req.params.id

    let result = await userModel.findById(id)

    if (!result || result.isDeleted) {

      res.status(404).send({
        message: "ID NOT FOUND"
      })

    } else {

      result.isDeleted = true

      await result.save()

      res.send(result)

    }

  } catch (error) {

    res.status(404).send({
      message: "ID NOT FOUND"
    })

  }

})


// ENABLE
router.post('/enable', async function (req, res) {

  let { email, username } = req.body

  let user = await userModel.findOne(
    {
      email: email,
      username: username
    }
  )

  if (!user) {

    res.status(404).send({
      message: "USER NOT FOUND"
    })

  } else {

    user.status = true

    await user.save()

    res.send(user)

  }

})


// DISABLE
router.post('/disable', async function (req, res) {

  let { email, username } = req.body

  let user = await userModel.findOne(
    {
      email: email,
      username: username
    }
  )

  if (!user) {

    res.status(404).send({
      message: "USER NOT FOUND"
    })

  } else {

    user.status = false

    await user.save()

    res.send(user)

  }

})

module.exports = router;