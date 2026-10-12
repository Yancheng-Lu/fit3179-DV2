{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

  "width": 700,
  "height": 420,

  "title": {
    "text": "Blockbusters and Expensive Misses",
    "subtitle": "Reported production budget compared with box-office gross",
    "anchor": "start"
  },

  "data": {
    "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv"
  },

  "transform": [
    {
      "calculate": "toNumber(datum.budget)",
      "as": "budget_num"
    },

    {
      "calculate": "toNumber(datum.gross)",
      "as": "gross_num"
    },

    {
      "filter": "datum.country === 'Australia' && datum.budget_num > 0 && datum.gross_num > 0"
    },

    {
      "calculate": "datum.gross_num - datum.budget_num",
      "as": "gross_budget_gap"
    },

    {
      "calculate": "datum.gross_budget_gap >= 0 ? 'Blockbuster / Overperformer' : 'Expensive Miss'",
      "as": "performance"
    },

    {
      "calculate": "abs(datum.gross_budget_gap)",
      "as": "gap_size"
    },

    {
      "window": [
        {
          "op": "row_number",
          "as": "rank"
        }
      ],

      "sort": [
        {
          "field": "gap_size",
          "order": "descending"
        }
      ],

      "groupby": [
        "performance"
      ]
    },

    {
      "filter": "datum.rank <= 6"
    }
  ],

  "layer": [

    {
      "mark": {
        "type": "rule",
        "strokeWidth": 3,
        "color": "#B0B0B0"
      },

      "encoding": {

        "y": {
          "field": "name",
          "type": "nominal",
          "title": "Film",

          "sort": {
            "field": "gross_budget_gap",
            "order": "descending"
          }
        },

        "x": {
          "field": "budget_num",
          "type": "quantitative",
          "title": "Reported Budget and Box-office Gross (USD)"
        },

        "x2": {
          "field": "gross_num"
        },

        "tooltip": [
          {
            "field": "name",
            "type": "nominal",
            "title": "Film"
          },

          {
            "field": "year",
            "type": "quantitative",
            "title": "Year",
            "format": "d"
          },

          {
            "field": "genre",
            "type": "nominal",
            "title": "Genre"
          },

          {
            "field": "budget_num",
            "type": "quantitative",
            "title": "Budget",
            "format": "$,.0f"
          },

          {
            "field": "gross_num",
            "type": "quantitative",
            "title": "Gross",
            "format": "$,.0f"
          },

          {
            "field": "gross_budget_gap",
            "type": "quantitative",
            "title": "Gross–Budget Gap",
            "format": "$,.0f"
          }
        ]
      }
    },

    {
      "transform": [
        {
          "fold": [
            "budget_num",
            "gross_num"
          ],

          "as": [
            "measure",
            "amount"
          ]
        },

        {
          "calculate": "datum.measure === 'budget_num' ? 'Budget' : 'Gross'",
          "as": "measure_name"
        }
      ],

      "mark": {
        "type": "point",
        "filled": true,
        "size": 100
      },

      "encoding": {

        "y": {
          "field": "name",
          "type": "nominal",

          "sort": {
            "field": "gross_budget_gap",
            "order": "descending"
          }
        },

        "x": {
          "field": "amount",
          "type": "quantitative"
        },

        "color": {
          "field": "measure_name",
          "type": "nominal",
          "title": null,

          "scale": {
            "domain": [
              "Budget",
              "Gross"
            ],

            "range": [
              "#D95F59",
              "#3A7CA5"
            ]
          }
        },

        "tooltip": [
          {
            "field": "name",
            "type": "nominal",
            "title": "Film"
          },

          {
            "field": "measure_name",
            "type": "nominal",
            "title": "Measure"
          },

          {
            "field": "amount",
            "type": "quantitative",
            "title": "Amount",
            "format": "$,.0f"
          },

          {
            "field": "gross_budget_gap",
            "type": "quantitative",
            "title": "Gross–Budget Gap",
            "format": "$,.0f"
          }
        ]
      }
    }
  ]
}