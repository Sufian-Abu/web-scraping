import React,{Component} from 'react';
import Properties from './components/properties';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reloadComponent = this.reloadComponent.bind(this);
  }
  state = {
    properties: []
  }

  componentDidMount() {
    // before loading the application call property api
    this.getData();
  }

  getData(){
    fetch('http://18.222.208.186:4000/properties')
    .then(res => res.json())
    .then((data) => {
      this.setState({ properties: data });
      this.input.value=null;
    })
    .catch(console.log)
  }

  // load the component
  reloadComponent(){
    window.location.reload();
  }

  // api call for filter property by name, city, state
  filterProperties(input) {
    fetch(`http://18.222.208.186:4000/filterItem/?filterItem=${input}`)
    .then(res => res.json())
    .then((data) => {
      this.setState({ properties: data });
    })
    .catch(console.log)
  }

  handleSubmit(e) {
    this.filterProperties(this.input.value);
    e.preventDefault();
  }

  render() {
      return (
         <div>
           <div  className={"centered"}>
              <form onSubmit={this.handleSubmit}>
                <label>
                  Search Key:
                  <input type="text" ref={(input) => this.input = input} />
                </label>
                <input type="submit" value="Submit" />
                <button type="button" onClick={this.reloadComponent}> <span>Reload</span> </button>
              </form>
           </div>
           <div  className={"centered"}>
              <Properties properties={this.state.properties} />
           </div>
         </div>
      )
  }
}

export default App;
