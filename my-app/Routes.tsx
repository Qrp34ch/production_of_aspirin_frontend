// export const ROUTES = {
//   HOME: "/",
//   REACTION: "/reaction",
//   REACTION_DETAIL: "/reaction/:id",
// };

// export type RouteKeyType = keyof typeof ROUTES;

// export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
//   HOME: "Главная",
//   REACTION: "Реакции", 
//   REACTION_DETAIL: "Детали реакции",
// };
export const ROUTES = {
  HOME: "/",
  REACTION: "/reaction",
  REACTION_DETAIL: "/reaction/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  SYNTHESES: "/syntheses",
  SYNTHESIS: "/synthesis/:id",
  ADMIN_REACTIONS: '/admin/reactions',
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  REACTION: "Реакции", 
  REACTION_DETAIL: "Детали реакции",
  LOGIN: "Вход",
  REGISTER: "Регистрация",
  PROFILE: "Профиль",
  SYNTHESES: "Мои синтезы",
  SYNTHESIS: "Синтез",
  ADMIN_REACTIONS: "Модерские вещи",
  NOT_FOUND: "404",
  FORBIDDEN: "403",
};