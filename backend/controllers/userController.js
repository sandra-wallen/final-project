import bcrypt from 'bcryptjs'

import { User, Project, Task } from '../models/models'

export const getAllUsers = async (req, res) => {
  let usersArray = []

  try {
    const users = await User.find()
    for (const user of users) {
      usersArray.push(user.username) 
    }
    res.status(201).json({ success: true, usersArray })
  } catch (error) {
    res.status(400).json({ success: false, message: 'Could not get users', error })
  }
}

export const signUp = async (req, res) => {
  const { username, password, email } = req.body

  try {
    const salt = bcrypt.genSaltSync()

    const newUser = await new User({ 
      username, 
      password: bcrypt.hashSync(password, salt),
      email 
    }).save()
    
    res.status(201).json({ 
      success: true,
      userID: newUser._id, 
      username: newUser.username, 
      email: newUser.email,
      accessToken: newUser.accessToken 
    })
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'User already exists', fields: error.keyValue })
    }
    res.status(400).json({ success: false, message: 'Could not create user', error })
  }
}

export const signIn = async (req, res) => {
  const { usernameOrEmail, password } = req.body

  try {
    const user = await User.findOne({ 
      $or: [
        { username: usernameOrEmail }, 
        { email: usernameOrEmail }
      ]
    })    

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({ 
        success: true,
        userID: user._id,
        username: user.username, 
        email: user.email,
        role: user.role,
        name: user.name,
        bio: user.bio,
        image: user.image, 
        accessToken: user.accessToken 
      })
    } else {
      res.status(404).json({ success: false, message: 'Could not find user' })
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid request', error })
  }
}

export const deleteUser = async (req, res) => {
  const { userID } = req.params

  try {
    const deletedUser = await User.findByIdAndDelete(userID)
    
    if (deletedUser) {
      const ownedProjects = await Project.find({ projectOwner: userID })
      const deletedProjects = await Project.deleteMany({ projectOwner: userID }, { useFindAndModify: false })

      if (deletedProjects) {
        let wasDeletedTasks = []

        ownedProjects.forEach(async item => {
          deletedTasks = await Task.deleteMany({ taskOwner: item._id })
          wasDeletedTasks.push(deletedTasks)
        })

        if (deletedTasks) {
          res.status(200).json({ success: true, deletedUser, deletedProjects, deletedTasks })
        } else {
          res.status(400).json({ success: false, message: 'Tasks related to project could not be deleted' })
        }
      } else {
        res.status(400).json({ success: false, message: 'Projects related to user could not be deleted' })
      }
    } else {
      res.status(400).json({ success: false, message: 'Could not find user' })
    }
  } catch (error) {
    res.status(404).json({ success: false, message: 'Invalid request/Could not delete user', error })
  }
}

export const patchUser = async (req, res) => {
  const { userID } = req.params

  try {
    const updatedUser = await User.findByIdAndUpdate(userID, req.body, { new: true })
    if (updatedUser) {
      res.status(200).json({ success: true, userID: userID, updated: req.body })
    } else {
      res.status(404).json({ success: false, message: 'Could not find user' })
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid request/could not update user', error })
  }
}