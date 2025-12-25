import type { Route } from "./+types/home";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TWD react router example" },
    { name: "description", content: "Welcome to TWD react router example" },
  ];
}

export function loader() {
  return { title: "Welcome to TWD" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { title } = loaderData;
  const [count, setCount] = useState(0);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground" data-testid="welcome-title">
            {title}
          </h1>
          <p className="text-xl text-muted-foreground">
            Testing While Developing - A powerful testing framework for web applications
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-foreground">
            Get started by reading the{' '}
            <a
              href="https://brikev.github.io/twd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline font-medium"
            >
              documentation
            </a>
            .
          </p>
          <div className="text-left bg-muted p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold">Testing Philosophy</h2>
            <p>
              This project demonstrates how to test React Router applications using TWD (Testing While Developing).
              The core idea is to isolate your route components using <code>createRoutesStub</code> from React Router.
            </p>
            <p>
              Instead of spinning up the entire app for every test, we mount specific routes in a controlled environment.
              This allows us to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Mock loaders and actions easily</li>
              <li>Test specific route scenarios</li>
              <li>Verify component behavior in isolation</li>
              <li>Reuse the same testing page across tests</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-8">
          <Button
            onClick={() => setCount((count) => count + 1)}
            size="lg"
            className="min-w-32"
            data-testid="counter-button"
          >
            Count is {count}
          </Button>
          <p className="text-sm text-muted-foreground">
            Click the button to test TWD features
          </p>
        </div>
      </div>
    </div>
  );
}
