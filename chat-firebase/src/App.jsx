import { Route, Switch, BrowserRouter } from 'react-router-dom';
import 'antd/dist/reset.css';
import "./App.css";
import Login from "@/components/Login";
import ChatRoom from "@/components/ChatRoom";
import AuthProvider from "@/context/AuthProvider";
import AppProvider from '@/context/AppProvider';
import AddRoom from '@/components/Modals/AddRoom';
import AddMemberToRoom from '@/components/Modals/AddMemberToRoom';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
          <AppProvider>
            <Switch>
              <Route component={Login} path='/login' />
              <Route component={ChatRoom} path='/' />
            </Switch>
            <AddRoom />
            <AddMemberToRoom />
          </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
 