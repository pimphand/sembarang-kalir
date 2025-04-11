import { connectToDatabase } from '../utils/mongodb';
import { CollectionInfo, Collection } from 'mongodb';

interface Post {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  _id?: any;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(operation: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryOperation(operation, retries - 1);
    }
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const { db } = await connectToDatabase();
    
    const posts = await retryOperation(async () => {
      // Create collection if it doesn't exist
      const collections = await db.listCollections().toArray();
      const collectionExists = collections.some((col: CollectionInfo) => col.name === 'posts');
      if (!collectionExists) {
        await db.createCollection('posts');
      }
      
      const postsCollection: Collection<Post> = db.collection('posts');
      return await postsCollection
        .find()
        .sort({ createdAt: -1 })
        .toArray();
    });
    
    return { 
      success: true,
      posts: posts.map((post: Post) => ({
        ...post,
        createdAt: post.createdAt.toISOString()
      }))
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { 
      success: false, 
      error: 'Failed to fetch posts',
      posts: [],
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}); 