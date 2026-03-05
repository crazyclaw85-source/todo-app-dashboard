import { NextRequest, NextResponse } from 'next/server';
import { Todo } from '@/types/todo';

const initialTodos: Todo[] = [];

export async function GET() {
  return NextResponse.json(initialTodos, { status: 200 });
}

export async function POST(request: NextRequest) {
  const { title } = await request.json();

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const newTodo: Todo = {
    id: Date.now(),
    title,
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  initialTodos.push(newTodo);

  return NextResponse.json(newTodo, { status: 201 });
}