export const ROUTES = {
  HOME: "/RIP_frontend/",
  REACTION: "/RIP_frontend/reaction",
  REACTION_DETAIL: "/RIP_frontend/reaction/:id",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  REACTION: "Реакции", 
  REACTION_DETAIL: "Детали реакции",
};