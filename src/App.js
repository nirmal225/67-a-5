import './App.css'
import {Route, Switch, Redirect} from 'react-router-dom'
import NotFound from './components/NotFound'
import Login from './components/Login'
import Jobs from './components/Jobs'
import Home from './components/Home'
import JobItemDetails from './components/JobItemDetails'
import ProtectedRoute from './components/ProtectedRoute'

// Replace your code here
const App = () => (
  <>
    <Switch>
      <Route exact path="/login/" component={Login} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute path="/jobs/:id" component={JobItemDetails} />
      <Route path="/bad-path" component={NotFound} />
      <Redirect to="/bad-path" />
    </Switch>
  </>
)

export default App
