import { NextResponse } from 'next/server';
import db from '@/lib/db';
import type { Todo } from '@/types/todo';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all() as Todo[];
    // Convert SQLite integer to boolean for the client
    const todos = rows.map((row) => ({
      ...row,
      completed: Boolean(row.completed)
    }));
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const result = db
      .prepare('INSERT INTO todos (title) VALUES (?)')
      .run(title.trim());

    const todo = db
      .prepare('SELECT * FROM todos WHERE id = ?')
      .get(result.lastInsertRowid) as Todo;

    return NextResponse.json(
      { ...todo, completed: Boolean(todo.completed) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
