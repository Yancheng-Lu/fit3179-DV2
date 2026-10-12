{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 800,
  "height": 450,

  "title": "How Australian Cinema Connects to the World",

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
        "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/tmdb_5000_movies.csv"
      },

      "transform": [

        {
          "filter": "datum.production_countries != null && indexof(datum.production_countries, 'Australia') >= 0"
        },

        {
          "calculate": "indexof(datum.production_countries, 'United States of America') >= 0 ? 1 : 0",
          "as": "US"
        },

        {
          "calculate": "indexof(datum.production_countries, 'United Kingdom') >= 0 ? 1 : 0",
          "as": "UK"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Canada') >= 0 ? 1 : 0",
          "as": "Canada"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Germany') >= 0 ? 1 : 0",
          "as": "Germany"
        },

        {
          "calculate": "indexof(datum.production_countries, 'France') >= 0 ? 1 : 0",
          "as": "France"
        },

        {
          "calculate": "indexof(datum.production_countries, 'India') >= 0 ? 1 : 0",
          "as": "India"
        },

        {
          "calculate": "indexof(datum.production_countries, 'New Zealand') >= 0 ? 1 : 0",
          "as": "NewZealand"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Japan') >= 0 ? 1 : 0",
          "as": "Japan"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Italy') >= 0 ? 1 : 0",
          "as": "Italy"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Spain') >= 0 ? 1 : 0",
          "as": "Spain"
        },

        {
          "calculate": "indexof(datum.production_countries, 'China') >= 0 ? 1 : 0",
          "as": "China"
        },

        {
          "calculate": "indexof(datum.production_countries, 'South Africa') >= 0 ? 1 : 0",
          "as": "SouthAfrica"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Ireland') >= 0 ? 1 : 0",
          "as": "Ireland"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Belgium') >= 0 ? 1 : 0",
          "as": "Belgium"
        },

        {
          "calculate": "indexof(datum.production_countries, 'Netherlands') >= 0 ? 1 : 0",
          "as": "Netherlands"
        },

        {
          "fold": [
            "US",
            "UK",
            "Canada",
            "Germany",
            "France",
            "India",
            "NewZealand",
            "Japan",
            "Italy",
            "Spain",
            "China",
            "SouthAfrica",
            "Ireland",
            "Belgium",
            "Netherlands"
          ],
          "as": [
            "partner_code",
            "is_partner"
          ]
        },

        {
          "filter": "datum.is_partner === 1"
        },

        {
          "calculate": "datum.partner_code === 'US' ? 'United States' : datum.partner_code === 'UK' ? 'United Kingdom' : datum.partner_code === 'NewZealand' ? 'New Zealand' : datum.partner_code === 'SouthAfrica' ? 'South Africa' : datum.partner_code",
          "as": "partner"
        },

        {
          "calculate": "datum.partner_code === 'US' ? -98.58 : datum.partner_code === 'UK' ? -3.44 : datum.partner_code === 'Canada' ? -106.35 : datum.partner_code === 'Germany' ? 10.45 : datum.partner_code === 'France' ? 2.21 : datum.partner_code === 'India' ? 78.96 : datum.partner_code === 'NewZealand' ? 174.89 : datum.partner_code === 'Japan' ? 138.25 : datum.partner_code === 'Italy' ? 12.57 : datum.partner_code === 'Spain' ? -3.75 : datum.partner_code === 'China' ? 104.20 : datum.partner_code === 'SouthAfrica' ? 22.94 : datum.partner_code === 'Ireland' ? -8.24 : datum.partner_code === 'Belgium' ? 4.47 : 5.29",
          "as": "partner_lon"
        },

        {
          "calculate": "datum.partner_code === 'US' ? 39.83 : datum.partner_code === 'UK' ? 55.38 : datum.partner_code === 'Canada' ? 56.13 : datum.partner_code === 'Germany' ? 51.17 : datum.partner_code === 'France' ? 46.23 : datum.partner_code === 'India' ? 20.59 : datum.partner_code === 'NewZealand' ? -40.90 : datum.partner_code === 'Japan' ? 36.20 : datum.partner_code === 'Italy' ? 41.87 : datum.partner_code === 'Spain' ? 40.46 : datum.partner_code === 'China' ? 35.86 : datum.partner_code === 'SouthAfrica' ? -30.56 : datum.partner_code === 'Ireland' ? 53.41 : datum.partner_code === 'Belgium' ? 50.50 : 52.13",
          "as": "partner_lat"
        },

        {
          "aggregate": [
            {
              "op": "count",
              "field": "title",
              "as": "coproduction_count"
            }
          ],

          "groupby": [
            "partner",
            "partner_lon",
            "partner_lat"
          ]
        },

        {
          "calculate": "133.7751",
          "as": "australia_lon"
        },

        {
          "calculate": "-25.2744",
          "as": "australia_lat"
        }
      ],

      "layer": [

        {
          "mark": {
            "type": "rule",
            "color": "#D46A4C",
            "opacity": 0.55
          },

          "encoding": {

            "longitude": {
              "field": "australia_lon",
              "type": "quantitative"
            },

            "latitude": {
              "field": "australia_lat",
              "type": "quantitative"
            },

            "longitude2": {
              "field": "partner_lon"
            },

            "latitude2": {
              "field": "partner_lat"
            },

            "size": {
              "field": "coproduction_count",
              "type": "quantitative",
              "title": "Co-productions",
              "scale": {
                "type": "sqrt",
                "range": [1, 10]
              }
            },

            "tooltip": [
              {
                "field": "partner",
                "type": "nominal",
                "title": "Partner Country"
              },
              {
                "field": "coproduction_count",
                "type": "quantitative",
                "title": "Co-produced Films"
              }
            ]
          }
        },

        {
          "mark": {
            "type": "circle",
            "color": "#D46A4C",
            "opacity": 0.85,
            "stroke": "white",
            "strokeWidth": 1
          },

          "encoding": {

            "longitude": {
              "field": "partner_lon",
              "type": "quantitative"
            },

            "latitude": {
              "field": "partner_lat",
              "type": "quantitative"
            },

            "size": {
              "field": "coproduction_count",
              "type": "quantitative",
              "title": "Co-produced Films",
              "scale": {
                "type": "sqrt",
                "range": [30, 350]
              }
            },

            "tooltip": [
              {
                "field": "partner",
                "type": "nominal",
                "title": "Partner Country"
              },
              {
                "field": "coproduction_count",
                "type": "quantitative",
                "title": "Co-produced Films"
              }
            ]
          }
        }
      ]
    },

    {
      "data": {
        "values": [
          {
            "country": "Australia",
            "longitude": 133.7751,
            "latitude": -25.2744
          }
        ]
      },

      "mark": {
        "type": "circle",
        "size": 140,
        "color": "#17365D",
        "stroke": "white",
        "strokeWidth": 1.5
      },

      "encoding": {

        "longitude": {
          "field": "longitude",
          "type": "quantitative"
        },

        "latitude": {
          "field": "latitude",
          "type": "quantitative"
        },

        "tooltip": {
          "field": "country",
          "type": "nominal",
          "title": "Origin"
        }
      }
    }
  ]
}