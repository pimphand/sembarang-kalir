import { getConnection } from '~/server/utils/mysql';
import { ResultSetHeader } from 'mysql2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  // Validate required fields
  if (!body.title || !body.content || !body.author) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: title, content, and author are required'
    });
  }
  
  let connection;
  try {
    connection = await getConnection();
    
    const [result] = await connection.execute(
      'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)',
      [body.title, body.content, body.author]
    ) as [ResultSetHeader, any];
    
    return {
      success: true,
      data: {
        id: result.insertId,
        title: body.title,
        content: body.content,
        author: body.author,
        created_at: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('Error saving post:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    
    throw createError({
      statusCode: 500,
      message: `Failed to save post: ${error.sqlMessage || error.message}`
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}); 