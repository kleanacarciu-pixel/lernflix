import Image, { type ImageProps } from 'next/image';

type AiImageProps = ImageProps & {
  caption?: string;
};

// Kennzeichnung für KI-generierte Symbolbilder: umschließt next/image mit
// <figure> und rendert eine dauerhaft sichtbare <figcaption> unter dem Bild.
export default function AiImage({
  caption = 'Symbolbild, KI-generiert',
  className,
  ...imageProps
}: AiImageProps) {
  return (
    <figure
      className={className}
      style={{ margin: 0, width: 'fit-content', maxWidth: '100%' }}
    >
      <Image {...imageProps} />
      <figcaption
        style={{
          marginTop: '4px',
          fontSize: '12px',
          lineHeight: 1.4,
          color: '#94A3B8',
          textAlign: 'center',
        }}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
