import { redirect, useFetcher } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import type { Route } from "./+types/todolist";
import { Button } from '~/components/ui/button';
import { createTodo, deleteTodo, fetchTodos, type Todo } from "~/api/todos";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import TodoItem from "~/components/TodoItem";
import { userContext } from "~/context";

// Server-side Authentication Middleware
const authMiddleware: Route.MiddlewareFunction = async ({ request, context }, next) => {
  const user = (context as any).get(userContext);
  context.set(userContext, { id: "1", name: "John Doe", email: "john.doe@example.com" });
  console.log(user);
  next();
}

export const middleware: Route.MiddlewareFunction[] = [
  authMiddleware,
];

export const loader = async ({ context }: Route.LoaderArgs) => {
  const user = context.get(userContext);
  console.log(user);
  const todos = await fetchTodos();
  return { todos };
};

interface NewTodo {
  title: string;
  description: string;
  date: string;
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const method = request.method.toUpperCase();

  const handlers: Record<string, () => Promise<Response | null>> = {
    POST: async () => {
      const newTodo: NewTodo = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
      };
      await createTodo(newTodo);
      return redirect("/todos");
    },
    DELETE: async () => {
      const id = formData.get("id") as string;
      await deleteTodo(id);
      return redirect("/todos");
    },
  };

  if (handlers[method]) {
    return handlers[method]();
  }

  return null;
};

interface FormValues {
  title: string;
  description: string;
  date: string;
}

export default function TodoListPage({ loaderData }: Route.ComponentProps) {
  const { todos } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    fetcher.submit({ ...data }, { method: 'POST', action: '/todos' });
    reset();
  };

  const isSubmitting = fetcher.state === 'submitting' || fetcher.state === 'loading';

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      
      {/* Todo Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Todo</CardTitle>
          <CardDescription>Add a new todo item with title, description, and date</CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            method="POST" 
            action="/todos"
            className="space-y-4"
            data-testid="todo-form"
          >
            <div>
              <Label htmlFor="title" className="mb-2">Title</Label>
              <Input
                type="text"
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter todo title"
              />
              {errors.title && (
                <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="mb-2">Description</Label>
              <Input
                type="text"
                id="description"
                {...register("description", { required: "Description is required" })}
                placeholder="Enter todo description"
              />
              {errors.description && (
                <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="date" className="mb-2">Date</Label>
              <Input
                type="date"
                id="date"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="text-destructive text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Todo'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Todo List */}
      <div className="space-y-4">
        {todos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground" data-testid="no-todos-message">
              No todos yet. Create one above!
            </CardContent>
          </Card>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
}