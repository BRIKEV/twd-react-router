import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("todos", "routes/todolist.tsx"),
  route("testing", "routes/testing-page.tsx"),
] satisfies RouteConfig;
