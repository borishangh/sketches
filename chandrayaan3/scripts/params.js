
const params = {
    "ch3_earth_small": {
        "x_lim": [-50000, 250000],
        "y_lim": [-150000, 150000],
        "x_param": 'x',
        "y_param": 'y',
        "path_data": [["./json/ch3_geo.json", "lightpink"]],
        "path_length": 17040,
        "primary_object": [6371, "royalblue"],
        "text": "CH3 wrt earth XY plane",
    },
    "ch3_moon": {
        "x_lim": [-5000, 20000],
        "y_lim": [-6500, 18500],
        "x_param": 'y',
        "y_param": 'z',
        "path_data": [["./json/ch3_moon.json", "lightpink"]],
        "path_length": 17040,
        "primary_object": [1737.4, "#999"],
        "text": "CH3 wrt moon YZ plane",
    },
    "ch3_earth": {
        "x_lim": [-450000, 450000],
        "y_lim": [-450000, 450000],
        "x_param": 'x',
        "y_param": 'y',
        "path_data": [["./json/ch3_geo.json", "lightpink"],
        ["./json/moon_geo.json", "#999"]],
        "path_length": 17040,
        "primary_object": [6371, "royalblue"],
        "text": "CH3 wrt earth(closeup) XY plane",
    }
}

export { params }