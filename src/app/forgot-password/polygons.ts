import { Polygon, Dims } from "@/types/konva-types";
export function getOuterPolygonLayer(width: number, height: number): Polygon[] {
  return [
    {
      points: [
        0,
        0,
        0,

        height / 30,
        (50 / 100) * width,
        height,

        width,
        height,
        width,

        0.45 * height,
        height / 60,
        0,
      ],
      fill: "#D0D12A",
    },
    {
      points: [
        0,
        height / 60,
        0,
        height,
        (50 / 85) * width,
        height,
      ],
      fill: "#295972",
    },
    {
      points: [
        height / 60,
        0,
        width,
        0,
        width,
        0.45 * height,
      ],
      fill: "#295972",
    },
  ];
}

export function getPolygonBorder(width: number, height: number): Polygon[] {
    return [
      {
        points: [
          0.245 * width - 2.0,
          0.125 * height - 2.0,
          0.815 * width + 2.0,
          0.125 * height - 2.0,
          0.815 * width + 2.0,
          0.875 * height + 2.0,
          0.245 * width - 2.0,
          0.875 * height + 2.0
        ],
        fill: "#ffffff"
      }
    ]
}

export function getInnerPolygonLayer(width: number, height: number): Polygon[] {
    return [
      {
        points: [
          0.285 * width,
          0.125 * height,
          0.815 * width,
          0.125 * height,
          0.815 * width,
          0.3675 * height,
        ],
        fill: "#D0D12A",
      },
      {
        points: [
          0.245 * width,
          0.125 * height,
          0.285 * width,
          0.125 * height,
          0.815 * width,
          0.3675 * height,
          0.815 * width,
          0.875 * height,
          0.51375 * width,
          0.875 * height,
          0.245 * width,
          0.425 * height,
        ],
        fill: "#295972",
      },
      {
        points: [
          0.51375 * width,
          0.875 * height,
          0.245 * width,
          0.425 * height,
          0.245 * width,
          0.875 * height,
        ],
        fill: "#D0D12A",
      },
    ];
}