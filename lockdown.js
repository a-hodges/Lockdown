function timeString(time) {
    if (time >= 60) {
        let s = Math.trunc(time / 60) + "m";
        const remainder = time % 60;
        if (remainder) {
            s += " " + remainder + "s"
        }
        return s;
    }
    else {
        return time + "s";
    }
}

class Time extends React.Component {
    render() {
        return (
            <div>
                <h2>Time left: {timeString(this.props.time)}</h2>
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
            time: props.duration,
            url: props.url,
        };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
        this.setURL(this.props.url);
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
        if (newurl.startsWith('http://')) {
            alert("Only HTTPS URLs are allowed");
            return;
        }
        if (!newurl.startsWith('https://')) {
            newurl = 'https://' + newurl;
        }
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
            view = <p style={{color: "red"}}>Out of time! Get back to work!</p>
        }

        return (
            <div>
                <Time time={this.state.time} />
                {view}
            </div>
        )
    }
}

class ChooseTimer extends React.Component {
    constructor(props) {
        super(props);
        this.chosen = this.chosen.bind(this);
    }

    chosen(e) {
        this.props.callback(e.target.value);
    }

    render() {
        const times = this.props.times.map((time) =>
            <option value={time} key={time}>{timeString(time)}</option>
        );
        return (
            <div>
                <h2>How long do you want to browse?</h2>
                <select onChange={this.chosen}>
                    <option></option>
                    {times}
                </select>
            </div>
        )
    }
}

class LockdownParent extends React.Component {
    constructor(props) {
        super(props);
        this.setDuration = this.setDuration.bind(this);
        this.state = {duration: null};
    }

    setDuration(d) {
        this.setState((prevState, props) => ({duration: d}));
    }

    render() {
        let page;
        if (this.state.duration !== null) {
            page = <Lockdown url="https://example.com" duration={this.state.duration} />
        }
        else {
            page = <ChooseTimer times={[60, 120, 300, 600, 900]} callback={this.setDuration} />
        }

        return page;
    }
}

ReactDOM.render(
    <LockdownParent />,
    document.getElementById('root')
);
