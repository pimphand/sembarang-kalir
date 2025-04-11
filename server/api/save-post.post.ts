import { getConnection, initDatabase } from '../utils/mysql';

interface Post {
  title: string;
  content: string;
  author: string;
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

    // Initialize database if needed
    await initDatabase();
    
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
        [post.title, post.content, post.author]
      );

      const insertResult = result as any;
      if (!insertResult.affectedRows) {
        throw new Error('Failed to save post');
      }

      return { 
        success: true,
        post: {
          id: insertResult.insertId,
          ...post,
          created_at: new Date().toISOString()
        }
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error saving post:', error);
    return { 
      success: false, 
      error: 'Failed to save post',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}); 