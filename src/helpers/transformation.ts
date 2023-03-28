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
        plusY: z.optional(z.number()),
      }),
    }),
  )
  .implement(({ transformTo, initialDimensions }) => {
    const imageAspectRatio = initialDimensions.width / initialDimensions.height;

    const maxWidth = transformTo.maxValue.width * transformTo.maxDecimal.width;
    const maxHeight =
      transformTo.maxValue.height * transformTo.maxDecimal.height;

    let width = maxWidth;
    let height = width / imageAspectRatio + (transformTo?.plusY || 0);

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
