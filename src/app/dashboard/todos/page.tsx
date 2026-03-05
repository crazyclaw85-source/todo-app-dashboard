'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast, Toaster } from 'sonner';
import { Todo } from '@/types/todo';
import { cn } from '@/lib/utils';

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/todos');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setIsLoading(false);
    } catch (error) {
      toast.error('Failed to load todos', { description: String(error) });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    // Update select all checkbox state
    setIsSelectAllChecked(selectedTodos.length === todos.length && todos.length > 0);
  }, [selectedTodos, todos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) {
      toast.warning('Todo title cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle.trim() }),
      });

      if (!response.ok) throw new Error('Failed to add todo');

      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
      setNewTodoTitle('');
      toast.success('Todo added successfully');
    } catch (error) {
      toast.error('Failed to add todo', { description: String(error) });
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    try {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      const updatedTodo = await response.json();
      setTodos(todos.map(t => t.id === updatedTodo.id ? updatedTodo : t));
      toast.success(`Todo marked as ${updatedTodo.completed ? 'completed' : 'pending'}`);
    } catch (error) {
      toast.error('Failed to update todo', { description: String(error) });
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos(todos.filter(t => t.id !== todoId));
      setSelectedTodos(selectedTodos.filter(id => id !== todoId));
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo', { description: String(error) });
    }
  };

  const toggleTodoSelection = (todoId: number) => {
    setSelectedTodos(prev => 
      prev.includes(todoId) 
        ? prev.filter(id => id !== todoId) 
        : [...prev, todoId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTodos(
      isSelectAllChecked ? [] : todos.map(todo => todo.id)
    );
  };

  const handleBulkMarkComplete = async () => {
    try {
      const response = await fetch('/api/todos/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todoIds: selectedTodos,
          updates: { completed: true }
        }),
      });

      if (!response.ok) throw new Error('Failed to mark todos as complete');

      const updatedTodos = await response.json();

      // Update local state
      setTodos(todos.map(todo => {
        const updatedTodo = updatedTodos.find((t: Todo) => t.id === todo.id);
        return updatedTodo ? updatedTodo : todo;
      }));

      toast.success(`${selectedTodos.length} todos marked as completed`);
      setSelectedTodos([]); // Clear selection
    } catch (error) {
      toast.error('Failed to mark todos as complete', { description: String(error) });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const response = await fetch('/api/todos/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoIds: selectedTodos }),
      });

      if (!response.ok) throw new Error('Failed to delete todos');

      // Remove selected todos from local state
      setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));
      setSelectedTodos([]); // Clear selection
      toast.success(`${selectedTodos.length} todos deleted`);
    } catch (error) {
      toast.error('Failed to delete todos', { description: String(error) });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <Toaster richColors />
      
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo} className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter a new todo"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit">Add Todo</Button>
          </form>

          {selectedTodos.length > 0 && (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-4">
              <span>{selectedTodos.length} selected</span>
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleBulkMarkComplete}
                >
                  Mark Complete
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-4">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No todos yet. Start by adding one!</div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 p-2 border-b">
                <Checkbox
                  checked={isSelectAllChecked}
                  onCheckedChange={toggleSelectAll}
                  className="mr-2"
                />
                <span className="flex-grow">Select All</span>
              </div>
              <ul className="space-y-2">
                {todos.map(todo => (
                  <li 
                    key={todo.id} 
                    className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={selectedTodos.includes(todo.id)}
                      onCheckedChange={() => toggleTodoSelection(todo.id)}
                      className="mr-2"
                    />
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo)}
                      className="mr-2"
                    />
                    <span 
                      className={cn(
                        "flex-grow", 
                        todo.completed && "line-through text-gray-500"
                      )}
                    >
                      {todo.title}
                    </span>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}