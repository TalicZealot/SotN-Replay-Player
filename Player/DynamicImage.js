import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-konva';

function DynamicImage({ src, x, y }) {
    const [image, setImage] = useState(null);

    useEffect(() => {
        loadImage();
    }, [src]);

    function loadImage() {
        const loadImage = new window.Image();
        loadImage.src = src;
        loadImage.onload = () => {
            setImage(loadImage);
        };
    }
    return (
        <Image image={image} x={x} y={y} />
    );
}

DynamicImage.propTypes = {
    src: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number
}

export default DynamicImage;
