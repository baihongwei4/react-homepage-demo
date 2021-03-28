import React from 'react';
import './BlogList.css';

import withStyles from "@material-ui/core/styles/withStyles";
import deepOrange from "@material-ui/core/colors/deepOrange";
import deepPurple from "@material-ui/core/colors/deepPurple";
import ItemEntryCard from "./ItemEntryCard";
import {FormControl, InputGroup} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {withRouter} from 'react-router-dom';
import store from '../../reducers/store';
import axios from "axios";
import {BLOG_LIST_UPDATE} from "../../reducers/BlogReducer";

const styles = {
    root: {
        display: 'flex'
    },
    orange: {
        backgroundColor: deepOrange[500],
    },
    purple: {
        backgroundColor: deepPurple[500],
    },
};

function updateBlogList(cur) {
    return {
        type: BLOG_LIST_UPDATE,
        data: cur
    }
}

class BlogList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: loadingStatus.LOADING,
            data: [],
            message: ""
        }
    }

    fetchBlogList() {
        axios.get(window.baseUrl + "/blog/entry.do?owner=1")
            .then(response => {
                let dataFromApi = response.data
                if (dataFromApi === undefined) {
                    dataFromApi = []
                }
                this.setState({
                    loadingStatus: loadingStatus.SUCCESS,
                    data: dataFromApi
                })
                store.dispatch(updateBlogList(dataFromApi))
            })
            .catch(reason => {
                console.log('reason', reason)
                this.setState({
                    loadingStatus: loadingStatus.ERROR,
                    message: reason
                })
            })
    }

    componentDidMount() {
        let cachedBlogList = store.getState().blogList
        if (cachedBlogList !== undefined && cachedBlogList.length > 0) {
            this.setState({
                loadingStatus: loadingStatus.SUCCESS,
                data: cachedBlogList
            })
        } else {
            this.fetchBlogList()
        }
    }

    render() {
        return <div>
            <img className="BlogListBanner" src={require("../../images/blog_banner_full.jpg")} alt="Blog" width="200"
                 height="80"/>
            <div className="BlogListRoot">
                <br/>
                <Button variant="light" onClick={() => this.props.history.push("/")}>&lt;Home</Button>&nbsp;
                <Button variant="primary" onClick={() => this.props.history.push("/blog/new")}> New
                    Post</Button>{' '}
                <br/>
                <br/>
                <InputGroup>
                    <FormControl className="BlogSearch"/>
                </InputGroup>
                <br/>
                <div>
                    <BlogListContent
                        loadingStatus={this.state.loadingStatus}
                        data={this.state.data}
                        history={this.props.history}/>
                </div>
            </div>
        </div>
    }
}

function BlogListContent(props) {
    switch (props.loadingStatus) {
        case "success":
            if (props.data.length > 0) {
                return (
                    <div>
                        <ul>
                            {props.data.map((entry) => (
                                <li key={entry.id}>
                                    <ItemEntryCard key={entry.id} data={entry} history={props.history}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            } else {
                return (
                    <p>No blog entry. Now add one!</p>
                )
            }
        case "loading":
            return (
                <p>Loading...</p>
            )
        case "error":
        default:
            return (
                <p>Ops, something is wrong! Please try again later.</p>
            )
    }
}

const loadingStatus = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success",
}

export default withRouter(withStyles(styles)(BlogList));