{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 700,
  "height": 350,

  "title": "Genres Rise, Fall and Return",

  "data": {
    "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv"
  },

  "transform": [
    {
      "calculate": "toNumber(datum.year)",
      "as": "year_num"
    },

    {
      "filter": "datum.country === 'Australia' && datum.year_num >= 1980 && datum.year_num <= 2019"
    },

    {
      "calculate": "datum.year_num < 1990 ? '1980s' : datum.year_num < 2000 ? '1990s' : datum.year_num < 2010 ? '2000s' : '2010s'",
      "as": "decade"
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
        "genre"
      ]
    },

    {
      "window": [
        {
          "op": "rank",
          "as": "rank"
        }
      ],
      "sort": [
        {
          "field": "film_count",
          "order": "descending"
        }
      ],
      "groupby": [
        "decade"
      ]
    },

    {
      "filter": "datum.rank <= 5"
    }
  ],

  "mark": {
    "type": "line",
    "point": true
  },

  "encoding": {
    "x": {
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

    "y": {
      "field": "rank",
      "type": "ordinal",
      "title": "Genre Rank",
      "sort": "ascending",
      "scale": {
        "reverse": true
      }
    },

    "color": {
      "field": "genre",
      "type": "nominal",
      "title": "Genre"
    },

    "detail": {
      "field": "genre"
    },

    "tooltip": [
      {
        "field": "genre",
        "type": "nominal",
        "title": "Genre"
      },
      {
        "field": "decade",
        "type": "ordinal",
        "title": "Decade"
      },
      {
        "field": "rank",
        "type": "ordinal",
        "title": "Rank"
      },
      {
        "field": "film_count",
        "type": "quantitative",
        "title": "Number of Films"
      }
    ]
  }
}