import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import { Todo } from '@/types/todo';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data/todos.db');
const db = new Database(dbPath, { verbose: console.log });

export async function PATCH(request: NextRequest) {
  try {
    const { todoIds, updates } = await request.json();

    // Validate input
    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return NextResponse.json({ error: 'Invalid todo IDs' }, { status: 400 });
    }

    if (typeof updates !== 'object' || Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updates specified' }, { status: 400 });
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Build dynamic update query
    if (updates.completed !== undefined) {
      updateFields.push('completed = ?');
      updateValues.push(updates.completed ? 1 : 0);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    // Prepare parameterized query
    const placeholders = todoIds.map(() => '?').join(',');
    const updateStmt = db.prepare(`
      UPDATE todos 
      SET ${updateFields.join(', ')} 
      WHERE id IN (${placeholders})
    `);

    // Execute update
    const result = updateStmt.run(...updateValues, ...todoIds);

    // Fetch updated todos
    const selectStmt = db.prepare(`
      SELECT * FROM todos 
      WHERE id IN (${placeholders})
    `);
    const updatedTodos = selectStmt.all(...todoIds) as Todo[];

    return NextResponse.json(updatedTodos, { status: 200 });
  } catch (error) {
    console.error('Error in bulk update:', error);
    return NextResponse.json({ error: 'Failed to update todos' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { todoIds } = await request.json();

    // Validate input
    if (!Array.isArray(todoIds) || todoIds.length === 0) {
      return NextResponse.json({ error: 'Invalid todo IDs' }, { status: 400 });
    }

    // Prepare parameterized delete query
    const placeholders = todoIds.map(() => '?').join(',');
    const deleteStmt = db.prepare(`
      DELETE FROM todos 
      WHERE id IN (${placeholders})
    `);

    // Execute delete
    const result = deleteStmt.run(...todoIds);

    return NextResponse.json({ 
      message: `Successfully deleted ${result.changes} todos` 
    }, { status: 200 });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json({ error: 'Failed to delete todos' }, { status: 500 });
  }
}