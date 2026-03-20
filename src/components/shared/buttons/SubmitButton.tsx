import { Button, ProgressCircle, type ButtonProps } from "@chakra-ui/react";


/**
 * A button component that functions as a submit button.
 * Combines Chakra UI Button styling with React Router Link functionality.
 *
 * @example
 * <SubmitButton colorPalette="teal" variant="solid">
 *   Submit
 * </SubmitButton>
 */
const SubmitButton = (props: ButtonProps) => {
    return (
        <Button type="submit" {...props} spinner={
            <ProgressCircle.Root value={null} size="xs">
                <ProgressCircle.Circle css={{ "--thickness": "3px" }}>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range />
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
        }>
            {props.children}
        </Button>
    )
}

export default SubmitButton;