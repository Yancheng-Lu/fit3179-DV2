{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 700,
  "height": 300,

  "title": "Did Audiences Think the Films Got Better?",

  "data": {
    "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv"
  },

  "transform": [
    {
      "calculate": "toNumber(datum.year)",
      "as": "year_num"
    },

    {
      "calculate": "toNumber(datum.score)",
      "as": "score_num"
    },

    {
      "filter": "datum.country === 'Australia' && datum.year_num >= 1980 && datum.year_num <= 2019 && datum.score_num > 0"
    },

    {
      "calculate": "datum.year_num < 1990 ? '1980s' : datum.year_num < 2000 ? '1990s' : datum.year_num < 2010 ? '2000s' : '2010s'",
      "as": "decade"
    },

    {
      "calculate": "datum.score_num < 6 ? 'Low Rated' : datum.score_num < 7 ? 'Moderate' : 'Highly Rated'",
      "as": "rating_group"
    },

    {
      "aggregate": [
        {
          "op": "count",
          "field": "name",
          "as": "film_count"
        }
      ],
      "groupby": [
        "decade",
        "rating_group"
      ]
    },

    {
      "joinaggregate": [
        {
          "op": "sum",
          "field": "film_count",
          "as": "total_films"
        }
      ],
      "groupby": [
        "decade"
      ]
    },

    {
      "calculate": "datum.film_count / datum.total_films * 100",
      "as": "percentage"
    }
  ],

  "mark": {
    "type": "bar"
  },

  "encoding": {
    "y": {
      "field": "decade",
      "type": "ordinal",
      "title": "Decade",
      "sort": [
        "1980s",
        "1990s",
        "2000s",
        "2010s"
      ]
    },

    "x": {
      "field": "percentage",
      "type": "quantitative",
      "title": "Percentage of Films",
      "stack": "zero",
      "scale": {
        "domain": [0, 100]
      },
      "axis": {
        "format": ".0f",
        "labelExpr": "datum.label + '%'"
      }
    },

    "color": {
      "field": "rating_group",
      "type": "nominal",
      "title": "Audience Rating",
      "sort": [
        "Low Rated",
        "Moderate",
        "Highly Rated"
      ]
    },

    "order": {
      "field": "rating_group",
      "sort": "ascending"
    },

    "tooltip": [
      {
        "field": "decade",
        "type": "ordinal",
        "title": "Decade"
      },

      {
        "field": "rating_group",
        "type": "nominal",
        "title": "Rating Group"
      },

      {
        "field": "film_count",
        "type": "quantitative",
        "title": "Number of Films"
      },

      {
        "field": "percentage",
        "type": "quantitative",
        "title": "Percentage",
        "format": ".1f"
      }
    ]
  }
}