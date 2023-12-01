import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './components/LoginRoute'
import Home from './components/HomeRoute'
import UserProfile from './components/UserProfileRoute'
import MyProfile from './components/MyProfileRoute'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFoundRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/users/:userId" component={UserProfile} />
    <ProtectedRoute exact path="/my-profile" component={MyProfile} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
