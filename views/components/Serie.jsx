var React = require('react');

var Serie = class Serie extends React.Component {
	handleMouseOver() {
		console.log('Mouse over ' + this.props.id);
	}

	render() {
		return (
			<a href="#" className="poster" data-id={this.props.id} onMouseOver={this.handleMouseOver.bind(this)}>
				<img src={this.props.thumbnail} />
			</a>
		);
	}
}

module.exports = exports = Serie;