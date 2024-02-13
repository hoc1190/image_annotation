import React, { useEffect, useState } from "react"

import { Box, useRadio } from "@chakra-ui/react";

import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons"


function RadioCard(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "green.300",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={1}
        py={1}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default RadioCard
