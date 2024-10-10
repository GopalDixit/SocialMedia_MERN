const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/users');
const Post = require('./models/Post');
const connectDB = require('./Database/db');

const jwtSecret = 'yourSecretKey';

const app = express();
app.use(bodyParser.json());
app.use(cors());
connectDB();

// Register user
app.post('/register', async (req, res) => {
  const { username, email, password, fullName } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword, fullName });
  await user.save();

  res.status(201).send(user);
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).send({ message: 'Invalid username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).send({ message: 'Invalid username or password' });
      }

      // res.send({ _id: user._id, username: user.username });
      const token = jwt.sign({ _id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
      res.json({_id: user._id, username: user.username, token });
  } catch (error) {
      res.status(500).send({ message: 'Server error' });
  }
});


// Send friend request
app.post('/friend-request', async (req, res) => {
  const { fromUserId, toUsername } = req.body;

  try {
    // Find the user to whom the request is being sent by username
    const user = await User.findOne({ username: toUsername }); // Change to find by username

    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Check if fromUserId is already a friend
    if (user.friends.includes(fromUserId)) {
      return res.status(400).send({ message: 'You are already friends with this user.' });
    }

    // Check if a friend request has already been sent
    const existingRequest = user.friendRequests.find(req => req.fromUser.toString() === fromUserId);
    if (existingRequest) {
      return res.status(400).send({ message: 'Friend request already sent.' });
    }

    // If not already friends and no existing request, proceed to send the friend request
    user.friendRequests.push({ fromUser: fromUserId });
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: 'An error occurred while sending the friend request.', error });
  }
});

// show friend request
app.get('/get-friend-requests/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('friendRequests.fromUser', 'username');
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    
    // Send only pending friend requests
    const pendingRequests = user.friendRequests.filter(req => req.status === 'pending');

    res.status(200).send({ friendRequests: pendingRequests });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
});


// Accept or reject friend request
app.post('/respond-friend-request', async (req, res) => {
  const { userId, fromUserId, status } = req.body;

  const user = await User.findById(userId);
  const request = user.friendRequests.find(req => req.fromUser.toString() === fromUserId);
  if (request) {
    request.status = status;
    if (status === 'accepted') {
      user.friends.push(fromUserId);
      const fromUser = await User.findById(fromUserId);
      fromUser.friends.push(userId);
      await fromUser.save();
    }
    await user.save();
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: 'Friend request not found' });
  }
});


// Create post
app.post('/post', async (req, res) => {
  const { userId, content } = req.body;

  const post = new Post({ userId, content });
  await post.save();

  res.status(201).send(post);
});

// Comment on post
app.post('/comment', async (req, res) => {
  const { postId, userId, comment } = req.body;

  const post = await Post.findById(postId);
  post.comments.push({ userId, comment });
  await post.save();

  res.status(201).send(post);
});

// Get feed
app.get('/feed/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user and their friends
    const user = await User.findById(userId).populate('friends');
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const friendIds = user.friends.map(friend => friend._id);


    const posts = await Post.find({
      $or: [
        { userId: { $in: [userId, ...friendIds] } },
        { 'comments.userId': { $in: friendIds } }
      ]
    })
      .populate('userId', 'username') 
      .populate('comments.userId', 'username'); 

    res.status(200).send(posts);
  } catch (error) {
    console.error('Error fetching feed:', error);
    res.status(500).send({ message: 'Error fetching feed' });
  }
});


// Like a post
app.post('/like', async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    // Check if the user already liked the post
    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      return res.status(400).send({ message: 'You have already liked this post' });
    }

    // Add the userId to the likes array
    post.likes.push(userId);
    await post.save();

    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({ message: 'An error occurred while liking the post.', error });
  }
});

// Unlike a post
app.post('/unlike', async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    // Check if the user has liked the post
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex === -1) {
      return res.status(400).send({ message: 'You have not liked this post' });
    }

    // Remove the userId from the likes array
    post.likes.splice(likeIndex, 1);
    await post.save();

    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({ message: 'An error occurred while unliking the post.', error });
  }
});




const PORT = 4800;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
