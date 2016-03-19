var React = require('react');

var DefaultLayout = class DefaultLayout extends React.Component {
	render() {
		return (
			<html>
				<head>
					<meta charSet="UTF-8"/>
					<title>{this.props.title}</title>
					<link rel="stylesheet" href="stylesheets/style.css"/>
					<script async="true" src="js/app.js"></script>
				</head>

				<body>
					{this.props.children}
				</body>

			</html>
		);
	}
}

module.exports = exports = DefaultLayout;