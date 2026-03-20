import { Button, type ButtonProps } from "@chakra-ui/react";
import { Link, type LinkProps } from "react-router";


/**
 * A button component that functions as a navigation link.
 * Combines Chakra UI Button styling with React Router Link functionality.
 *
 * @example
 * <LinkButton to="/dashboard" colorPalette="teal" variant="solid">
 *   Go to Dashboard
 * </LinkButton>
 */

const LinkButton = (props: ButtonProps & LinkProps) => {
    return (
        <Link to={props.to} state={props.state} replace={props.replace}>
            <Button {...props}>
                {props.children}
            </Button>
        </Link>
    )
}

export default LinkButton;