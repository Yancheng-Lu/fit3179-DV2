{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 800,
  "height": 450,

  "title": "Number of Films by Country",

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
          "filter": "datum.country != null && datum.country !== ''"
        },

        {
          "calculate": "datum.country === 'United States' ? 'United States of America' : datum.country === 'UK' ? 'United Kingdom' : datum.country",
          "as": "map_country"
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
          "field": "film_count",
          "type": "quantitative",

          "title": "Number of Films",

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
            "field": "film_count",
            "type": "quantitative",
            "title": "Number of Films"
          }
        ]
      }
    }
  ]
}