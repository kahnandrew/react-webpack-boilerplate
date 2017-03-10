import React from 'react';
import ReactDOM from 'react-dom';
import {EditorState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'; // eslint-disable-line import/no-unresolved
import 'draft-js-side-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved


class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});

    this.toolbarPlugin = createInlineToolbarPlugin();
    this.sideToolbarPlugin = createSideToolbarPlugin();
    this.plugins = [this.toolbarPlugin, this.sideToolbarPlugin];
  }
  render() {
    const { InlineToolbar } = this.toolbarPlugin;
    const { SideToolbar } = this.sideToolbarPlugin;

    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={this.plugins}
          ref={(element) => { this.editor = element; }}
          />
        <InlineToolbar/>
        <SideToolbar/>
      </div>
    );
  }
}

class BothEditors extends React.Component {
  render() {
    return (
      <div onBlur={ (e) => console.log(e.target.className, e.relatedTarget.className) }>
        <MyEditor key="first" />
        <hr></hr>
        <MyEditor key="second" />
      </div>
    )
  }

}

ReactDOM.render(
  <BothEditors />,
  document.getElementById('container')
);
