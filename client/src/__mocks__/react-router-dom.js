// Mock para react-router-dom
import React from 'react';

export const BrowserRouter = ({ children }) => <div data-testid="router">{children}</div>;
export const Routes = ({ children }) => <div data-testid="routes">{children}</div>;
export const Route = ({ element, children }) => element || children;
export const Link = ({ to, children, ...props }) => (
  <a href={to} {...props}>{children}</a>
);
export const NavLink = ({ to, children, ...props }) => (
  <a href={to} {...props}>{children}</a>
);

export const useNavigate = () => jest.fn();
export const useLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null
});
export const useParams = () => ({});

export default {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useParams
};
