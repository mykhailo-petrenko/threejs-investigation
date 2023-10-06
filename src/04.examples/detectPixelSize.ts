export const pixelSize = (distanceFromCamera): number => {
    const cameraFocalLength = 0; // @TODO: detec
    const screenHeight = 0; // @TODO: detect

    const metersPerPixel = 2 / (cameraFocalLength * screenHeight);

    return distanceFromCamera * metersPerPixel;
}

// @TODO: Idea - accept object coordinates and cal distance to camera inside of function.