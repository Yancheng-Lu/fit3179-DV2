{
  "$schema": "https://vega.github.io/schema/vega/v5.json",

  "width": 800,
  "height": 450,
  "padding": 10,

  "title": {
    "text": "The Companies Behind Australian Film",
    "anchor": "start",
    "fontSize": 20,
    "offset": 12
  },

  "data": [
    {
      "name": "companies",

      "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv",

      "format": {
        "type": "csv",
        "parse": {
          "score": "number"
        }
      },

      "transform": [
        {
          "type": "filter",
          "expr": "datum.country === 'Australia' && datum.company != null && datum.company !== ''"
        },

        {
          "type": "aggregate",
          "groupby": [
            "company"
          ],

          "ops": [
            "count",
            "median"
          ],

          "fields": [
            "name",
            "score"
          ],

          "as": [
            "film_count",
            "median_score"
          ]
        },

        {
          "type": "filter",
          "expr": "datum.film_count >= 2"
        },

        {
          "type": "nest",
          "keys": [
            "company"
          ]
        },

        {
          "type": "treemap",
          "field": "film_count",
          "method": "squarify",
          "ratio": 1.6,
          "round": true,
          "paddingInner": 2,

          "size": [
            {
              "signal": "width"
            },
            {
              "signal": "height"
            }
          ]
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "color",

      "type": "linear",

      "domain": {
        "data": "companies",
        "field": "median_score"
      },

      "range": {
        "scheme": "blues"
      },

      "nice": true
    }
  ],

  "marks": [
    {
      "type": "rect",

      "from": {
        "data": "companies"
      },

      "encode": {
        "enter": {
          "stroke": {
            "value": "white"
          },

          "strokeWidth": {
            "value": 1.5
          }
        },

        "update": {
          "x": {
            "field": "x0"
          },

          "y": {
            "field": "y0"
          },

          "x2": {
            "field": "x1"
          },

          "y2": {
            "field": "y1"
          },

          "fill": {
            "scale": "color",
            "field": "median_score"
          },

          "tooltip": {
            "signal": "{'Company': datum.company, 'Number of Films': datum.film_count, 'Median Score': format(datum.median_score, '.1f')}"
          }
        },

        "hover": {
          "fillOpacity": {
            "value": 0.7
          }
        }
      }
    },

    {
      "type": "text",

      "from": {
        "data": "companies"
      },

      "encode": {
        "update": {
          "x": {
            "signal": "(datum.x0 + datum.x1) / 2"
          },

          "y": {
            "signal": "(datum.y0 + datum.y1) / 2 - 7"
          },

          "text": {
            "field": "company"
          },

          "align": {
            "value": "center"
          },

          "baseline": {
            "value": "middle"
          },

          "fontSize": {
            "signal": "datum.x1 - datum.x0 > 110 && datum.y1 - datum.y0 > 50 ? 12 : 0"
          },

          "fontWeight": {
            "value": "bold"
          },

          "fill": {
            "value": "white"
          },

          "limit": {
            "signal": "datum.x1 - datum.x0 - 8"
          }
        }
      }
    },

    {
      "type": "text",

      "from": {
        "data": "companies"
      },

      "encode": {
        "update": {
          "x": {
            "signal": "(datum.x0 + datum.x1) / 2"
          },

          "y": {
            "signal": "(datum.y0 + datum.y1) / 2 + 10"
          },

          "text": {
            "signal": "datum.film_count + ' films'"
          },

          "align": {
            "value": "center"
          },

          "baseline": {
            "value": "middle"
          },

          "fontSize": {
            "signal": "datum.x1 - datum.x0 > 80 && datum.y1 - datum.y0 > 45 ? 10 : 0"
          },

          "fill": {
            "value": "white"
          }
        }
      }
    }
  ],

  "legends": [
    {
      "fill": "color",
      "title": "Median Audience Score",
      "orient": "right"
    }
  ]
}