"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RestrictGraph = function (_React$Component) {
	_inherits(RestrictGraph, _React$Component);

	function RestrictGraph() {
		_classCallCheck(this, RestrictGraph);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(RestrictGraph).apply(this, arguments));
	}

	_createClass(RestrictGraph, [{
		key: "expect_overlapped",
		value: function expect_overlapped(markers) {
			return markers;
		}
	}, {
		key: "find_restrict_map",
		value: function find_restrict_map(markers) {
			var _this2 = this;

			function relative_mapper(markers) {
				var scale = d3.scaleLinear().domain([0, markers.reduce(function (a, b) {
					return a + b;
				})]).range([0, 100]);
				return markers.map(function (marker) {
					return scale(marker);
				});
			}

			function find_all_combi(elem) {
				var combi = [];
				function perm(arr, n) {
					if (n == 0) {
						combi.push(arr.slice(0));
						return;
					}
					for (var i = n - 1; i >= 0; i--) {
						var temp = arr[i];
						arr[i] = arr[n - 1];
						arr[n - 1] = temp;

						perm(arr, n - 1);

						var temp = arr[i];
						arr[i] = arr[n - 1];
						arr[n - 1] = temp;
					}
				}
				perm(elem, elem.length);
				return combi;
			}

			function calc_linear_double_affinity(a, b, a_b) {
				var affinity = 0;
				var pos_a_b = 0;
				var affinity_a_b = [];
				a_b.slice(0, -1).forEach(function (e_a_b) {
					pos_a_b += e_a_b;

					var a_affinity = [];
					var pos_a = 0;
					a.slice(0, -1).forEach(function (e_a) {
						pos_a += e_a;
						a_affinity.push(Math.exp(Math.pow(pos_a_b - pos_a, 2) * -0.1));
					});
					affinity += d3.max(a_affinity);

					var b_affinity = [];
					var pos_b = 0;
					b.slice(0, -1).forEach(function (e_b) {
						pos_b += e_b;
						b_affinity.push(Math.exp(Math.pow(pos_a_b - pos_b, 2) * -0.1));
					});
					affinity += d3.max(b_affinity);

					affinity_a_b.push({ a: d3.max(a_affinity), b: d3.max(b_affinity) });
				});
				return [affinity, affinity_a_b];
			}

			function calc_circular_double_affinity(a, b, a_b) {
				var pos_a = [0];
				var pos_b = [0];
				var pos_a_b = [0];

				a.slice(0, -1).forEach(function (e_a, idx, a) {
					pos_a.push(a.slice(0, idx + 1).reduce(function (a, b) {
						return a + b;
					}));
				});
				b.slice(0, -1).forEach(function (e_b, idx, b) {
					pos_b.push(b.slice(0, idx + 1).reduce(function (a, b) {
						return a + b;
					}));
				});
				a_b.slice(0, -1).forEach(function (e_a_b, idx, a_b) {
					pos_a_b.push(a_b.slice(0, idx + 1).reduce(function (a, b) {
						return a + b;
					}));
				});

				function rotate_DNA(pos, distance) {
					return pos.map(function (p) {
						return p + distance >= 100 ? p + distance - 100 : p + distance;
					});
				}

				var affinities = [];
				pos_a_b.forEach(function (e_a_b, idx_a_b, p_a_b) {
					var a_start_pos = e_a_b;
					/*
     var except_a_start_pos= p_a_b.slice(0, idx_a_b).concat(p_a_b.slice(idx_a_b+1));
     except_a_start_pos.forEach( (b_s) => {
     	var b_start_pos= b_s;
     })
     */
					p_a_b.forEach(function (e_a_b) {
						var b_start_pos = e_a_b;

						var rotated_a = rotate_DNA(pos_a, a_start_pos).sort();
						var rotated_b = rotate_DNA(pos_b, b_start_pos).sort();

						var rotation_affinity = 0;
						var rotation_affinity_a_b = [];

						p_a_b.forEach(function (p_a_b) {
							var a_affinity = [];
							rotated_a.forEach(function (r_a) {
								a_affinity.push(Math.exp(Math.pow(p_a_b - r_a, 2) * -0.1));
							});
							var b_affinity = [];
							rotated_b.forEach(function (r_b) {
								b_affinity.push(Math.exp(Math.pow(p_a_b - r_b, 2) * -0.1));
							});
							rotation_affinity += d3.max(a_affinity) + d3.max(b_affinity);
							rotation_affinity_a_b.push({ a: d3.max(a_affinity), b: d3.max(b_affinity) });
						});
						affinities.push([rotation_affinity, rotation_affinity_a_b, a_start_pos, b_start_pos]);
					});
				});
				return affinities.sort(function (a, b) {
					return a[0] < b[0];
				})[0];
			}

			function remove_duplications(combis, DNA_form) {
				var result = [];
				switch (DNA_form) {
					case "linear":
						combis.forEach(function (combi) {
							if (!result.map(function (r) {
								return JSON.stringify(r);
							}).includes(JSON.stringify(combi.slice(0).reverse()))) {
								result.push(combi);
							}
						});
						break;
					case "circular":
						result = combis;
						break;
				}
				return result;
			}

			switch (this.props.digest_manner) {
				case "double":
					var markers_a = markers.filter(function (marker) {
						return marker[0] == 1;
					});
					var markers_b = markers.filter(function (marker) {
						return marker[0] == 2;
					});
					var markers_a_b = markers.filter(function (marker) {
						return marker[0] == 3;
					});

					var comb_a = find_all_combi(markers_a.map(function (e) {
						return e[2];
					}));
					var comb_b = find_all_combi(markers_b.map(function (e) {
						return e[2];
					}));
					var comb_a_b = find_all_combi(markers_a_b.map(function (e) {
						return e[2];
					}));

					var result = [];

					comb_a_b = remove_duplications(comb_a_b, this.props.DNA_form);

					comb_a.forEach(function (a) {
						comb_b.forEach(function (b) {
							comb_a_b.forEach(function (a_b) {
								switch (_this2.props.DNA_form) {
									case "linear":
										var affinity = calc_linear_double_affinity(relative_mapper(a), relative_mapper(b), relative_mapper(a_b));
										break;
									case "circular":
										var affinity = calc_circular_double_affinity(relative_mapper(a), relative_mapper(b), relative_mapper(a_b));
										break;
								}
								result.push([affinity[0], a.slice(0), b.slice(0), a_b.slice(0), affinity[1]]);
							});
						});
					});
					return result.sort(function (r1, r2) {
						return r1[0] < r2[0] ? 1 : -1;
					});
				case "partial":
					break;
			}
		}
	}, {
		key: "render_restrict_map",
		value: function render_restrict_map(restrict_map, fragScale, label) {
			switch (this.props.DNA_form) {
				case "linear":
					//var fragScale= d3.scaleLinear().domain([0, restrict_maps[0][3].reduce( (a, b) => a+b )]).range([0, this.props.width- this.props.padding*2])
					return React.createElement(
						"div",
						null,
						React.createElement(LinearRestrictMap, _extends({}, this.props, { favorite: restrict_map, fragScale: fragScale, padding: 30, label: label }))
					);
					break;
				case "circular":
					break;
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this3 = this;

			var col_length = [];
			var cols = new Set(this.props.markers.map(function (marker) {
				return marker[0];
			}));
			if (this.props.exclude_ladder) {
				cols.delete(0);
			}
			var frag_padding = 25;
			cols.forEach(function (col) {
				return col_length.push(_this3.props.markers.filter(function (marker) {
					return marker[0] == col;
				}).map(function (marker) {
					return Math.round(parseFloat(marker[2]));
				}).reduce(function (a, b) {
					return a + b;
				}));
			});

			var height = this.props.row_padding * cols.size + this.props.padding * 2;
			var fragScale = d3.scaleLinear().domain([0, d3.max(col_length)]).range([0, this.props.width - this.props.padding - this.props.label_padding - frag_padding * d3.max([].concat(_toConsumableArray(cols)).map(function (col) {
				return _this3.props.markers.filter(function (marker) {
					return marker[0] == col;
				});
			}), function (col) {
				return col.length;
			})]);
			var yScale = d3.scaleLinear().domain([d3.min([].concat(_toConsumableArray(cols))), d3.max([].concat(_toConsumableArray(cols)))]).range([this.props.padding, height - this.props.padding]);

			var scale = { fragScale: fragScale, yScale: yScale };

			var restrict_maps = this.find_restrict_map(this.expect_overlapped(this.props.markers));

			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					null,
					React.createElement(
						"svg",
						{ width: this.props.width, height: height },
						React.createElement(FragmentGraph, _extends({}, this.props, scale, { cols: cols, frag_padding: frag_padding }))
					)
				),
				React.createElement(
					"div",
					null,
					this.render_restrict_map(restrict_maps[0], fragScale, "restrict_map")
				),
				React.createElement(
					"div",
					null,
					React.createElement(
						"div",
						{ id: "candidate_div", className: "collapse" },
						restrict_maps.map(function (restrict_map, idx) {
							return _this3.render_restrict_map(restrict_map, fragScale, idx + 1);
						})
					),
					React.createElement(
						"div",
						null,
						React.createElement(
							"button",
							{ type: "button", className: "btn btn-primary", "data-toggle": "collapse", "data-target": "#candidate_div" },
							"Show All Candidates"
						),
						"(sorted by affinity)"
					)
				)
			);
		}
	}]);

	return RestrictGraph;
}(React.Component);

