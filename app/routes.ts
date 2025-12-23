import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("test-harness", "routes/test-harness.tsx"),
] satisfies RouteConfig;
