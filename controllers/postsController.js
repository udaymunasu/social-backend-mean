// controllers/postController.js

const Post = require('../models/article');
const User = require('../models/user');

// Create a Post
exports.createPost = async (req, res) => {
    try {
      const { title, description, content, location, images } = req.body;
      const authorId = req.userId; // Assuming you have middleware to set userId
  
      const author = await User.findById(authorId);
  
      if (!author) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Convert base64 image strings to an array of image URLs
      const imageUrls = [];
  
      if (images && Array.isArray(images)) {
        for (const imageBase64 of images) {
          // Decode base64 and save the image to your server
          const imageBuffer = Buffer.from(imageBase64, 'base64');
          const imageUrl = `/uploads/${Date.now()}.jpg`; // Define your image storage location
          
          // You can save the imageBuffer to your server using fs or a similar library.
          // For simplicity, this example does not include the actual file-saving logic.
  
          imageUrls.push(imageUrl);
        }
      }
  
      const newPost = new Post({
        title,
        description,
        content,
        location,
        images: imageUrls,
        author: authorId,
      });
  
      await newPost.save();
      res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Post creation failed' });
    }
  };

// Get Posts by User ID
exports.getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ author: userId });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user posts' });
  }
};

// Get All Posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching posts' });
  }
};

// Get Post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching post' });
  }
};

// Edit Post by ID
exports.editPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, description, content, location, images } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      { title, description, content, location, images },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    res.status(500).json({ error: 'Error updating post' });
  }
};

// Delete Post by ID
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndRemove(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting post' });
  }
};
