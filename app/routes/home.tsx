import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader() {
  return { title: "Home Page" };
}

export default function Home({ loaderData, matches, params }: Route.ComponentProps) {
  console.log(matches, params);
  
  return (
    <div>
      <h1>{loaderData.title}</h1>
      <Welcome />
    </div>
  );
}
