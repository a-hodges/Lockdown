class Time extends React.Component {
    render() {
        let f;
        if (this.props.time >= 60) {
            f = Math.trunc(this.props.time / 60) + "m " + (this.props.time % 60) + "s";
        }
        else {
            f = this.props.time + "s";
        }
        return (
            <div>
                <h1>Time left: {f}</h1>
            </div>
        );
    }
}

class URLInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.setURL(this.input.value);
    }

    render() {
        return (
            <div>
                <input defaultValue={this.props.url} ref={(input) => this.input = input} />
                <button onClick={this.handleChange}>Ok</button>
            </div>
        )
    }
}

class Viewport extends React.Component {
    componentDidMount() {
        document.addEventListener('fb_init', e => FB.XFBML.parse());
    }

    render() {
        const styles = {
            width: "100vw",
            height: "100vh",
            border: 0,
        };
        return (
            <iframe src={this.props.url} style={styles}></iframe>
        )
    }
}

class Lockdown extends React.Component {
    constructor(props) {
        super(props);
        this.setURL = this.setURL.bind(this);
        this.state = {
            url: props.url,
            time: props.duration,
        };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if (this.state.time > 0) {
            this.setState((prevState, props) => ({
                time: prevState.time - 1,
            }));
        }
    }
    
    setURL(newurl) {
        this.setState((prevState, props) => ({
            url: newurl,
        }));
    }
    
    render() {
        let view;
        if (this.state.time > 0) {
            view = (
                <div>
                    <URLInput url={this.state.url} setURL={this.setURL} />
                    <Viewport url={this.state.url} />
                </div>
            )
        }
        else {
            view = (
                <div style={{color: "red"}}>
                    <p>Time's up! Get back to work!</p>
                </div>
            )
        }

        return (
            <div>
                <h1>Lockdown Browser</h1>
                <Time time={this.state.time} />
                {view}
            </div>
        )
    }
}

ReactDOM.render(
    <Lockdown url="http://example.com" duration={120} />,
    document.getElementById('root')
);
