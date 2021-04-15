import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from "./modules/home/Home";
import About from "./modules/home/About";
import FlowChatDemo from "./modules/demo/FlowChatDemo"
import UserInfo from "./modules/demo/UserInfo";
import BlogEntryEdit from "./modules/blogs/BlogEntryEdit";
import BlogList from "./modules/blogs/BlogList";
import Blog from "./modules/blogs/Blog";
import UserList from "./modules/admin/UserList";
import FileUploadPage from "./modules/summer/FileUploadPage";
import AntTest from "./modules/demo/AntTest";
import {initLocale} from "./locales/LocalesUtil";
import {localesStore} from "./reducers/store";
import {recoverLoginStatusFromCookie} from "./services/LoginService";
import KnowledgeRoot from "./modules/knowledge/KnowledgeRoot";
import AlbumListHome from "./modules/photo/AlbumListHome";
import PhotoGallery from "./modules/photo/PhotoGallery";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intlDone: false
        };
    }

    componentDidMount() {
        localesStore.subscribe(() => {
            this.setState({
                intlDone: localesStore.getState().initDone
            })
        })
        initLocale()
        recoverLoginStatusFromCookie()
    }

    render() {
        return (
            this.state.intlDone &&
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/admin" component={UserList}/>
                        <Route exact path="/blog" component={BlogList}/>
                        <Route path="/blog/category/:categories" component={BlogList}/>
                        <Route path="/blog/tag/:tags" component={BlogList}/>
                        <Route path="/blog/entry/:id" component={Blog}/>
                        <Route path="/blog/edit/:id" component={BlogEntryEdit}/>
                        <Route path="/blog/new" component={BlogEntryEdit}/>
                        <Route path="/knowledge" component={KnowledgeRoot}/>
                        <Route exact path="/photo" component={AlbumListHome}/>
                        <Route path="/photo/gallery/:name" component={PhotoGallery}/>
                        <Route path="/about" component={About}/>
                        <Route path="/demo/rdm" component={FlowChatDemo}/>
                        <Route path="/demo/antd" component={AntTest}/>
                        <Route path="/demo/info" component={UserInfo}/>
                        <Route path="/summer/upload" component={FileUploadPage}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
