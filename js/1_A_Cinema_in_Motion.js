{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 700,
  "height": 350,

  "title": "A Cinema in Motion",

  "data": {
    "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv"
  },

  "transform": [
    {
      "filter": "datum.country === 'Australia'"
    },
    {
      "aggregate": [
        {
          "op": "count",
          "field": "name",
          "as": "Number of Films"
        }
      ],
      "groupby": ["year"]
    }
  ],

  "mark": {
    "type": "line",
    "point": true
  },

  "encoding": {
    "x": {
      "field": "year",
      "type": "quantitative",
      "title": "Year",
      "axis": {
        "format": "d"
      }
    },

    "y": {
      "field": "Number of Films",
      "type": "quantitative",
      "title": "Number of Films"
    },

    "tooltip": [
      {
        "field": "year",
        "type": "quantitative",
        "title": "Year",
        "format": "d"
      },
      {
        "field": "Number of Films",
        "type": "quantitative",
        "title": "Number of Films"
      }
    ]
  }
}