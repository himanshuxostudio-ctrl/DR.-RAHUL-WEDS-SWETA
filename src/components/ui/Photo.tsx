import Image, { getImageProps } from "next/image";
import { getImage } from "@/data/weddingData";
import type { ImageId } from "@/data/imageManifest.generated";

/** next/image wrapper bound to the generated image manifest. */
export default function Photo({
  id,
  alt,
  sizes,
  priority = false,
  fill = true,
  className = "",
  position = "50% 50%",
  quality = 80,
}: {
  id: ImageId;
  alt: string;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
  position?: string;
  quality?: 70 | 80;
}) {
  const img = getImage(id);
  const common = {
    alt,
    sizes,
    priority,
    quality,
    placeholder: "blur" as const,
    blurDataURL: img.blurDataURL,
    className: `object-cover ${className}`,
    style: { objectPosition: position },
  };
  return fill ? (
    <Image src={img.src} fill {...common} />
  ) : (
    <Image src={img.src} width={img.width} height={img.height} {...common} />
  );
}

/**
 * Art-directed <picture>: a different crop below/above 768px. Only the
 * matching source is downloaded.
 */
export function ArtPicture({
  mobile,
  desktop,
  alt,
  desktopSizes,
  mobileSizes = "100vw",
  priority = false,
  className = "",
}: {
  mobile: ImageId;
  desktop: ImageId;
  alt: string;
  desktopSizes: string;
  mobileSizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const m = getImage(mobile);
  const d = getImage(desktop);
  const common = { alt, quality: 80, priority, fill: true } as const;
  const { props: dp } = getImageProps({ ...common, src: d.src, sizes: desktopSizes });
  const { props: mp } = getImageProps({ ...common, src: m.src, sizes: mobileSizes });
  const { srcSet: mSrcSet, sizes: mSizes, ...img } = mp;
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={dp.srcSet} sizes={dp.sizes} />
      <source media="(max-width: 767px)" srcSet={mSrcSet} sizes={mSizes} />
      <img
        {...img}
        alt={alt}
        className={`object-cover ${className}`}
        style={{ ...img.style, backgroundImage: `url(${m.blurDataURL})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}
