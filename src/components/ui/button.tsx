import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react"
import { Button as ChakraButton, Spinner } from "@chakra-ui/react"
import * as React from "react"

export interface ButtonProps extends ChakraButtonProps {
  loading?: boolean
  loadingText?: React.ReactNode
  leftIcon?: React.ReactElement
  rightIcon?: React.ReactElement
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { loading, disabled, loadingText, children, leftIcon, rightIcon, ...rest } = props
    return (
      <ChakraButton disabled={loading || disabled} ref={ref} {...rest}>
        {loading && !loadingText ? (
          <>
            <Spinner size="inherit" color="inherit" />
            <span style={{ opacity: 0 }}>{children}</span>
          </>
        ) : loading && loadingText ? (
          <>
            <Spinner size="inherit" color="inherit" />
            {loadingText}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </ChakraButton>
    )
  },
)
