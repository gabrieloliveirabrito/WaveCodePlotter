import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import "./App.css"

import WaveCanvas from "./WaveCanvas"
import SingleWaveCanvas from "./SingleWaveCanvas"

export default function App() {
  return <Router>
    <nav id="menu">
      <ul>
        <li><Link to="/Single">Modo direto</Link></li>
        <li>Codificações</li>
        <li><Link to="/">Binária Direta</Link></li>
        <li><Link to="/manchester">Manchester</Link></li>
        <li><Link to="/dif-manchester">Manchester diferencial</Link></li>
      </ul>
    </nav>


    <Switch>
      <Route exact path="/">
        <WaveCanvas mode="normal" />
      </Route>
      <Route exact path="/manchester">
        <WaveCanvas mode="manchester" />
      </Route>
      <Route exact path="/dif-manchester">
        <WaveCanvas mode="dif-manchester" />
      </Route>
      <Route exact path="/single">
        <SingleWaveCanvas />
      </Route>
      <Route>
        <h1>Erro 404</h1>
      </Route>
    </Switch>
  </Router>
}