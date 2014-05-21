var dex = {
    version: "0.6"
};

dex.range = function(start, len) {
    var i;
    var range = [];
    var end = start + len;
    for (i = start; i < end; i++) {
        range.push(i);
    }
    return range;
};

dex.config = {};

dex.config.expand = function(config) {
    var name;
    var ci;
    var expanded;
    if (!config) {
        return config;
    }
    expanded = dex.object.clone(config);
    for (name in config) {
        if (config.hasOwnProperty(name)) {
            if (name) {
                ci = name.indexOf(".");
            } else {
                ci = -1;
            }
            if (ci > -1) {
                dex.object.setHierarchical(expanded, name, dex.object.clone(expanded[name]), ".");
                delete expanded[name];
            }
        }
    }
    return expanded;
};

dex.config.font = function(custom) {
    var config = {
        size: 18,
        family: "sans-serif",
        style: "normal",
        variant: "normal",
        weight: "normal"
    };
    return custom ? dex.object.overlay(custom, config) : config;
};

dex.config.configureFont = function(node, config) {
    return node.attr("font-family", config.family).attr("font-weight", config.weight).attr("font-style", config.style).style("font-size", config.size);
};

dex.config.label = function(custom) {
    var config = {
        x: 0,
        y: 0,
        transform: "",
        dy: ".71em",
        font: this.font(),
        text: "",
        anchor: "end",
        color: "black"
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.tick = function(custom) {
    var config = {
        count: 5,
        subdivide: 3,
        size: {
            major: 5,
            minor: 3,
            end: 5
        },
        padding: 5,
        format: d3.format(",d"),
        label: this.label()
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.xaxis = function(custom) {
    var config = {
        scale: d3.scale.linear(),
        orient: "bottom",
        tick: this.tick(),
        label: this.label()
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.yaxis = function(custom) {
    var config = {
        scale: d3.scale.linear(),
        orient: "left",
        tick: this.tick(),
        label: this.label({
            transform: "rotate(-90)"
        })
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.stroke = function(custom) {
    var config = {
        width: 1,
        color: "black",
        opacity: 1,
        dasharray: ""
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.configureStroke = function(node, config) {
    return node.style("stroke-width", config.width).style("stroke", config.color).style("stroke-opacity", config.opacity).style("stroke-dasharray", config.dasharray);
};

dex.config.rectangle = function(custom) {
    var config = {
        width: 50,
        height: 50,
        x: 0,
        y: 0,
        stroke: dex.config.stroke(),
        opacity: 1,
        color: d3.scale.category20()
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.configureRectangle = function(node, config, d) {
    dex.console.log("THIS", this, "D", d);
    return node.attr("width", config.width).attr("height", config.height).attr("x", config.x).attr("y", config.y).attr("opacity", config.opacity).style("fill", config.color).call(dex.config.configureStroke, config.stroke);
};

dex.config.point = function(custom) {
    var config = {
        x: 0,
        y: 0
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.configurePoint = function(node, config) {
    return node.attr("x", config.center.cx).attr("y", config.center.cy);
};

dex.config.circle = function(custom) {
    var config = {
        center: dex.config.point(),
        radius: 10,
        style: {
            stroke: dex.config.stroke(),
            color: d3.scale.category20(),
            opacity: 1
        }
    };
    if (custom) {
        config = dex.object.overlay(custom, config);
    }
    return config;
};

dex.config.configureShapeStyle = function(node, config) {
    return node.call(dex.config.configureStroke, config.stroke).attr("opacity", config.opacity).style("fill", config.color);
};

dex.config.configureCircle = function(node, config) {
    return node.call(dex.config.configureShapeStyle, config.style).attr("r", config.radius).attr("cx", config.center.x).attr("cy", config.center.y);
};

dex.config.configureLabel = function(node, config, text) {
    var rnode = node.attr("x", config.x).attr("y", config.y).attr("transform", config.transform).attr("dy", config.dy).call(dex.config.configureFont, config.font).style("text-anchor", config.anchor).attr("fill", config.color).style("fill-opacity", config.opacity);
    if (text) {
        rnode.attr(text);
    }
    return rnode;
};

dex.config.configureAxis = function(config) {
    return d3.svg.axis().ticks(config.tick.count).tickSubdivide(config.tick.subdivide).tickSize(config.tick.size.major, config.tick.size.minor, config.tick.size.end).tickPadding(config.tick.padding).tickFormat(config.tick.format).orient(config.orient);
};

dex.array = {};

dex.array.slice = function(array, rowRange, optLen) {
    var slice = [];
    var range;
    var i;
    if (arguments.length < 2) {
        return array;
    } else if (arguments.length == 2) {
        if (Array.isArray(rowRange)) {
            range = rowRange;
        } else {
            range = dex.range(rowRange, array.length - rowRange);
        }
    } else if (arguments.length > 2) {
        if (Array.isArray(rowRange)) {
            range = rowRange;
        } else {
            range = dex.range(rowRange, optLen);
        }
    }
    for (i = 0; i < range.length; i++) {
        slice.push(array[range[i]]);
    }
    return slice;
};

dex.array.unique = function(array) {
    var uniqueMap = {};
    var unique = [];
    var i, l;
    for (i = 0, l = array.length; i < l; i += 1) {
        if (uniqueMap.hasOwnProperty(array[i])) {
            continue;
        }
        unique.push(array[i]);
        uniqueMap[array[i]] = 1;
    }
    return unique;
};

dex.array.extent = function(array, indices) {
    var values = getArrayValues(array, indices);
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    console.log("EXTENT:");
    console.dir(values);
    console.dir([ min, max ]);
    return [ min, max ];
};

dex.array.difference = function(a1, a2) {
    var i, j;
    var a = [], diff = [];
    for (i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }
    for (i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }
    for (j in a) {
        diff.push(j);
    }
    return diff;
};

dex.array.selectiveJoin = function(array, rows, delimiter) {
    var delim = ":::";
    var key = "";
    if (arguments.length >= 3) {
        delim = delimiter;
    } else if (arguments.length === 2) {
        return dex.array.slice(array, rows).join(delimiter);
    }
    throw "Invalid arguments.";
};

dex.color = {};

dex.color.toHex = function(color) {
    if (color.substr(0, 1) === "#") {
        return color;
    }
    var digits = /rgb\((\d+),(\d+),(\d+)\)/.exec(color);
    var red = parseInt(digits[1]);
    var green = parseInt(digits[2]);
    var blue = parseInt(digits[3]);
    var rgb = blue | green << 8 | red << 16;
    return "#" + rgb.toString(16);
};

dex.color.colorScheme = function(colorScheme, numColors) {
    if (colorScheme == "1") {
        return d3.scale.category10();
    } else if (colorScheme == "2") {
        return d3.scale.category20();
    } else if (colorScheme == "3") {
        return d3.scale.category20b();
    } else if (colorScheme == "4") {
        return d3.scale.category20c();
    } else if (colorScheme == "HiContrast") {
        return d3.scale.ordinal().range(colorbrewer[colorScheme][9]);
    } else if (colorScheme in colorbrewer) {
        var c;
        var effColors = Math.pow(2, Math.ceil(Math.log(numColors) / Math.log(2)));
        if (effColors > 128) {
            effColors = 256;
        }
        for (c = effColors; c >= 2; c--) {
            if (colorbrewer[colorScheme][c]) {
                return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
            }
        }
        for (c = effColors; c <= 256; c++) {
            if (colorbrewer[colorScheme][c]) {
                return d3.scale.ordinal().range(colorbrewer[colorScheme][c]);
            }
        }
        return d3.scale.category20();
    } else {
        return d3.scale.category20();
    }
};

dex.console = {};

dex.console.log = function() {
    var i;
    for (i = 0; i < arguments.length; i++) {
        if (typeof arguments[i] == "object") {
            console.dir(arguments[i]);
        } else {
            console.log(arguments[i]);
        }
    }
    return this;
};

dex.csv = {};

dex.csv.csv = function(header, data) {
    var csv = {
        header: header,
        data: data
    };
    return csv;
};

dex.csv.getConnectionMatrix = function(csv) {
    var matrix = [];
    var ri, ci;
    var row;
    var cid;
    var header = [];
    var nameToIndex = {};
    var connectionMatrix;
    var uniques;
    var nameIndices = [];
    var src, dest;
    uniques = dex.matrix.uniques(csv.data);
    header = dex.matrix.flatten(uniques);
    nameToIndex = new Array(uniques.length);
    for (ri = 0, cid = 0; ri < uniques.length; ri++) {
        nameToIndex[ri] = {};
        for (ci = 0; ci < uniques[ri].length; ci++) {
            nameToIndex[ri][header[cid]] = cid;
            cid += 1;
        }
    }
    matrix = new Array(header.length);
    for (ri = 0; ri < header.length; ri++) {
        row = new Array(header.length);
        for (ci = 0; ci < header.length; ci++) {
            row[ci] = 0;
        }
        matrix[ri] = row;
    }
    for (ri = 0; ri < csv.data.length; ri++) {
        for (ci = 1; ci < csv.header.length; ci++) {
            src = nameToIndex[ci - 1][csv.data[ri][ci - 1]];
            dest = nameToIndex[ci][csv.data[ri][ci]];
            matrix[src][dest] = 1;
            matrix[dest][src] = 1;
        }
    }
    connectionMatrix = {
        header: header,
        connections: matrix
    };
    return connectionMatrix;
};

dex.csv.createMap = function(csv, keyIndex) {
    var ri, ci, rowMap, map = {};
    for (ri = 0; ri < csv.data.length; ri += 1) {
        if (csv.data[ri].length === csv.header.length) {
            rowMap = {};
            for (ci = 0; ci < csv.header.length; ci += 1) {
                rowMap[csv.header[ci]] = csv.data[ri][ci];
            }
            map[csv.data[ri][keyIndex]] = rowMap;
        }
    }
    return map;
};

dex.csv.toJson = function(csv, rowIndex, columnIndex) {
    var jsonData = [];
    var ri, ci, jsonRow;
    if (arguments.length >= 3) {
        jsonRow = {};
        jsonRow[csv.header[columnIndex]] = csv.data[rowIndex][columnIndex];
        return jsonRow;
    } else if (arguments.length === 2) {
        var jsonRow = {};
        for (ci = 0; ci < csv.header.length; ci += 1) {
            jsonRow[csv.header[ci]] = csv.data[rowIndex][ci];
        }
        return jsonRow;
    } else if (arguments.length === 1) {
        for (ri = 0; ri < csv.data.length; ri++) {
            var jsonRow = {};
            for (ci = 0; ci < csv.header.length; ci++) {
                jsonRow[csv.header[ci]] = csv.data[ri][ci];
            }
            jsonData.push(jsonRow);
        }
    }
    return jsonData;
};

dex.csv.toHierarchicalJson = function(csv) {
    var connections = dex.csv.connections(csv);
    return getChildren(connections, 0);
    function getChildren(connections, depth) {
        var kids = [], cname;
        if (typeof connections === "undefined") {
            return kids;
        }
        for (cname in connections) {
            if (connections.hasOwnProperty(cname)) {
                kids.push(createChild(cname, csv.header[depth], getChildren(connections[cname], depth + 1)));
            }
        }
        return kids;
    }
    function createChild(name, category, children) {
        var child = {
            name: name,
            category: category,
            children: children
        };
        return child;
    }
};

dex.csv.connections = function(csv) {
    var connections = {};
    var ri;
    for (ri = 0; ri < csv.data.length; ri++) {
        dex.object.connect(connections, csv.data[ri]);
    }
    return connections;
};

dex.csv.createRowMap = function(csv, keyIndex) {
    var map = {};
    var ri;
    for (ri = 0; ri < csv.data.length; ri++) {
        if (csv.data[ri].length == csv.header.length) {
            map[csv.data[ri][keyIndex]] = csv.data[ri];
        }
    }
    return map;
};

dex.csv.columnSlice = function(csv, columns) {
    dex.console.log(csv);
    csv.header = dex.array.slice(columns);
    csv.data = dex.matrix.columnSlice(csv.data, columns);
    return csv;
};

dex.csv.getNumericColumnNames = function(csv) {
    var possibleNumeric = {};
    var i, j, ri, ci;
    var numericColumns = [];
    for (i = 0; i < csv.header.length; i++) {
        possibleNumeric[csv.header[i]] = true;
    }
    for (ri = 0; ri < csv.data.length; ri++) {
        for (ci = 0; ci < csv.data[ri].length && ci < csv.header.length; ci++) {
            if (possibleNumeric[csv.header[ci]] && !dex.object.isNumeric(csv.data[ri][ci])) {
                possibleNumeric[csv.header[ci]] = false;
            }
        }
    }
    for (ci = 0; ci < csv.header.length; ci++) {
        if (possibleNumeric[csv.header[ci]]) {
            numericColumns.push(csv.header[ci]);
        }
    }
    return numericColumns;
};

dex.csv.getNumericIndices = function(csv) {
    var possibleNumeric = {};
    var i, j;
    var numericIndices = [];
    for (i = 0; i < csv.header.length; i++) {
        possibleNumeric[csv.header[i]] = true;
    }
    for (i = 1; i < csv.data.length; i++) {
        for (j = 0; j < csv.data[i].length && j < csv.header.length; j++) {
            if (possibleNumeric[csv.header[j]] && !dex.object.isNumeric(csv.data[i][j])) {
                possibleNumeric[csv.header[j]] = false;
            }
        }
    }
    for (i = 0; i < csv.header.length; i++) {
        if (possibleNumeric[csv.header[i]]) {
            numericIndices.push(i);
        }
    }
    return numericIndices;
};

dex.csv.isColumnNumeric = function(csv, columnNum) {
    var i;
    for (i = 0; i < csv.data.length; i++) {
        if (!dex.object.isNumeric(csv.data[i][columnNum])) {
            return false;
        }
    }
    return true;
};

dex.csv.group = function(csv, columns) {
    var ri, ci;
    var groups = {};
    var returnGroups = [];
    var values;
    var key;
    var otherColumns;
    var otherHeaders;
    var groupName;
    if (arguments < 2) {
        return csv;
    }
    function compare(a, b) {
        var si, h;
        for (si = 0; si < columns.length; si++) {
            h = csv.header[columns[si]];
            if (a[h] < b[h]) {
                return -1;
            } else if (a[h] > b[h]) {
                return 1;
            }
        }
        return 0;
    }
    for (ri = 0; ri < csv.data.length; ri += 1) {
        values = dex.array.slice(csv.data[ri], columns);
        key = values.join(":::");
        if (groups[key]) {
            group = groups[key];
        } else {
            group = {
                csv: dex.csv.csv(csv.header, [])
            };
            for (ci = 0; ci < values.length; ci++) {
                group[csv.header[columns[ci]]] = values[ci];
            }
            groups[key] = group;
        }
        group.csv.data.push(csv.data[ri]);
    }
    for (groupName in groups) {
        if (groups.hasOwnProperty(groupName)) {
            returnGroups.push(groups[groupName]);
        }
    }
    return returnGroups.sort(compare);
};

dex.csv.visitCells = function(csv, func) {
    var ci, ri;
    for (ri = 0; ri < csv.data.length; ri++) {
        for (ci = 0; ci < csv.header.length; ci++) {
            func(ci, ri, csv.data[ri][ci]);
        }
    }
};

dex.datagen = {};

dex.datagen.randomMatrix = function(spec) {
    var ri, ci;
    var matrix = [];
    var range = spec.max - spec.min;
    for (ri = 0; ri < spec.rows; ri++) {
        var row = [];
        for (ci = 0; ci < spec.columns; ci++) {
            row.push(Math.random() * range + spec.min);
        }
        matrix.push(row);
    }
    return matrix;
};

dex.json = {};

dex.json.toCsv = function(json, header) {
    var csv;
    var ri, ci;
    var data = [];
    if (arguments.length == 2) {
        if (Array.isArray(json)) {
            for (ri = 0; ri < json.length; ri++) {
                var row = [];
                for (ci = 0; ci < header.length; ci++) {
                    row.push(json[ri][header[ci]]);
                }
                data.push(row);
            }
        } else {
            var row = [];
            for (ci = 0; ci < header.length; ci++) {
                row.push(json[ri][header[ci]]);
            }
            data.push(row);
        }
        return dex.csv.csv(header, data);
    } else {
        return dex.json.toCsv(json, dex.json.keys(json));
    }
};

dex.json.keys = function(json) {
    var keyMap = {};
    var keys = [];
    var ri, key;
    if (Array.isArray(json)) {
        for (ri = 0; ri < json.length; ri++) {
            for (key in json[ri]) {
                keyMap[key] = true;
            }
        }
    } else {
        for (key in json) {
            keyMap[key] = true;
        }
    }
    for (key in keyMap) {
        keys.push(key);
    }
    return keys;
};

dex.matrix = {};

dex.matrix.slice = function(matrix, columns, rows) {
    var slice = [];
    var ri;
    if (arguments.length === 3) {
        for (ri = 0; ri < rows.length; ri++) {
            slice.push(dex.array.slice(matrix[rows[ri]]));
        }
    } else {
        for (ri = 0; ri < matrix.length; ri++) {
            slice.push(dex.array.slice(matrix[ri], columns));
        }
    }
    return slice;
};

dex.matrix.uniques = function(matrix) {
    var ci;
    var uniques = [];
    var tmatrix = dex.matrix.transpose(matrix);
    var ncol = tmatrix.length;
    for (ci = 0; ci < ncol; ci += 1) {
        uniques.push(dex.array.unique(tmatrix[ci]));
    }
    return uniques;
};

dex.matrix.transpose = function(matrix) {
    var ci;
    var ncols = matrix[0].length;
    var transposedMatrix = [];
    for (ci = 0; ci < ncols; ci++) {
        transposedMatrix.push(matrix.map(function(row) {
            return row[ci];
        }));
    }
    return transposedMatrix;
};

dex.matrix.columnSlice = function(matrix, columns) {
    var slice = [];
    var ri;
    var transposeMatrix;
    if (arguments.length != 2) {
        return matrix;
    }
    transposeMatrix = dex.matrix.transpose(matrix);
    if (Array.isArray(columns)) {
        for (ri = 0; ri < columns.length; ri += 1) {
            slice.push(transposeMatrix[columns[ri]]);
        }
    } else {
        slice.push(transposeMatrix[columns]);
    }
    return dex.matrix.transpose(slice);
};

dex.matrix.flatten = function(matrix) {
    var array = [];
    var ri, ci;
    for (ri = 0; ri < matrix.length; ri++) {
        for (ci = 0; ci < matrix[ri].length; ci++) {
            array.push(matrix[ri][ci]);
        }
    }
    return array;
};

dex.matrix.extent = function(data, indices) {
    var values = data;
    if (arguments.length === 2) {
        values = dex.matrix.slice(data, indices);
        return d3.extent(dex.matrix.flatten(values));
    }
};

dex.matrix.combine = function(matrix1, matrix2) {
    var result = [];
    var ri, oci, ici;
    for (ri = 0; ri < matrix1.length; ri++) {
        for (oci = 0; oci < matrix1[ri].length; oci++) {
            for (ici = 0; ici < matrix2[ri].length; ici++) {
                result.push([ matrix1[ri][oci], matrix2[ri][ici], oci, ici ]);
            }
        }
    }
    return result;
};

dex.matrix.isColumnNumeric = function(data, columnNum) {
    var i;
    for (i = 1; i < data.length; i++) {
        if (!dex.object.isNumeric(data[i][columnNum])) {
            return false;
        }
    }
    return true;
};

dex.matrix.max = function(data, columnNum) {
    var maxValue = data[0][columnNum];
    var i;
    if (dex.matrix.isColumnNumeric(data, columnNum)) {
        maxValue = parseFloat(data[0][columnNum]);
        for (i = 1; i < data.length; i++) {
            if (maxValue < parseFloat(data[i][columnNum])) {
                maxValue = parseFloat(data[i][columnNum]);
            }
        }
    } else {
        for (i = 1; i < data.length; i++) {
            if (maxValue < data[i][columnNum]) {
                maxValue = data[i][columnNum];
            }
        }
    }
    return maxValue;
};

dex.matrix.min = function(data, columnNum) {
    var minValue = data[0][columnNum];
    var i;
    if (dex.matrix.isColumnNumeric(data, columnNum)) {
        minValue = parseFloat(data[0][columnNum]);
        for (i = 1; i < data.length; i++) {
            if (minValue > parseFloat(data[i][columnNum])) {
                minValue = parseFloat(data[i][columnNum]);
            }
        }
    } else {
        for (i = 1; i < data.length; i++) {
            if (minValue > data[i][columnNum]) {
                minValue = data[i][columnNum];
            }
        }
    }
    return minValue;
};

dex.object = {};

dex.object.clone = function(destination, source) {
    var property;
    for (property in source) {
        if (source[property] && source[property].constructor && source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            arguments.callee(destination[property], source[property]);
        } else {
            destination[property] = source[property];
        }
    }
    return destination;
};

dex.object.overlay = function(top, bottom) {
    var overlay = dex.object.clone(bottom);
    var prop;
    if (top !== "undefined") {
        for (prop in top) {
            if (typeof top[prop] == "object" && overlay[prop] != null && !(top[prop] instanceof Array)) {
                overlay[prop] = dex.object.overlay(top[prop], overlay[prop]);
            } else {
                overlay[prop] = top[prop];
            }
        }
    }
    return overlay;
};

dex.object.contains = function(container, obj) {
    var i = container.length;
    while (i--) {
        if (container[i] === obj) {
            return true;
        }
    }
    return false;
};

dex.object.visit = function(obj, func) {
    var prop;
    func(obj);
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (typeof obj[prop] === "object") {
                dex.object.visit(obj[prop], func);
            }
        }
    }
};

dex.object.connect = function(map, values) {
    if (!values || values.length <= 0) {
        return this;
    }
    if (!map[values[0]]) {
        map[values[0]] = {};
    }
    dex.object.connect(map[values[0]], values.slice(1));
    return this;
};

dex.object.isNumeric = function(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj);
};

dex.object.setHierarchical = function(hierarchy, name, value, delimiter) {
    if (hierarchy == null) {
        hierarchy = {};
    }
    if (typeof hierarchy != "object") {
        return hierarchy;
    }
    if (arguments.length == 4) {
        return dex.object.setHierarchical(hierarchy, name.split(delimiter), value);
    } else {
        if (name.length === 1) {
            hierarchy[name[0]] = value;
        } else {
            if (!(name[0] in hierarchy)) {
                hierarchy[name[0]] = {};
            }
            dex.object.setHierarchical(hierarchy[name[0]], name.splice(1), value);
        }
    }
    return hierarchy;
};

function DexComponent(userConfig, defaultConfig) {
    this.registry = {};
    this.debug = false;
    if (userConfig instanceof DexComponent) {
        this.config = dex.object.overlay(userConfig.config, defaultConfig);
    } else {
        this.config = dex.object.overlay(dex.config.expand(userConfig), defaultConfig);
    }
}

DexComponent.prototype.attr = function(name, value) {
    if (arguments.length == 0) {
        return this.config;
    } else if (arguments.length == 1) {
        return this.config[name];
    } else if (arguments.length == 2) {
        dex.object.setHierarchical(this.config, name, value, ".");
    }
    return this;
};

DexComponent.prototype.dump = function(message) {
    console.log("========================");
    if (arguments.length == 1) {
        console.log(message);
        console.log("========================");
    }
    console.log("=== CONFIG ===");
    console.dir(this.config);
    console.log("=== REGISTRY ===");
    console.dir(this.registry);
};

DexComponent.prototype.addListener = function(eventType, target, method) {
    var targets;
    if (this.debug) {
        console.log("Registering Target: " + eventType + "=" + target);
    }
    if (!this.registry.hasOwnProperty(eventType)) {
        this.registry[eventType] = [];
    }
    this.registry[eventType].push({
        target: target,
        method: method
    });
};

DexComponent.prototype.notify = function(event) {
    var targets, i;
    if (this.debug) {
        console.log("notify: " + event.type);
    }
    if (!this.registry.hasOwnProperty(event.type)) {
        return this;
    }
    event.source = this;
    targets = this.registry[event.type];
    for (i = 0; i < targets.length; i++) {
        targets[i]["method"](event, targets[i]["target"]);
    }
    return this;
};

DexComponent.prototype.render = function() {
    console.log("Rendering component...");
};

DexComponent.prototype.update = function() {
    console.log("Updating component...");
};

Series.prototype = new DexComponent();

Series.constructor = Series;

function Series(csv, userConfig) {
    DexComponent.call(this, userConfig, {
        name: "series",
        id: "Series",
        "class": "Series",
        csv: csv
    });
    this.series = this;
}

Series.prototype.name = function() {
    var series = this.series;
    var config = this.config;
    return config.name;
};

Series.prototype.csv = function() {
    var config = this.config;
    return config.csv;
};

Series.prototype.dimensions = function() {
    var csv = this.config.csv;
    console.log("CSV");
    console.dir(csv);
    return {
        rows: csv.data.length,
        columns: csv.header.length
    };
};

Series.prototype.value = function(rowIndex, columnIndex) {
    var csv = this.config.csv;
    if (arguments.length == 2) {
        return csv.data[rowIndex][columnIndex];
    }
    return csv.data[rowIndex];
};

Series.prototype.jsonValue = function(rowIndex, columnIndex) {
    var csv = this.config.csv;
    if (arguments.length == 2) {
        return dex.csv.toJson(csv, rowIndex, columnIndex);
    } else if (arguments.length == 1) {
        return dex.csv.toJson(csv, rowIndex);
    }
    return dex.csv.toJson(csv);
};