var FragmentGraph = function (_React$Component2) {
	_inherits(FragmentGraph, _React$Component2);

	function FragmentGraph() {
		_classCallCheck(this, FragmentGraph);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(FragmentGraph).apply(this, arguments));
	}

	_createClass(FragmentGraph, [{
		key: "render_fragment",
		value: function render_fragment(marker, idx, row) {
			var x = this.props.fragScale([0].concat(row.slice(0, idx).map(function (mark) {
				return mark[2];
			})).reduce(function (a, b) {
				return a + b;
			})) + this.props.frag_padding * idx + this.props.label_padding;
			return React.createElement(
				"g",
				null,
				React.createElement(
					"text",
					{ x: x, y: this.props.yScale(marker[0]) - 4, fontSize: "10px", key: "enzyme" + idx },
					Math.round(marker[2])
				),
				React.createElement("rect", { width: this.props.fragScale(marker[2]), height: "2", x: x, y: this.props.yScale(marker[0]), key: idx })
			);
		}
	}, {
		key: "render_label",
		value: function render_label(label) {
			return React.createElement(
				"text",
				{ x: 0, y: this.props.yScale(label[0]), fontSize: "10", key: label[0] },
				label[1]
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var markers = this.props.markers.filter(function (marker) {
				return _this5.props.cols.has(marker[0]);
			});
			return React.createElement(
				"g",
				null,
				this.props.marker_label.filter(function (label) {
					return _this5.props.cols.has(label[0]);
				}).map(function (label) {
					return _this5.render_label(label);
				}),
				[].concat(_toConsumableArray(this.props.cols)).map(function (col) {
					return _this5.props.markers.filter(function (marker) {
						return marker[0] == col;
					});
				}).map(function (row) {
					return row.map(function (marker, idx) {
						return _this5.render_fragment(marker, idx, row);
					});
				})
			);
		}
	}]);

	return FragmentGraph;
}(React.Component);

