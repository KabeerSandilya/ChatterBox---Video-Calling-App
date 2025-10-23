import React from "react";

const DEFAULT_AVATAR = "/default-avatar.png";

/**
 * Avatar component
 * props:
 * - src: image source
 * - alt: alt text
 * - wrapperClass: class applied to the outer wrapper (default 'avatar')
 * - innerClass: optional inner wrapper class (e.g. 'w-10 rounded-full')
 * - imgClass: class applied to the <img>
 */
const Avatar = ({
  src,
  alt = "avatar",
  wrapperClass = "avatar",
  innerClass = "w-10 rounded-full",
  imgClass = "",
  ...props
}) => {
  const safeSrc = src || DEFAULT_AVATAR;

  const img = (
    <img
      src={safeSrc}
      alt={alt}
      className={imgClass}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = DEFAULT_AVATAR;
      }}
      {...props}
    />
  );

  return (
    <div className={wrapperClass}>
      {innerClass ? <div className={innerClass}>{img}</div> : img}
    </div>
  );
};

export default Avatar;
