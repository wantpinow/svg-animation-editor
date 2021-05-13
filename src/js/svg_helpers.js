function matrixTransformStringToArray(transform) {
    let out = transform.replace("matrix", "");
    out = out.replace("(", "[");
    out = out.replace(")", "]");
    return JSON.parse(out);
}

function matrixTransformDictToArray(transform) {
    return [
        transform.a,
        transform.b,
        transform.c,
        transform.d,
        transform.e,
        transform.f,
    ]
}

function matrixTransformArrayToString(transform) {
    return "matrix(" +
        transform[0] +
        "," +
        transform[1] +
        "," +
        transform[2] +
        "," +
        transform[3] +
        "," +
        transform[4] +
        "," +
        transform[5] +
        ")";
}

function matrixTransformCompose(t1, t2) {
    // convert xform string to array
    if (typeof t1 == 'string') {
        t1 = matrixTransformStringToArray(t1)
    }
    if (typeof t2 == 'string') {
        t2 = matrixTransformStringToArray(t2)
    }
    return [
        t1[0] * t2[0] + t1[2] * t2[1],
        t1[1] * t2[0] + t1[3] * t2[1],
        t1[0] * t2[2] + t1[2] * t2[3],
        t1[1] * t2[2] + t1[3] * t2[3],
        t1[0] * t2[4] + t1[2] * t2[5] + t1[4],
        t1[1] * t2[4] + t1[3] * t2[5] + t1[5],
    ]
}

function matrixTransformInverse(transform) {
    // convert xform string to array
    if (typeof transform == 'string') {
        transform = matrixTransformStringToArray(transform)
    }
    // calculate determinant (bc-ad)
    const det = transform[1] * transform[2] - transform[0] * transform[3]

    // return original transform if inverse doesn't exist
    if (det == 0) {
        console.log('TRANSFORMATION INVERSE DNE')
        return transform
    }

    // return inverse transform (-d, b, c, -a, ed-cf, af-eb) / det
    return [
        -transform[3] / det,
        transform[1] / det,
        transform[2] / det,
        -transform[0] / det,
        (transform[4] * transform[3] - transform[2] * transform[5]) / det,
        (transform[0] * transform[5] - transform[4] * transform[1]) / det,
    ]
}

function matrixTransformPoint(point, transform) {
    // convert xform string to array
    if (typeof transform == 'string') {
        transform = matrixTransformStringToArray(transform)
    }
    const x = point[0]
    const y = point[1]
    const new_x = transform[0] * x + transform[2] * y + transform[4];
    const new_y = transform[1] * x + transform[3] * y + transform[5];
    return [new_x, new_y]
}

function matrixTransformPointInverse(point, transform) {
    // get matrix inverse
    const inverse_transform = matrixTransformInverse(transform)
    // return result
    return matrixTransformPoint(point, inverse_transform)
}

function matrixTransformBBox(bbox, transform) {
    return {
        "ul": matrixTransformPoint([bbox.x, bbox.y], transform),
        "ur": matrixTransformPoint([bbox.x + bbox.width, bbox.y], transform),
        "br": matrixTransformPoint([bbox.x + bbox.width, bbox.y + bbox.height], transform),
        "bl": matrixTransformPoint([bbox.x, bbox.y + bbox.height], transform),
    }
}

function matrixTransformNewBbox(old_bbox, new_bbox) {
    const translate_origin = [
        1,
        0,
        0,
        1,
        -old_bbox.x,
        -old_bbox.y,
    ];
    const resize = [
        new_bbox.width / old_bbox.width,
        0,
        0,
        new_bbox.height / old_bbox.height,
        0,
        0
    ]
    const translate_new_bbox = [
        1,
        0,
        0,
        1,
        new_bbox.x,
        new_bbox.y,
    ];
    let out = matrixTransformCompose(translate_new_bbox, resize)
    out = matrixTransformCompose(out, translate_origin)
    return matrixTransformArrayToString(out)
}

const svg_helpers = {
    matrixTransformStringToArray,
    matrixTransformDictToArray,
    matrixTransformArrayToString,
    matrixTransformCompose,
    matrixTransformInverse,
    matrixTransformPoint,
    matrixTransformPointInverse,
    matrixTransformBBox,
    matrixTransformNewBbox
}

export default svg_helpers