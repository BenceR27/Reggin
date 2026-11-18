import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("cars", "routes/cars.tsx"),
  route("belepes", "routes/login.tsx"),
] satisfies RouteConfig;
