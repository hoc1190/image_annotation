import React from "react"
import { Star } from 'react-konva';

export interface RectProps {
  x: number,
  y: number,
  width: number,
  height: number,
  id: string,
  stroke: string,
  label: string,
}
export interface BBoxProps {
  rectProps: RectProps,
  onChange: any,
  isSelected: boolean,
  onClick: any,
  scale: number,
  strokeWidth: number
}
const NegPoint = (props: BBoxProps)=>{
  const {
    rectProps, onChange, isSelected, onClick, scale, strokeWidth
  }: BBoxProps = props

  return (
    <React.Fragment>
      <Star
        onClick={onClick}
        {...rectProps}
        x={rectProps.x * scale}
        y={rectProps.y * scale}
        numPoints={5}
        stroke="#ff0000"
        width={strokeWidth*2}
        innerRadius={10}
        outerRadius={10}
        height={strokeWidth*2}
        draggable={isSelected}
        strokeWidth={isSelected?strokeWidth*3:strokeWidth}
        onDragEnd={(e) => {
          onChange({
            ...rectProps,
            x: e.target.x() / scale,
            y: e.target.y() / scale,
          });
        }}
      />
    </React.Fragment>
  );
};


export default NegPoint;