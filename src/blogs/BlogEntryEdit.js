import React from 'react';
import './BlogEntryEdit.css';

import Button from '@material-ui/core/Button';
import ReactQuill, {Quill} from 'react-quill';
import {ImageDrop} from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css';
import TextField from "@material-ui/core/TextField";
import {Delta} from "quill";

// 在quill中注册quill-image-drop-module
Quill.register('modules/imageDrop', ImageDrop);

class BlogEntryEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: "Post",
            data: undefined,
            title: "",
            editor: null,
            content: "",
            delta: {
                "ops": []
            }
        }
        this.goBack = this.goBack.bind(this);
    }

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
            ['link', 'image'],
            ['clean'],
        ],
        imageDrop: true,
    };

    formats = [
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
    ];

    onQuillChange = (content, delta, source, editor) => {
        // content 是真实的DOM节点
        // delta 记录了修改的对象，下篇文章详述
        // source 值为user或api
        // editor 文本框对象，可以调用函数获取content, delta值

        let fullDelta = editor.getContents()

        this.setState({
            editor: editor,
            delta: fullDelta,
            content: content
        })
    };

    fetchBlogEntry(id) {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(window.baseUrl + "/blog/" + id + "/entry.do?owner=1", requestOptions)
            .then(response => response.json())
            .then(
                result => {
                    this.setState({
                        data: result.data,
                        title: result.data.title,
                        delta: JSON.parse(result.data.delta)
                    })
                }
            )
            .catch(error => {
                console.log('error', error)
            });
    }

    componentDidMount() {
        const id = this.props.match.params.id

        let titleByDefault = "New post on " + new Date().toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
        this.setState({title: titleByDefault})

        if (id != undefined) {
            this.fetchBlogEntry(id)
        }
    }

    goBack() {
        this.props.history.goBack();
    }

    post(thisPtr) {
        thisPtr.setState({post: "Post..."})
        if (thisPtr.state.data == undefined) {
            thisPtr.postNew()
        } else {
            thisPtr.postUpdate()
        }
    }

    postUpdate() {
        let params = {
            owner: this.state.data.owner,
            title: this.state.title,
            content: this.state.content,
            delta: JSON.stringify(this.state.delta)
        };

        let formData = new FormData();
        for (let k in params) {
            formData.append(k, params[k]);
        }

        console.log("bodyStr: " + formData)

        const requestOptions = {
            method: 'PUT',
            redirect: 'follow',
            body: formData
        };

        fetch(window.baseUrl + "/blog/" + this.state.data.id + "/entry.do", requestOptions)
            .then(response => response.json())
            .then(
                result => {
                    console.log("post result: " + result)
                    this.setState({post: "Post"})
                    this.props.history.push("/blog/entry/" + this.state.data.id)
                }
            )
            .catch(error => {
                console.log('error', error)
            });
    }

    postNew() {
        let params = {
            owner: '1',
            title: this.state.title,
            content: this.state.content,
            delta: JSON.stringify(this.state.delta)
        };

        let formData = new FormData();
        for (let k in params) {
            formData.append(k, params[k]);
        }

        console.log("bodyStr: " + formData)

        const requestOptions = {
            method: 'POST',
            redirect: 'follow',
            body: formData
        };

        fetch(window.baseUrl + "/blog/entry.do", requestOptions)
            .then(response => response.json())
            .then(
                result => {
                    console.log("post result: " + result)
                    this.setState({post: "Post"})
                    this.props.history.push("/blog/entry")
                }
            )
            .catch(error => {
                console.log('error', error)
            });
    }

    render() {
        const thisPtr = this
        return <div className="DemoRoot">
            <div className="DemoContent">
                <br/>
                <TextField required id="standard-required" label="Title" fullWidth={true}
                           value={this.state.title}
                           onChange={e => {
                               thisPtr.setState({title: e.target.value})
                           }
                           }/>
                <br/>
                <br/>
                <ReactQuill className="DemoInputArea"
                            theme="snow"
                            modules={this.modules}
                            formats={this.formats}
                            onChange={this.onQuillChange}
                            value={this.state.delta}
                            placeholder="Please Input"
                /><br/>

                <Button variant="contained" color="primary" onClick={() => {
                    this.post(thisPtr)
                }}>
                    {this.state.post}
                </Button>&nbsp;
                <Button onClick={() => {
                    this.goBack()
                }}>Cancel</Button>
                <br/><br/>
            </div>
        </div>
    }
}

export default BlogEntryEdit;
