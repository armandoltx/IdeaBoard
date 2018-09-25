import React, { Component } from 'react';
import axios from 'axios';

import Idea from './Idea';
import IdeaForm from './IdeaForm';

class IdeasContainer extends Component {
  state = {
    ideas: [],
    editingIdeaId: null
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/v1/ideas.json')
      .then(response => {
        this.setState({ideas: response.data })
      })
      .catch(error => console.log(error))
  }

  addNewIdea = () => {
    axios.post('http://localhost:3001/api/v1/ideas', { idea: { title: '', body: '' } })
      .then(response => {
        // console.log("response => ", response);
        this.setState({ ideas: [response.data, ...this.state.ideas], editingIdeaId: response.data.id })
      })
      .catch(error => console.log(error))
  }



  render() {
    return (
      <div className="container">
        <button className="newIdeaButton"onClick={this.addNewIdea}>Create Idea</button>
        <div className="ideasContainer">
          {this.state.ideas.map((idea) => {
            if(this.state.editingIdeaId === idea.id ) {
              return(
                <IdeaForm idea={idea} key={idea.id} />
              )

            } else {
              return (
                <Idea idea={idea} key={idea.id} />
              )
            }
          })}
        </div>
      </div>
    );
  }
}

export default IdeasContainer;