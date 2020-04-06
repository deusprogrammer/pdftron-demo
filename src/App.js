import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.viewer = React.createRef();
    this.docViewer = null;
    this.annotManager = null;
    this.instance = null;
  }

  componentDidMount() {
    
  }

  setFile = (url) => {
    window.WebViewer({
        path: '/lib',
        initialDoc: url
    }, this.viewer.current).then(instance => {
        // at this point, the viewer is 'ready'
        // call methods from instance, docViewer and annotManager as needed
        this.instance = instance;
        this.docViewer = instance.docViewer;
        this.annotManager = instance.annotManager;

        // you can also access major namespaces from the instance as follows:
        // var Tools = instance.Tools;
        // var Annotations = instance.Annotations;

        // now you can access APIs through `this.instance`
        this.instance.openElement('notesPanel')

        // or listen to events from the viewer element
        this.viewer.current.addEventListener('pageChanged', (e) => {
            const [ pageNumber ] = e.detail;
            console.log(`Current page is ${pageNumber}`);
        });

        // or from the docViewer instance
        this.docViewer.on('annotationsLoaded', () => {
            console.log('annotations loaded');
        });

        this.annotManager.on('annotationChanged', (annotations, action) => {
            switch(action) {
            case "add":
                console.log("ANNOTATION ADDED");
                break;
            case "modify":
                console.log("ANNOTATION MODIFIED");
                break;
            case "delete":
                console.log("ANNOTATION DELETE");
                break;
            }

            annotations.forEach((annot) => {
            console.log('annotation page number', JSON.stringify(annot, null, 5));
            });
        })

        this.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
    })
  }

  onFileChanged = (target) => {
    var input = target;

    var reader = new FileReader();
    reader.onload = () =>{
        var buffer = reader.result;
        var blob = new Blob([buffer], {type: "application/pdf"});
        var url = URL.createObjectURL(blob);
        this.setFile(url);
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  wvDocumentLoadedHandler = () => {
    // call methods relating to the loaded document
    // const { Annotations } = this.instance;
    // const rectangle = new Annotations.RectangleAnnotation();
    // rectangle.PageNumber = 1;
    // rectangle.X = 100;
    // rectangle.Y = 100;
    // rectangle.Width = 250;
    // rectangle.Height = 250;
    // rectangle.StrokeThickness = 5;
    // rectangle.Author = this.annotManager.getCurrentUser();
    // this.annotManager.addAnnotation(rectangle);
    // this.annotManager.drawAnnotations(rectangle.PageNumber);
    // see https://www.pdftron.com/api/web/WebViewer.html for the full list of low-level APIs
  }

  render() {
    return (
        <div className="App">
            <div className="header">React sample</div>
            <label>File:</label><input onChange={(e) => {this.onFileChanged(e.target)}} type="file" />
            <div className="webviewer" ref={this.viewer}></div>
        </div>
    );
  }
}

export default App;
