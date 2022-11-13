import React, { useCallback, useEffect, useRef, useState } from "react";

function LazyLoadImage(props) {
  const { placeholder, src, style, offsetMargin = "50px", ...imgProps } = props;

  const [imageLoaded, setImageLoaded] = useState(undefined);
  const imageRef = useRef();

  useEffect(() => {
    const lazyLoadObs = new IntersectionObserver(
      (entry) => {
        if (entry[0]?.isIntersecting) {
          setImageLoaded(false);
          lazyLoadObs.unobserve(entry[0].target);
        }
      },
      {
        threshold: 0,
        rootMargin: offsetMargin,
      }
    );

    lazyLoadObs.observe(imageRef.current);

    return () => {
      lazyLoadObs.disconnect();
    };
  }, []);

  const onImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <>
      <img
        {...imgProps}
        ref={(ref) => {
          imageRef.current = ref;
        }}
        style={
          imageLoaded
            ? { ...style, display: "none" }
            : { ...style, display: "inline-block" }
        }
        src={placeholder}
      />
      {imageLoaded !== undefined && (
        <img
          {...imgProps}
          style={
            imageLoaded
              ? { ...style, display: "inline-block" }
              : { ...style, display: "none" }
          }
          src={src}
          onLoad={onImageLoad}
        />
      )}
    </>
  );
}

export default React.memo(LazyLoadImage);
