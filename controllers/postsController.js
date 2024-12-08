const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
  const { title, topic, body, expirationTime } = req.body;
  const userId = req.user.id; // Get the user from the authenticated request

  try {
    const post = new Post({
      title,
      topic,
      body,
      expirationTime: Date.now() + expirationTime * 60 * 1000, // Convert expiration to milliseconds
      owner: userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

exports.getPost = async (req, res) => {
  const topic  = req.query.topic;
  const status  = req.query.status;
  try{
    let filter = {}
    if(topic){
      filter.topic = topic;
    }
    if(status){
      filter.status = status;
    }
    
    const posts = await Post.find(filter)
    res.json(posts)
  }
  catch (error){
    res.status(500).send('Server Error')
  }
}

// Like a post
exports.likePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;
  console.log(req.user)

  try {
    const post = await Post.findById(postId);
    console.log(post)

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.owner.equals(userId)) {
      return res.status(400).json({ message: "You can't like your own post" });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    post.likes.push(userId);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error liking post', error: err.message });
  }
};

// Dislike a post
exports.dislikePost = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

     // Check if the post is expired
     const currentDate = new Date();
     if (currentDate > new Date(post.expirationTime)) {
       return res.status(400).json({ message: 'This post has expired and cannot be disliked' });
     }

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.owner.equals(userId)) {
      return res.status(400).json({ message: "You can't dislike your own post" });
    }

    if (post.dislikes.includes(userId)) {
      return res.status(400).json({ message: 'You already disliked this post' });
    }

    post.dislikes.push(userId);
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error disliking post', error: err.message });
  }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
  const postId = req.params.postId;
  const { comment } = req.body;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.status === 'Expired') {
      return res.status(400).json({ message: 'Post is expired, cannot comment' });
    }

    post.comments.push({ user: userId, comment });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error commenting on post', error: err.message });
  }
};

// Query for active posts with the highest interest (likes + dislikes)
exports.getMostEngagedPost = async (req, res) => {
  const topic = req.params.topic;

  try {
    const post = await Post.aggregate([
      { $match: { topic, status: 'Live' } },
      { $addFields: { engagement: { $add: [{ $size: '$likes' }, { $size: '$dislikes' }] } } },
      { $sort: { engagement: -1 } },
      { $limit: 1 }
    ]);

    if (!post.length) {
      return res.status(404).json({ message: 'No active posts in this topic' });
    }

    res.status(200).json(post[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching most engaged post', error: err.message });
  }
};
