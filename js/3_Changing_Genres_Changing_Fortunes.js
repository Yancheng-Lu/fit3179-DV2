{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 700,
  "height": 400,

  "title": "Changing Genres, Changing Fortunes",

  "data": {
    "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv"
  },

  "transform": [
    {
      "calculate": "toNumber(datum.year)",
      "as": "year_num"
    },

    {
      "calculate": "toNumber(datum.gross)",
      "as": "gross_num"
    },

    {
      "filter": "datum.country === 'Australia' && datum.year_num >= 1980 && datum.year_num <= 2019 && datum.gross_num > 0"
    },

    {
      "calculate": "datum.year_num < 1990 ? '1980s' : datum.year_num < 2000 ? '1990s' : datum.year_num < 2010 ? '2000s' : '2010s'",
      "as": "decade"
    },

    {
      "aggregate": [
        {
          "op": "median",
          "field": "gross_num",
          "as": "median_gross"
        },
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
    }
  ],

  "mark": {
    "type": "rect"
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
      "field": "genre",
      "type": "nominal",
      "title": "Genre"
    },

    "color": {
      "field": "median_gross",
      "type": "quantitative",
      "title": "Median Gross",
      "scale": {
        "scheme": "blues"
      }
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
        "field": "median_gross",
        "type": "quantitative",
        "title": "Median Gross",
        "format": "$,.0f"
      },
      {
        "field": "film_count",
        "type": "quantitative",
        "title": "Number of Films"
      }
    ]
  }
}