import React from 'react';
import ReactDOM from 'react-dom';
import {EditorState, ContentState, Modifier, RichUtils, SelectionState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin'; // eslint-disable-line import/no-unresolved
import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin'; // eslint-disable-line import/no-unresolved
import 'draft-js-side-toolbar-plugin/lib/plugin.css'; // eslint-disable-line import/no-unresolved
import createMentionsPlugin, {defaultSuggestionsFilter} from 'draft-js-mention-plugin'
import 'draft-js-mention-plugin/lib/plugin.css'; 
import {Record, fromJS, List} from 'immutable';


const mentions = fromJS([
  {
    name: 'Matthew Russell',
    link: 'https://twitter.com/mrussell247',
    avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
  },
  {
    name: 'Julian Krispel-Samsel',
    link: 'https://twitter.com/juliandoesstuff',
    avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
  },
])

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty(), suggestions: mentions};
    this.onChange = (editorState) => this.setState({editorState});

    this.toolbarPlugin = createInlineToolbarPlugin();
    this.sideToolbarPlugin = createSideToolbarPlugin();
    this.mentionsPlugin = createMentionsPlugin()

    this.onSearchChange = this.onSearchChange.bind(this)
    this.onAddMention = this.onAddMention.bind(this)
    this.plugins = [this.toolbarPlugin, this.sideToolbarPlugin, this.mentionsPlugin];

  }
  onSearchChange({ value }){
    // var tempMentions = draftHelpers.getSuggestions(this.props.members, this.props.profile, this.props.currentProjectMembers)
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  }

  onAddMention(){
    // get the mention object selected
  }


  doSomething(ed) {
  	var state = RichUtils.insertSoftNewline(ed);
  	state = RichUtils.toggleInlineStyle(state, 'BOLD');
    return state;
  }

  handleReturn(e) {
    var selection = this.editorState.getSelection();
    var content = this.editorState.getCurrentContent();
    var block = content.getBlockForKey(selection.getStartKey());
    var blockBefore = content.getBlockBefore(selection.getStartKey());

    if(block.text == '' && (block.type == 'ordered-list-item' || block.type == 'unordered-list-item')){
      console.log(block.text, block.type);
      var changed = Modifier.setBlockType(content, selection, 'unstyled')
      var cs = EditorState.push(this.editorState, changed, 'change-block-type')
      this.onChange(cs)

      return true;
    }
    // if(block.type == 'ordered-list-item') {
    //   if(blockBefore){
    //     if(blockBefore.type == 'ordered-list-item' && !blockBefore.getLength()){
    //       console.log('empty block before')
          // TODO delete existing line first
          // const atomicBlockTarget = selection.merge({
          //   focusKey: blockBefore.getKey(),
          //   focusOffset: blockBefore.getLength(),
          // });
          // const anotherSelect = SelectionState.createEmpty(blockBefore.getKey()) //.set('focusOffset', blockBefore.getLength())
          // const yetanotherSelect = selection.set('focusKey', blockBefore.getKey(), 'focusOffset', blockBefore.getLength())
          // var removed = Modifier.removeRange(content, anotherSelect, 'forward');
          // var fs = EditorState.push(this.editorState, removed, 'remove-range');
          // this.onChange(fs);
        //  var inserted = Modifier.insertText(content, selection, "wefoiwjoefjwoiefjoiwjefio");
            //  console.log('after insert', this.editorState.toJS())

            //  var fs = EditorState.push(this.editorState, inserted, 'insert-characters');
            //  console.log('after push', this.editorState.toJS())

            //  selection = this.editorState.getSelection();
            //  content = this.editorState.getCurrentContent();
            //  var inserted = Modifier.insertText(fs.getCurrentContent(), selection, "zzzzzzzzzzzzzzzzz");
            //  var es = EditorState.push(fs, inserted, 'insert-characters');
            //  this.onChange(es);
            // rs = RichUtils.insertSoftNewline(this.editorState);
        //     var changed = Modifier.setBlockType(content, selection, 'unstyled')
        //     var cs = EditorState.push(this.editorState, changed, 'change-block-type')
        //     this.onChange(cs)
        //     // this.onChange(rs)
        //    return true;
        // }
      // }
    return false;
  }

  render() {
        const { MentionSuggestions } = this.mentionsPlugin;

    const { InlineToolbar } = this.toolbarPlugin;
    const { SideToolbar } = this.sideToolbarPlugin;

    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={this.plugins}
          ref={(element) => { this.editor = element; }}
          handleReturn={this.handleReturn}
          doSomething={this.doSomething}
          />
        <InlineToolbar/>
        <SideToolbar/>
                  <MentionSuggestions
              onSearchChange={this.onSearchChange}
              suggestions={this.state.suggestions}
              onAddMention={this.onAddMention}
            />
      </div>
    );
  }
}

class BothEditors extends React.Component {
  render() {
    return (
      <div>
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
