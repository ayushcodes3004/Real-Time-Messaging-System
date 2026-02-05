import './App.css'
import { Route } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import ChatPage from './Pages/ChatPage.jsx'
import { Toaster } from './components/ui/toaster.jsx'

function App() {

  return (
    <>
      <div className="App">
        <Route path="/" component={HomePage} exact />
        <Route path="/chat" component={ChatPage} />
      </div>
      <Toaster />
    </>
  )
}

export default App
