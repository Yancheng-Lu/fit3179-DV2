{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 800,
  "height": 450,

  "title": "Average Film Score by Country",

  "projection": {
    "type": "equalEarth"
  },

  "layer": [
    {
      "data": {
        "url": "https://raw.githubusercontent.com/FIT3179/Vega-Lite/main/3_choropleth_map/js/ne_110m_admin_0_countries.topojson",
        "format": {
          "type": "topojson",
          "feature": "ne_110m_admin_0_countries"
        }
      },

      "mark": {
        "type": "geoshape",
        "fill": "#E6E6E6",
        "stroke": "white",
        "strokeWidth": 0.5
      }
    },

    {
      "data": {
        "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv"
      },

      "transform": [
        {
          "calculate": "toNumber(datum.score)",
          "as": "score_num"
        },

        {
          "filter": "datum.country != null && datum.country !== '' && isValid(datum.score_num) && datum.score_num > 0"
        },

        {
          "calculate": "datum.country === 'United States' ? 'United States of America' : datum.country === 'UK' ? 'United Kingdom' : datum.country",
          "as": "map_country"
        },

        {
          "aggregate": [
            {
              "op": "mean",
              "field": "score_num",
              "as": "average_score"
            },
            {
              "op": "count",
              "field": "name",
              "as": "film_count"
            }
          ],
          "groupby": [
            "country",
            "map_country"
          ]
        },

        {
          "lookup": "map_country",
          "from": {
            "data": {
              "url": "https://raw.githubusercontent.com/FIT3179/Vega-Lite/main/3_choropleth_map/js/ne_110m_admin_0_countries.topojson",
              "format": {
                "type": "topojson",
                "feature": "ne_110m_admin_0_countries"
              }
            },
            "key": "properties.NAME"
          },
          "as": "geo"
        },

        {
          "filter": "isValid(datum.geo)"
        }
      ],

      "mark": {
        "type": "geoshape",
        "stroke": "white",
        "strokeWidth": 0.5
      },

      "encoding": {
        "shape": {
          "field": "geo",
          "type": "geojson"
        },

        "color": {
          "field": "average_score",
          "type": "quantitative",
          "title": "Average Score",
          "scale": {
            "scheme": "blues"
          }
        },

        "tooltip": [
          {
            "field": "country",
            "type": "nominal",
            "title": "Country"
          },
          {
            "field": "average_score",
            "type": "quantitative",
            "title": "Average Score",
            "format": ".2f"
          },
          {
            "field": "film_count",
            "type": "quantitative",
            "title": "Number of Films"
          }
        ]
      }
    }
  ]
}