import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import LogIn from '../components/LogIn';
import SignUp from '../components/SignUp';
import Dashboard from '../components/Dashboard';
import JournalCreate from '../components/Journal/JournalCreate';
import JournalView from "../components/Journal/JournalView";
import JournalList from "../components/Journal/JournalList";
import EntityCreate from '../components/Entity/EntityCreate';
import EntityList from "../components/Entity/EntityList";
import SalesCreate from '../components/Sales/SalesCreate';
import SalesView from "../components/Sales/SalesView";
import SalesList from "../components/Sales/SalesList";
import ChartOfAccountsView from "../components/ChartOfAccountsView";
import Help from "../components/Help";



const Routes = () => {
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/login",
      element: <LogIn />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
  ];

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/journal/create",
          element: <JournalCreate />,
        },
        {
          path: "/journal/view/:journalId",
          element: <JournalView />,
        },
        {
          path: "/journal/list",
          element: <JournalList />,
        },
        {
          path: "/entity/create",
          element: <EntityCreate />,
        },
        {
          path: "/entity/list",
          element: <EntityList />,
        },
        {
          path: "/sales/create",
          element: <SalesCreate />,
        },
        {
          path: "/sales/view/:saleId",
          element: <SalesView />,
        },
        {
          path: "/sales/list",
          element: <SalesList />,
        },
        {
          path: "/viewchartofaccounts",
          element: <ChartOfAccountsView />,
        },
        {
          path: "/help",
          element: <Help />,
        },
      ],
    },
  ];


  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;