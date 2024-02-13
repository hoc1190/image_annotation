import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, { useEffect, useState } from "react"
import {
  ChakraProvider,
  Select,
  Box,
  Spacer,
  Stack,
  VStack,
  Center,
  Button,
  HStack,
  Text,
  IconButton,
  useRadioGroup,
  Icon,
  Grid,
  GridItem,
  Flex,
} from "@chakra-ui/react"
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  CheckCircleIcon,
  DeleteIcon,
  PlusSquareIcon,
  StarIcon,
} from "@chakra-ui/icons"

import useImage from "use-image"

import ThemeSwitcher from "./ThemeSwitcher"

import BBoxCanvas from "./BBoxCanvas"
import RadioCard from "./RadioCard"
import ShapeMenu from "./ShapeMenu"

export interface PythonArgs {
  image_url: string
  image_size: number[]
  label_list: string[]
  bbox_info: any[]
  points_info: any[]
  neg_points_info: any[]
  color_map: any
  line_width: number
}

const Detection = ({ args, theme }: ComponentProps) => {
  type History = {
    rectangles: any
    pointsInfo: any
    negPointsInfo: any
  }
  const {
    image_url,
    image_size,
    label_list,
    bbox_info,
    points_info,
    neg_points_info,
    color_map,
    line_width,
  }: PythonArgs = args

  const params = new URLSearchParams(window.location.search)
  const baseUrl = params.get("streamlitUrl")
  const [image] = useImage(baseUrl + image_url)
  const [histories, setHistories] = React.useState<History[]>([])
  const [history_id, setHistoryId] = React.useState<number | null>(null)

  const [rectangles, setRectangles] = React.useState(
    bbox_info.map((bb, i) => {
      return {
        x: bb.bbox[0],
        y: bb.bbox[1],
        width: bb.bbox[2],
        height: bb.bbox[3],
        label: bb.label,
        stroke: color_map[bb.label],
        id: "bbox-" + i,
      }
    })
  )
  const [pointsInfo, setPointsInfo] = React.useState(
    points_info.map((p, i) => {
      return {
        x: p.point[0],
        y: p.point[1],
        label: p.label,
        stroke: color_map[p.label],
        id: "point-" + i,
      }
    })
  )
  const [negPointsInfo, setNegPointsInfo] = React.useState(
    neg_points_info.map((p, i) => {
      return {
        x: p.point[0],
        y: p.point[1],
        label: p.label,
        stroke: color_map[p.label],
        id: "neg_point-" + i,
      }
    })
  )

  useEffect(() => {
    const current_id = history_id === null ? histories.length - 1 : history_id
    if (history_id === null) {
      if (histories.length > 0) {
      }
      if (
        histories.length === 0 ||
        histories[current_id]["rectangles"] !== rectangles ||
        histories[current_id]["pointsInfo"] !== pointsInfo ||
        histories[current_id]["negPointsInfo"] !== negPointsInfo
      ) {
        setHistories(
          histories.slice().concat([
            {
              rectangles: JSON.parse(JSON.stringify(rectangles)),
              pointsInfo: JSON.parse(JSON.stringify(pointsInfo)),
              negPointsInfo: JSON.parse(JSON.stringify(negPointsInfo)),
            },
          ])
        )
      }
    } else {
      if (
        histories[history_id]["rectangles"] !== rectangles ||
        histories[history_id]["pointsInfo"] !== pointsInfo ||
        histories[history_id]["negPointsInfo"] !== negPointsInfo
      ) {
        setHistories(
          histories.slice(0, history_id + 1).concat([
            {
              rectangles: JSON.parse(JSON.stringify(rectangles)),
              pointsInfo: JSON.parse(JSON.stringify(pointsInfo)),
              negPointsInfo: JSON.parse(JSON.stringify(negPointsInfo)),
            },
          ])
        )
        setHistoryId(null)
      }
    }
  }, [rectangles, pointsInfo, negPointsInfo])

  useEffect(() => {
    if (history_id !== null) {
      const history = histories[history_id]
      setRectangles(history["rectangles"])
      setPointsInfo(history["pointsInfo"])
      setNegPointsInfo(history["negPointsInfo"])
    }
  }, [history_id])

  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [selectedPointId, setSelectedPointId] = React.useState<string | null>(
    null
  )
  const [selectedNegPointId, setSelectedNegPointId] = React.useState<
    string | null
  >(null)

  const [label, setLabel] = useState(label_list[0])
  const [pointLabel, setPointLabel] = useState(label_list[0])
  const [negPointLabel, setNegPointLabel] = useState(label_list[0])

  const [mode, setMode] = React.useState<string>("Transform")
  const [shape, setShape] = React.useState<string>("Point")

  const prevHistory = () => {
    if (history_id === null) {
      setHistoryId(histories.length - 2)
    } else if (history_id >= 1) {
      setHistoryId(history_id - 1)
    }
  }

  const nextHistory = () => {
    if (history_id === histories.length - 1) {
      setHistoryId(null)
    } else if (history_id !== null && history_id < histories.length - 1) {
      setHistoryId(history_id + 1)
    }
  }

  const handleClassSelectorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (shape === "Rectangle") {
      setLabel(event.target.value)
    } else if (shape === "Point") {
      setPointLabel(event.target.value)
    } else {
      setNegPointLabel(event.target.value)
    }

    if (!(selectedId === null)) {
      const rects = rectangles.slice()
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].id === selectedId) {
          rects[i].label = event.target.value
          rects[i].stroke = color_map[rects[i].label]
        }
      }
      setRectangles(rects)
    }
    if (!(selectedPointId === null)) {
      const points = pointsInfo.slice()
      for (let i = 0; i < points.length; i++) {
        if (points[i].id === selectedPointId) {
          points[i].label = event.target.value
          points[i].stroke = color_map[points[i].label]
        }
      }
      setPointsInfo(points)
    }

    if (!(selectedNegPointId === null)) {
      const points = negPointsInfo.slice()
      for (let i = 0; i < points.length; i++) {
        if (points[i].id === selectedPointId) {
          points[i].label = event.target.value
          points[i].stroke = color_map[points[i].label]
        }
      }
      setNegPointsInfo(points)
    }
  }

  const changeShape = (e: any) => {
    setShape(e)
    switch (e) {
      case "Point":
        setSelectedId(null)
        setSelectedNegPointId(null)
        break
      case "Rectangle":
        setSelectedPointId(null)
        setSelectedNegPointId(null)
        break
      case "NegPoint":
        setSelectedId(null)
        setSelectedPointId(null)
        break
    }
  }

  const { getRadioProps } = useRadioGroup({
    name: "mode",
    defaultValue: "Transform",
    onChange: setMode,
  })

  const [scale, setScale] = useState(1.0)
  useEffect(() => {
    const resizeCanvas = () => {
      const scale_ratio = (window.innerWidth * 0.8) / image_size[0]
      setScale(Math.min(scale_ratio, 1.0))
      Streamlit.setFrameHeight(image_size[1] * Math.min(scale_ratio, 1.0) + 300)
    }
    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
  }, [image_size])

  return (
    <ChakraProvider>
      <ThemeSwitcher theme={theme}>
        <Center>
          <Stack>
            <Flex>
              <HStack spacing="5px">
                <Center w='80px'>
              <Text fontSize="md">ラベル: </Text>
              </Center>
              <Spacer />
              <Select
                disabled={shape === "NegPoint" || mode === "Del"}
                value={
                  shape === "Rectangle"
                    ? label
                    : shape === "Point"
                    ? pointLabel
                    : negPointLabel
                }
                onChange={handleClassSelectorChange}
              >
                {label_list.map((l) => (
                  <option value={l}>{l}</option>
                ))}
              </Select>
              </HStack>

            </Flex>

            <Box>
              <BBoxCanvas
                rectangles={rectangles}
                pointsInfo={pointsInfo}
                negPointsInfo={negPointsInfo}
                mode={mode}
                shape={shape}
                selectedId={selectedId}
                selectedPointId={selectedPointId}
                selectedNegPointId={selectedNegPointId}
                scale={scale}
                setSelectedId={setSelectedId}
                setSelectedPointId={setSelectedPointId}
                setSelectedNegPointId={setSelectedNegPointId}
                setPointsInfo={setPointsInfo}
                setNegPointsInfo={setNegPointsInfo}
                setRectangles={setRectangles}
                setLabel={setLabel}
                setPointLabel={setPointLabel}
                setNegPointLabel={setNegPointLabel}
                color_map={color_map}
                label={label}
                pointLabel={pointLabel}
                negPointLabel={negPointLabel}
                image={image}
                image_size={image_size}
                strokeWidth={line_width}
              />
            </Box>
            <Flex>
              <HStack spacing="14px">
                <Box>
                  <ShapeMenu changeShape={changeShape} />
                </Box>
                <Spacer />
                <Box>
                  <HStack>
                    {[
                      ["Transform", <CheckCircleIcon />],
                      ["Del", <DeleteIcon />],
                    ].map((value) => {
                      const radio = getRadioProps({ value: value[0] })
                      return (
                        <RadioCard key={value[0]} {...radio}>
                          {value[1]}
                        </RadioCard>
                      )
                    })}
                  </HStack>
                </Box>
              </HStack>
              <Spacer />
              <Box>
                <IconButton
                  onClick={prevHistory}
                  variant="unstyled"
                  aria-label="prev"
                  icon={<ArrowBackIcon />}
                  isDisabled={
                    histories.length === 1 ||
                    (history_id !== null && history_id === 0)
                  }
                />
                <IconButton
                  onClick={nextHistory}
                  variant="unstyled"
                  aria-label="next"
                  icon={<ArrowForwardIcon />}
                  isDisabled={
                    histories.length === 1 ||
                    history_id == null ||
                    (history_id !== null && histories.length - 1 === history_id)
                  }
                />
              </Box>
            </Flex>
            <Flex>
              <Spacer />
              <Button
                onClick={(e) => {
                  const currentBboxValue = rectangles.map((rect, i) => {
                    return {
                      bbox: [rect.x, rect.y, rect.width, rect.height],
                      label_id: label_list.indexOf(rect.label),
                      label: rect.label,
                    }
                  })
                  Streamlit.setComponentValue(currentBboxValue)
                }}
              >
                計算
              </Button>
            </Flex>
          </Stack>
        </Center>
      </ThemeSwitcher>
    </ChakraProvider>
  )
}

export default withStreamlitConnection(Detection)
