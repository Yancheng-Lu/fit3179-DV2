{
  "$schema": "https://vega.github.io/schema/vega/v5.json",

  "width": 820,
  "height": 470,
  "padding": 20,

  "title": {
    "text": "From Era to Genre to Box Office",
    "anchor": "start",
    "fontSize": 20,
    "offset": 15
  },

  "data": [
    {
      "name": "movies",

      "url": "https://raw.githubusercontent.com/Yancheng-Lu/fit3179-australian-movies/refs/heads/main/data/movies.csv",

      "format": {
        "type": "csv",
        "parse": {
          "year": "number",
          "gross": "number"
        }
      },

      "transform": [
        {
          "type": "filter",
          "expr": "datum.country === 'Australia' && datum.year >= 1980 && datum.year <= 2019 && datum.gross > 0"
        },

        {
          "type": "formula",
          "as": "decade",
          "expr": "datum.year < 1990 ? '1980s' : datum.year < 2000 ? '1990s' : datum.year < 2010 ? '2000s' : '2010s'"
        },

        {
          "type": "formula",
          "as": "genre_group",
          "expr": "datum.genre === 'Action' || datum.genre === 'Adventure' || datum.genre === 'Comedy' || datum.genre === 'Drama' || datum.genre === 'Biography' || datum.genre === 'Horror' ? datum.genre : 'Other'"
        },

        {
          "type": "formula",
          "as": "box_office_tier",
          "expr": "datum.gross < 10000000 ? 'Under $10M' : datum.gross < 50000000 ? '$10–50M' : datum.gross < 150000000 ? '$50–150M' : '$150M+'"
        }
      ]
    },

    {
      "name": "nodes_era",
      "source": "movies",

      "transform": [
        {
          "type": "aggregate",
          "groupby": ["decade"],
          "ops": ["count"],
          "fields": ["name"],
          "as": ["value"]
        },

        {
          "type": "formula",
          "as": "order",
          "expr": "datum.decade === '1980s' ? 0 : datum.decade === '1990s' ? 1 : datum.decade === '2000s' ? 2 : 3"
        },

        {
          "type": "stack",
          "field": "value",
          "sort": {
            "field": "order",
            "order": "ascending"
          },
          "offset": "normalize",
          "as": ["y0", "y1"]
        }
      ]
    },

    {
      "name": "nodes_genre",
      "source": "movies",

      "transform": [
        {
          "type": "aggregate",
          "groupby": ["genre_group"],
          "ops": ["count"],
          "fields": ["name"],
          "as": ["value"]
        },

        {
          "type": "formula",
          "as": "order",
          "expr": "datum.genre_group === 'Action' ? 0 : datum.genre_group === 'Adventure' ? 1 : datum.genre_group === 'Comedy' ? 2 : datum.genre_group === 'Drama' ? 3 : datum.genre_group === 'Biography' ? 4 : datum.genre_group === 'Horror' ? 5 : 6"
        },

        {
          "type": "stack",
          "field": "value",
          "sort": {
            "field": "order",
            "order": "ascending"
          },
          "offset": "normalize",
          "as": ["y0", "y1"]
        }
      ]
    },

    {
      "name": "nodes_box",
      "source": "movies",

      "transform": [
        {
          "type": "aggregate",
          "groupby": ["box_office_tier"],
          "ops": ["count"],
          "fields": ["name"],
          "as": ["value"]
        },

        {
          "type": "formula",
          "as": "order",
          "expr": "datum.box_office_tier === 'Under $10M' ? 0 : datum.box_office_tier === '$10–50M' ? 1 : datum.box_office_tier === '$50–150M' ? 2 : 3"
        },

        {
          "type": "stack",
          "field": "value",
          "sort": {
            "field": "order",
            "order": "ascending"
          },
          "offset": "normalize",
          "as": ["y0", "y1"]
        }
      ]
    },

    {
      "name": "links_era_genre_base",
      "source": "movies",

      "transform": [
        {
          "type": "aggregate",
          "groupby": [
            "decade",
            "genre_group"
          ],
          "ops": ["count"],
          "fields": ["name"],
          "as": ["value"]
        },

        {
          "type": "formula",
          "as": "decade_order",
          "expr": "datum.decade === '1980s' ? 0 : datum.decade === '1990s' ? 1 : datum.decade === '2000s' ? 2 : 3"
        },

        {
          "type": "formula",
          "as": "genre_order",
          "expr": "datum.genre_group === 'Action' ? 0 : datum.genre_group === 'Adventure' ? 1 : datum.genre_group === 'Comedy' ? 2 : datum.genre_group === 'Drama' ? 3 : datum.genre_group === 'Biography' ? 4 : datum.genre_group === 'Horror' ? 5 : 6"
        },

        {
          "type": "formula",
          "as": "link_key",
          "expr": "datum.decade + '|' + datum.genre_group"
        }
      ]
    },

    {
      "name": "links_era_genre_target",
      "source": "links_era_genre_base",

      "transform": [
        {
          "type": "stack",
          "groupby": ["genre_group"],
          "field": "value",

          "sort": {
            "field": "decade_order",
            "order": "ascending"
          },

          "offset": "normalize",

          "as": [
            "local0",
            "local1"
          ]
        },

        {
          "type": "lookup",
          "from": "nodes_genre",
          "key": "genre_group",
          "fields": ["genre_group"],
          "as": ["node"]
        },

        {
          "type": "formula",
          "as": "target_y0",
          "expr": "datum.node.y0 + datum.local0 * (datum.node.y1 - datum.node.y0)"
        },

        {
          "type": "formula",
          "as": "target_y1",
          "expr": "datum.node.y0 + datum.local1 * (datum.node.y1 - datum.node.y0)"
        }
      ]
    },

    {
      "name": "links_era_genre",
      "source": "links_era_genre_base",

      "transform": [
        {
          "type": "stack",
          "groupby": ["decade"],
          "field": "value",

          "sort": {
            "field": "genre_order",
            "order": "ascending"
          },

          "offset": "normalize",

          "as": [
            "local0",
            "local1"
          ]
        },

        {
          "type": "lookup",
          "from": "nodes_era",
          "key": "decade",
          "fields": ["decade"],
          "as": ["node"]
        },

        {
          "type": "lookup",
          "from": "links_era_genre_target",
          "key": "link_key",
          "fields": ["link_key"],
          "as": ["target"]
        },

        {
          "type": "formula",
          "as": "source_y0",
          "expr": "datum.node.y0 + datum.local0 * (datum.node.y1 - datum.node.y0)"
        },

        {
          "type": "formula",
          "as": "source_y1",
          "expr": "datum.node.y0 + datum.local1 * (datum.node.y1 - datum.node.y0)"
        }
      ]
    },

    {
      "name": "links_genre_box_base",
      "source": "movies",

      "transform": [
        {
          "type": "aggregate",
          "groupby": [
            "genre_group",
            "box_office_tier"
          ],
          "ops": ["count"],
          "fields": ["name"],
          "as": ["value"]
        },

        {
          "type": "formula",
          "as": "genre_order",
          "expr": "datum.genre_group === 'Action' ? 0 : datum.genre_group === 'Adventure' ? 1 : datum.genre_group === 'Comedy' ? 2 : datum.genre_group === 'Drama' ? 3 : datum.genre_group === 'Biography' ? 4 : datum.genre_group === 'Horror' ? 5 : 6"
        },

        {
          "type": "formula",
          "as": "box_order",
          "expr": "datum.box_office_tier === 'Under $10M' ? 0 : datum.box_office_tier === '$10–50M' ? 1 : datum.box_office_tier === '$50–150M' ? 2 : 3"
        },

        {
          "type": "formula",
          "as": "link_key",
          "expr": "datum.genre_group + '|' + datum.box_office_tier"
        }
      ]
    },

    {
      "name": "links_genre_box_target",
      "source": "links_genre_box_base",

      "transform": [
        {
          "type": "stack",
          "groupby": ["box_office_tier"],
          "field": "value",

          "sort": {
            "field": "genre_order",
            "order": "ascending"
          },

          "offset": "normalize",

          "as": [
            "local0",
            "local1"
          ]
        },

        {
          "type": "lookup",
          "from": "nodes_box",
          "key": "box_office_tier",
          "fields": ["box_office_tier"],
          "as": ["node"]
        },

        {
          "type": "formula",
          "as": "target_y0",
          "expr": "datum.node.y0 + datum.local0 * (datum.node.y1 - datum.node.y0)"
        },

        {
          "type": "formula",
          "as": "target_y1",
          "expr": "datum.node.y0 + datum.local1 * (datum.node.y1 - datum.node.y0)"
        }
      ]
    },

    {
      "name": "links_genre_box",
      "source": "links_genre_box_base",

      "transform": [
        {
          "type": "stack",
          "groupby": ["genre_group"],
          "field": "value",

          "sort": {
            "field": "box_order",
            "order": "ascending"
          },

          "offset": "normalize",

          "as": [
            "local0",
            "local1"
          ]
        },

        {
          "type": "lookup",
          "from": "nodes_genre",
          "key": "genre_group",
          "fields": ["genre_group"],
          "as": ["node"]
        },

        {
          "type": "lookup",
          "from": "links_genre_box_target",
          "key": "link_key",
          "fields": ["link_key"],
          "as": ["target"]
        },

        {
          "type": "formula",
          "as": "source_y0",
          "expr": "datum.node.y0 + datum.local0 * (datum.node.y1 - datum.node.y0)"
        },

        {
          "type": "formula",
          "as": "source_y1",
          "expr": "datum.node.y0 + datum.local1 * (datum.node.y1 - datum.node.y0)"
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "y",
      "type": "linear",
      "domain": [
        0,
        1
      ],
      "range": [
        55,
        450
      ]
    },

    {
      "name": "genre_color",
      "type": "ordinal",

      "domain": [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Biography",
        "Horror",
        "Other"
      ],

      "range": {
        "scheme": "tableau10"
      }
    }
  ],

  "marks": [
    {
      "type": "path",
      "from": {
        "data": "links_era_genre"
      },

      "encode": {
        "update": {
          "path": {
            "signal": "'M138,' + scale('y', datum.source_y0) + ' C269,' + scale('y', datum.source_y0) + ' 269,' + scale('y', datum.target.target_y0) + ' 400,' + scale('y', datum.target.target_y0) + ' L400,' + scale('y', datum.target.target_y1) + ' C269,' + scale('y', datum.target.target_y1) + ' 269,' + scale('y', datum.source_y1) + ' 138,' + scale('y', datum.source_y1) + ' Z'"
          },

          "fill": {
            "scale": "genre_color",
            "field": "genre_group"
          },

          "fillOpacity": {
            "value": 0.4
          },

          "tooltip": {
            "signal": "datum.decade + ' → ' + datum.genre_group + ': ' + datum.value + ' films'"
          }
        },

        "hover": {
          "fillOpacity": {
            "value": 0.75
          }
        }
      }
    },

    {
      "type": "path",
      "from": {
        "data": "links_genre_box"
      },

      "encode": {
        "update": {
          "path": {
            "signal": "'M418,' + scale('y', datum.source_y0) + ' C549,' + scale('y', datum.source_y0) + ' 549,' + scale('y', datum.target.target_y0) + ' 680,' + scale('y', datum.target.target_y0) + ' L680,' + scale('y', datum.target.target_y1) + ' C549,' + scale('y', datum.target.target_y1) + ' 549,' + scale('y', datum.source_y1) + ' 418,' + scale('y', datum.source_y1) + ' Z'"
          },

          "fill": {
            "scale": "genre_color",
            "field": "genre_group"
          },

          "fillOpacity": {
            "value": 0.4
          },

          "tooltip": {
            "signal": "datum.genre_group + ' → ' + datum.box_office_tier + ': ' + datum.value + ' films'"
          }
        },

        "hover": {
          "fillOpacity": {
            "value": 0.75
          }
        }
      }
    },

    {
      "type": "rect",

      "from": {
        "data": "nodes_era"
      },

      "encode": {
        "update": {
          "x": {
            "value": 120
          },

          "x2": {
            "value": 138
          },

          "y": {
            "signal": "scale('y', datum.y0) + 1"
          },

          "y2": {
            "signal": "scale('y', datum.y1) - 1"
          },

          "fill": {
            "value": "#5B6573"
          },

          "tooltip": {
            "signal": "datum.decade + ': ' + datum.value + ' films'"
          }
        }
      }
    },

    {
      "type": "rect",

      "from": {
        "data": "nodes_genre"
      },

      "encode": {
        "update": {
          "x": {
            "value": 400
          },

          "x2": {
            "value": 418
          },

          "y": {
            "signal": "scale('y', datum.y0) + 1"
          },

          "y2": {
            "signal": "scale('y', datum.y1) - 1"
          },

          "fill": {
            "scale": "genre_color",
            "field": "genre_group"
          },

          "tooltip": {
            "signal": "datum.genre_group + ': ' + datum.value + ' films'"
          }
        }
      }
    },

    {
      "type": "rect",

      "from": {
        "data": "nodes_box"
      },

      "encode": {
        "update": {
          "x": {
            "value": 680
          },

          "x2": {
            "value": 698
          },

          "y": {
            "signal": "scale('y', datum.y0) + 1"
          },

          "y2": {
            "signal": "scale('y', datum.y1) - 1"
          },

          "fill": {
            "value": "#5B6573"
          },

          "tooltip": {
            "signal": "datum.box_office_tier + ': ' + datum.value + ' films'"
          }
        }
      }
    },

    {
      "type": "text",

      "from": {
        "data": "nodes_era"
      },

      "encode": {
        "update": {
          "x": {
            "value": 110
          },

          "y": {
            "signal": "scale('y', (datum.y0 + datum.y1) / 2)"
          },

          "text": {
            "field": "decade"
          },

          "align": {
            "value": "right"
          },

          "baseline": {
            "value": "middle"
          },

          "fontSize": {
            "value": 12
          },

          "fill": {
            "value": "#222222"
          }
        }
      }
    },

    {
      "type": "text",

      "from": {
        "data": "nodes_genre"
      },

      "encode": {
        "update": {
          "x": {
            "value": 428
          },

          "y": {
            "signal": "scale('y', (datum.y0 + datum.y1) / 2)"
          },

          "text": {
            "field": "genre_group"
          },

          "align": {
            "value": "left"
          },

          "baseline": {
            "value": "middle"
          },

          "fontSize": {
            "value": 11
          },

          "fontWeight": {
            "value": "bold"
          },

          "fill": {
            "value": "#222222"
          }
        }
      }
    },

    {
      "type": "text",

      "from": {
        "data": "nodes_box"
      },

      "encode": {
        "update": {
          "x": {
            "value": 708
          },

          "y": {
            "signal": "scale('y', (datum.y0 + datum.y1) / 2)"
          },

          "text": {
            "field": "box_office_tier"
          },

          "align": {
            "value": "left"
          },

          "baseline": {
            "value": "middle"
          },

          "fontSize": {
            "value": 12
          },

          "fill": {
            "value": "#222222"
          }
        }
      }
    },

    {
      "type": "text",

      "encode": {
        "update": {
          "x": {
            "value": 129
          },

          "y": {
            "value": 25
          },

          "text": {
            "value": "ERA"
          },

          "align": {
            "value": "center"
          },

          "fontSize": {
            "value": 13
          },

          "fontWeight": {
            "value": "bold"
          },

          "fill": {
            "value": "#555555"
          }
        }
      }
    },

    {
      "type": "text",

      "encode": {
        "update": {
          "x": {
            "value": 409
          },

          "y": {
            "value": 25
          },

          "text": {
            "value": "GENRE"
          },

          "align": {
            "value": "center"
          },

          "fontSize": {
            "value": 13
          },

          "fontWeight": {
            "value": "bold"
          },

          "fill": {
            "value": "#555555"
          }
        }
      }
    },

    {
      "type": "text",

      "encode": {
        "update": {
          "x": {
            "value": 689
          },

          "y": {
            "value": 25
          },

          "text": {
            "value": "BOX OFFICE"
          },

          "align": {
            "value": "center"
          },

          "fontSize": {
            "value": 13
          },

          "fontWeight": {
            "value": "bold"
          },

          "fill": {
            "value": "#555555"
          }
        }
      }
    }
  ],

  "config": {
    "background": "white"
  }
}