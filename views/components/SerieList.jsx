var React = require('react'),
    Serie = require('./Serie');

var SerieList = class SerieList extends React.Component {
	addClass(name) {
		var classes = this.state.classes,
		    index   = classes.indexOf(name);

		if (index === -1) {
			classes.push(name);

			this.setState({ classes: classes });
		}
	}

	removeClass(name) {
		var classes = this.state.classes,
		    index   = classes.indexOf(name);

		if (index !== -1) {
			classes.splice(index, 1);

			this.setState({ classes: classes });
		}
	}

	leftMouseOver() {
		console.log('leftMouseOver');

		this.addClass('posters--line-left');
	}

	leftMouseOut() {
		console.log('leftMouseOut');

		this.removeClass('posters--line-left');
	}

	rightMouseOver() {
		console.log('rightMouseOver');

		this.addClass('posters--line-right');
	}

	rightMouseOut() {
		console.log('rightMouseOut');

		this.removeClass('posters--line-right');
	}

	render() {
		var datafolder = this.props.datafolder,
		    self       = this;

		return (
			<div className="posters--line">
				{this.props.series.map(function(serie, index) {
					if (index%7 == 0)
						return <Serie key={serie._id} id={serie._id} onMouseOver={self.leftMouseOver.bind(self)} onMouseOut={self.leftMouseOut.bind(self)} thumbnail={datafolder + '/' + serie.posters[0].thumbnail} />
					else if (index%7 == 6)
						return <Serie key={serie._id} id={serie._id} onMouseOver={self.rightMouseOver.bind(self)} onMouseOut={self.rightMouseOut.bind(self)} thumbnail={datafolder + '/' + serie.posters[0].thumbnail} />
					else
						return <Serie key={serie._id} id={serie._id} thumbnail={datafolder + '/' + serie.posters[0].thumbnail} />
				})}
			</div>
		);
	}
}

module.exports = exports = SerieList;