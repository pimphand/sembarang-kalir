import { getConnection } from '~/server/utils/mysql';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: Date;
}

export default defineEventHandler(async (event) => {
  let connection;
  try {
    console.log('Fetching posts...');
    
    connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    
    const posts = rows as Post[];
    console.log(`Found ${posts.length} posts`);
    
    return {
      success: true,
      data: posts.map(post => ({
        ...post,
        created_at: post.created_at.toISOString()
      }))
    };
  } catch (error: any) {
    console.error('Error fetching posts:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    throw createError({
      statusCode: 500,
      message: `Failed to fetch posts: ${error.sqlMessage || error.message}`
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}); 