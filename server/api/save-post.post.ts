import { connectToDatabase } from '../utils/mongodb';
import { CollectionInfo, Collection } from 'mongodb';

interface Post {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  _id?: any;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { post } = body;

    if (!post || !post.title || !post.content || !post.author) {
      return { 
        success: false, 
        error: 'Invalid post data. Title, content, and author are required.' 
      };
    }

    const { db } = await connectToDatabase();
    
    // Create collection if it doesn't exist
    const collections = await db.listCollections().toArray();
    const collectionExists = collections.some((col: CollectionInfo) => col.name === 'posts');
    if (!collectionExists) {
      await db.createCollection('posts');
    }
    
    const newPost: Post = {
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: new Date()
    };
    
    const postsCollection: Collection<Post> = db.collection('posts');
    const result = await postsCollection.insertOne(newPost);

    if (!result.acknowledged) {
      throw new Error('Failed to save post');
    }

    return { 
      success: true,
      post: {
        ...newPost,
        _id: result.insertedId,
        createdAt: newPost.createdAt.toISOString()
      }
    };
  } catch (error) {
    console.error('Error saving post:', error);
    return { 
      success: false, 
      error: 'Failed to save post',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}); 