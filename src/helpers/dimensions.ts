export function calcImgHeightForWidth({
  containerWidth,
  image,
}: {
  containerWidth: number;
  image: { naturalHeight: number; naturalWidth: number };
}) {
  return containerWidth / (image.naturalWidth / image.naturalHeight);
}
