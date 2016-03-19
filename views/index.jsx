var React = require('react');

var SerieHeader = require('./components/SerieHeader'),
    SerieList   = require('./components/SerieList');

var DefaultLayout = require('./layouts/default');

var index = class index extends React.Component {
	render() {
		var datafolder = this.props.datafolder,
		    series     = this.props.series,
		    lists      = [];

		for (var i = 1; i < series.length; i = i + 7)
			lists.push(series.slice(i, i + 7));

		return (
			<DefaultLayout title={this.props.title}>
				<SerieHeader key={series[0]._id} name={series[0].name} fanarts={datafolder + '/' + series[0].fanarts[0].url} />

				<main>
					<section className="posters">
						{lists.map(function(seriesList, index) {
							return <SerieList key={index} series={seriesList} datafolder={datafolder} />
						})}
					</section>

					<div className="preview" />
				</main>
			</DefaultLayout>
		);
	}
}

module.exports = exports = index;