import React, { useState, useEffect } from "react"
import { Layer, Rect, Stage, Image } from "react-konva"
import BBox from "./BBox"
import Konva from "konva"
import Point from "./Point"
import NegPoint from "./NegPoint"

export interface BBoxCanvasLayerProps {
  rectangles: any[]
  pointsInfo: any[]
  negPointsInfo: any[]
  mode: string
  shape: string
  selectedId: string | null
  selectedPointId: string | null
  selectedNegPointId: string | null
  setSelectedId: any
  setSelectedPointId: any
  setSelectedNegPointId: any
  setRectangles: any
  setPointsInfo: any
  setNegPointsInfo: any
  setLabel: any
  setPointLabel: any
  setNegPointLabel: any
  color_map: any
  scale: number
  label: string
  pointLabel: string
  negPointLabel: string
  image_size: number[]
  image: any
  strokeWidth: number
}
const BBoxCanvas = (props: BBoxCanvasLayerProps) => {
  const {
    rectangles,
    pointsInfo,
    negPointsInfo,
    mode,
    shape,
    selectedId,
    selectedPointId,
    selectedNegPointId,
    setSelectedId,
    setSelectedPointId,
    setSelectedNegPointId,
    setRectangles,
    setPointsInfo,
    setNegPointsInfo,
    setLabel,
    setPointLabel,
    setNegPointLabel,
    color_map,
    scale,
    label,
    pointLabel,
    negPointLabel,
    image_size,
    image,
    strokeWidth,
  }: BBoxCanvasLayerProps = props
  const [adding, setAdding] = useState<number[] | null>(null)
  const checkDeselect = (e: any) => {
    if (!(e.target instanceof Konva.Rect)) {
      if (selectedId === null) {
        if (mode === "Transform") {
          const pointer = e.target.getStage().getPointerPosition()
          setAdding([pointer.x, pointer.y, pointer.x, pointer.y])
        }
      } else {
        setSelectedId(null)
      }
    }
  }

  useEffect(() => {
    const rects = rectangles.slice()
    for (let i = 0; i < rects.length; i++) {
      if (rects[i].width < 0) {
        rects[i].width = rects[i].width * -1
        rects[i].x = rects[i].x - rects[i].width
        setRectangles(rects)
      }
      if (rects[i].height < 0) {
        rects[i].height = rects[i].height * -1
        rects[i].y = rects[i].y - rects[i].height
        setRectangles(rects)
      }
      if (rects[i].x < 0 || rects[i].y < 0) {
        rects[i].width = rects[i].width + Math.min(0, rects[i].x)
        rects[i].x = Math.max(0, rects[i].x)
        rects[i].height = rects[i].height + Math.min(0, rects[i].y)
        rects[i].y = Math.max(0, rects[i].y)
        setRectangles(rects)
      }
      if (
        rects[i].x + rects[i].width > image_size[0] ||
        rects[i].y + rects[i].height > image_size[1]
      ) {
        rects[i].width = Math.min(rects[i].width, image_size[0] - rects[i].x)
        rects[i].height = Math.min(rects[i].height, image_size[1] - rects[i].y)
        setRectangles(rects)
      }
      if (rects[i].width < 5 || rects[i].height < 5) {
        rects[i].width = 5
        rects[i].height = 5
      }
    }
  }, [rectangles, image_size])

  useEffect(() => {
    const points = pointsInfo.slice()
    for (let i = 0; i < points.length; i++) {
      if (points[i].x < 0 || points[i].y < 0) {
        points[i].x = Math.max(0, points[i].x)
        points[i].y = Math.max(0, points[i].y)
        setPointsInfo(points)
      }
      if (points[i].x > image_size[0] || points[i].y > image_size[1]) {
        points[i].x = Math.min(points[i].x, image_size[0])
        points[i].y = Math.min(points[i].y, image_size[1])
        setPointsInfo(points)
      }
    }
  }, [pointsInfo, image_size])

  const checkDeselectPoint = (e: any) => {
    if (!(e.target instanceof Konva.Circle)) {
      if (selectedPointId === null) {
        if (mode === "Transform") {
          const pointer = e.target.getStage().getPointerPosition()
          const points = pointsInfo.slice()
          const new_id = Date.now().toString()
          points.push({
            x: pointer.x / scale,
            y: pointer.y / scale,
            label: pointLabel,
            stroke: color_map[pointLabel],
            id: new_id,
          })
          setPointsInfo(points)
          setSelectedPointId(new_id)
        }
      } else {
        setSelectedPointId(null)
      }
    }
  }

  const checkDeselectNegPoint = (e: any) => {
    if (!(e.target instanceof Konva.Star)) {
      if (selectedNegPointId === null) {
        if (mode === "Transform") {
          const pointer = e.target.getStage().getPointerPosition()
          const points = negPointsInfo.slice()
          const new_id = Date.now().toString()
          points.push({
            x: pointer.x / scale,
            y: pointer.y / scale,
            label: negPointLabel,
            stroke: color_map[negPointLabel], // allway red
            id: new_id,
          })
          setNegPointsInfo(points)
          setSelectedNegPointId(new_id)
        }
      } else {
        setSelectedNegPointId(null)
      }
    }
  }

  return (
    <Stage
      width={image_size[0] * scale}
      height={image_size[1] * scale}
      //onContextMenu={prevent}
      //onMouseDown={checkDeselect}
      onMouseDown={
        shape === "Rectangle"
          ? checkDeselect
          : shape === "Point"
          ? checkDeselectPoint
          : checkDeselectNegPoint
      }
      onMouseMove={(e: any) => {
        if (shape === "Rectangle") {
          if (!(adding === null)) {
            const pointer = e.target.getStage().getPointerPosition()
            setAdding([adding[0], adding[1], pointer.x, pointer.y])
          }
        }
      }}
      onMouseLeave={(e: any) => {
        if (shape === "Rectangle") {
          setAdding(null)
        }
      }}
      onMouseUp={(e: any) => {
        if (shape === "Rectangle") {
          if (!(adding === null)) {
            const rects = rectangles.slice()
            const new_id = Date.now().toString()
            rects.push({
              x: adding[0] / scale,
              y: adding[1] / scale,
              width: (adding[2] - adding[0]) / scale,
              height: (adding[3] - adding[1]) / scale,
              label: label,
              stroke: color_map[label],
              id: new_id,
            })
            setRectangles(rects)
            setSelectedId(new_id)
            setAdding(null)
          }
        }
      }}
    >
      <Layer>
        <Image image={image} scaleX={scale} scaleY={scale} />
      </Layer>
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <BBox
              key={i}
              rectProps={rect}
              scale={scale}
              strokeWidth={strokeWidth}
              isSelected={mode === "Transform" && rect.id === selectedId}
              onClick={() => {
                if (shape === "Rectangle") {
                  if (mode === "Transform") {
                    setSelectedId(rect.id)
                    const rects = rectangles.slice()
                    const lastIndex = rects.length - 1
                    const lastItem = rects[lastIndex]
                    rects[lastIndex] = rects[i]
                    rects[i] = lastItem
                    setRectangles(rects)
                    setLabel(rect.label)
                  } else if (mode === "Del") {
                    const rects = rectangles.slice()
                    setRectangles(
                      rects.filter((element) => element.id !== rect.id)
                    )
                  }
                }
              }}
              onChange={(newAttrs: any) => {
                const rects = rectangles.slice()
                rects[i] = newAttrs
                setRectangles(rects)
              }}
            />
          )
        })}

        {pointsInfo.map((point, i) => {
          return (
            <Point
              key={i}
              rectProps={point}
              scale={scale}
              strokeWidth={strokeWidth}
              isSelected={mode === "Transform" && point.id === selectedPointId}
              onClick={() => {
                if (shape === "Point") {
                  if (mode === "Transform") {
                    setSelectedPointId(point.id)
                    const points = pointsInfo.slice()
                    const lastIndex = points.length - 1
                    const lastItem = points[lastIndex]
                    points[lastIndex] = points[i]
                    points[i] = lastItem
                    setPointsInfo(points)
                    setPointLabel(point.label)
                  } else if (mode === "Del") {
                    const points = pointsInfo.slice()
                    setPointsInfo(
                      points.filter((element) => element.id !== point.id)
                    )
                  }
                }
              }}
              onChange={(newAttrs: any) => {
                const points = pointsInfo.slice()
                points[i] = newAttrs
                setPointsInfo(points)
              }}
            />
          )
        })}

        {negPointsInfo.map((point, i) => {
          return (
            <NegPoint
              key={i}
              rectProps={point}
              scale={scale}
              strokeWidth={strokeWidth}
              isSelected={
                mode === "Transform" && point.id === selectedNegPointId
              }
              onClick={() => {
                if (shape === "NegPoint") {
                  if (mode === "Transform") {
                    setSelectedNegPointId(point.id)
                    const points = negPointsInfo.slice()
                    const lastIndex = points.length - 1
                    const lastItem = points[lastIndex]
                    points[lastIndex] = points[i]
                    points[i] = lastItem
                    setNegPointsInfo(points)
                    setNegPointLabel(point.label)
                  } else if (mode === "Del") {
                    const points = negPointsInfo.slice()
                    setNegPointsInfo(
                      points.filter((element) => element.id !== point.id)
                    )
                  }
                }
              }}
              onChange={(newAttrs: any) => {
                const points = negPointsInfo.slice()
                points[i] = newAttrs
                setNegPointsInfo(points)
              }}
            />
          )
        })}

        {adding !== null && (
          <Rect
            fill={color_map[label] + "4D"}
            x={adding[0]}
            y={adding[1]}
            width={adding[2] - adding[0]}
            height={adding[3] - adding[1]}
          />
        )}
      </Layer>
    </Stage>
  )
}

export default BBoxCanvas