var LinearRestrictMap = function (_React$Component3) {
	_inherits(LinearRestrictMap, _React$Component3);

	function LinearRestrictMap() {
		_classCallCheck(this, LinearRestrictMap);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(LinearRestrictMap).apply(this, arguments));
	}

	_createClass(LinearRestrictMap, [{
		key: "render_len",
		value: function render_len(marker, idx) {
			var x = this.props.fragScale([0].concat(this.props.favorite[3].slice(0, idx)).reduce(function (a, b) {
				return a + b;
			})) + this.props.label_padding;
			return React.createElement(
				"text",
				{ x: x, y: 50, fontSize: "10px", key: idx },
				Math.round(marker)
			);
		}
	}, {
		key: "render_restrict_point",
		value: function render_restrict_point(markers, marker, idx) {
			var x = this.props.fragScale([0].concat(this.props.favorite[3].slice(0, idx)).reduce(function (a, b) {
				return a + b;
			}) + marker) + this.props.label_padding;
			function get_label(markers, marker_label) {
				if (markers[4][idx].a > markers[4][idx].b) {
					return marker_label[1][1];
				} else {
					return marker_label[2][1];
				}
			}
			return React.createElement(
				"g",
				{ key: idx },
				React.createElement(
					"text",
					{ x: x, y: 28, fontSize: "10px", key: "label" + idx },
					get_label(markers, this.props.marker_label)
				),
				React.createElement("rect", { x: x, y: 30, width: 2, height: 5, key: "restrict_site" + idx })
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _this7 = this;

			return React.createElement(
				"svg",
				{ width: this.props.width, height: 70 },
				React.createElement(
					"text",
					{ x: 0, y: 35, fontSize: "10", key: this.props.label },
					this.props.label
				),
				React.createElement("rect", { width: this.props.fragScale(this.props.favorite[3].reduce(function (a, b) {
						return a + b;
					})), x: this.props.label_padding, y: 35, height: 2 }),
				this.props.favorite[3].map(function (marker, idx) {
					return _this7.render_len(marker, idx);
				}),
				this.props.favorite[3].slice(0, -1).map(function (marker, idx) {
					return _this7.render_restrict_point(_this7.props.favorite, marker, idx);
				})
			);
		}
	}]);

	return LinearRestrictMap;
}(React.Component);