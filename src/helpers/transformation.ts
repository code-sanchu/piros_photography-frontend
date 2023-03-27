import { z } from "zod";

export function calcImgHeightForWidth({
  containerWidth,
  image,
}: {
  containerWidth: number;
  image: { naturalHeight: number; naturalWidth: number };
}) {
  return containerWidth / (image.naturalWidth / image.naturalHeight);
}

export const calcTransformDimensions = z
  .function()
  .args(
    z.object({
      initialDimensions: z.object({ width: z.number(), height: z.number() }),
      transformTo: z.object({
        maxValue: z.object({ width: z.number(), height: z.number() }),
        maxDecimal: z.object({
          width: z.number().gt(0).lte(1),
          height: z.number().gt(0).lte(1),
        }),
      }),
    }),
  )
  .implement(({ transformTo: constraint, initialDimensions: image }) => {
    const imageAspectRatio = image.width / image.height;

    const maxWidth = constraint.maxValue.width * constraint.maxDecimal.width;
    const maxHeight = constraint.maxValue.height * constraint.maxDecimal.height;

    let width = maxWidth;
    let height = width / imageAspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * imageAspectRatio;
    }

    return { width, height };
  });

export const calcTransformDistanceToWindowCenter = z
  .function()
  .args(
    z.object({
      transformElement: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
      }),
      windowSize: z.object({ width: z.number(), height: z.number() }),
    }),
  )
  .implement(({ transformElement, windowSize }) => {
    const distance = {
      // x: windowSize.width / 2 - transformElement.width / 2 - transformElement.x,
      /*       y:
        windowSize.height / 2 -
        transformElement.height / 2 -
        transformElement.y, */
      x:
        windowSize.width / 2 -
        (transformElement.x + transformElement.width / 2),
      y:
        windowSize.height / 2 -
        (transformElement.y + transformElement.height / 2),
    };

    return distance;
  });
