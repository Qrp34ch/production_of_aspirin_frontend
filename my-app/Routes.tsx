export const ROUTES = {
  HOME: "/",
  REACTION: "/reaction",
  REACTION_DETAIL: "/reaction/:id",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  REACTION: "Реакции", 
  REACTION_DETAIL: "Детали реакции",
};