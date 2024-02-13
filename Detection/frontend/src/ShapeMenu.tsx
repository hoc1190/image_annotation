import React from "react"
import { HStack, useRadioGroup, Icon } from "@chakra-ui/react"
import { PlusSquareIcon, StarIcon } from "@chakra-ui/icons"
import RadioCard from "./RadioCard"

export interface ShapeMenuProps {
  changeShape: any
}

const ShapeMenu = (props: ShapeMenuProps) => {
  const { changeShape }: ShapeMenuProps = props

  const { getRadioProps } = useRadioGroup({
    name: "shape",
    defaultValue: "Point",
    onChange: changeShape,
  })

  return (
    <HStack>
      {[
        [
          "Point",
          <Icon viewBox="0 0 200 200" color="green.500">
            <path
              fill="currentColor"
              d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
          </Icon>,
        ],
        ["Rectangle", <Icon as={PlusSquareIcon} color="green.500" />],
        ["NegPoint", <Icon as={StarIcon} color="red.500" />],
      ].map((value) => {
        const radio = getRadioProps({ value: value[0] })
        return (
          <RadioCard key={value[0]} {...radio}>
            {value[1]}
          </RadioCard>
        )
      })}
    </HStack>
  )
}

export default ShapeMenu
