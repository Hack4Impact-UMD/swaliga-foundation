import { Polygon } from "@/types/konva-types";

export function getPolygonBackground(width: number, height: number): Polygon[] {
    return [
      {
        points: [
          0,
          0,
          0,
          height / 60,
          (50 / 85) * width,
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
      }
    ]
}

export function getPolygonOverlay(width: number, height: number): Polygon[] {
    return [
      {
        points: [
          width / 2,
          0.15 * height,
          0.875 * width,
          0.15 * height,
          0.875 * width,
          0.39375 * height,
          width / 2,
          0.225 * height,
        ],
        fill: "#D0D12A",
      },
      {
        points: [
          width / 2,
          0.225 * height,
          0.875 * width,
          0.39375 * height,
          0.875 * width,
          0.85 * height,
          0.5 * width,
          0.85 * height,
        ],
        fill: "#295972",
      },
    ];
}