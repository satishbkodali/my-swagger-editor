import React from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import SwaggerEditor from 'swagger-editor';
import 'swagger-editor/dist/swagger-editor.css';

import { Spectral } from "@stoplight/spectral-core";
import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler/with-loader";

// create a ruleset that extends the spectral:oas ruleset
const myRuleset = `extends: spectral:oas
rules: {}`;

// try to load an external ruleset
const fs = {
  promises: {
    async readFile(filepath) {
      if (filepath === "/.spectral.yaml") {
        return myRuleset;
      }

      throw new Error(`Could not read ${filepath}`);
    },
  },
};




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.saveContent = this.saveContent.bind(this);
  }

  
  componentDidMount() {
    window.editor = SwaggerEditor({
      dom_id: '#swagger-editor',
      layout: 'EditorLayout',

  });
  }

  async saveContent() {
    const content = window.localStorage.getItem('swagger-editor-content');
    console.log(content);
     const spectral = new Spectral();
     spectral.setRuleset(await bundleAndLoadRuleset("/.spectral.yaml", { fs, fetch }));
    spectral.run(content).then(console.log);
  }


  render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.saveContent}>
          Save Content
        </Button>
        <div id='swagger-editor'></div>
      </div>
    );
  }
}

export default App;
