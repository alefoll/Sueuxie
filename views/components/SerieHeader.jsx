var React = require('react');

var SerieHeader = class SerieHeader extends React.Component {
	render() {
		var divStyle = {
			backgroundImage: 'url(' + this.props.fanarts + ')',
		};

		return (
			<header>
				<img className="header--background" src={this.props.fanarts} />

				<div className="header--container">
					<span className="header--container-name">{this.props.name}</span>
					<div className="header--container-blur" style={divStyle}></div>
				</div>
			</header>
		);
	}
}

module.exports = exports = SerieHeader;