import { getConnection, initDatabase } from '../utils/mysql';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: Date;
}

export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching posts...');
    
    // Initialize database if needed
    await initDatabase();
    
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM posts ORDER BY created_at DESC'
      );
      
      const posts = rows as Post[];
      console.log(`Found ${posts.length} posts`);
      
      return { 
        success: true,
        posts: posts.map(post => ({
          ...post,
          created_at: post.created_at.toISOString()
        }))
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error in posts endpoint:', error);
    return { 
      success: false, 
      error: 'Failed to fetch posts',
      posts: [],
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    };
  }
}); 